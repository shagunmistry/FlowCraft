import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-auth/server'

export const dynamic = 'force-dynamic'

const getURL = () => {
  const baseRoute = 'auth/confirm'
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000'
  url = url.includes('http') ? url : `https://${url}`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  url = `${url}${baseRoute}`
  return url
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
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
      return NextResponse.json(
        { error: 'Error during login' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: 'Google Login successful!',
      url: data.url,
    })
  } catch (error) {
    console.error('Error during Google login:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
