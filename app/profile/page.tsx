import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type WeeklyMenu = {
  id: string
  name: string
  description: string | null
  created_at: string
}

type PantryCountRow = {
  ingredient_id: string
}

type FavoriteRecipe = {
  recipes: {
    id: string
    title: string
    recipe_type: string
  } | null
}

function formatCreatedDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const firstName =
    (user.user_metadata?.first_name as string | undefined) ?? ''
  const lastName =
    (user.user_metadata?.last_name as string | undefined) ?? ''

  const { data: customMenus, error: menusError } = await supabase
    .from('weekly_menus')
    .select('id, name, description, created_at')
    .eq('is_custom', true)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: pantryRows, error: pantryError } = await supabase
    .from('user_pantry')
    .select('ingredient_id')
    .eq('user_id', user.id)

  const { data: favoriteRows, error: favoritesError } = await supabase
    .from('user_favorites')
    .select('recipes(id, title, recipe_type)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  if (menusError || pantryError || favoritesError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl p-6">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
            <p className="mt-4 text-red-600">
              There was a problem loading your profile.
            </p>
          </section>
        </div>
      </main>
    )
  }

  const pantryCount = ((pantryRows ?? []) as PantryCountRow[]).length

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <Link
          href="/"
          className="inline-block mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to home
        </Link>

        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Your profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Hi{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Manage your personal account, custom menus, pantry, and favorite recipes.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Account</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500">First name</p>
                <p className="mt-1 font-medium text-gray-900">
                  {firstName || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last name</p>
                <p className="mt-1 font-medium text-gray-900">
                  {lastName || '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 font-medium text-gray-900">
                  {user.email || '—'}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Pantry</h2>

            <div className="mt-5">
              <p className="text-3xl font-semibold text-gray-900">
                {pantryCount}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                ingredient{pantryCount === 1 ? '' : 's'} currently in your pantry
              </p>

              <Link
                href="/pantry"
                className="mt-4 inline-block rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Manage pantry
              </Link>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                My custom menus
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Your most recent custom weekly menus.
              </p>
            </div>

            <Link
              href="/create-menu"
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Create new menu
            </Link>
          </div>

          {(customMenus ?? []).length === 0 ? (
            <p className="mt-5 text-sm text-gray-600">
              You have not created any custom menus yet.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {(customMenus as WeeklyMenu[]).map((menu) => (
                <div
                  key={menu.id}
                  className="rounded-xl border bg-gray-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {menu.name}
                      </h3>

                      {menu.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {menu.description}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-gray-500">
                        Created on {formatCreatedDate(menu.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/menus/${menu.id}/edit`}
                        className="rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/menus/${menu.id}/grocery-list`}
                        className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Grocery list
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <Link
                  href="/menus#custom-menus"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  View all custom menus →
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Favorite recipes
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Your most recently saved favorite recipes.
              </p>
            </div>

            <Link
              href="/recipes"
              className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Browse recipes
            </Link>
          </div>

          {(favoriteRows ?? []).length === 0 ? (
            <p className="mt-5 text-sm text-gray-600">
              You have not added any favorite recipes yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {(favoriteRows as FavoriteRecipe[]).map((favorite, index) => {
                const recipe = favorite.recipes
                if (!recipe) return null

                return (
                  <Link
                    key={`${recipe.id}-${index}`}
                    href={`/recipes/${recipe.id}`}
                    className="block rounded-xl border bg-gray-50 p-4 transition hover:bg-white"
                  >
                    <div className="font-medium text-blue-600 hover:underline">
                      {recipe.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {recipe.recipe_type}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}