import { createClient } from '@/lib/supabase-auth/server'
import { NextRequest } from 'next/server'

/**
 * This function is the route to get all diagrams for a user
 * @returns {Response}
 */
export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const { data: diagramsData, error: diagramsError } = await supabase
    .from('diagrams')
    .select('*')
    .eq('user_id', data.user.id)

  if (diagramsError) {
    return new Response(JSON.stringify({ error: diagramsError.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify({ diagrams: diagramsData }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * This function is the route to get a diagram by id
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest) {
  const { id } = await req.json()
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const { data: diagramData, error: diagramError } = await supabase
    .from('diagrams')
    .select('*')
    .eq('id', id)

  if (diagramError) {
    return new Response(JSON.stringify({ error: diagramError.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify({ diagram: diagramData }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
