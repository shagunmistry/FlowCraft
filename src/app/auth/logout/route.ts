import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase-auth/server'

export async function GET(request: NextRequest) {
  console.log('GET /auth/logout: ', request.url.toString())
  // Implement logout
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  console.log('GET /auth/logout: ', error)
  if (!error) {
    // Redirect them to login if no error
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin))
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/error', request.nextUrl.origin))
}
