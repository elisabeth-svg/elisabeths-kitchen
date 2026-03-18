'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateWeeklyMenuEmailPreference(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to update your preferences.')
  }

  const wantsWeeklyMenuEmail =
    formData.get('wants_weekly_menu_email') === 'on'

  const { error } = await supabase
    .from('profiles')
    .update({
      wants_weekly_menu_email: wantsWeeklyMenuEmail,
    })
    .eq('id', user.id)

  if (error) {
    throw new Error(`Could not update email preference: ${error.message}`)
  }

  revalidatePath('/profile')
}