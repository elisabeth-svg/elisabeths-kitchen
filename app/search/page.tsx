import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

type Recipe = {
  id: string
  title: string
  recipe_type: string
  serves: number | null
}

type IngredientMatch = {
  recipe_id: string
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  if (!query) {
    return (
      <main className="flex flex-col gap-6">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Search</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter a recipe name or ingredient to search.
          </p>

          <form action="/search" method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
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
      </main>
    )
  }

  const { data: titleMatches, error: titleError } = await supabase
    .from('recipes')
    .select('id, title, recipe_type, serves')
    .ilike('title', `%${query}%`)
    .order('title')

  const { data: ingredientMatches, error: ingredientError } = await supabase
    .from('recipe_ingredients')
    .select('recipe_id')
    .or(`ingredient_name.ilike.%${query}%,canonical_ingredient.ilike.%${query}%`)

  if (titleError || ingredientError) {
    return (
      <main className="flex flex-col gap-6">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Search results</h1>
          <p className="mt-2 text-red-600">
            There was a problem loading the search results.
          </p>
        </section>
      </main>
    )
  }

  const titleRecipeIds = new Set((titleMatches ?? []).map((recipe) => recipe.id))

  const ingredientRecipeIds = Array.from(
    new Set((ingredientMatches ?? []).map((row: IngredientMatch) => row.recipe_id))
  )

  const ingredientOnlyRecipeIds = ingredientRecipeIds.filter(
    (id) => !titleRecipeIds.has(id)
  )

  let ingredientRecipes: Recipe[] = []

  if (ingredientOnlyRecipeIds.length > 0) {
    const { data: ingredientRecipeData } = await supabase
      .from('recipes')
      .select('id, title, recipe_type, serves')
      .in('id', ingredientOnlyRecipeIds)
      .order('title')

    ingredientRecipes = (ingredientRecipeData ?? []) as Recipe[]
  }

  const totalResults = (titleMatches?.length ?? 0) + ingredientRecipes.length

  return (
    <main className="flex flex-col gap-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <Link
          href="/"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to home
        </Link>

        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Search results</h1>
        <p className="mt-2 text-sm text-gray-600">
          Showing results for <span className="font-medium text-gray-900">“{query}”</span>
        </p>

        <form action="/search" method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            name="q"
            defaultValue={query}
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

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Search results</h2>
          <p className="text-sm text-gray-500">{totalResults} found</p>
        </div>

        {totalResults === 0 ? (
          <p className="text-sm text-gray-600">
            No recipes matched your search.
          </p>
        ) : (
          <div className="space-y-6">
            {(titleMatches?.length ?? 0) > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Matched by recipe name
                </h3>

                <div className="space-y-3">
                  {(titleMatches ?? []).map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/recipes/${recipe.id}`}
                      className="block rounded-xl border bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="font-medium text-blue-600 hover:underline">
                        {recipe.title}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {recipe.recipe_type} • Serves {recipe.serves ?? '—'}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {ingredientRecipes.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Matched by ingredient
                </h3>

                <div className="space-y-3">
                  {ingredientRecipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/recipes/${recipe.id}`}
                      className="block rounded-xl border bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="font-medium text-blue-600 hover:underline">
                        {recipe.title}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {recipe.recipe_type} • Serves {recipe.serves ?? '—'}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}