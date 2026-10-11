import { cleanProps } from '@/lib/analytics'

const SEND_URL =
  process.env.UMAMI_SEND_URL ?? 'https://gateway.umami.is/api/send'
const TIMEOUT_MS = 3000

/**
 * Server-side event for things the browser can't be trusted to report, e.g. a
 * paid subscription. `distinctId` is the Supabase user id, so the event joins
 * the same user as the client-side `identify`. Umami drops requests without a
 * browser-like User-Agent. Best-effort: never throws, never blocks long.
 */
export async function trackServer(
  event: string,
  distinctId: string | undefined,
  props?: Record<string, string | number | boolean | null | undefined>,
): Promise<void> {
  const website = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  if (!website) return
  try {
    await fetch(SEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; FlowCraft-Server/1.0)',
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website,
          hostname: 'flowcraft.app',
          url: '/api/stripe/webhook',
          name: event,
          data: cleanProps(props),
          ...(distinctId ? { id: distinctId } : {}),
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    // analytics must never fail a webhook
  }
}
