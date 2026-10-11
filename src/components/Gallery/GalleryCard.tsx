'use client'

import { motion } from 'framer-motion'
import { HeartIcon, BookmarkIcon, EyeIcon } from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid'
import { PublicVisual } from './PublicVisualType'

interface GalleryCardProps {
  visual: PublicVisual
  onClick: () => void
  onLike: (visualId: string) => Promise<boolean>
  onSave: (visualId: string) => Promise<boolean>
  featured?: boolean
  index?: number
}

const typeLabelMap: Record<PublicVisual['type'], string> = {
  mermaid: 'Mermaid',
  infographic: 'Infographic',
  illustration: 'Illustration',
  generated_image: 'Image',
}

function CornerTicks() {
  return (
    <>
      <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-signal/70" />
      <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-signal/70" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-signal/70" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-signal/70" />
    </>
  )
}

function PreviewThumb({ visual }: { visual: PublicVisual }) {
  if (
    visual.type === 'illustration' ||
    visual.type === 'generated_image'
  ) {
    const src = visual.previewUrl || visual.image_url || ''
    if (!src) return <PlaceholderMark />
    return (
      <img
        src={src}
        alt={visual.title}
        className="h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        loading="lazy"
      />
    )
  }

  if (visual.type === 'infographic') {
    const src = visual.previewUrl
    if (!src) return <PlaceholderMark />
    return (
      <img
        src={src}
        alt={visual.title}
        className="h-full w-full object-contain p-4 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        loading="lazy"
      />
    )
  }

  return <PlaceholderMark />
}

function PlaceholderMark() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 160 90" className="h-24 w-36 opacity-70" fill="none">
        <g style={{ stroke: 'rgb(var(--color-paper))' }} strokeWidth="1">
          <rect x="18" y="18" width="34" height="18" rx="1" />
          <rect x="64" y="40" width="34" height="18" rx="1" />
          <rect x="110" y="18" width="34" height="18" rx="1" />
        </g>
        <g style={{ stroke: 'rgb(var(--color-signal))' }} strokeWidth="0.9" strokeDasharray="2 2">
          <path d="M52 27 L 81 49" />
          <path d="M110 27 L 81 49" />
        </g>
      </svg>
    </div>
  )
}

export default function GalleryCard({
  visual,
  onClick,
  onLike,
  onSave,
  featured,
  index = 0,
}: GalleryCardProps) {
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await onLike(visual.id)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await onSave(visual.id)
  }

  const typeLabel = typeLabelMap[visual.type] || visual.type

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col bg-ink p-6 transition-colors duration-300 hover:bg-graphite"
    >
      {/* Top meta row */}
      <div className="mb-5 text-xs text-fog">{typeLabel}</div>

      {/* Preview */}
      <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-sm border border-rule bg-ink">
        <CornerTicks />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(rgb(var(--color-signal) / 0.08) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
        <div className="relative h-full w-full">
          <PreviewThumb visual={visual} />
        </div>

        {/* Hover action buttons */}
        <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={handleLike}
            aria-label="Like"
            className="rounded-sm border border-rule bg-ink/80 p-1.5 backdrop-blur transition-colors hover:border-signal/60"
          >
            {visual.isLiked ? (
              <HeartIconSolid className="h-3.5 w-3.5 text-signal" />
            ) : (
              <HeartIcon className="h-3.5 w-3.5 text-paper/80" />
            )}
          </button>
          <button
            onClick={handleSave}
            aria-label="Save"
            className="rounded-sm border border-rule bg-ink/80 p-1.5 backdrop-blur transition-colors hover:border-signal/60"
          >
            {visual.isSaved ? (
              <BookmarkIconSolid className="h-3.5 w-3.5 text-signal" />
            ) : (
              <BookmarkIcon className="h-3.5 w-3.5 text-paper/80" />
            )}
          </button>
        </div>
      </div>

      {/* Text */}
      <h3 className="line-clamp-2 font-serif text-2xl leading-tight text-paper transition-colors group-hover:text-signal">
        {visual.title || 'Untitled draft'}
      </h3>
      {visual.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/55">
          {visual.description}
        </p>
      )}

      {/* Footer meta */}
      <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-xs text-fog">
        <span>
          {new Date(visual.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-paper/70">{visual.views || 0}</span>
          </span>
          {(visual.likes ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <HeartIconSolid className="h-3 w-3 text-signal" />
              <span className="text-paper/70">{visual.likes ?? 0}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
