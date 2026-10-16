import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-auth/server'
import { sanitizeMermaid } from '@/lib/utils'
import { freeTasteTypeToDiagramType } from '@/lib/free-taste/prefill'

const MAX_CODE_CHARS = 20_000
const MAX_PROMPT_CHARS = 1_500

/**
 * Saves the diagram a visitor generated on the landing page ("try it") into
 * their account right after they sign up. The client sends what it kept in
 * localStorage, so everything here is untrusted and validated.
 */
export async function POST(req: Request) {
  const sb = await createClient()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const code = typeof body?.code === 'string' ? body.code : ''
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
  const type = freeTasteTypeToDiagramType(String(body?.type ?? ''))
  if (!code || code.length > MAX_CODE_CHARS || !type) {
    return NextResponse.json({ error: 'Invalid diagram' }, { status: 400 })
  }

  const data = sanitizeMermaid(code)
  if (!data) {
    return NextResponse.json({ error: 'Invalid diagram' }, { status: 400 })
  }

  const { data: inserted, error } = await sb
    .from('diagrams')
    .insert([
      {
        user_id: user.id,
        type,
        title: prompt.slice(0, 80) || 'My first diagram',
        description: prompt.slice(0, MAX_PROMPT_CHARS),
        data,
        private: true,
        created_at: new Date().toISOString(),
      },
    ])
    .select('id')
    .single()

  if (error || !inserted) {
    return NextResponse.json({ error: 'Could not save diagram' }, { status: 500 })
  }
  return NextResponse.json({ id: inserted.id })
}
