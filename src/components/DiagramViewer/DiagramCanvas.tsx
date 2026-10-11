'use client'

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { sanitizeMermaid, sanitizeSVG, DiagramOrChartType } from '@/lib/utils'
import { renderMermaid, parseMermaid } from '@/lib/mermaidClient'
import dynamic from 'next/dynamic'
import { Node, Edge } from 'reactflow'
import DiagramSkeleton from '@/components/skeletons/DiagramSkeleton'

const ReactFlowCanvas = dynamic(() => import('./ReactFlowCanvas'), {
  ssr: false,
  loading: () => <DiagramSkeleton />,
})
const ChartJsComponent = dynamic(
  () => import('@/components/ChartJsComponents'),
  { ssr: false, loading: () => <DiagramSkeleton /> },
)

const VIEWER_MERMAID_CONFIG = {
  theme: 'base' as const,
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#000000',
    primaryBorderColor: '#000000',
    lineColor: '#333333',
    secondaryColor: '#f4f4f5',
    tertiaryColor: '#fff',
  },
}

export interface DiagramCanvasHandle {
  contentElement: HTMLDivElement | null
}

interface DiagramCanvasProps {
  type: string
  mermaidCode?: string | null
  svgCode?: string | null
  imageUrl?: string | null
  flowDiagramData?: { nodes: Node[]; edges: Edge[] } | null
  chartJsData?: any | null
  zoomLevel: number
  position: { x: number; y: number }
  onPositionChange: (pos: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
  editableFlow?: boolean
  diagramId?: string
  title?: string
  onRetry?: () => Promise<void> | void
  retrying?: boolean
}

const DiagramCanvas = forwardRef<DiagramCanvasHandle, DiagramCanvasProps>(
  function DiagramCanvas(
    {
      type,
      mermaidCode,
      svgCode,
      imageUrl,
      flowDiagramData,
      chartJsData,
      zoomLevel,
      position,
      onPositionChange,
      onZoomChange,
      editableFlow,
      diagramId,
      title,
      onRetry,
      retrying,
    },
    ref,
  ) {
    const contentRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)
    const mermaidContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [mermaidError, setMermaidError] = useState(false)

    useImperativeHandle(ref, () => ({
      get contentElement() {
        return contentRef.current
      },
    }))

    // Lazy-load + render mermaid when code is available
    useEffect(() => {
      if (!mermaidCode || !mermaidContainerRef.current) return
      const container = mermaidContainerRef.current
      let cancelled = false

      ;(async () => {
        if (cancelled) return

        container.innerHTML = ''
        setMermaidError(false)
        const id = `mermaid-${Date.now()}`
        try {
          const ok = await parseMermaid(mermaidCode)
          if (!ok) throw new Error('Invalid mermaid syntax')
          const { svg } = await renderMermaid(
            id,
            mermaidCode,
            VIEWER_MERMAID_CONFIG,
          )
          if (cancelled) return
          container.innerHTML = svg
        } catch (e) {
          console.error('Mermaid render error', {
            error: e,
            message: (e as Error)?.message,
            codeLength: mermaidCode?.length,
            codePreview: mermaidCode?.slice(0, 200),
            fontsStatus:
              typeof document !== 'undefined'
                ? document.fonts?.status
                : undefined,
          })
          if (!cancelled) setMermaidError(true)
          container.innerHTML = ''
        } finally {
          document.getElementById('d' + id)?.remove()
        }
      })()

      return () => {
        cancelled = true
      }
    }, [mermaidCode])

    // Drag to pan
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        // Don't drag if clicking on ReactFlow or interactive elements
        if ((e.target as HTMLElement).closest('.react-flow')) return
        if (e.button === 0) {
          setIsDragging(true)
          setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          })
        }
      },
      [position],
    )

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (isDragging) {
          onPositionChange({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          })
        }
      },
      [isDragging, dragStart, onPositionChange],
    )

    const handleMouseUp = useCallback(() => {
      setIsDragging(false)
    }, [])

    // Ctrl+scroll to zoom
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -10 : 10
          const newZoom = Math.min(Math.max(zoomLevel + delta, 25), 300)
          onZoomChange(newZoom)
        }
      }

      canvas.addEventListener('wheel', handleWheel, { passive: false })
      return () => canvas.removeEventListener('wheel', handleWheel)
    }, [zoomLevel, onZoomChange])

    const isFlowDiagram = type.toLowerCase() === 'flow diagram'

    return (
      <div
        ref={canvasRef}
        className={`relative flex h-full w-full items-center justify-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Dot grid background — editorial sheet */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Flow Diagram takes full space (ReactFlow manages its own zoom/pan) */}
        {isFlowDiagram && flowDiagramData ? (
          <div className="relative z-10 h-full w-full">
            <ReactFlowCanvas
              nodes={flowDiagramData.nodes}
              edges={flowDiagramData.edges}
              editable={editableFlow}
              diagramId={diagramId}
              title={title}
            />
          </div>
        ) : (
          /* All other types use our zoom/pan transform */
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
            }}
            className="relative z-10 inline-block transition-transform duration-100 ease-out"
          >
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-sm bg-white shadow-2xl shadow-black/60 ring-1 ring-rule"
            >
              <div className="min-h-[300px] min-w-[300px] p-8 md:p-12">
                {svgCode && (
                  <div
                    dangerouslySetInnerHTML={{ __html: svgCode }}
                    className="svg-container h-full w-full"
                  />
                )}

                {mermaidCode && (
                  <>
                    <div
                      ref={mermaidContainerRef}
                      className={`flex w-full justify-center ${mermaidError ? 'hidden' : ''}`}
                    />
                    {mermaidError && (
                      <div className="flex min-h-[260px] w-full flex-col items-center justify-center gap-4 rounded-sm border border-gray-200 bg-gray-50 p-8 text-center">
                        <div className="text-sm font-medium text-gray-500">
                          Render failed
                        </div>
                        <p className="max-w-sm text-sm text-gray-700">
                          Unable to render diagram — the generated mermaid
                          syntax was invalid.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          {onRetry && (
                            <button
                              onClick={() => onRetry()}
                              disabled={retrying}
                              className="rounded-sm bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {retrying ? 'Retrying…' : 'Retry with original prompt'}
                            </button>
                          )}
                          {diagramId && (
                            <a
                              href={`/dashboard/diagrams/new?id=${diagramId}`}
                              className="rounded-sm border border-gray-300 px-4 py-2 text-sm text-gray-800 transition-colors hover:border-ink hover:text-ink"
                            >
                              Re-open in workbench
                            </a>
                          )}
                        </div>
                        {mermaidCode && (
                          <details className="w-full max-w-lg text-left">
                            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-800">
                              Show raw source
                            </summary>
                            <pre className="mt-2 max-h-64 overflow-auto rounded-sm bg-gray-100 p-3 text-left text-xs text-gray-800">
                              {mermaidCode}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}
                  </>
                )}

                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={title || 'Diagram'}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="max-h-[80vh] w-auto rounded-lg object-contain"
                    style={{ height: 'auto' }}
                    unoptimized
                  />
                )}

                {chartJsData && <ChartJsComponent data={chartJsData} />}

                {!svgCode &&
                  !mermaidCode &&
                  !imageUrl &&
                  !chartJsData &&
                  !isFlowDiagram && (
                    <div className="flex h-[300px] items-center justify-center text-sm text-gray-400">
                      No preview available
                    </div>
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    )
  },
)

export default DiagramCanvas
