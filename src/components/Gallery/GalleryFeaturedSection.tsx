import { motion } from 'framer-motion';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { PublicVisual } from './PublicVisualType';
import GalleryCard from './GalleryCard';
interface GalleryFeaturedSectionProps {
  visuals: PublicVisual[];
  onVisualClick: (visual: PublicVisual) => void;
  onLike: (visualId: string) => Promise<boolean>;
  onSave: (visualId: string) => Promise<boolean>;
}

export default function GalleryFeaturedSection({
  visuals,
  onVisualClick,
  onLike,
  onSave,
}: GalleryFeaturedSectionProps) {
  const featuredVisuals = visuals
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Popular This Week</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredVisuals.map((visual) => (
          <GalleryCard
            key={visual.id}
            visual={visual}
            onClick={() => onVisualClick(visual)}
            onLike={onLike}
            onSave={onSave}
            featured
          />
        ))}
      </div>
    </div>
  );
}