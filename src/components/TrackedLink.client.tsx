'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { track, type AnalyticsEvent } from '@/lib/analytics'

type Props = ComponentProps<typeof Link> & {
  event: AnalyticsEvent
  eventProps?: Record<string, string | number | boolean>
}

/** next/link that fires an analytics event on click (usable from server components). */
export default function TrackedLink({ event, eventProps, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, eventProps)
        onClick?.(e)
      }}
    />
  )
}
