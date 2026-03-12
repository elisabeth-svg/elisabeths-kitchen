import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { count: weeklyMenuCount } = await supabase
    .from('weekly_menus')
    .select('*', { count: 'exact', head: true })

  const { count: recipeCount } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })

  const quickFilters = [
    { label: 'Slow cooker', query: { recipe_type: 'slow cooker' } },
    { label: 'Oven', query: { recipe_type: 'oven' } },
    { label: 'Pasta', query: { recipe_type: 'pasta' } },
    { label: 'One pot', query: { recipe_type: 'one pot' } },
    { label: 'Chicken', query: { protein_type: 'chicken' } },
    { label: 'Fish', query: { protein_type: 'fish' } },
    { label: 'Vegetarian', query: { diet_type: 'vegetarian' } },
    { label: 'Under 45 min', query: { max_time: '45' } },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Elisabeth&apos;s Kitchen
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Plan your week, cook with less stress
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Browse pre-made weekly menus, build your own menu from your favorite
            recipes, and generate grocery lists in just a few clicks.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/menus"
            className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-medium text-green-700">
              Weekly planning
            </div>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Pre-made Weekly Menus
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Open curated weekly menus and generate a grocery list for each one.
            </p>
          </Link>

          <Link
            href="/create-menu"
            className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-medium text-blue-700">
              Personalize it
            </div>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Create Your Own Weekly Menu
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Choose 1 to 7 recipes from your recipe library and build your own menu.
            </p>
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-blue-700">Browse all</div>

            <div className="mt-4 space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Browse All Dinner Recipes
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  See every dinner recipe in one place and open them individually.
                </p>
                <Link
                  href="/recipes?meal_category=dinner"
                  className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Open dinner recipes →
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  Browse All Kid-Friendly Snacks
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Discover easy snack recipes that work well for children.
                </p>
                <Link
                  href="/kids-snacks"
                  className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Open kid-friendly snacks →
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-purple-700">
              Quick browse
            </div>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Browse by Filter
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Jump straight into a recipe category.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <Link
                  key={filter.label}
                  href={{
                    pathname: '/recipes',
                    query: filter.query,
                  }}
                  className="rounded-full border bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-white hover:shadow-sm"
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </section>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Search Recipes</h2>
            <p className="mt-2 text-sm text-gray-600">
              Search by recipe name or ingredient, for example salmon, curry,
              garlic, or chickpeas.
            </p>

            <form
              action="/search"
              method="get"
              className="mt-4 flex flex-col gap-3"
            >
              <input
                type="text"
                name="q"
                placeholder="Search recipes or ingredients..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
              >
                Search
              </button>
            </form>
          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Current Library</h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {weeklyMenuCount ?? 0}
                </div>
                <div className="text-sm text-gray-600">Weekly menus</div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {recipeCount ?? 0}
                </div>
                <div className="text-sm text-gray-600">Recipes</div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}