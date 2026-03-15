import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import RecipeDetailContent from './RecipeDetailContent'

type Recipe = {
  id: string
  title: string
  recipe_type: string
  serves: number | null
  prep_minutes: number | null
  cook_minutes: number | null
  protein_type?: string | null
  diet_type?: string | null
  difficulty?: string | null
  total_time_minutes?: number | null
}

type RecipeIngredient = {
  id: string
  ingredient_group: string
  quantity: number | null
  unit: string | null
  ingredient_name: string
  notes: string | null
}

type RecipeInstruction = {
  id: string
  step_number: number
  instruction: string
}

export default async function RecipeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ menu?: string }>
}) {
  const { id } = await params
  const { menu } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select(
      'id, title, recipe_type, serves, prep_minutes, cook_minutes, protein_type, diet_type, difficulty, total_time_minutes'
    )
    .eq('id', id)
    .single()

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .select('id, ingredient_group, quantity, unit, ingredient_name, notes')
    .eq('recipe_id', id)
    .order('ingredient_group')
    .order('id')

  const { data: instructions, error: instructionsError } = await supabase
    .from('recipe_instructions')
    .select('id, step_number, instruction')
    .eq('recipe_id', id)
    .order('step_number')

  let isFavorite = false

  if (user) {
    const { data: favoriteRow } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('recipe_id', id)
      .maybeSingle()

    isFavorite = Boolean(favoriteRow)
  }

  if (recipeError || ingredientsError || instructionsError || !recipe) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto mt-6 max-w-6xl">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Recipe not found</h1>
            <p className="mt-4 text-red-600">
              There was a problem loading this recipe.
            </p>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto mt-6 max-w-6xl">
        <Link
          href={menu ? '/menus' : '/recipes'}
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← {menu ? 'Back to menus' : 'Back to recipes'}
        </Link>

        <RecipeDetailContent
          recipe={recipe as Recipe}
          ingredients={(ingredients ?? []) as RecipeIngredient[]}
          instructions={(instructions ?? []) as RecipeInstruction[]}
          initialIsFavorite={isFavorite}
        />
      </div>
    </main>
  )
}