import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase-auth/server'

export async function GET(request: NextRequest) {
  console.log('GET /auth/confirm: ', request.url.toString())
  const { searchParams } = new URL(request.url)

  console.log('GET /auth/confirm SEARCH PARAMS: ', searchParams.toString())

  const isCode = searchParams.get('code')

  if (isCode) {
    const supabase = createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(isCode)

    console.log('GET /auth/confirm: ', error)

    if (!error) {
      // Redirect them to dashboard if no error
      return NextResponse.redirect(
        new URL('/dashboard', request.nextUrl.origin),
      )
    }

    if (error) {
      console.log('GET /auth/confirm: ', error)
      return NextResponse.redirect(new URL('/error', request.nextUrl.origin))
    }
  } else {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = next
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')

    console.log('GET /auth/confirm Routing to: ', redirectTo.toString())

    if (token_hash && type) {
      const supabase = createClient()

      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      console.log('GET /auth/confirm: ', error)
      if (!error) {
        // Redirect them to dashboard if no error
        return NextResponse.redirect(
          new URL('/dashboard', request.nextUrl.origin),
        )
      }
    }

    // return the user to an error page with some instructions
    redirectTo.pathname = '/error'
    return NextResponse.redirect(redirectTo)
  }
}
