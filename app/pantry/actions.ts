'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function togglePantryItem(
  ingredientId: string,
  inStock: boolean
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (inStock) {
    const { error } = await supabase.from('user_pantry').upsert(
      {
        user_id: user.id,
        ingredient_id: ingredientId,
        in_stock: true,
      },
      { onConflict: 'user_id,ingredient_id' }
    )

    if (error) {
      throw new Error(`Could not save pantry item: ${error.message}`)
    }
  } else {
    const { error } = await supabase
      .from('user_pantry')
      .delete()
      .eq('user_id', user.id)
      .eq('ingredient_id', ingredientId)

    if (error) {
      throw new Error(`Could not remove pantry item: ${error.message}`)
    }
  }

  revalidatePath('/pantry')
}

export async function clearPantry() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('user_pantry')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Could not clear pantry: ${error.message}`)
  }

  revalidatePath('/pantry')
}