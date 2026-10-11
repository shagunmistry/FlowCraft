'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase-auth/client'
import { identify } from '@/lib/analytics'

const RETRY_MS = 500
const MAX_TRIES = 10

/** Links the Umami session to the signed-in Supabase user id (never the
 *  email) so web activity joins to the same user as extension events. The
 *  Umami script loads afterInteractive, so retry briefly until it is there. */
export default function AnalyticsIdentify() {
  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const userId = data.user?.id
        if (!userId || cancelled) return
        let tries = 0
        const attempt = () => {
          if (cancelled) return
          if (window.umami) {
            identify(userId)
          } else if (++tries < MAX_TRIES) {
            timer = setTimeout(attempt, RETRY_MS)
          }
        }
        attempt()
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [])

  return null
}
