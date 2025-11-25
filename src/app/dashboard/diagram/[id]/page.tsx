'use client'

import { useContext, useEffect, useState, useRef } from 'react'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { DiagramOrChartType, sanitizeMermaid, sanitizeSVG } from '@/lib/utils'
import mermaid from 'mermaid'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeftIcon,
  ShareIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'

// Dynamic imports to save initial bundle size
const DiagramOrChartView = dynamic(
  () => import('@/components/DiagramOrChartView'),
  { ssr: false },
)

// A clean, minimal loader component specific to this view
const CanvasLoader = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F5F5F7]">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
    <p className="mt-4 animate-pulse text-sm font-medium text-gray-500">
      Loading Canvas...
    </p>
  </div>
)

export default function DiagramPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const diagramContext = useContext(DiagramContext)

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isLiked, setIsLiked] = useState(false)

  // Data State
  const [imageUrl, setImageUrl] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState<string | null>(null)
  const [diagramMeta, setDiagramMeta] = useState<{
    title: string
    type: string
  } | null>(null)

  // Refs
  const mermaidContainerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // 1. Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#ffffff',
        primaryTextColor: '#000000',
        primaryBorderColor: '#000000',
        lineColor: '#333333',
        secondaryColor: '#f4f4f5',
        tertiaryColor: '#fff',
      },
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    })
  }, [])

  // 2. Fetch Data
  useEffect(() => {
    const fetchDiagram = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/get-diagrams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: params.id }),
        })

        const { diagram } = await response.json()

        if (!diagram || diagram.length === 0) {
          setError(true)
          return
        }

        const data = diagram[0]
        setDiagramMeta({ title: data.title, type: data.type })

        // Context updates (optional if you want to keep context in sync)
        diagramContext.setTitle(data.title)
        diagramContext.setDiagramId(params.id)
        diagramContext.setType(data.type)

        // Type handling
        if (['illustration', 'generated_image'].includes(data.type)) {
          setImageUrl(data.type === 'illustration' ? data.image_url : data.data)
        } else if (data.type === 'infographic') {
          setSvgCode(sanitizeSVG(data.data).svgContent)
        } else if (data.type.toLowerCase() === 'flow diagram') {
          const parsedData = JSON.parse(JSON.parse(data.data))
          const nodes = parsedData.nodes
          const edges = parsedData.edges

          diagramContext.setEdges(edges)
          diagramContext.setNodes(nodes)
        } else {
          setMermaidCode(sanitizeMermaid(data.data))
        }
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchDiagram()
  }, [params.id])

  // 3. Render Mermaid when code is present
  useEffect(() => {
    if (!loading && mermaidCode && mermaidContainerRef.current) {
      const container = mermaidContainerRef.current
      container.innerHTML = ''
      const id = `mermaid-${Date.now()}`

      try {
        mermaid.render(id, mermaidCode).then(({ svg }) => {
          container.innerHTML = svg
        })
      } catch (e) {
        console.error('Mermaid render error', e)
        container.innerHTML = `<div class="p-4 text-sm text-gray-500 bg-gray-50 rounded border">Unable to render diagram syntax.</div>`
      }
    }
  }, [mermaidCode, loading])

  // Actions
  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((prev) => {
      const step = 25
      const next = direction === 'in' ? prev + step : prev - step
      const newZoom = Math.min(Math.max(next, 25), 300) // Clamp between 25% and 300%
      console.log('Zoom changed:', prev, '->', newZoom)
      return newZoom
    })
  }

  const handleFitToScreen = () => {
    if (!contentRef.current || !mainRef.current) return

    const container = mainRef.current
    const content = contentRef.current

    // Get dimensions
    const containerRect = container.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()

    // Get the original (unscaled) content dimensions
    const currentScale = zoomLevel / 100
    const originalWidth = contentRect.width / currentScale
    const originalHeight = contentRect.height / currentScale

    // Calculate padding (accounting for the p-20 on the container)
    const padding = 160 // 80px on each side (20 * 4 = 80px in Tailwind)

    // Available space
    const availableWidth = containerRect.width - padding
    const availableHeight = containerRect.height - padding

    // Calculate scale needed to fit content
    const scaleX = availableWidth / originalWidth
    const scaleY = availableHeight / originalHeight

    // Use the smaller scale to ensure content fits in both dimensions
    const optimalScale = Math.min(scaleX, scaleY, 1) // Don't zoom in beyond 100%

    // Convert to percentage and clamp between 25% and 300%
    const newZoom = Math.round(Math.min(Math.max(optimalScale * 100, 25), 300))

    setZoomLevel(newZoom)
  }

  const handleDownload = async () => {
    // Basic implementation - expansion depends on requirement (html2canvas or svg export)
    alert('Download started...')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard')
  }

  // --- Render ---

  if (loading) return <CanvasLoader />

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F5F5F7] text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Diagram Not Found
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          The project you are looking for has been moved or deleted.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Go to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F5F5F7]">
      {/* 1. Header (Floating Glass Effect) */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200/50 bg-white/60 px-6 backdrop-blur-xl transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="group flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            aria-label="Back"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div className="h-6 w-px bg-gray-200"></div>

          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-gray-900">
              {diagramMeta?.title || 'Untitled'}
            </h1>
            <span className="text-xs capitalize text-gray-500">
              {diagramMeta?.type?.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            icon={isLiked ? HeartSolidIcon : HeartIcon}
            active={isLiked}
            onClick={() => setIsLiked(!isLiked)}
            label="Like"
          />
          <ActionButton icon={ShareIcon} onClick={handleShare} label="Share" />
          <ActionButton
            icon={ArrowDownTrayIcon}
            onClick={handleDownload}
            label="Download"
          />

          <div className="ml-2 border-l border-gray-200 pl-2">
            <Image
              src={FlowCraftLogo}
              alt="Logo"
              className="h-8 w-8 opacity-80"
            />
          </div>
        </div>
      </header>

      {/* 2. Main Canvas */}
      <main
        ref={mainRef}
        className="relative flex flex-1 items-center justify-center overflow-auto pt-80"
      >
        {/* Dot Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(#cfcfcf 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div
          ref={contentRef}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center',
          }}
          className="relative z-10 inline-block transition-transform duration-200 ease-out"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Apple-style spring
            className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div className="min-h-[400px] min-w-[400px] p-8 md:p-12">
            {svgCode && (
              <div
                dangerouslySetInnerHTML={{ __html: svgCode }}
                className="svg-container h-full w-full"
              />
            )}

            {mermaidCode ? (
              <div
                ref={mermaidContainerRef}
                className="mermaid flex w-full justify-center pt-20"
              />
            ) : null}

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Diagram"
                className="max-h-[80vh] w-auto rounded object-contain"
              />
            )}

            {!svgCode && !mermaidCode && !imageUrl && diagramMeta?.type && (
              <DiagramOrChartView type={diagramMeta.type as DiagramOrChartType} />
            )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* 3. Floating Toolbar (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white/90 p-1.5 shadow-xl shadow-gray-200/50 backdrop-blur-md">
        <ToolButton
          onClick={() => handleZoom('out')}
          icon={MagnifyingGlassMinusIcon}
          label="Zoom Out"
        />
        <span className="w-16 select-none text-center font-mono text-xs font-medium text-gray-600">
          {zoomLevel}%
        </span>
        <ToolButton
          onClick={() => handleZoom('in')}
          icon={MagnifyingGlassPlusIcon}
          label="Zoom In"
        />
        <div className="mx-1 h-4 w-px bg-gray-200"></div>
        <ToolButton
          onClick={handleFitToScreen}
          icon={ArrowsPointingOutIcon}
          label="Fit to Screen"
        />
      </div>
    </div>
  )
}

// --- Subcomponents for Consistency ---

const ActionButton = ({ icon: Icon, onClick, active, label }: any) => (
  <button
    onClick={onClick}
    className={`rounded-full p-2 transition-all duration-200 ${
      active
        ? 'bg-red-50 text-red-500'
        : 'text-gray-500 hover:bg-gray-100 hover:text-black'
    }`}
    title={label}
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </button>
)

const ToolButton = ({ icon: Icon, onClick, label }: any) => (
  <button
    onClick={onClick}
    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black hover:text-white active:scale-95"
    title={label}
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
  </button>
)
