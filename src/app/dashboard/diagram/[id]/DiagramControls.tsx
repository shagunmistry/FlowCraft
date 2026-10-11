'use client'

import { ZoomInIcon, ZoomOutIcon, LinkIcon } from 'lucide-react'
import Button from '@/components/ui/Button'

interface DiagramControlsProps {
    zoomLevel: number
    onZoomIn: () => void
    onZoomOut: () => void
    onCopyLink: () => void
    diagramType?: string | null
    title?: string
    onBack?: () => void
  }

export function DiagramControls({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onCopyLink,
  diagramType,
  title,
  onBack,
}: DiagramControlsProps) {
  return (
    <div className="flex items-center justify-between border-b bg-ink p-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={onZoomOut}
          className="rounded-full p-1 transition-colors hover:bg-ink"
          title="Zoom out"
        >
          <ZoomOutIcon className="h-5 w-5 text-paper" />
        </button>
        <span className="text-sm text-fog">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="rounded-full p-1 transition-colors hover:bg-ink"
          title="Zoom in"
        >
          <ZoomInIcon className="h-5 w-5 text-paper" />
        </button>
        <button
          onClick={onCopyLink}
          className="ml-2 rounded-full p-1 transition-colors hover:bg-ink"
          title="Copy link"
        >
          <LinkIcon className="h-5 w-5 text-paper" />
        </button>
        <span className="ml-4 text-sm italic text-fog">
          {['Flow Diagram', 'Chart', 'Whiteboard'].includes(diagramType || '')
            ? ''
            : 'Click and drag to move the diagram'}
        </span>
      </div>
      <div className="text-sm text-fog">
        {title && <span className="mr-4 font-semibold">{title}</span>}
        {diagramType && <span>Type: {diagramType}</span>}
      </div>
    </div>
  )
}