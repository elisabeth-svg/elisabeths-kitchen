'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function deleteCustomMenu(menuId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('weekly_menus')
    .delete()
    .eq('id', menuId)
    .eq('is_custom', true)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Could not delete menu: ${error.message}`)
  }

  redirect('/menus#custom-menus')
}