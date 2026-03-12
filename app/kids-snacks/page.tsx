import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Recipe = {
  id: string
  title: string
  recipe_type: string
  serves: number | null
  total_time_minutes: number | null
}

function formatTotalTime(minutes: number | null) {
  if (!minutes) return '—'

  if (minutes < 60) return `${minutes} min`

  const hours = minutes / 60

  if (Number.isInteger(hours)) {
    return `${hours} hr`
  }

  return `${hours.toFixed(1).replace('.0', '')} hr`
}

export default async function KidsSnacksPage() {
  const supabase = await createClient()

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, recipe_type, serves, total_time_minutes')
    .eq('recipe_type', 'snack')
    .eq('is_kid_friendly', true)
    .order('title')

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl p-6">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Kid-Friendly Snacks
            </h1>
            <p className="mt-4 text-red-600">
              There was a problem loading the snack recipes.
            </p>
          </section>
        </div>
      </main>
    )
  }

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
            Recipe collection
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Kid-Friendly Snacks
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Discover easy snack recipes that work well for children.
          </p>
        </section>

        {(recipes ?? []).length === 0 ? (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">
              No kid-friendly snack recipes found yet.
            </p>
          </section>
        ) : (
          <div className="space-y-4">
            {(recipes as Recipe[]).map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {recipe.title}
                </h2>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="capitalize">{recipe.recipe_type}</span>
                  <span>Serves {recipe.serves ?? '—'}</span>
                  <span>{formatTotalTime(recipe.total_time_minutes)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}