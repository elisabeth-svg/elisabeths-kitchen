import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CreateMenuForm from './CreateMenuForm'

type Recipe = {
  id: string
  title: string
  recipe_type: string
  protein_type: string | null
  total_time_minutes: number | null
}

export default async function CreateMenuPage() {
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, recipe_type, protein_type, total_time_minutes')
    .order('title')

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl p-6">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create your own weekly menu
            </h1>
            <p className="mt-4 text-red-600">
              There was a problem loading recipes.
            </p>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <Link
          href="/"
          className="inline-block mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to home
        </Link>

        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Custom weekly menu
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Create your own weekly menu
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Pick 1 to 7 recipes from your recipe library and save them as your
            own weekly menu.
          </p>
        </section>

        <CreateMenuForm recipes={(recipes ?? []) as Recipe[]} />
      </div>
    </main>
  )
}