'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { parseMermaid, renderMermaid } from '@/lib/mermaidClient'

const PREVIEW_MERMAID_CONFIG = {
  theme: 'dark' as const,
  themeVariables: {
    darkMode: true,
    background: '#141417',
    primaryColor: '#141417',
    primaryTextColor: '#F3EFE4',
    primaryBorderColor: '#C4FF3D',
    lineColor: '#76766F',
    secondaryColor: '#0B0B0C',
    tertiaryColor: '#141417',
  },
}

const MIN_ZOOM = 0.3
const MAX_ZOOM = 8
const FIT_MARGIN = 0.92 // leave a little breathing room

export default function PreviewPane({
  code,
  streaming = false,
  className,
}: {
  code: string
  streaming?: boolean
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null) // the transformed SVG host
  const canvasRef = useRef<HTMLDivElement>(null) // the outer pan/zoom viewport
  const [zoom, setZoom] = useState(1)
  const [renderError, setRenderError] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragState = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const idRef = useRef(`mmd-${Math.random().toString(36).slice(2, 9)}`)
  const userHasZoomedRef = useRef(false)

  const computeFit = useCallback(() => {
    const host = containerRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return null
    const svg = host.querySelector('svg') as SVGSVGElement | null
    if (!svg) return null

    // Use the intrinsic unscaled size of the svg. getBoundingClientRect would
    // already include our current transform, which would feed back into zoom.
    let svgW = svg.viewBox?.baseVal?.width || 0
    let svgH = svg.viewBox?.baseVal?.height || 0
    if (!svgW || !svgH) {
      const bbox = svg.getBBox?.()
      svgW = bbox?.width || 0
      svgH = bbox?.height || 0
    }
    if (!svgW || !svgH) return null

    const { width: canvasW, height: canvasH } = canvas.getBoundingClientRect()
    if (!canvasW || !canvasH) return null

    const ratio = Math.min(canvasW / svgW, canvasH / svgH) * FIT_MARGIN
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, ratio))
  }, [])

  const fitToPane = useCallback(() => {
    const next = computeFit()
    if (next == null) return
    setZoom(next)
    setOffset({ x: 0, y: 0 })
    userHasZoomedRef.current = false
  }, [computeFit])

  useEffect(() => {
    if (!code || !containerRef.current) return
    let cancelled = false
    const host = containerRef.current
    // Unique per run: React StrictMode (dev) runs this effect twice, and two
    // overlapping renders sharing one id delete each other's temp node.
    const renderId = `${idRef.current}-${Math.random().toString(36).slice(2, 7)}`

    ;(async () => {
      try {
        const ok = await parseMermaid(code)
        if (!ok) {
          if (!cancelled) setRenderError(true)
          return
        }
        const { svg } = await renderMermaid(
          renderId,
          code,
          PREVIEW_MERMAID_CONFIG,
        )
        if (cancelled) return
        host.innerHTML = svg
        setRenderError(false)
        // Reset manual-zoom flag on fresh render and auto-fit.
        userHasZoomedRef.current = false
        // Wait a frame so the SVG is laid out before measuring.
        requestAnimationFrame(() => {
          if (cancelled) return
          const next = computeFit()
          if (next != null) {
            setZoom(next)
            setOffset({ x: 0, y: 0 })
          }
        })
      } catch {
        if (!cancelled) setRenderError(true)
      } finally {
        document.getElementById(`d${renderId}`)?.remove()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [code, computeFit])

  // Re-fit when the canvas itself resizes — but only if the user hasn't
  // manually zoomed since the last render.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      if (userHasZoomedRef.current) return
      const next = computeFit()
      if (next != null) setZoom(next)
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [computeFit])

  const zoomIn = () => {
    userHasZoomedRef.current = true
    setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.15).toFixed(2)))
  }
  const zoomOut = () => {
    userHasZoomedRef.current = true
    setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.15).toFixed(2)))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    dragState.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current) return
    setOffset({
      x: dragState.current.ox + (e.clientX - dragState.current.x),
      y: dragState.current.oy + (e.clientY - dragState.current.y),
    })
  }
  const onMouseUp = () => {
    dragState.current = null
  }

  return (
    <div
      className={clsx(
        'relative flex h-full flex-col overflow-hidden bg-ink',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-60"
        aria-hidden
      />

      <div className="relative z-10 flex items-center justify-between border-b border-rule/60 bg-ink/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
          <span className="inline-flex h-1.5 w-1.5 items-center">
            <span
              className={clsx(
                'h-1.5 w-1.5 rounded-full',
                streaming ? 'bg-signal animate-tick' : 'bg-signal/40',
              )}
            />
          </span>
          <span className="text-paper/80">Preview</span>
          {renderError && (
            <span className="text-red-300/90">· invalid syntax</span>
          )}
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-fog">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-sm px-2 py-1 hover:bg-graphite"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="w-12 text-center tabular-nums text-paper/80">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-sm px-2 py-1 hover:bg-graphite"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={fitToPane}
            className="ml-1 rounded-sm border border-rule/60 px-2 py-1 uppercase tracking-[0.18em] hover:bg-graphite"
          >
            Fit
          </button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="relative z-0 flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {!code && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-xs text-center">
              <p className="font-serif text-2xl italic text-paper/70">
                Awaiting the first draft.
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                Your diagram will appear here
              </p>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className="absolute left-1/2 top-1/2 origin-center"
          style={{
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
            transition: dragState.current ? 'none' : 'transform 160ms ease-out',
          }}
        />
      </div>

      {streaming && (
        <div className="pointer-events-none absolute inset-x-0 top-12 z-10 h-px overflow-hidden">
          <div className="h-full w-1/3 animate-scan bg-gradient-to-r from-transparent via-signal/70 to-transparent" />
        </div>
      )}
    </div>
  )
}
