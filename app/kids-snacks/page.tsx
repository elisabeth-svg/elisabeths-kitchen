import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Recipe = {
  id: string
  title: string
  recipe_type: string
  serves: number | null
  total_time_minutes: number | null
  difficulty: string | null
}

type KidsSnacksPageProps = {
  searchParams: Promise<{
    max_time?: string
    q?: string
  }>
}

function buildSingleValueQuery(
  current: URLSearchParams,
  key: string,
  value: string
) {
  const params = new URLSearchParams(current.toString())

  if (!value) {
    params.delete(key)
  } else {
    params.set(key, value)
  }

  const query = params.toString()
  return query ? `/kids-snacks?${query}` : '/kids-snacks'
}

function removeFilterValue(current: URLSearchParams, key: string) {
  const params = new URLSearchParams(current.toString())
  params.delete(key)

  const query = params.toString()
  return query ? `/kids-snacks?${query}` : '/kids-snacks'
}

function formatTotalTime(minutes: number | null) {
  if (!minutes) return ''

  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = minutes / 60

  if (Number.isInteger(hours)) {
    return `${hours} hr`
  }

  return `${hours.toFixed(1).replace('.0', '')} hr`
}

function countByMaxTime(recipes: Recipe[], maxTime: number) {
  return recipes.filter(
    (recipe) =>
      recipe.total_time_minutes !== null &&
      recipe.total_time_minutes <= maxTime
  ).length
}

export default async function KidsSnacksPage({
  searchParams,
}: KidsSnacksPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const queryText = params.q?.trim() ?? ''
  const selectedMaxTime = params.max_time ?? ''

  let allRecipesQuery = supabase
    .from('recipes')
    .select('id, title, recipe_type, serves, total_time_minutes, difficulty')
    .eq('recipe_type', 'snack')
    .eq('is_kid_friendly', true)
    .order('title')

  let recipesQuery = supabase
    .from('recipes')
    .select('id, title, recipe_type, serves, total_time_minutes, difficulty')
    .eq('recipe_type', 'snack')
    .eq('is_kid_friendly', true)
    .order('title')

  if (queryText) {
    recipesQuery = recipesQuery.ilike('title', `%${queryText}%`)
  }

  if (selectedMaxTime) {
    recipesQuery = recipesQuery.lte('total_time_minutes', Number(selectedMaxTime))
  }

  const [{ data: allRecipesData }, { data: recipes, error }] = await Promise.all([
    allRecipesQuery,
    recipesQuery,
  ])

  const allRecipes = (allRecipesData ?? []) as Recipe[]

  if (error) {
    return (
      <main className="flex flex-col gap-6">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Kid-Friendly Snacks</h1>
          <p className="mt-4 text-red-600">
            There was a problem loading the snack recipes.
          </p>
        </section>
      </main>
    )
  }

  const currentParams = new URLSearchParams()
  if (queryText) currentParams.set('q', queryText)
  if (selectedMaxTime) currentParams.set('max_time', selectedMaxTime)

  const activeFilterCount = selectedMaxTime ? 1 : 0

  const activeFilters: { label: string; href: string }[] = selectedMaxTime
    ? [
        {
          label: `Under ${selectedMaxTime} min`,
          href: removeFilterValue(currentParams, 'max_time'),
        },
      ]
    : []

  return (
    <main className="flex flex-col gap-6 lg:grid lg:grid-cols-[300px_1fr] lg:items-start">
      <aside className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Filters</h1>
          <Link
            href="/kids-snacks"
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all
          </Link>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {activeFilterCount === 0
            ? 'No filters selected'
            : `${activeFilterCount} filter selected`}
        </p>

        <div className="mt-6 space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Cooking time
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Any', value: '' },
                { label: 'Under 30 min', value: '30' },
                { label: 'Under 45 min', value: '45' },
                { label: 'Under 60 min', value: '60' },
              ].map((option) => {
                const checked = selectedMaxTime === option.value

                return (
                  <Link
                    key={option.label}
                    href={buildSingleValueQuery(
                      currentParams,
                      'max_time',
                      option.value
                    )}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border text-xs ${
                          checked
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 bg-white text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span className="text-sm text-gray-700">
                        {option.label}
                      </span>
                    </div>

                    {option.value && (
                      <span className="text-xs text-gray-400">
                        {countByMaxTime(allRecipes, Number(option.value))}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </aside>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="mb-3 inline-block text-sm text-blue-600 hover:underline"
              >
                ← Back to home
              </Link>

              <h1 className="text-2xl font-semibold text-gray-900">
                Kid-Friendly Snacks
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Discover easy snack recipes that work well for children.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {(recipes as Recipe[] | null)?.length ?? 0} found
            </p>
          </div>

          <form
            action="/kids-snacks"
            method="get"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="q"
              defaultValue={queryText}
              placeholder="Search kid-friendly snacks..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
            />

            {selectedMaxTime && (
              <input type="hidden" name="max_time" value={selectedMaxTime} />
            )}

            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Search
            </button>
          </form>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-600">
              Active filters
            </p>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1.5 text-sm text-gray-700 hover:bg-white"
                >
                  <span className="capitalize">{filter.label}</span>
                  <span className="text-gray-400">✕</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {((recipes ?? []) as Recipe[]).length === 0 ? (
          <div className="rounded-2xl border bg-gray-50 p-5">
            <p className="text-sm text-gray-600">
              No kid-friendly snack recipes found.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {((recipes ?? []) as Recipe[]).map((recipe) => (
              <li
                key={recipe.id}
                className="rounded-2xl border bg-gray-50 p-5 transition hover:bg-white hover:shadow-sm"
              >
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {recipe.title}
                </Link>

                <div className="mt-2 text-sm text-gray-600">
                  <span className="capitalize">{recipe.recipe_type}</span>
                  {' • '}
                  Serves {recipe.serves ?? '—'}
                  {recipe.total_time_minutes
                    ? ` • ${formatTotalTime(recipe.total_time_minutes)}`
                    : ''}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                    {recipe.recipe_type}
                  </span>

                  <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                    kid-friendly
                  </span>

                  {recipe.difficulty && (
                    <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}