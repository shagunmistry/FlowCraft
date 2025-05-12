import { PublicVisual } from './PublicVisualType';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import DiagramRenderer from './DiagramRenderer';

interface GalleryViewerProps {
  user_id: string | null;
  visual: PublicVisual;
  onClose: () => void;
  onLike: (visualId: string) => Promise<boolean>;
  onSave: (visualId: string) => Promise<boolean>;
}

export default function GalleryViewer({
  user_id,
  visual,
  onClose,
  onLike,
  onSave,
}: GalleryViewerProps) {

  const handleLike = async () => {
    if (!user_id) return;
    await onLike(visual.id);
  };

  const handleSave = async () => {
    if (!user_id) return;
    await onSave(visual.id);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 mb-8 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Back to Showcase</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{visual.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  {visual.type}
                </span>
                <span>{new Date(visual.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="text-gray-300">•</span>
                <span>{(visual.views || 0) + 1} views</span>
                <span className="text-gray-300">•</span>
                <span>{visual.likes || 0} likes</span>
              </div>
            </div>

            <div className="grid gap-8">
              <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                <div className="aspect-[4/3] flex items-center justify-center p-6">
                        <DiagramRenderer
                          type={visual.type}
                          data={visual.data}
                          imageUrl={visual.type === 'illustration' ? visual.image_url : undefined}
                          className="w-full h-full p-4"
                        />
                  {/* <img
                    src={visual.previewUrl || '/default-diagram.png'}
                    alt={visual.title}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy" 
                  /> */}
                </div>
              </div>

              {user_id && (
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {visual.isLiked ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                    <span>{visual.likes || 0}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {visual.isSaved ? (
                      <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
                    ) : (
                      <BookmarkIcon className="h-5 w-5 text-gray-600" />
                    )}
                    <span>{visual.isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              )}

              {visual.description && (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                  <div className="text-gray-700 leading-relaxed">
                    {visual.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}