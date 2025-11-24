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
}

// Minimalist Type Icons (Stroke width 1.5 for consistency)
const typeIcons = {
  mermaid: (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  infographic: (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
      />
    </svg>
  ),
  illustration: (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
      />
    </svg>
  ),
  generated_image: (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  ),
}

export default function GalleryCard({
  visual,
  onClick,
  onLike,
  onSave,
}: GalleryCardProps) {
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await onLike(visual.id)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await onSave(visual.id)
  }

  const typeIcon = typeIcons[visual.type] || typeIcons.mermaid

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-transparent bg-gray-50 p-6 transition-colors duration-300 hover:border-gray-100 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      {/* Top Row: Type & Actions */}
      <div className="mb-6 flex items-start justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-600 shadow-sm">
          {typeIcon}
          {visual.type === 'generated_image' ? 'Image' : visual.type}
        </span>

        <div className="flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={handleLike}
            className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-100 transition-all hover:bg-gray-50"
          >
            {visual.isLiked ? (
              <HeartIconSolid className="h-4 w-4 text-black" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-400 hover:text-black" />
            )}
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-100 transition-all hover:bg-gray-50"
          >
            {visual.isSaved ? (
              <BookmarkIconSolid className="h-4 w-4 text-black" />
            ) : (
              <BookmarkIcon className="h-4 w-4 text-gray-400 hover:text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-gray-900">
          {visual.title}
        </h3>
        {visual.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {visual.description}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200/50 pt-4 text-xs font-medium text-gray-400">
        <span>
          {new Date(visual.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <EyeIcon className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{visual.views || 0}</span>
          </div>
          {(visual.likes ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <HeartIconSolid className="h-3.5 w-3.5" />
              <span>{visual.likes ?? 0}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
