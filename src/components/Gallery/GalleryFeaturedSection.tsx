'use client'

import { PublicVisual } from './PublicVisualType'
import GalleryCard from './GalleryCard'

interface GalleryFeaturedSectionProps {
  visuals: PublicVisual[]
  onVisualClick: (visual: PublicVisual) => void
  onLike: (visualId: string) => Promise<boolean>
  onSave: (visualId: string) => Promise<boolean>
}

export default function GalleryFeaturedSection({
  visuals,
  onVisualClick,
  onLike,
  onSave,
}: GalleryFeaturedSectionProps) {
  const featured = [...visuals]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4)

  if (featured.length === 0) return null

  return (
    <section className="mb-20">
      <div className="flex items-end justify-between border-b border-rule pb-4">
        <div>
          <h2 className="font-serif text-4xl leading-[0.95] text-paper md:text-5xl">
            Most viewed
            <span className="italic text-signal"> this week.</span>
          </h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((visual, i) => (
          <GalleryCard
            key={visual.id}
            visual={visual}
            index={i}
            onClick={() => onVisualClick(visual)}
            onLike={onLike}
            onSave={onSave}
            featured
          />
        ))}
      </div>
    </section>
  )
}
