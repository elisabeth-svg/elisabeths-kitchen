import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type WeeklyMenu = {
  id: string
  name: string
  week_number: number
  description: string | null
  is_custom: boolean
  created_at: string
  user_id: string | null
}

type MenuRecipeLink = {
  menu_id: string
  recipe_id: string
  order_index: number
}

type Recipe = {
  id: string
  title: string
  recipe_type: string
}

function getIsoWeekStart(year: number, week: number) {
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7))
  const day = simple.getUTCDay() || 7

  if (day <= 4) {
    simple.setUTCDate(simple.getUTCDate() - day + 1)
  } else {
    simple.setUTCDate(simple.getUTCDate() + 8 - day)
  }

  return simple
}

function formatWeekDateRange(weekNumber: number, year = 2026) {
  const monday = getIsoWeekStart(year, weekNumber)
  const friday = new Date(monday)
  friday.setUTCDate(monday.getUTCDate() + 4)

  const startDay = monday.getUTCDate()
  const endDay = friday.getUTCDate()

  const startMonth = monday.toLocaleDateString('en-GB', {
    month: 'short',
    timeZone: 'UTC',
  })

  const endMonth = friday.toLocaleDateString('en-GB', {
    month: 'short',
    timeZone: 'UTC',
  })

  if (startMonth === endMonth) {
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year} menu plan`
  }

  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year} menu plan`
}

function formatCustomMenuDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function MenusPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let menusQuery = supabase
    .from('weekly_menus')
    .select('id, name, week_number, description, is_custom, created_at, user_id')

  if (user) {
    menusQuery = menusQuery.or(`is_custom.eq.false,user_id.eq.${user.id}`)
  } else {
    menusQuery = menusQuery.eq('is_custom', false)
  }

  const { data: menus, error: menusError } = await menusQuery

  const { data: menuRecipes, error: menuRecipesError } = await supabase
    .from('menu_recipes')
    .select('menu_id, recipe_id, order_index')
    .order('order_index')

  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, title, recipe_type')
    .order('id')

  if (menusError || menuRecipesError || recipesError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Weekly Menus</h1>
        <p className="mt-4 text-red-600">Error loading menus.</p>
      </main>
    )
  }

  const recipesById = new Map(
    ((recipes ?? []) as Recipe[]).map((recipe) => [recipe.id, recipe])
  )

  const typedMenus = ((menus ?? []) as WeeklyMenu[]).filter((menu) => {
    if (!menu.is_custom) return true
    return user ? menu.user_id === user.id : false
  })

  const preMadeMenus = [...typedMenus]
    .filter((menu) => !menu.is_custom)
    .sort((a, b) => b.week_number - a.week_number)

  const customMenus = [...typedMenus]
    .filter((menu) => menu.is_custom)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  function renderMenuSection(
    title: string,
    menuList: WeeklyMenu[],
    emptyText: string
  ) {
    return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {title === 'Pre-made Weekly Menus'
              ? 'Browse curated menus ready to use.'
              : 'Menus you created from your own recipe selection.'}
          </p>
        </div>

        {menuList.length === 0 ? (
          <p className="text-sm text-gray-600">{emptyText}</p>
        ) : (
          <div className="space-y-6">
            {menuList.map((menu) => {
              const linkedRecipes = ((menuRecipes ?? []) as MenuRecipeLink[])
                .filter((link) => link.menu_id === menu.id)
                .map((link) => recipesById.get(link.recipe_id))
                .filter((recipe): recipe is Recipe => Boolean(recipe))

              return (
                <section key={menu.id} className="rounded-xl border bg-gray-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {menu.is_custom ? menu.name : `Week ${menu.week_number}`}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {menu.is_custom
                          ? menu.description || `Created on ${formatCustomMenuDate(menu.created_at)}`
                          : formatWeekDateRange(menu.week_number)}
                      </p>
                    </div>

                    {menu.is_custom && (
                      <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-600">
                        Custom
                      </span>
                    )}
                  </div>

                  <ul className="mt-4 space-y-2">
                    {linkedRecipes.map((recipe) => (
                      <li key={recipe.id} className="rounded-lg bg-white p-3">
                        <Link
                          href={`/recipes/${recipe.id}?menu=${menu.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {recipe.title}
                        </Link>
                        <div className="text-sm text-gray-600">
                          {recipe.recipe_type}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <Link
                      href={`/menus/${menu.id}/grocery-list`}
                      className="inline-block rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                      Generate Grocery List
                    </Link>
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </section>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Weekly menus
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Weekly Menus
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Browse pre-made weekly menus or revisit custom menus you created from
            your own recipe selection.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#pre-made-menus"
              className="inline-flex items-center rounded-full border bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-white"
            >
              Pre-made Weekly Menus
            </a>

            <a
              href="#custom-menus"
              className="inline-flex items-center rounded-full border bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-white"
            >
              Custom Menus
            </a>

            <Link
              href="/create-menu"
              className="inline-flex items-center rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              Create Your Own Weekly Menu
            </Link>
          </div>
        </section>

        <div className="space-y-6">
          <div id="pre-made-menus">
            {renderMenuSection(
              'Pre-made Weekly Menus',
              preMadeMenus,
              'No pre-made weekly menus found.'
            )}
          </div>

          <div id="custom-menus">
            {renderMenuSection(
              'Custom Menus',
              customMenus,
              'No custom menus created yet.'
            )}
          </div>
        </div>
      </div>
    </main>
  )
}