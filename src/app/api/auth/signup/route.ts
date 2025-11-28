import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-auth/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Email', email)
    console.log('Password', password)

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log('(signup) Error during signup:', error)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success:
        'Signup successful! Please check your email to verify your account.',
    })
  } catch (error) {
    console.error('Error during signup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
