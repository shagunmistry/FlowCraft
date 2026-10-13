import { track, type AnalyticsEvent } from '@/lib/analytics'

export type TryItEvent = Extract<
  AnalyticsEvent,
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
>

type Props = Record<string, string | number | boolean | null | undefined>

/** Landing "try it" funnel events: same behavior as before (never throws,
 *  primitives only, no prompt text / emails / device ids), now routed through
 *  the shared analytics wrapper so they reach Umami as well as Vercel. */
export function trackTryIt(event: TryItEvent, props?: Props): void {
  track(event, props)
}

/** Coarse prompt-length bucket so we learn about input size without the text. */
export function promptLenBucket(n: number): string {
  if (n < 20) return '0-19'
  if (n < 80) return '20-79'
  if (n < 300) return '80-299'
  return '300+'
}
