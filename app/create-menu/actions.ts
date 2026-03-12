'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCustomMenu(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const selectedRecipeIds = formData.getAll('recipeIds').map(String)
  const menuName = String(formData.get('menuName') || '').trim()
  const menuNote = String(formData.get('menuNote') || '').trim()

  if (!menuName) {
    throw new Error('Please enter a menu name.')
  }

  if (selectedRecipeIds.length < 1 || selectedRecipeIds.length > 7) {
    throw new Error('Please select between 1 and 7 recipes.')
  }

  const { data: existingMenus, error: existingMenusError } = await supabase
    .from('weekly_menus')
    .select('week_number')
    .order('week_number', { ascending: false })
    .limit(1)

  if (existingMenusError) {
    throw new Error('Could not load existing menus.')
  }

  const nextWeekNumber =
    existingMenus && existingMenus.length > 0
      ? Number(existingMenus[0].week_number) + 1
      : 1

  const timestamp = Date.now()
  const menuId = `WM${timestamp}`

  const { error: menuInsertError } = await supabase.from('weekly_menus').insert({
    id: menuId,
    name: menuName,
    week_number: nextWeekNumber,
    description: menuNote || null,
    is_custom: true,
    user_id: user.id,
  })

  if (menuInsertError) {
    throw new Error(`Could not create menu: ${menuInsertError.message}`)
  }

  const menuRecipeRows = selectedRecipeIds.map((recipeId, index) => ({
    id: `MR${timestamp}-${index + 1}`,
    menu_id: menuId,
    recipe_id: recipeId,
    order_index: index + 1,
    weekday: index + 1,
  }))

  const { error: menuRecipesInsertError } = await supabase
    .from('menu_recipes')
    .insert(menuRecipeRows)

  if (menuRecipesInsertError) {
    throw new Error(
      `Could not save selected recipes: ${menuRecipesInsertError.message}`
    )
  }

  redirect('/menus#custom-menus')
}