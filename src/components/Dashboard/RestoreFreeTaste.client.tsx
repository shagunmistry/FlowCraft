'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/analytics'
import { FREE_TASTE_STORAGE_KEY } from '@/lib/free-taste/prefill'

const TRIED_KEY = 'flowcraft:free-taste:restore-tried'

/**
 * If the visitor generated a diagram on the landing page before signing up,
 * save it to their account the first time they reach the dashboard.
 * Silent on any failure: the key stays so a later visit can retry once.
 */
export default function RestoreFreeTaste() {
  const router = useRouter()

  useEffect(() => {
    let saved: { code?: string; type?: string; prompt?: string } | null = null
    try {
      const raw = localStorage.getItem(FREE_TASTE_STORAGE_KEY)
      if (!raw) return
      if (sessionStorage.getItem(TRIED_KEY)) return
      sessionStorage.setItem(TRIED_KEY, '1')
      saved = JSON.parse(raw)
    } catch {
      return
    }
    if (!saved?.code || !saved.type) return

    fetch('/api/diagrams/from-free-taste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved),
    })
      .then(async (res) => {
        if (!res.ok) return
        const { id } = await res.json()
        try {
          localStorage.removeItem(FREE_TASTE_STORAGE_KEY)
        } catch {}
        track('free_taste_restored', { type: saved?.type })
        if (id) router.push(`/dashboard/diagram/${id}`)
      })
      .catch(() => {})
  }, [router])

  return null
}
