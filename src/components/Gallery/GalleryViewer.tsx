import { PublicVisual } from './PublicVisualType';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import DiagramRenderer from './DiagramRenderer';
import { useState } from 'react';

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
  const [isLiked, setIsLiked] = useState(visual.isLiked);
  const [isSaved, setIsSaved] = useState(visual.isSaved);
  const [likeCount, setLikeCount] = useState(visual.likes || 0);
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);
  const [isAnimatingSave, setIsAnimatingSave] = useState(false);

  const handleLike = async () => {
    if (!user_id) return;
    
    setIsAnimatingLike(true);
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);
    
    try {
      await onLike(visual.id);
    } catch (error) {
      // Revert if failed
      setIsLiked(!newLikeState);
      setLikeCount(prev => newLikeState ? prev - 1 : prev + 1);
    } finally {
      setTimeout(() => setIsAnimatingLike(false), 300);
    }
  };

  const handleSave = async () => {
    if (!user_id) return;
    
    setIsAnimatingSave(true);
    const newSaveState = !isSaved;
    setIsSaved(newSaveState);
    
    try {
      await onSave(visual.id);
    } catch (error) {
      // Revert if failed
      setIsSaved(!newSaveState);
    } finally {
      setTimeout(() => setIsAnimatingSave(false), 300);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 mb-8 px-4 py-2.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 group border border-indigo-100 shadow-sm hover:shadow-indigo-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-indigo-700 group-hover:text-indigo-900">Back to Showcase</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{visual.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                  {visual.type}
                </span>
                <span>{new Date(visual.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="text-gray-300">•</span>
                <span>{(visual.views || 0) + 1} views</span>
                <span className="text-gray-300">•</span>
                <span>{likeCount} likes</span>
              </div>
            </div>

            <div className="grid gap-8">
              <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden transition-transform hover:scale-[1.005]">
                <div className="aspect-[4/3] flex items-center justify-center p-6">
                  <DiagramRenderer
                    type={visual.type}
                    data={visual.data}
                    imageUrl={visual.type === 'illustration' ? visual.image_url : 
                             visual.type === 'generated_image' ? visual.data : undefined}
                    className="w-full h-full p-4"
                  />
                </div>
              </div>

              {user_id && (
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isLiked 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                      ${isAnimatingLike ? 'animate-pulse' : ''}`}
                  >
                    {isLiked ? (
                      <HeartIconSolid className={`h-5 w-5 ${isAnimatingLike ? 'scale-125' : 'scale-100'} transition-transform`} />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span>{likeCount}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isSaved 
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                      ${isAnimatingSave ? 'animate-pulse' : ''}`}
                  >
                    {isSaved ? (
                      <BookmarkIconSolid className={`h-5 w-5 ${isAnimatingSave ? 'scale-125' : 'scale-100'} transition-transform`} />
                    ) : (
                      <BookmarkIcon className="h-5 w-5" />
                    )}
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              )}

              {visual.description && (
                <div className="prose max-w-none border-t border-gray-100 pt-6">
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