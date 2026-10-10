import { createClient } from '@/lib/supabase-auth/server'
import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/lib/api-key-auth'

export const maxDuration = 200

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const authResult = await authenticateRequest(req)
  if (!authResult.authenticated || !authResult.userId) {
    return new Response(
      JSON.stringify({ error: authResult.error || 'Not authenticated' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const { data: userRows } = await supabase
    .from('users')
    .select('subscribed')
    .eq('user_id', authResult.userId)

  if (userRows && userRows.length > 0 && userRows[0].subscribed === false) {
    return new Response(
      JSON.stringify({ error: 'Subscription required to regenerate diagrams' }),
      { status: 402, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const { diagramId } = await req.json()
  if (!diagramId) {
    return new Response(JSON.stringify({ error: 'Missing diagramId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data: rows, error: fetchError } = await supabase
    .from('diagrams')
    .select('id, title, description, type')
    .eq('id', diagramId)
    .eq('user_id', authResult.userId)
    .limit(1)

  if (fetchError || !rows || rows.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Diagram not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const diagram = rows[0]
  const { title, description, type } = diagram

  // Only mermaid-based diagrams go through the FlowCraft API regen path.
  // Flow Diagram / Chart use a different generation pipeline and are unlikely
  // to hit the "Unable to render diagram" mermaid error.
  if (type === 'Flow Diagram' || type === 'Chart') {
    return new Response(
      JSON.stringify({ error: 'Regeneration not supported for this type' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
  const res = await fetch(`${API_URL}/v2/diagrams/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      title,
      description,
      type,
      source: 'ui-retry',
    }),
  })

  if (res.status !== 200) {
    return new Response(
      JSON.stringify({ error: 'Failed to regenerate diagram' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const data = await res.json()
  const mermaid_code: string | undefined = data?.response?.mermaid_code
  if (!mermaid_code) {
    return new Response(
      JSON.stringify({ error: 'No mermaid code returned' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const { error: updateError } = await supabase
    .from('diagrams')
    .update({ data: mermaid_code })
    .eq('id', diagramId)
    .eq('user_id', authResult.userId)

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ result: mermaid_code }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
