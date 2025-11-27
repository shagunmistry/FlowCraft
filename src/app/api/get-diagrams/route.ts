import { createClient } from '@/lib/supabase-auth/server'
import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/lib/api-key-auth'

/**
 * This function is the route to get all diagrams for a user
 * Supports both session and API key authentication
 * @returns {Response}
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Authenticate using either API key or session
  const authResult = await authenticateRequest(request)

  if (!authResult.authenticated || !authResult.userId) {
    return new Response(JSON.stringify({ error: authResult.error || 'Not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const { data: diagramsData, error: diagramsError } = await supabase
    .from('diagrams')
    .select('*')
    .eq('user_id', authResult.userId)

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
 * Supports both session and API key authentication
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const { id } = await req.json()
  const supabase = await createClient()

  // Authenticate using either API key or session
  const authResult = await authenticateRequest(req)

  if (!authResult.authenticated || !authResult.userId) {
    return new Response(JSON.stringify({ error: authResult.error || 'Not authenticated' }), {
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
