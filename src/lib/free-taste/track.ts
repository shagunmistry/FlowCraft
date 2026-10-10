import { track } from '@vercel/analytics'

export type TryItEvent =
  | 'try_it_shown'
  | 'try_it_started'
  | 'try_it_succeeded'
  | 'try_it_failed'
  | 'try_it_cta_clicked'
  | 'try_it_example_used'
  | 'signup_completed'

type Props = Record<string, string | number | boolean | null | undefined>

/** Fire a Vercel custom event. Never throws (ad blockers, SSR) and never
 *  carries prompt text, emails or device ids. Vercel only accepts primitive
 *  property values, so anything else is dropped. */
export function trackTryIt(event: TryItEvent, props?: Props): void {
  try {
    const clean: Record<string, string | number | boolean> = {}
    for (const [k, v] of Object.entries(props ?? {})) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        clean[k] = v
      }
    }
    track(event, props ? clean : undefined)
  } catch {
    // analytics must never break the product
  }
}

/** Coarse prompt-length bucket so we learn about input size without the text. */
export function promptLenBucket(n: number): string {
  if (n < 20) return '0-19'
  if (n < 80) return '20-79'
  if (n < 300) return '80-299'
  return '300+'
}
