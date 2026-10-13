import { track as vercelTrack } from '@vercel/analytics'

/**
 * Client-side custom events. Sends to Umami (if the script is loaded) and to
 * Vercel Analytics, which stays on during the transition.
 *
 * Never put prompt text, titles, emails, device ids or any user-authored
 * content in props — only coarse, non-identifying values.
 */
export type AnalyticsEvent =
  // landing "try it" funnel
  | 'try_it_shown'
  | 'try_it_started'
  | 'try_it_succeeded'
  | 'try_it_failed'
  | 'try_it_cta_clicked'
  | 'try_it_result_opened'
  | 'try_it_result_closed'
  | 'try_it_example_used'
  | 'signup_completed'
  | 'signup_viewed'
  | 'signup_oauth_clicked'
  | 'try_it_engaged'
  // product + conversion
  | 'create'
  | 'pricing_viewed'
  | 'checkout_started'
  | 'login_succeeded'
  | 'share_created'
  | 'export_clicked'

type Props = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void
      identify: (id: string, data?: Record<string, unknown>) => void
    }
  }
}

/** Keep only primitive values; both backends reject anything else. */
export function cleanProps(
  props?: Props,
): Record<string, string | number | boolean> | undefined {
  if (!props) return undefined
  const clean: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      clean[k] = v
    }
  }
  return clean
}

/** Fire a custom event. Never throws (ad blockers, SSR). */
export function track(event: AnalyticsEvent, props?: Props): void {
  const clean = cleanProps(props)
  try {
    if (typeof window !== 'undefined') window.umami?.track(event, clean)
  } catch {
    // analytics must never break the product
  }
  try {
    vercelTrack(event, clean)
  } catch {
    // ditto
  }
}

/** Link this browser session to the Supabase user id (not the email). */
export function identify(userId: string): void {
  try {
    if (typeof window !== 'undefined') window.umami?.identify(userId)
  } catch {
    // ditto
  }
}
