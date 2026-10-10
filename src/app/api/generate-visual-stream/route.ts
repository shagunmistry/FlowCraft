import { createClient } from '@/lib/supabase-auth/server'
import { OptionType } from '@/lib/utils'

export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession()

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } },
      )
    }

    const { data: userRows } = await supabaseClient
      .from('users')
      .select('subscribed')
      .eq('user_id', session.user.id)

    if (userRows && userRows.length > 0 && userRows[0].subscribed === false) {
      return new Response(
        JSON.stringify({ error: 'Subscription required to generate diagrams' }),
        { status: 402, headers: { 'content-type': 'application/json' } },
      )
    }

    const body = await req.json()
    const { type, description, isPublic, colorPalette, complexityLevel } = body

    const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API

    const res = await fetch(`${API_URL}/v2/diagram/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        prompt: description,
        type: (type as string).toLowerCase(),
        private: !isPublic,
        colorPalette: colorPalette
          ? colorPalette.toLowerCase().replace(' (default)', '')
          : 'brand colors',
        complexityLevel: complexityLevel
          ? complexityLevel.toLowerCase().replace(' (default)', '')
          : 'medium',
      }),
    })

    if (!res.ok) {
      const errorData = await res.text()
      return new Response(errorData, {
        status: res.status,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Pipe the SSE stream directly through
    return new Response(res.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('Error in streaming generation:', error)
    return new Response(
      JSON.stringify({ error: 'Streaming generation failed' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    )
  }
}
