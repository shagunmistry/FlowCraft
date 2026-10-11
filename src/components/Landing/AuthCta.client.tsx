'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-auth/client'
import { trackTryIt } from '@/lib/free-taste/track'

type Props = {
  placement: string
  children?: React.ReactNode
  variant?: 'primary' | 'quiet'
  signedOutHref?: string
  signedInHref?: string
  signedInLabel?: string
  className?: string
}

export function useIsAuthenticated() {
  const [authed, setAuthed] = useState(false)
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data, error }) => setAuthed(!!data?.user && !error))
      .catch(() => {})
  }, [])
  return authed
}

const styles = {
  primary:
    'inline-flex items-center rounded-full bg-signal px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-paper',
  quiet:
    'inline-flex items-center px-1 py-3.5 text-[15px] text-paper underline decoration-rule underline-offset-[6px] transition-colors hover:decoration-signal',
}

export default function AuthCta({
  placement,
  children = 'Create your first diagram',
  variant = 'primary',
  signedOutHref = '/sign-up?src=landing',
  signedInHref = '/dashboard',
  signedInLabel = 'Open dashboard',
  className,
}: Props) {
  const authed = useIsAuthenticated()
  return (
    <Link
      href={authed ? signedInHref : `${signedOutHref}${signedOutHref.includes('?') ? '&' : '?'}at=${placement}`}
      onClick={() => trackTryIt('try_it_cta_clicked', { where: `landing_${placement}` })}
      className={className ?? styles[variant]}
    >
      {authed ? signedInLabel : children}
    </Link>
  )
}
