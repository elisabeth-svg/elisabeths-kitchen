import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PantryList from './PantryList'

type Ingredient = {
  id: string
  display_name: string
  category: string
  store_section: string | null
}

type PantryRow = {
  ingredient_id: string
}

export default async function PantryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients_master')
    .select('id, display_name, category, store_section')
    .order('display_name')

  const { data: pantryRows, error: pantryError } = await supabase
    .from('user_pantry')
    .select('ingredient_id')
    .eq('user_id', user.id)

  if (ingredientsError || pantryError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl p-6">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">My Pantry</h1>
            <p className="mt-4 text-red-600">
              There was a problem loading your pantry.
            </p>
          </section>
        </div>
      </main>
    )
  }

  const pantryIds = new Set(
    ((pantryRows ?? []) as PantryRow[]).map((row) => row.ingredient_id)
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to home
        </Link>

        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            My Pantry
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            My Pantry
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Mark the ingredients you already have at home. Next we will use this
            to make your grocery lists smarter.
          </p>
        </section>

        <PantryList
          ingredients={(ingredients ?? []) as Ingredient[]}
          pantryIds={Array.from(pantryIds)}
        />
      </div>
    </main>
  )
}