'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidRendererProps {
  code: string
  zoomLevel: number
  position: { x: number; y: number }
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

export function MermaidRenderer({
  code,
  zoomLevel,
  position,
  isDragging,
  onMouseDown,
}: MermaidRendererProps) {
  const mermaidContainerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
      },
    })
  }, [])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code || !mermaidContainerRef.current) return

      try {
        setError(null)
        setSvg(null)
        mermaidContainerRef.current.innerHTML = ''

        // Advanced cleaning pipeline
        let cleanedCode = code
          // Remove all code block markers
          .replace(/```/g, '')
          // Remove any HTML/XML tags
          .replace(/<[^>]*>?/gm, '')
          // Remove duplicate declarations
          .replace(/(flowchart|graph)\s+TD\s+(flowchart|graph)/gi, '$1 TD')
          // Normalize whitespace
          .replace(/\s+/g, ' ')
          .trim()

        // Ensure proper diagram declaration
        if (!cleanedCode.match(/^(flowchart|graph|sequenceDiagram|classDiagram)/i)) {
          cleanedCode = `flowchart TD\n${cleanedCode}`
        }

        // Validate syntax
        try {
          await mermaid.parse(cleanedCode)
        } catch (parseError) {
          throw new Error(`Syntax error: ${parseError.message}`)
        }

        // Render diagram
        const { svg } = await mermaid.render(
          'mermaid-diagram',
          cleanedCode
        )
        
        setSvg(svg)
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        setError(error instanceof Error ? error.message : 'Failed to render diagram')
        if (mermaidContainerRef.current) {
          mermaidContainerRef.current.innerHTML = `
            <div class="p-4 border border-red-300 bg-red-50 rounded text-red-700">
              <p class="font-bold">Diagram Error</p>
              <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
              <details class="mt-2 text-xs">
                <summary>View code</summary>
                <pre class="mt-1 p-2 bg-gray-100 rounded overflow-auto">${code}</pre>
              </details>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [code])

  return (
    <div
      ref={mermaidContainerRef}
      style={{
        transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
        width: '100%',
        height: 'auto',
        display: 'block',
        position: 'absolute',
      }}
      onMouseDown={onMouseDown}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}