import { PublicVisual } from './PublicVisualType';
import EmptyState from './EmptyState';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  visuals: PublicVisual[];
  selectedFilter: string;
  searchQuery: string;
  onVisualClick: (visual: PublicVisual) => void;
  onLike: (visualId: string) => Promise<boolean>;
  onSave: (visualId: string) => Promise<boolean>;
}

export default function GalleryGrid({
  visuals,
  selectedFilter,
  searchQuery,
  onVisualClick,
  onLike,
  onSave,
}: GalleryGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedFilter === 'Newest' ? 'Recently Added' :
            selectedFilter === 'Trending' ? 'Most Viewed' :
              `${selectedFilter} Diagrams`}
        </h2>
        <div className="text-sm text-gray-500">
          {visuals.length} {visuals.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {visuals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visuals.map((visual) => (
            <GalleryCard
              key={visual.id}
              visual={visual}
              onClick={() => onVisualClick(visual)}
              onLike={onLike}
              onSave={onSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState searchQuery={searchQuery} />
      )}
    </div>
  );
}