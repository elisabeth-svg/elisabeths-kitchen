'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleFavorite(recipeId: string, shouldFavorite: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (shouldFavorite) {
    const { error } = await supabase.from('user_favorites').upsert(
      {
        user_id: user.id,
        recipe_id: recipeId,
      },
      { onConflict: 'user_id,recipe_id' }
    )

    if (error) {
      throw new Error(`Could not save favorite: ${error.message}`)
    }
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)

    if (error) {
      throw new Error(`Could not remove favorite: ${error.message}`)
    }
  }

  revalidatePath(`/recipes/${recipeId}`)
  revalidatePath('/profile')
}
