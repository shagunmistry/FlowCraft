'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Share2,
  Heart,
  Eye,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
} from 'lucide-react'

// Assuming these exist in your project structure
import PageLoader from '@/components/PageLoader'
import { PublicVisual } from '@/components/Gallery/PublicVisualType'
import DiagramRenderer from '@/components/Gallery/DiagramRenderer'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'

// --- Types & Interfaces ---
interface ShowcaseItemPageProps {
  params: { id: string }
}

// --- Utility Components ---

// 1. Apple-style Tooltip
const Tooltip = ({
  children,
  text,
}: {
  children: React.ReactNode
  text: string
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 whitespace-nowrap rounded-lg bg-gray-900/90 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm"
          >
            {text}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 2. Action Button Component
const ActionButton = ({
  onClick,
  icon: Icon,
  isActive = false,
  activeColor = 'text-rose-500 fill-rose-500',
  label,
}: any) => (
  <Tooltip text={label}>
    <button
      onClick={onClick}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-out hover:bg-black/5 active:scale-95 ${isActive ? 'bg-rose-50' : ''}`}
      aria-label={label}
    >
      <Icon
        className={`h-5 w-5 transition-colors duration-300 ${isActive ? activeColor : 'text-slate-500 group-hover:text-slate-900'}`}
        strokeWidth={2}
      />
    </button>
  </Tooltip>
)

export default function ShowcaseItemPage({ params }: ShowcaseItemPageProps) {
  const router = useRouter()

  // State
  const [visual, setVisual] = useState<PublicVisual | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isCopied, setIsCopied] = useState(false)

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetching for speed
        const [userRes, visualRes] = await Promise.all([
          fetch('/api/auth/user'),
          fetch(`/api/get-public-diagrams/${params.id}`),
        ])

        let currentUserId = null
        if (userRes.ok) {
          const userData = await userRes.json()
          currentUserId = userData.user?.id || null
          setUserId(currentUserId)
        }

        if (!visualRes.ok) throw new Error('Visual not found')

        const { diagram } = await visualRes.json()
        if (!diagram) throw new Error('Diagram data missing')

        // Transform Data
        const transformedDiagram = {
          ...diagram,
          previewUrl:
            diagram.type === 'illustration'
              ? diagram.image_url
              : diagram.type === 'infographic'
                ? `data:image/svg+xml;utf8,${encodeURIComponent(diagram.data)}`
                : diagram.type === 'generated_image'
                  ? diagram.data
                  : FlowCraftLogo.src,
          views: diagram.views || 0,
          likes: diagram.likes || 0,
          isLiked: diagram.is_like || false,
          isSaved: diagram.is_save || false,
        }

        setVisual(transformedDiagram)

        // Update Page Title for Client-Side SEO
        document.title = `${transformedDiagram.title} | FlowCraft Showcase`

        // Increment Views (Fire and forget)
        fetch(`/api/get-public-diagrams/views_increment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: params.id }),
        }).catch(console.error)
      } catch (error) {
        console.error('Error:', error)
        router.push('/dashboard/showcase')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  // Keyboard Shortcuts for Zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault()
        handleZoomOut()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handlers
  const handleLike = async () => {
    if (!userId || !visual) return
    const prev = { ...visual }

    // Optimistic Update
    setVisual((curr) =>
      curr
        ? {
            ...curr,
            isLiked: !curr.isLiked,
            likes: curr.isLiked ? (curr.likes ?? 0) - 1 : (curr.likes ?? 0) + 1,
          }
        : null,
    )

    try {
      const res = await fetch('/api/like-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagramId: visual.id, userID: userId }),
      })
      if (!res.ok) throw new Error('Failed to like')
    } catch {
      setVisual(prev) // Revert
    }
  }

  const handleSave = async () => {
    if (!userId || !visual) return
    const prev = { ...visual }

    setVisual((curr) => (curr ? { ...curr, isSaved: !curr.isSaved } : null))

    try {
      const res = await fetch('/api/save-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagramId: visual.id, userID: userId }),
      })
      if (!res.ok) throw new Error('Failed to save')
    } catch {
      setVisual(prev)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2.5))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  const handleFit = () => setZoomLevel(1)

  // Loading State - Minimal Skeleton
  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F5F5F7]">
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200" />
        <div className="mt-4 h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!visual) return null

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-[#F5F5F7] text-slate-900 selection:bg-violet-500/20">
      {/* --- SEO Metadata (Client Side Fallback) --- */}
      <head>
        <meta
          name="description"
          content={`View ${visual.title} - A ${visual.type} created on FlowCraft.`}
        />
        <meta property="og:title" content={visual.title} />
        <meta property="og:image" content={visual.previewUrl} />
      </head>

      {/* --- Top Navigation Bar --- */}
      <header className="fixed left-0 right-0 top-20 z-40 flex items-center justify-between px-6 py-4 transition-all">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => router.push('/dashboard/showcase')}
          className="group flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-md hover:ring-1 hover:ring-black/5"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-end"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-1.5 ring-1 ring-black/5 backdrop-blur-md">
            <h1 className="text-sm font-semibold text-slate-800">
              {visual.title}
            </h1>
            <span className="mx-1 h-3 w-px bg-slate-300"></span>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {visual.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {visual.likes}
              </span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* --- Main Canvas Area --- */}
      <article className="relative flex h-full flex-1 items-center justify-center overflow-hidden">
        {/* Dot Matrix Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Content Container */}
        <motion.figure
          layout
          className="relative max-h-[85vh] max-w-[90vw] overflow-auto rounded-xl ring-1 ring-black/5"
          style={{ transform: `scale(${zoomLevel})` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: zoomLevel }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="bg-white p-1">
            <DiagramRenderer
              type={visual.type}
              data={visual.data}
              imageUrl={visual.previewUrl}
            />
          </div>
        </motion.figure>

        {/* Watermark */}
        <div className="absolute bottom-6 right-6 hidden items-center gap-2 opacity-30 mix-blend-multiply md:flex">
          <Image
            src={FlowCraftLogo}
            alt="FlowCraft"
            width={20}
            height={20}
            className="grayscale"
          />
          <span className="text-xs font-semibold tracking-wider text-slate-900">
            FLOWCRAFT
          </span>
        </div>
      </article>

      {/* --- Floating Dock (Controls) --- */}
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-1 rounded-full bg-white/80 p-1.5 ring-1 ring-black/[0.04] backdrop-blur-2xl"
        >
          {/* Zoom Controls Group */}
          <div className="mr-1 flex items-center gap-1 border-r border-slate-200/60 pr-2">
            <ActionButton
              onClick={handleZoomOut}
              icon={ZoomOut}
              label="Zoom Out (Cmd -)"
            />
            <span className="w-12 text-center font-mono text-xs font-medium text-slate-500">
              {Math.round(zoomLevel * 100)}%
            </span>
            <ActionButton
              onClick={handleZoomIn}
              icon={ZoomIn}
              label="Zoom In (Cmd +)"
            />
          </div>

          {/* Actions Group */}
          <div className="flex items-center gap-1">
            <ActionButton
              onClick={handleLike}
              icon={Heart}
              isActive={visual.isLiked}
              label="Like"
            />

            <ActionButton
              onClick={handleShare}
              icon={isCopied ? Check : Share2}
              isActive={isCopied}
              activeColor="text-green-600"
              label={isCopied ? 'Copied Link' : 'Share'}
            />

            <Tooltip text="Save to Collection">
              <button
                onClick={handleSave}
                className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
                  visual.isSaved
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {visual.isSaved ? 'Saved' : 'Save'}
              </button>
            </Tooltip>

            <ActionButton
              onClick={() => {}} // Hook up actual download logic
              icon={Download}
              label="Download"
            />
          </div>
        </motion.div>
      </div>
    </main>
  )
}
