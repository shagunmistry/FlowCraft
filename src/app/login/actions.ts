'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase-auth/server'
import { useRouter } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = createClient()

  console.log('login', formData.get('email'), formData.get('password'))

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  console.log('---> Error during Login', error)

  if (error) {
    return { error: 'Invalid login credentials' }
  }

  revalidatePath('/dashboard')
  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Email', data.email)
  console.log('Password', data.password)

  const { error } = await supabase.auth.signUp(data)

  console.log('---> Error', error)

  if (error) {
    return { error: error.message }
  }

  return {
    success:
      'Signup successful! Please check your email to verify your account.',
  }
}
