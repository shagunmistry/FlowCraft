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

    console.log('Redirect URL:', redirectURL)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectURL,
      },
    })

    if (error) {
      console.error('Error during login:', error)
      return NextResponse.json(
        { error: 'Error during login' },
        { status: 400 }
      )
    }

    console.log('Data:', data)
    return NextResponse.json({
      success: 'Github Login successful!',
      url: data.url,
    })
  } catch (error) {
    console.error('Error during GitHub login:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
