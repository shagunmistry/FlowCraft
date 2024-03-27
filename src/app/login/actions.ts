'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase-auth/server'
import { AuthUser } from '@supabase/supabase-js'

const getURL = () => {
  const baseRoute = 'auth/confirm'
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  url = `${url}${baseRoute}`

  return url
}

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

  // create a user in supabase DB if it doesn't exist
  await createOrUpdateUserInDB()

  revalidatePath('/dashboard')
  return redirect('/dashboard')
}

async function createOrUpdateUserInDB() {
  const supabaseClient = createClient()

  const { data: loggedInUser, error: loggedInUserError } =
    await supabaseClient.auth.getUser()

  if (loggedInUserError || !loggedInUser?.user) {
    console.error(
      '(createOrUpdateUserInDB) Error during logged in user fetch:',
      loggedInUserError,
    )
  }

  // Check if user exists in DB
  const { data: user, error: userError } = await supabaseClient
    .from('users')
    .select('user_id')
    .eq('user_id', loggedInUser?.user?.id)
    .single()

  if (userError) {
    console.error(
      '(createOrUpdateUserInDB) Error during user fetch:',
      userError,
    )
  }

  if (user && user.user_id) {
    return
  }

  const { error: dbError } = await supabaseClient.from('users').insert({
    user_id: loggedInUser?.user?.id,
    email: loggedInUser?.user?.email,
  })

  if (dbError) {
    console.error(
      '(createOrUpdateUserInDB) Error during user creation:',
      dbError,
    )
  }

  return
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

  const { data: userData, error } = await supabase.auth.signUp(data)

  console.log('(signup) Error during signup:', error)

  if (error) {
    return { error: error.message }
  }

  await createOrUpdateUserInDB()

  return {
    success:
      'Signup successful! Please check your email to verify your account.',
  }
}

export async function loginWithGithub() {
  const supabase = createClient()
  const redirectURL = getURL()

  console.log('Redirect URL:', redirectURL)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectURL,
    },
  })

  if (error) {
    console.error('Error during login:', error)
    return { error: 'Error during login' }
  }

  console.log('Data:', data)
  return { success: 'Github Login successful!', data }
}

export async function loginWithGoogle() {
  const supabase = createClient()
  const redirectURL = getURL()

  console.log('(loginWithGoogle) Redirect URL:', redirectURL)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectURL,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Error during login:', error)
    return { error: 'Error during login' }
  }

  await createOrUpdateUserInDB()

  return { success: 'Google Login successful!', data }
}
