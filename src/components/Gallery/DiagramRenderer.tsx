'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
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
  const [mermaidInitialized, setMermaidInitialized] = useState(false)
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const [renderError, setRenderError] = useState<string | null>(null)

  // Initialize Mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    })
    setMermaidInitialized(true)
  }, [])

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
      const sanitizedMermaidCode = sanitizeMermaid(data)
      setMermaidCode(sanitizedMermaidCode)
      setSvgCode('')
    }
  }, [type, data])

  // Validate and render Mermaid diagram when code changes
  useEffect(() => {
    if (mermaidInitialized && mermaidCode && mermaidContainerRef.current) {
      const container = mermaidContainerRef.current
      container.innerHTML = '' // Clear previous content
      setRenderError(null) // Clear previous error

      // First, validate the mermaid code
      const validateAndRender = async () => {
        try {
          // Validate mermaid syntax before rendering
          await mermaid.parse(mermaidCode)

          // If validation passes, proceed with rendering
          const { svg } = await mermaid.render('mermaid-diagram', mermaidCode)

          // Check if the rendered SVG contains error indicators
          if (
            svg.includes('error-icon') ||
            svg.includes('Syntax error in text')
          ) {
            console.error('Mermaid syntax error detected in rendered SVG')
            setRenderError(
              'Error rendering Mermaid diagram. Please check the syntax.',
            )
            container.innerHTML = '' // Don't display the error SVG
          } else {
            container.innerHTML = svg
            setRenderError(null)
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          console.error('Mermaid validation/rendering error:', errorMessage)
          setRenderError(
            `Invalid Mermaid syntax: ${errorMessage}`,
          )
          // Clear the container on error
          container.innerHTML = ''
        }
      }

      validateAndRender()
    }
  }, [mermaidCode, mermaidInitialized])

  console.log('SVG Code: ', svgCode)
  console.log('Mermaid Code: ', mermaidCode)
  console.log('Render error state: ', renderError)

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
      className={`flex h-full w-full items-center justify-center bg-gray-100 ${className}`}
    >
      <div className="text-gray-500">No diagram preview available</div>
    </div>
  )
}
