'use client'

import { useEffect, useRef, useState } from 'react'
import { renderMermaid } from '@/lib/mermaidClient'
import { sanitizeMermaid } from '@/lib/utils'

// Rendered thumbnails are cached per diagram so scrolling, filtering and
// re-mounting never re-run Mermaid. A null entry records a failed render.
const thumbCache = new Map<string, Promise<string | null>>()

function renderThumb(id: string, data: string): Promise<string | null> {
  let cached = thumbCache.get(id)
  if (!cached) {
    const renderId = `gt-${id.replace(/[^a-zA-Z0-9]/g, '')}`
    cached = renderMermaid(renderId, sanitizeMermaid(data))
      .then(({ svg }) => svg)
      .catch(() => null)
      .finally(() => {
        document.getElementById(`d${renderId}`)?.remove()
      })
    thumbCache.set(id, cached)
  }
  return cached
}

interface MermaidThumbProps {
  id: string
  data: string
  title: string
  onRenderFail?: (id: string) => void
}

export default function MermaidThumb({
  id,
  data,
  title,
  onRenderFail,
}: MermaidThumbProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let cancelled = false
    renderThumb(id, data).then((result) => {
      if (cancelled) return
      if (result === null) onRenderFail?.(id)
      else setSvg(result)
    })
    return () => {
      cancelled = true
    }
  }, [visible, id, data, onRenderFail])

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={title}
      className="flex h-full w-full items-center justify-center bg-white p-3 [&>svg]:h-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:max-w-full"
    >
      {svg ? (
        <div
          className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-sm bg-graphite" />
      )}
    </div>
  )
}
