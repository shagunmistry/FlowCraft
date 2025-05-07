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
    <div className="flex items-center justify-between border-b bg-gray-50 p-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={onZoomOut}
          className="rounded-full p-1 transition-colors hover:bg-gray-200"
          title="Zoom out"
        >
          <ZoomOutIcon className="h-5 w-5 text-gray-700" />
        </button>
        <span className="text-sm text-gray-600">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="rounded-full p-1 transition-colors hover:bg-gray-200"
          title="Zoom in"
        >
          <ZoomInIcon className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={onCopyLink}
          className="ml-2 rounded-full p-1 transition-colors hover:bg-gray-200"
          title="Copy link"
        >
          <LinkIcon className="h-5 w-5 text-gray-700" />
        </button>
        <span className="ml-4 text-sm italic text-gray-500">
          {['Flow Diagram', 'Chart', 'Whiteboard'].includes(diagramType || '')
            ? ''
            : 'Click and drag to move the diagram'}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        {title && <span className="mr-4 font-semibold">{title}</span>}
        {diagramType && <span>Type: {diagramType}</span>}
      </div>
    </div>
  )
}