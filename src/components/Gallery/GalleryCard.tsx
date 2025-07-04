import { motion } from 'framer-motion';
import { HeartIcon, BookmarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { PublicVisual } from './PublicVisualType';

interface GalleryCardProps {
  visual: PublicVisual;
  onClick: () => void;
  onLike: (visualId: string) => Promise<boolean>;
  onSave: (visualId: string) => Promise<boolean>;
  featured?: boolean;
}

// Type to color mapping inspired by Canva's design system
const typeColors = {
  mermaid: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  infographic: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  illustration: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  generated_image: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

// Type icons
const typeIcons = {
  mermaid: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  infographic: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  illustration: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  generated_image: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export default function GalleryCard({
  visual,
  onClick,
  onLike,
  onSave,
  featured = false,
}: GalleryCardProps) {
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onLike(visual.id);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onSave(visual.id);
  };

  const typeColor = typeColors[visual.type] || typeColors.mermaid;
  const typeIcon = typeIcons[visual.type] || typeIcons.mermaid;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl cursor-pointer transition-all duration-300 ${featured ? 'shadow-lg' : 'shadow-sm'} overflow-hidden`}
      onClick={onClick}
    >
      {/* Header with type badge */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeColor.bg} ${typeColor.text} ${typeColor.border}`}>
            {typeIcon}
            <span className="capitalize">{visual.type === 'generated_image' ? 'Generated Image' : visual.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className="p-1.5 rounded-full hover:bg-red-50 transition-colors group"
            >
              {visual.isLiked ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <HeartIconSolid className="h-4 w-4 text-red-500" />
                </motion.div>
              ) : (
                <HeartIcon className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              )}
            </button>
            <button
              onClick={handleSave}
              className="p-1.5 rounded-full hover:bg-blue-50 transition-colors group"
            >
              {visual.isSaved ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <BookmarkIconSolid className="h-4 w-4 text-blue-500" />
                </motion.div>
              ) : (
                <BookmarkIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`${featured ? 'text-lg font-semibold' : 'text-base font-medium'} text-gray-900 mb-2 line-clamp-2 leading-tight`}>
          {visual.title}
        </h3>

        {/* Description */}
        {visual.description && (
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
            {visual.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <EyeIcon className="h-3.5 w-3.5" />
              <span>{visual.views || 0}</span>
            </div>
            {visual.likes && visual.likes > 0 && (
              <div className="flex items-center gap-1">
                <HeartIcon className="h-3.5 w-3.5" />
                <span>{visual.likes}</span>
              </div>
            )}
          </div>
          <span>{new Date(visual.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}