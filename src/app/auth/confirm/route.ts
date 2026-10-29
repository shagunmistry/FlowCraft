import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase-auth/server'
import { handleSignupTemplate } from '@/lib/templates/handoff'
import { trackServer } from '@/lib/analytics-server'

const NEW_USER_WINDOW_MS = 2 * 60 * 1000

/** Server-side auth outcome events: the browser never sees the OAuth return,
 *  so this is the only place a completed Google/GitHub sign-up is visible. */
async function trackAuthSuccess(
  user: { id: string; created_at?: string; app_metadata?: { provider?: string } } | null | undefined,
  src: string | null,
) {
  if (!user) return
  const created = user.created_at ? Date.parse(user.created_at) : NaN
  const newUser = Number.isFinite(created) && Date.now() - created < NEW_USER_WINDOW_MS
  const props = {
    method: user.app_metadata?.provider ?? 'unknown',
    new_user: newUser,
    source: src && /^[a-z0-9-]{1,32}$/.test(src) ? src : 'direct',
  }
  await trackServer('auth_succeeded', user.id, props)
  // Email sign-ups already fire signup_completed client-side at form submit.
  if (newUser && props.method !== 'email') await trackServer('signup_completed', user.id, props)
}

export async function GET(request: NextRequest) {
  console.log('GET /auth/confirm: ', request.url.toString())
  const { searchParams } = new URL(request.url)

  console.log('GET /auth/confirm SEARCH PARAMS: ', searchParams.toString())

  const isCode = searchParams.get('code')
  const templateId = searchParams.get('template')
  const src = searchParams.get('src')

  if (isCode) {
    const supabase = await createClient()

    const { data: exchangeData, error } =
      await supabase.auth.exchangeCodeForSession(isCode)

    console.log('GET /auth/confirm: ', error)

    if (!error) {
      await trackAuthSuccess(exchangeData?.user, src)

      // VS Code OAuth bridge: if the sign-in was initiated from the extension
      // (cookie set by /vscode/auth/start), redirect back to the extension's
      // URI handler with the freshly-minted session tokens.
      const cookieStore = await cookies()
      const vscodeCookie = cookieStore.get('flowcraft_vscode_oauth')
      if (vscodeCookie?.value && exchangeData?.session) {
        let parsed: { state?: string } = {}
        try {
          parsed = JSON.parse(vscodeCookie.value)
        } catch {
          // ignore malformed cookie
        }
        if (parsed.state) {
          cookieStore.delete('flowcraft_vscode_oauth')
          const session = exchangeData.session
          const params = new URLSearchParams({
            state: parsed.state,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: String(session.expires_at ?? ''),
            email: session.user?.email ?? '',
          })
          return NextResponse.redirect(
            `vscode://FlowCraft.flowcraft/auth/callback?${params.toString()}`
          )
        }
      }

      // If the user came from a "Use this template" CTA before signup, clone
      // it into their fresh account and drop them straight into the editor.
      const newDiagramId = await handleSignupTemplate(templateId)
      const dest = newDiagramId
        ? `/dashboard/diagram/${newDiagramId}`
        : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.nextUrl.origin))
    }

    if (error) {
      console.log('GET /auth/confirm: ', error)
      await trackServer('auth_failed', undefined, { stage: 'code_exchange' })
      return NextResponse.redirect(new URL('/error', request.nextUrl.origin))
    }
  } else {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = next
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')

    console.log('GET /auth/confirm Routing to: ', redirectTo.toString())

    if (token_hash && type) {
      const supabase = await createClient()

      const { data: otpData, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      console.log('GET /auth/confirm: ', error)
      if (!error) {
        await trackAuthSuccess(otpData?.user, src)
        // Same template hand-off as the OAuth-code branch above.
        const newDiagramId = await handleSignupTemplate(templateId)
        const dest = newDiagramId
          ? `/dashboard/diagram/${newDiagramId}`
          : '/dashboard'
        return NextResponse.redirect(new URL(dest, request.nextUrl.origin))
      }
    }

    // return the user to an error page with some instructions
    await trackServer('auth_failed', undefined, { stage: 'otp' })
    redirectTo.pathname = '/error'
    return NextResponse.redirect(redirectTo)
  }
}
