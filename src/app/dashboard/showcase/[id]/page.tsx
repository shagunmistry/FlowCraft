'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ShareIcon, HeartIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import Image from 'next/image'
import PageLoader from '@/components/PageLoader'
import { PublicVisual } from '@/components/Gallery/PublicVisualType'
import DiagramRenderer from '@/components/Gallery/DiagramRenderer'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import { createClient } from '@/lib/supabase-auth/server'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'

interface ShowcaseItemPageProps {
  params: { id: string }
}

export default function ShowcaseItemPage({ params }: ShowcaseItemPageProps) {
  const [visual, setVisual] = useState<PublicVisual | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndVisual = async () => {
      try {
        // Get user ID
        const response = await fetch('/api/auth/user')
        if (response.ok) {
          const userData = await response.json()
          setUserId(userData.user?.id || null)
        }

        // Fetch the specific visual
        const visualResponse = await fetch(`/api/get-public-diagrams/${params.id}`, {
          headers: {
            'User-Id': userId || ''
          }
        })
        
        if (!visualResponse.ok) {
          router.push('/dashboard/showcase')
          return
        }

        const { diagram } = await visualResponse.json()
        
        if (!diagram) {
          router.push('/dashboard/showcase')
          return
        }

        // Transform the diagram data
        const transformedDiagram = {
          ...diagram,
          previewUrl: diagram.type === 'illustration' ? diagram.image_url : 
                     diagram.type === 'infographic' ? `data:image/svg+xml;utf8,${encodeURIComponent(diagram.data)}` : 
                     diagram.type === 'generated_image' ? diagram.data :
                     FlowCraftLogo.src,
          views: diagram.views || 0,
          likes: diagram.likes || 0,
          isLiked: diagram.is_like || false,
          isSaved: diagram.is_save || false,
        }

        setVisual(transformedDiagram)

        // Increment view count
        fetch(`/api/get-public-diagrams/views_increment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: params.id }),
        }).catch(console.error)

      } catch (error) {
        console.error('Error fetching visual:', error)
        router.push('/dashboard/showcase')
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndVisual()
  }, [params.id, router])

  const handleLike = async () => {
    if (!userId || !visual) return

    try {
      const isCurrentlyLiked = visual.isLiked
      const newLikeCount = isCurrentlyLiked ? (visual.likes ?? 0) - 1 : (visual.likes ?? 0) + 1

      // Optimistic update
      setVisual(prev => prev ? {
        ...prev,
        isLiked: !isCurrentlyLiked,
        likes: newLikeCount
      } : null)

      const response = await fetch('/api/like-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagramId: visual.id, userID: userId }),
      })

      if (!response.ok) {
        // Revert optimistic update on error
        setVisual(prev => prev ? {
          ...prev,
          isLiked: isCurrentlyLiked,
          likes: visual.likes
        } : null)
      }
    } catch (error) {
      console.error('Error liking visual:', error)
    }
  }

  const handleSave = async () => {
    if (!userId || !visual) return

    try {
      const isCurrentlySaved = visual.isSaved

      // Optimistic update
      setVisual(prev => prev ? {
        ...prev,
        isSaved: !isCurrentlySaved
      } : null)

      const response = await fetch('/api/save-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagramId: visual.id, userID: userId }),
      })

      if (!response.ok) {
        // Revert optimistic update on error
        setVisual(prev => prev ? {
          ...prev,
          isSaved: isCurrentlySaved
        } : null)
      }
    } catch (error) {
      console.error('Error saving visual:', error)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // You might want to show a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5))
  }

  if (loading) {
    return <PageLoader />
  }

  if (!visual) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Image
            src={FlowCraftLogo}
            alt="FlowCraft"
            className="mx-auto mb-4 h-16 w-16 rounded-xl"
          />
          <h2 className="mb-2 text-xl font-semibold text-slate-700">
            Item not found
          </h2>
          <p className="mb-4 text-slate-500">
            The showcase item you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/dashboard/showcase')}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white transition-all hover:shadow-lg"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Showcase
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-200/50 bg-white shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
          <div className="flex items-center justify-between py-4">
            {/* Left section - Back button and title */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/showcase')}
                className="flex items-center space-x-2 text-slate-600 transition-colors hover:text-violet-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Showcase</span>
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
                    {visual.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span>{visual.type}</span>
                    <span className="flex items-center">
                      <EyeIcon className="mr-1 h-4 w-4" />
                      {visual.views} views
                    </span>
                    <span className="flex items-center">
                      <HeartIcon className="mr-1 h-4 w-4" />
                      {visual.likes} likes
                    </span>
                  </div>
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
                {visual.isLiked ? (
                  <HeartSolidIcon className="h-5 w-5 text-rose-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-slate-400 hover:text-rose-500" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="rounded-lg p-2 transition-colors hover:bg-blue-50"
                title="Save diagram"
              >
                <span className="text-sm font-medium text-slate-600">
                  {visual.isSaved ? 'Saved' : 'Save'}
                </span>
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
                <ArrowDownTrayIcon className="mr-2 inline h-4 w-4" />
                Download
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
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
        <div className="relative flex h-full items-center justify-center p-8">
          <div
            className="max-h-full max-w-full overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-xl"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <DiagramRenderer 
              type={visual.type}
              data={visual.data}
              imageUrl={visual.previewUrl}
            />
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
    </div>
  )
}