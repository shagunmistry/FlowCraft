'use client'

import { useState } from 'react'
import { PublicVisual } from './PublicVisualType'
import EmptyState from './EmptyState'
import GalleryCard from './GalleryCard'

interface GalleryGridProps {
  visuals: PublicVisual[]
  selectedFilter: string
  searchQuery: string
  onVisualClick: (visual: PublicVisual) => void
  onLike: (visualId: string) => Promise<boolean>
  onSave: (visualId: string) => Promise<boolean>
}

export default function GalleryGrid({
  visuals,
  selectedFilter,
  searchQuery,
  onVisualClick,
  onLike,
  onSave,
}: GalleryGridProps) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? visuals : visuals.slice(0, 12)
  const total = visuals.length

  const heading =
    selectedFilter === 'Newest'
      ? 'Recently drafted'
      : selectedFilter === 'Trending'
        ? 'Most viewed'
        : selectedFilter === 'Generated Images'
          ? 'Generated images'
          : `${selectedFilter} · drafts`

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
        <div>
          <h2 className="font-serif text-4xl leading-[0.95] text-paper md:text-5xl">
            {heading}
            <span className="italic text-signal">.</span>
          </h2>
        </div>

        <div className="flex items-center gap-6 text-sm text-fog">
          <span>
            Showing{' '}
            <span className="text-paper">
              {displayed.length.toString().padStart(2, '0')}
            </span>{' '}
            of{' '}
            <span className="text-paper">
              {total.toString().padStart(2, '0')}
            </span>
          </span>
          {total > 12 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="group inline-flex items-center gap-2 rounded-sm border border-rule px-3 py-2 text-paper/80 transition-colors hover:border-signal/50 hover:text-signal"
            >
              <span>{showAll ? 'Show less' : 'Show all'}</span>
            </button>
          )}
        </div>
      </div>

      {displayed.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayed.map((visual, i) => (
            <GalleryCard
              key={visual.id}
              visual={visual}
              index={i}
              onClick={() => onVisualClick(visual)}
              onLike={onLike}
              onSave={onSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState searchQuery={searchQuery} />
      )}
    </section>
  )
}
