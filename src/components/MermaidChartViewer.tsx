import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  CheckCircleIcon,
  ShareIcon,
  PencilIcon,
  CopyIcon,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Move,
} from 'lucide-react'

interface DownloadSVG {
  (svgContent: string, filename?: string): void
}

const downloadSVG: DownloadSVG = (svgContent, filename = 'diagram') => {
  // Create a clean SVG string
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')
  const svgElement = svgDoc.querySelector('svg')

  // Ensure SVG has width and height
  if (svgElement) {
    if (!svgElement.hasAttribute('width')) {
      svgElement.setAttribute('width', '800')
    }
    if (!svgElement.hasAttribute('height')) {
      svgElement.setAttribute('height', '600')
    }
  }

  // Create clean SVG string
  const serializer = new XMLSerializer()
  if (!svgElement) {
    throw new Error('SVG element not found')
  }
  const svgString = svgElement ? serializer.serializeToString(svgElement) : ''

  // Create downloadable blob
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  // Create download link
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.svg`
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

interface CopySVGToClipboard {
  (svgContent: string): Promise<boolean>
}

const copySVGToClipboard: CopySVGToClipboard = async (svgContent) => {
  try {
    // Create a clean SVG string
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')
    const svgElement = svgDoc.querySelector('svg')

    // Create clean SVG string
    const serializer = new XMLSerializer()
    const svgString = svgElement ? serializer.serializeToString(svgElement) : ''

    // Copy to clipboard
    await navigator.clipboard.writeText(svgString)
    return true
  } catch (error) {
    console.error('Error copying SVG:', error)
    return false
  }
}

const MermaidViewer = ({
  title,
  mermaidSVG,
  isMermaidError,
  isLoading,
  onDownload,
  onCopy,
  onShare,
  onEdit,
}: {
  title: string
  mermaidSVG: string | null
  isMermaidError: boolean
  isLoading: boolean
  onDownload: (svg: string, fileName: string) => void
  onCopy: () => void
  onShare: () => void
  onEdit: () => void
}) => {
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    if (!mermaidSVG) return

    const success = await copySVGToClipboard(mermaidSVG)

    if (success) {
      setCopied(true)

      setTimeout(() => setCopied(false), 2000)
    } else {
    }
  }

  const handleDownload = () => {
    if (!mermaidSVG) return

    try {
      downloadSVG(mermaidSVG, 'mermaid-diagram')
    } catch (error) {
      console.error('Error downloading SVG:', error)
    }
  }

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen()
        }
        setIsFullscreen(true)
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err)
      }
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.2, 3))
  }

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale / 1.2, 0.5))
  }

  interface Position {
    x: number
    y: number
  }

  interface MouseEventWithPosition extends React.MouseEvent {
    clientX: number
    clientY: number
    button: number
  }

  const handleMouseDown = (e: MouseEventWithPosition) => {
    if (e.button === 0) {
      // Left click only
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  interface MouseMoveEvent extends React.MouseEvent {
    clientX: number
    clientY: number
  }

  const handleMouseMove = (e: MouseMoveEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  interface WheelEventWithCtrl extends React.WheelEvent {
    ctrlKey: boolean
    deltaY: number
  }

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setScale((prevScale) => Math.min(Math.max(prevScale * delta, 0.5), 3))
    }
  }

  useEffect(() => {
    const content = contentRef.current
    if (content) {
      content.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        content.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  const buttonVariants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5 },
  }

  const ActionButton = ({
    onClick,
    disabled,
    icon: Icon,
    label,
  }: {
    onClick: () => void
    disabled: boolean
    icon: any
    label: string
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      animate={disabled ? 'disabled' : 'initial'}
      className="relative m-1 rounded-full bg-gray-50 p-3 text-gray-900 shadow-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
      title={label}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  )

  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-4 p-8"
    >
      <div className="h-12 w-12 text-red-500">⚠️</div>
      <p className="text-lg font-medium text-gray-900">
        {isMermaidError
          ? 'There was an error generating the diagram'
          : 'No diagram to display'}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-full bg-blue-500 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Create New Diagram
      </motion.button>
    </motion.div>
  )

  const isDisabled = isMermaidError || isLoading || !mermaidSVG

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`mx-auto rounded-2xl bg-white p-6 shadow-lg ${
        isFullscreen ? 'h-screen w-screen' : 'h-screen max-w-6xl'
      }`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {title || 'Diagram'}
        </h2>
        <div className="flex space-x-2">
          <ActionButton
            onClick={handleZoomIn}
            disabled={isDisabled || scale >= 3}
            icon={ZoomIn}
            label="Zoom In"
          />
          <ActionButton
            onClick={handleZoomOut}
            disabled={isDisabled || scale <= 0.5}
            icon={ZoomOut}
            label="Zoom Out"
          />
          <ActionButton
            onClick={handleDownload}
            disabled={isDisabled}
            icon={ArrowDown}
            label="Download Diagram"
          />
          <ActionButton
            onClick={handleCopy}
            disabled={isDisabled}
            icon={copied ? CheckCircleIcon : CopyIcon}
            label="Copy Diagram"
          />
          <ActionButton
            onClick={onShare}
            disabled={isDisabled}
            icon={ShareIcon}
            label="Share Diagram"
          />
          <ActionButton
            onClick={onEdit}
            disabled={isDisabled}
            icon={PencilIcon}
            label="Edit Diagram"
          />
          <ActionButton
            onClick={toggleFullscreen}
            disabled={isDisabled}
            icon={isFullscreen ? Minimize2 : Maximize2}
            label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          />
        </div>
      </div>

      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-full w-full overflow-hidden rounded-xl bg-gray-50 p-6"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isDisabled ? (
          <ErrorState />
        ) : (
          <div
            className="mermaid mx-auto h-full w-full text-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            dangerouslySetInnerHTML={{ __html: mermaidSVG }}
          />
        )}

        {!isDisabled && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/80 p-2 text-sm backdrop-blur-sm">
            <Move className="h-4 w-4" />
            <span>Drag to pan • Ctrl + Wheel to zoom</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default MermaidViewer
