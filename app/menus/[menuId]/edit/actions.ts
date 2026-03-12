'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateCustomMenu(menuId: string, formData: FormData) {
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

  const { error: updateMenuError } = await supabase
    .from('weekly_menus')
    .update({
      name: menuName,
      description: menuNote || null,
    })
    .eq('id', menuId)
    .eq('is_custom', true)
    .eq('user_id', user.id)

  if (updateMenuError) {
    throw new Error(`Could not update menu: ${updateMenuError.message}`)
  }

  const { error: deleteLinksError } = await supabase
    .from('menu_recipes')
    .delete()
    .eq('menu_id', menuId)

  if (deleteLinksError) {
    throw new Error(`Could not update menu recipes: ${deleteLinksError.message}`)
  }

  const timestamp = Date.now()
  const menuRecipeRows = selectedRecipeIds.map((recipeId, index) => ({
    id: `MR${timestamp}-${index + 1}`,
    menu_id: menuId,
    recipe_id: recipeId,
    order_index: index + 1,
    weekday: index + 1,
  }))

  const { error: insertLinksError } = await supabase
    .from('menu_recipes')
    .insert(menuRecipeRows)

  if (insertLinksError) {
    throw new Error(`Could not save updated recipes: ${insertLinksError.message}`)
  }

  redirect('/menus#custom-menus')
}