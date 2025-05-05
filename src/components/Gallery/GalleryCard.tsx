import { motion } from 'framer-motion';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { PublicVisual } from './PublicVisualType';

interface GalleryCardProps {
  visual: PublicVisual;
  onClick: () => void;
  onLike: (visualId: string) => Promise<boolean>;
  onSave: (visualId: string) => Promise<boolean>;
  featured?: boolean;
}

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

  return (
    <motion.div
      whileHover={{ y: featured ? -5 : -3 }}
      className={`rounded-xl overflow-hidden ${featured ? 'shadow-md' : 'shadow-sm'} bg-white cursor-pointer border border-gray-100 hover:shadow-lg transition-all duration-200`}
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
        <img
          src={visual.previewUrl || '/default-diagram.png'}
          alt={visual.title}
          className="w-full h-full object-contain p-4"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleLike}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          >
            {visual.isLiked ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              </motion.div>
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleSave}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          >
            {visual.isSaved ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
              </motion.div>
            ) : (
              <BookmarkIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      <div className={`p-4 ${featured ? '' : 'pt-3'}`}>
        <h3 className={`${featured ? 'font-semibold' : 'font-medium'} text-gray-800 truncate`}>
          {visual.title}
        </h3>
        <div className="flex justify-between items-center mt-2">
          {/* {featured ? (
            <span className="text-xs text-gray-500">{visual.type}</span>
          ) : (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {visual.type}
            </span>
          )} */}
          <div className="flex items-center gap-2">
            {featured ? (
              <>
                {/* <span className="text-xs text-gray-400 flex items-center">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  {visual.likes || 0}
                </span> */}
                <span className="text-xs text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {visual.views || 0}
                </span>
              </>
            ) : (
              <>
                {/* <span className="text-xs text-gray-400 flex items-center">
                  <HeartIcon className="h-3 w-3 mr-1" />
                  {visual.likes || 0}
                </span> */}
                <span className="text-xs text-gray-400">
                  {new Date(visual.createdAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}