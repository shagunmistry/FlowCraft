'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import GalleryHeader from './GalleryHeader'
import GallerySearchAndFilter from './GallerySearchAndFilter'
import GalleryFeaturedSection from './GalleryFeaturedSection'
import GalleryGrid from './GalleryGrid'
import PageLoader from '@/components/PageLoader'
import { PublicVisual } from './PublicVisualType'
import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import { parseMermaid } from '@/lib/mermaidClient'
import { sanitizeMermaid } from '@/lib/utils'

// Only showcase diagrams that actually parse, so every card shows a real
// render. Non-Mermaid visuals (images, SVG infographics) pass straight through.
async function filterRenderable(visuals: PublicVisual[]) {
  const checks = await Promise.all(
    visuals.map(async (v) => {
      if (v.type !== 'diagram' && v.type !== 'mermaid') return true
      const code = sanitizeMermaid(v.data)
      return code ? parseMermaid(code) : false
    }),
  )
  return visuals.filter((_, i) => checks[i])
}

interface GalleryProps {
  user_id?: string | null
}

export default function Gallery({ user_id }: GalleryProps) {
  const userId = user_id || null
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Newest')
  const [publicVisuals, setPublicVisuals] = useState<PublicVisual[]>([])
  const [loading, setLoading] = useState(true)
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchPublicVisuals = async () => {
      try {
        const response = await fetch('/api/get-public-diagrams', {
          headers: {
            'User-Id': userId || '',
          },
        })
        const { diagrams } = await response.json()

        const transformedDiagrams = diagrams.map((diagram: any) => {
          return {
            ...diagram,
            previewUrl:
              diagram.type === 'illustration'
                ? diagram.image_url
                : diagram.type === 'infographic'
                  ? `data:image/svg+xml;utf8,${encodeURIComponent(diagram.data)}`
                  : diagram.type === 'generated_image'
                    ? diagram.data
                    : FlowCraftLogo.src,
            data: diagram.data,
            views: diagram.views || 0,
            likes: diagram.likes || 0,
            isLiked: diagram.is_like || false,
            isSaved: diagram.is_save || false,
          }
        })

        setPublicVisuals(await filterRenderable(transformedDiagrams))
      } catch (error) {
        console.error('Error fetching public visuals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicVisuals()
  }, [])

  const handleLike = async (visualId: string) => {
    if (!userId) return false

    try {
      const visualIndex = publicVisuals.findIndex((v) => v.id === visualId)
      if (visualIndex === -1) return false

      const visual = publicVisuals[visualIndex]
      const isCurrentlyLiked = visual.isLiked
      const newLikeCount = isCurrentlyLiked
        ? visual.likes! - 1
        : visual.likes! + 1

      setPublicVisuals((prev) => {
        const next = [...prev]
        next[visualIndex] = {
          ...next[visualIndex],
          isLiked: !isCurrentlyLiked,
          likes: newLikeCount,
        }
        return next
      })

      const response = await fetch('/api/like-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagramId: visualId, userID: userId }),
      })
      return response.ok
    } catch (error) {
      console.error('Error liking visual:', error)
      return false
    }
  }

  const handleSave = async (visualId: string) => {
    if (!userId) return false

    try {
      const visualIndex = publicVisuals.findIndex((v) => v.id === visualId)
      if (visualIndex === -1) return false

      const visual = publicVisuals[visualIndex]
      const isCurrentlySaved = visual.isSaved

      setPublicVisuals((prev) => {
        const next = [...prev]
        next[visualIndex] = {
          ...next[visualIndex],
          isSaved: !isCurrentlySaved,
        }
        return next
      })

      const response = await fetch('/api/save-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagramId: visualId, userID: userId }),
      })
      return response.ok
    } catch (error) {
      console.error('Error saving visual:', error)
      return false
    }
  }

  const handleRenderFail = useCallback((visualId: string) => {
    setFailedIds((prev) => new Set(prev).add(visualId))
  }, [])

  const visibleVisuals = useMemo(
    () => publicVisuals.filter((v) => !failedIds.has(v.id)),
    [publicVisuals, failedIds],
  )

  const filteredVisuals = useMemo(() => {
    return visibleVisuals
      .filter((v) =>
        (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .filter((v) => {
        if (selectedFilter === 'Newest' || selectedFilter === 'Trending') {
          return true
        }
        if (selectedFilter === 'Generated Images') {
          return v.type === 'generated_image'
        }
        return v.type.toLowerCase().includes(selectedFilter.toLowerCase())
      })
      .sort((a, b) => {
        if (selectedFilter === 'Trending')
          return (b.views || 0) - (a.views || 0)
        if (selectedFilter === 'Newest')
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        return 0
      })
  }, [searchQuery, selectedFilter, visibleVisuals])

  const openVisualViewer = (visual: PublicVisual) => {
    router.push(`/dashboard/showcase/${visual.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-paper">
        <PageLoader />
      </div>
    )
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-paper selection:bg-signal selection:text-ink">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 top-[76px] bg-dot-grid bg-dot-24 opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-60 h-[480px] w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--color-signal) / 0.08), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 pb-32 pt-10 lg:px-8">
        <GalleryHeader totalItems={visibleVisuals.length} />

        <GallerySearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <GalleryFeaturedSection
          visuals={visibleVisuals}
          onVisualClick={openVisualViewer}
          onLike={handleLike}
          onSave={handleSave}
          onRenderFail={handleRenderFail}
        />

        <GalleryGrid
          visuals={filteredVisuals}
          selectedFilter={selectedFilter}
          searchQuery={searchQuery}
          onVisualClick={openVisualViewer}
          onLike={handleLike}
          onSave={handleSave}
          onRenderFail={handleRenderFail}
        />
      </div>
    </main>
  )
}
