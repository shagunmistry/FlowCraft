import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-auth/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: userData, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user: userData.user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}