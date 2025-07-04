'use client'
import { useContext, useEffect, useState, useRef } from 'react'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useRouter } from 'next/navigation'
import PageLoader from '@/components/PageLoader'
import dynamic from 'next/dynamic'
import { sanitizeMermaid, sanitizeSVG } from '@/lib/utils'
import mermaid from 'mermaid'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import { DownloadIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react'

const DiagramOrChartView = dynamic(
  () => import('@/components/DiagramOrChartView'),
  {
    ssr: false,
  },
)

export default function DiagramPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const diagramContext = useContext(DiagramContext)
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const mermaidContainerRef = useRef<HTMLDivElement>(null)
  const [mermaidInitialized, setMermaidInitialized] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [diagramData, setDiagramData] = useState<any>(null)

  // Initialize Mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    })
    setMermaidInitialized(true)
  }, [])

  // Render Mermaid diagram when code changes
  useEffect(() => {
    if (mermaidInitialized && mermaidCode && mermaidContainerRef.current) {
      const container = mermaidContainerRef.current
      container.innerHTML = '' // Clear previous content

      try {
        mermaid
          .render('mermaid-diagram', mermaidCode)
          .then(({ svg }) => {
            container.innerHTML = svg
          })
          .catch((error) => {
            console.error('Mermaid rendering error:', error)
            container.innerHTML = `<div class="text-red-500 p-4 text-center">Error rendering diagram</div>`
          })
      } catch (error) {
        console.error('Mermaid error:', error)
        container.innerHTML = `<div class="text-red-500 p-4 text-center">Error processing diagram</div>`
      }
    }
  }, [mermaidCode, mermaidInitialized])

  const fetchDiagram = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/get-diagrams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: params.id }),
      })

      const { diagram } = await response.json()

      if (!diagram || diagram.length === 0) {
        setLoading(false)
        router.push('/dashboard')
        return
      }

      const diagramInfoFromApi = diagram[0]
      setDiagramData(diagramInfoFromApi)

      diagramContext.setTitle(diagramInfoFromApi.title)
      diagramContext.setDescription(diagramInfoFromApi.description)
      diagramContext.setType(diagramInfoFromApi.type)
      diagramContext.setDiagramId(params.id)

      if (diagramInfoFromApi.type === 'illustration') {
        setImageUrl(diagramInfoFromApi.image_url)
        setSvgCode('')
        setMermaidCode('')
      } else if (diagramInfoFromApi.type === 'generated_image') {
        setImageUrl(diagramInfoFromApi.data)
        setSvgCode('')
        setMermaidCode('')
      } else if (diagramInfoFromApi.type === 'infographic') {
        const sanitizedSvgCode = sanitizeSVG(diagramInfoFromApi.data)
        setSvgCode(sanitizedSvgCode.svgContent)
        setMermaidCode('')
        setImageUrl('')
      } else {
        const sanitizedMermaidCode = sanitizeMermaid(diagramInfoFromApi.data)
        setMermaidCode(sanitizedMermaidCode)
        setSvgCode('')
        setImageUrl('')
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching diagram:', error)
      setLoading(false)
      router.push('/dashboard')
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 0.5))
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // You might want to show a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // Here you would typically make an API call to like/unlike the diagram
  }

  useEffect(() => {
    fetchDiagram()
  }, [params.id])

  if (loading) {
    return <PageLoader />
  }

  const DiagramHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-slate-200/50 bg-white shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left section - Back button and title */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-slate-600 transition-colors hover:text-violet-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </motion.button>

            <div className="hidden h-6 w-px bg-slate-300 sm:block"></div>

            <div className="flex items-center space-x-3">
              <Image
                src={FlowCraftLogo}
                alt="FlowCraft"
                className="h-8 w-8 rounded-lg"
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {diagramContext.title || 'Untitled Diagram'}
                </h1>
                <p className="text-sm text-slate-500">
                  {diagramContext.type} • Created with FlowCraft
                </p>
              </div>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomOut}
              className="rounded-lg border border-slate-200 p-2 transition-colors hover:border-slate-300 hover:bg-slate-50"
              title="Zoom out"
            >
              <ZoomOutIcon className="h-4 w-4 text-slate-600" />
            </motion.button>

            <span className="min-w-[60px] text-center text-sm text-slate-600">
              {Math.round(zoomLevel * 100)}%
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomIn}
              className="rounded-lg border border-slate-200 p-2 transition-colors hover:border-slate-300 hover:bg-slate-50"
              title="Zoom in"
            >
              <ZoomInIcon className="h-4 w-4 text-slate-600" />
            </motion.button>

            <div className="mx-2 h-6 w-px bg-slate-300"></div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className="rounded-lg p-2 transition-colors hover:bg-rose-50"
              title="Like diagram"
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-rose-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-slate-400 hover:text-rose-500" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="rounded-lg p-2 transition-colors hover:bg-blue-50"
              title="Share diagram"
            >
              <ShareIcon className="h-5 w-5 text-slate-400 hover:text-blue-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-violet-200/40"
              title="Download diagram"
            >
              <DownloadIcon className="mr-2 inline h-4 w-4" />
              Download
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const DiagramContainer = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='m0 40 0-40 40 0c0 0 0 40 0 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Diagram content */}
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-8">
        <div
          className="w-full max-w-none overflow-auto rounded-2xl border border-slate-200/50 bg-white shadow-xl"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {children}
        </div>
      </div>

      {/* FlowCraft watermark */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 rounded-full bg-white/80 px-3 py-2 shadow-lg backdrop-blur-sm">
        <Image
          src={FlowCraftLogo}
          alt="FlowCraft"
          className="h-5 w-5 rounded"
        />
        <span className="text-xs font-medium text-slate-600">
          Powered by FlowCraft
        </span>
      </div>
    </motion.div>
  )

  if (svgCode) {
    return (
      <div className="flex h-screen flex-col">
        <DiagramHeader />
        <DiagramContainer>
          <div
            dangerouslySetInnerHTML={{ __html: svgCode }}
            className="w-full p-4 sm:p-8"
          />
        </DiagramContainer>
      </div>
    )
  } else if (mermaidCode) {
    return (
      <div className="flex h-screen flex-col">
        <DiagramHeader />
        <DiagramContainer>
          <div className="w-full p-4 sm:p-8">
            <div
              ref={mermaidContainerRef}
              className="mermaid w-full"
            />
          </div>
        </DiagramContainer>
      </div>
    )
  } else if (imageUrl) {
    return (
      <div className="flex h-screen flex-col">
        <DiagramHeader />
        <DiagramContainer>
          <div className="w-full p-4 sm:p-8">
            <img
              src={imageUrl}
              alt="Diagram"
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
        </DiagramContainer>
      </div>
    )
  }

  if (diagramContext.title && diagramContext.type) {
    return (
      <div className="flex h-screen flex-col">
        <DiagramHeader />
        <DiagramContainer>
          <div className="w-full p-4 sm:p-8">
            <DiagramOrChartView type={diagramContext.type} />
          </div>
        </DiagramContainer>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <Image
          src={FlowCraftLogo}
          alt="FlowCraft"
          className="mx-auto mb-4 h-16 w-16 rounded-xl"
        />
        <h2 className="mb-2 text-xl font-semibold text-slate-700">
          Diagram not found
        </h2>
        <p className="mb-4 text-slate-500">
          The diagram you're looking for doesn't exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white transition-all hover:shadow-lg"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
