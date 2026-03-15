import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import RecipeFilters from './RecipeFilters'

type Recipe = {
  id: string
  title: string
  recipe_type: string
  serves: number | null
  protein_type: string | null
  diet_type: string | null
  total_time_minutes: number | null
  difficulty: string | null
  is_kid_friendly?: boolean | null
}

type RecipesPageProps = {
  searchParams: Promise<{
    recipe_type?: string | string[]
    protein_type?: string | string[]
    diet_type?: string | string[]
    max_time?: string
    q?: string
    collection?: string
  }>
}

function toArray(value?: string | string[]) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function removeFilterValue(
  current: URLSearchParams,
  key: string,
  value?: string
) {
  const params = new URLSearchParams(current.toString())

  if (value === undefined) {
    params.delete(key)
  } else {
    const remaining = params.getAll(key).filter((item) => item !== value)
    params.delete(key)
    remaining.forEach((item) => params.append(key, item))
  }

  const query = params.toString()
  return query ? `/recipes?${query}` : '/recipes'
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

function countByField(
  recipes: Recipe[],
  field: 'recipe_type' | 'protein_type' | 'diet_type'
) {
  return recipes.reduce<Record<string, number>>((acc, recipe) => {
    const value = recipe[field]
    if (!value) return acc
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

function countByMaxTime(recipes: Recipe[], maxTime: number) {
  return recipes.filter(
    (recipe) =>
      recipe.total_time_minutes !== null &&
      recipe.total_time_minutes <= maxTime
  ).length
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams

  const queryText = params.q?.trim() ?? ''
  const collection = params.collection ?? ''

  const selectedRecipeTypes = toArray(params.recipe_type)
  const selectedProteinTypes = toArray(params.protein_type)
  const selectedDietTypes = toArray(params.diet_type)
  const selectedMaxTime = params.max_time ?? ''

  const recipeTypes = ['slow cooker', 'oven', 'pasta', 'one pot']
  const proteinTypes = ['chicken', 'beef', 'pork', 'fish', 'vegetarian']
  const dietTypes = ['vegetarian']

  let allRecipesQuery = supabase
    .from('recipes')
    .select(
      'id, title, recipe_type, serves, protein_type, diet_type, total_time_minutes, difficulty, is_kid_friendly'
    )
    .order('title')

  let recipesQuery = supabase
    .from('recipes')
    .select(
      'id, title, recipe_type, serves, protein_type, diet_type, total_time_minutes, difficulty, is_kid_friendly'
    )
    .order('title')

  if (collection === 'dinner') {
    allRecipesQuery = allRecipesQuery.neq('recipe_type', 'snack')
    recipesQuery = recipesQuery.neq('recipe_type', 'snack')
  }

  if (queryText) {
    recipesQuery = recipesQuery.ilike('title', `%${queryText}%`)
  }

  if (selectedRecipeTypes.length > 0) {
    recipesQuery = recipesQuery.in('recipe_type', selectedRecipeTypes)
  }

  if (selectedProteinTypes.length > 0) {
    recipesQuery = recipesQuery.in('protein_type', selectedProteinTypes)
  }

  if (selectedDietTypes.length > 0) {
    recipesQuery = recipesQuery.in('diet_type', selectedDietTypes)
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
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto mt-6 max-w-6xl">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Recipes</h1>
            <p className="mt-4 text-red-600">Error: {error.message}</p>
          </section>
        </div>
      </main>
    )
  }

  const recipeTypeCounts = countByField(allRecipes, 'recipe_type')
  const proteinTypeCounts = countByField(allRecipes, 'protein_type')
  const dietTypeCounts = countByField(allRecipes, 'diet_type')

  const currentParams = new URLSearchParams()

  if (collection) currentParams.set('collection', collection)
  if (queryText) currentParams.set('q', queryText)

  selectedRecipeTypes.forEach((value) =>
    currentParams.append('recipe_type', value)
  )
  selectedProteinTypes.forEach((value) =>
    currentParams.append('protein_type', value)
  )
  selectedDietTypes.forEach((value) =>
    currentParams.append('diet_type', value)
  )
  if (selectedMaxTime) currentParams.set('max_time', selectedMaxTime)

  const activeFilterCount =
    selectedRecipeTypes.length +
    selectedProteinTypes.length +
    selectedDietTypes.length +
    (selectedMaxTime ? 1 : 0)

  const activeFilters: { label: string; href: string }[] = [
    ...selectedRecipeTypes.map((value) => ({
      label: value,
      href: removeFilterValue(currentParams, 'recipe_type', value),
    })),
    ...selectedProteinTypes.map((value) => ({
      label: value,
      href: removeFilterValue(currentParams, 'protein_type', value),
    })),
    ...selectedDietTypes.map((value) => ({
      label: value,
      href: removeFilterValue(currentParams, 'diet_type', value),
    })),
    ...(selectedMaxTime
      ? [
          {
            label: `Under ${selectedMaxTime} min`,
            href: removeFilterValue(currentParams, 'max_time'),
          },
        ]
      : []),
  ]

  const pageTitle =
    collection === 'dinner' ? 'Dinner Recipes' : 'Recipes'

  const pageDescription =
    collection === 'dinner'
      ? 'Browse all dinner recipes in one place and open them individually.'
      : 'Browse your full recipe library and filter recipes by style, protein, diet, or cooking time.'

  const clearAllHref =
    collection ? `/recipes?collection=${collection}` : '/recipes'

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto mt-6 max-w-6xl">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[300px_1fr] lg:items-start">
          <RecipeFilters
            clearAllHref={clearAllHref}
            activeFilterCount={activeFilterCount}
            recipeTypes={recipeTypes}
            proteinTypes={proteinTypes}
            dietTypes={dietTypes}
            selectedRecipeTypes={selectedRecipeTypes}
            selectedProteinTypes={selectedProteinTypes}
            selectedDietTypes={selectedDietTypes}
            selectedMaxTime={selectedMaxTime}
            recipeTypeCounts={recipeTypeCounts}
            proteinTypeCounts={proteinTypeCounts}
            dietTypeCounts={dietTypeCounts}
            currentQueryString={currentParams.toString()}
            countByMaxTimeValues={{
              '30': countByMaxTime(allRecipes, 30),
              '45': countByMaxTime(allRecipes, 45),
              '60': countByMaxTime(allRecipes, 60),
            }}
          />

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {pageTitle}
                  </h1>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {pageDescription}
                  </p>
                </div>

                <p className="shrink-0 text-sm text-gray-500">
                  {(recipes as Recipe[] | null)?.length ?? 0} found
                </p>
              </div>

              <form
                action="/recipes"
                method="get"
                className="flex flex-col gap-3 sm:flex-row"
              >
                {collection && (
                  <input type="hidden" name="collection" value={collection} />
                )}

                <input
                  type="text"
                  name="q"
                  defaultValue={queryText}
                  placeholder="Search recipes..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
                />

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

                    {recipe.protein_type && (
                      <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                        {recipe.protein_type}
                      </span>
                    )}

                    {recipe.diet_type && (
                      <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                        {recipe.diet_type}
                      </span>
                    )}

                    {recipe.difficulty && (
                      <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                        {recipe.difficulty}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}