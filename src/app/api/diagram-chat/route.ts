import { createClient } from '@/lib/supabase-auth/server'

export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession()

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    }

    const { data: userRows } = await supabaseClient
      .from('users')
      .select('subscribed')
      .eq('user_id', session.user.id)

    if (userRows && userRows.length > 0 && userRows[0].subscribed === false) {
      return new Response(
        JSON.stringify({ error: 'Subscription required to chat with diagrams' }),
        { status: 402, headers: { 'content-type': 'application/json' } },
      )
    }

    const body = await req.json()
    const { diagramType, currentCode, message, history, model } = body as {
      diagramType: string
      currentCode: string
      message: string
      history: Array<{ role: 'user' | 'assistant'; content: string }>
      model?: string
    }

    if (!diagramType || !message) {
      return new Response(
        JSON.stringify({ error: 'diagramType and message are required' }),
        { status: 400, headers: { 'content-type': 'application/json' } },
      )
    }

    const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API

    const res = await fetch(`${API_URL}/v2/diagram/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        diagram_type: diagramType.toLowerCase(),
        current_code: currentCode ?? '',
        message,
        history: (history ?? []).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        model,
      }),
    })

    if (!res.ok) {
      const errorData = await res.text()
      return new Response(errorData, {
        status: res.status,
        headers: { 'content-type': 'application/json' },
      })
    }

    return new Response(res.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('Error in diagram chat proxy:', error)
    return new Response(JSON.stringify({ error: 'Diagram chat failed' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
