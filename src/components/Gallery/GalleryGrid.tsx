import { useState } from 'react';
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
  const [showAll, setShowAll] = useState(false);
  const displayedVisuals = showAll ? visuals : visuals.slice(0, 10);
  const totalItems = visuals.length;
  const showingItems = displayedVisuals.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedFilter === 'Newest' ? 'Recently Added' :
            selectedFilter === 'Trending' ? 'Most Viewed' :
            selectedFilter === 'Generated Images' ? 'Generated Images' :
              `${selectedFilter} Diagrams`}
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {showingItems} of {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </div>
          
          {totalItems > 10 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>
      </div>

      {displayedVisuals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedVisuals.map((visual) => (
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