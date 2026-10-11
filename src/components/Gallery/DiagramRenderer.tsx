'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { renderMermaid } from '@/lib/mermaidClient'
import { sanitizeMermaid, sanitizeSVG } from '@/lib/utils'
import { CodeFrame } from 'lumina-code-frame'

interface DiagramRendererProps {
  type: string
  data: string
  imageUrl?: string
  className?: string
}

export default function DiagramRenderer({
  type,
  data,
  imageUrl,
  className = '',
}: DiagramRendererProps) {
  const mermaidContainerRef = useRef<HTMLDivElement>(null)
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const [renderError, setRenderError] = useState<string | null>(null)
  const renderId = useId().replace(/:/g, '')

  // Process diagram data based on type
  useEffect(() => {
    if (type === 'illustration' || type === 'generated_image') {
      setSvgCode('')
      setMermaidCode('')
    } else if (type === 'infographic') {
      const sanitizedSvgCode = sanitizeSVG(data)
      setSvgCode(sanitizedSvgCode.svgContent)
      setMermaidCode('')
    } else {
      setMermaidCode(sanitizeMermaid(data))
      setSvgCode('')
    }
    setRenderError(null)
  }, [type, data])

  // Render Mermaid through the shared client. mermaid.render throws on invalid
  // syntax, so no SVG string sniffing is needed (valid Mermaid SVGs always
  // embed an `.error-icon` rule in their stylesheet).
  useEffect(() => {
    if (!mermaidCode || renderError !== null) return
    let cancelled = false

    renderMermaid(`dr-${renderId}`, mermaidCode)
      .then(({ svg }) => {
        if (cancelled || !mermaidContainerRef.current) return
        mermaidContainerRef.current.innerHTML = svg
      })
      .catch((error) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Mermaid rendering error:', message)
        setRenderError(`Invalid Mermaid syntax: ${message}`)
      })
      .finally(() => {
        document.getElementById(`ddr-${renderId}`)?.remove()
      })

    return () => {
      cancelled = true
    }
  }, [mermaidCode, renderError, renderId])

  if (!!svgCode && renderError === null) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: svgCode }}
        style={{ width: '100%', height: 'auto' }}
      />
    )
  } else if (!!mermaidCode && renderError !== null) {
    return (
      <div className="h-full w-full space-y-4 p-4">
        <div className="space-y-3">
          <div className="rounded-md border border-red-200 bg-red-50 p-3 font-semibold text-red-500">
            {renderError}
          </div>
          <CodeFrame
            code={mermaidCode}
            language="mermaid"
            title="Mermaid Code"
            theme="graphite"
          />
        </div>
      </div>
    )
  } else if (!!mermaidCode && renderError === null) {
    return (
      <div
        ref={mermaidContainerRef}
        className="mermaid-diagram-container mx-auto h-auto max-w-full"
      />
    )
  } else if (imageUrl) {
    return (
      <div className="mx-auto h-auto max-w-full">
        <img src={imageUrl} alt="Diagram" style={{ maxWidth: '100%' }} />
      </div>
    )
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-ink ${className}`}
    >
      <div className="text-fog">No diagram preview available</div>
    </div>
  )
}
