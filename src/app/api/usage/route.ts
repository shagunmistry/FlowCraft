import { createClient } from '@/lib/supabase-auth/server'

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession()

    if (sessionError || !session) {
      console.error('Session error: ', sessionError)
      return new Response(
        JSON.stringify({
          error: 'Unauthorized - Please log in',
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        },
      )
    }

    const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API

    const res = await fetch(`${API_URL}/v2/usage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      credentials: 'include',
    })

    if (!res.ok) {
      const errorData = await res.text()
      console.error('API Error Response:', {
        status: res.status,
        statusText: res.statusText,
        body: errorData,
      })

      if (res.status === 401 || res.status === 403) {
        return new Response(
          JSON.stringify({
            error: 'Authentication failed - Please log in again',
          }),
          {
            status: 401,
            headers: {
              'content-type': 'application/json',
            },
          },
        )
      }

      throw new Error(`API Error: ${res.status} - ${errorData}`)
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return new Response(
      JSON.stringify({
        error: 'An error occurred while fetching usage',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  }
}
