import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditCustomMenuForm from './EditCustomMenuForm'

type Menu = {
  id: string
  name: string
  description: string | null
  is_custom: boolean
  user_id: string | null
}

type Recipe = {
  id: string
  title: string
  recipe_type: string
  protein_type: string | null
  total_time_minutes: number | null
}

type MenuRecipe = {
  recipe_id: string
}

export default async function EditCustomMenuPage({
  params,
}: {
  params: Promise<{ menuId: string }>
}) {
  const { menuId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: menu, error: menuError } = await supabase
    .from('weekly_menus')
    .select('id, name, description, is_custom, user_id')
    .eq('id', menuId)
    .single()

  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, title, recipe_type, protein_type, total_time_minutes')
    .order('title')

  const { data: menuRecipes, error: menuRecipesError } = await supabase
    .from('menu_recipes')
    .select('recipe_id')
    .eq('menu_id', menuId)
    .order('order_index')

  const typedMenu = menu as Menu | null

  if (
    menuError ||
    recipesError ||
    menuRecipesError ||
    !typedMenu ||
    !typedMenu.is_custom ||
    typedMenu.user_id !== user.id
  ) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl p-6">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">Edit menu</h1>
            <p className="mt-4 text-red-600">
              There was a problem loading this custom menu.
            </p>
          </section>
        </div>
      </main>
    )
  }

  const selectedRecipeIds = ((menuRecipes ?? []) as MenuRecipe[]).map(
    (row) => row.recipe_id
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <Link
          href="/menus#custom-menus"
          className="inline-block mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to custom menus
        </Link>

        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            Custom menu
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Edit custom menu
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Update the menu name, note, and recipe selection.
          </p>
        </section>

        <EditCustomMenuForm
          menu={typedMenu}
          recipes={(recipes ?? []) as Recipe[]}
          selectedRecipeIds={selectedRecipeIds}
        />
      </div>
    </main>
  )
}