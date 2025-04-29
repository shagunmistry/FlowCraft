'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import DiagramOrChartView from '@/components/DiagramOrChartView';
import { DiagramContext } from '@/lib/Contexts/DiagramContext';
import PageLoader from '@/components/PageLoader';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface PublicVisual {
  id: string;
  title: string;
  data: string;
  description: string;
  type: string;
  createdAt: string;
  isPublic: boolean;
  previewUrl?: string;
  views?: number;
  likes?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export default function PublicGallery() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Newest');
  const [publicVisuals, setPublicVisuals] = useState<PublicVisual[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisual, setSelectedVisual] = useState<PublicVisual | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const filters = ['Newest', 'Trending', 'Flow', 'Chart', 'Whiteboard', 'Mind Map'];

  useEffect(() => {
    const fetchPublicVisuals = async () => {
      try {
        const response = await fetch('/api/get-public-diagrams');
        const { diagrams } = await response.json();

        const transformedDiagrams = diagrams.map((diagram: any) => {
          let previewUrl = '/default-diagram.png';

          try {
            if (diagram.data && typeof diagram.data === 'string') {
              const cleanedSvg = diagram.data
                .trim()
                .replace(/<\?xml.*?\?>/g, '')
                .replace(/<!--[\s\S]*?-->/g, '');
              previewUrl = `data:image/svg+xml;utf8,${encodeURIComponent(cleanedSvg)}`;
            }
          } catch (svgError) {
            console.error('Error processing SVG:', svgError);
          }

          return {
            ...diagram,
            previewUrl,
            views: diagram.views || 0,
            likes: diagram.likes || 0,
            isLiked: diagram.isLiked || false,
            isSaved: diagram.isSaved || false,
          };
        });

        setPublicVisuals(transformedDiagrams);
      } catch (error) {
        console.error('Error fetching public visuals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicVisuals();
  }, []);

  const handleLike = async (visualId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session) {
      toast.error('Please sign in to like visuals');
      return;
    }

    try {
      const visualIndex = publicVisuals.findIndex(v => v.id === visualId);
      if (visualIndex === -1) return;

      const visual = publicVisuals[visualIndex];
      const isCurrentlyLiked = visual.isLiked;
      const newLikeCount = isCurrentlyLiked ? visual.likes! - 1 : visual.likes! + 1;

      // Optimistic update
      setPublicVisuals(prev => {
        const newVisuals = [...prev];
        newVisuals[visualIndex] = {
          ...newVisuals[visualIndex],
          isLiked: !isCurrentlyLiked,
          likes: newLikeCount
        };
        return newVisuals;
      });

      const response = await fetch('/api/like-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagramId: visualId, like: !isCurrentlyLiked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Error liking visual:', error);
      // Revert optimistic update
      setPublicVisuals(prev => {
        const newVisuals = [...prev];
        const visualIndex = newVisuals.findIndex(v => v.id === visualId);
        if (visualIndex !== -1) {
          newVisuals[visualIndex] = {
            ...newVisuals[visualIndex],
            isLiked: !newVisuals[visualIndex].isLiked,
            likes: newVisuals[visualIndex].isLiked ? newVisuals[visualIndex].likes! - 1 : newVisuals[visualIndex].likes! + 1
          };
        }
        return newVisuals;
      });
      toast.error('Failed to update like');
    }
  };

  const handleSave = async (visualId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session) {
      toast.error('Please sign in to save visuals');
      return;
    }

    try {
      const visualIndex = publicVisuals.findIndex(v => v.id === visualId);
      if (visualIndex === -1) return;

      const visual = publicVisuals[visualIndex];
      const isCurrentlySaved = visual.isSaved;

      // Optimistic update
      setPublicVisuals(prev => {
        const newVisuals = [...prev];
        newVisuals[visualIndex] = {
          ...newVisuals[visualIndex],
          isSaved: !isCurrentlySaved
        };
        return newVisuals;
      });

      const response = await fetch('/api/save-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagramId: visualId, save: !isCurrentlySaved }),
      });

      if (!response.ok) {
        throw new Error('Failed to update save');
      }

      toast.success(!isCurrentlySaved ? 'Visual saved to your collection!' : 'Visual removed from your collection');
    } catch (error) {
      console.error('Error saving visual:', error);
      // Revert optimistic update
      setPublicVisuals(prev => {
        const newVisuals = [...prev];
        const visualIndex = newVisuals.findIndex(v => v.id === visualId);
        if (visualIndex !== -1) {
          newVisuals[visualIndex] = {
            ...newVisuals[visualIndex],
            isSaved: !newVisuals[visualIndex].isSaved
          };
        }
        return newVisuals;
      });
      toast.error('Failed to update save');
    }
  };

  const filteredVisuals = useMemo(() => {
    return publicVisuals
      .filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((v) =>
        selectedFilter === 'Newest' || selectedFilter === 'Trending'
          ? true
          : v.type.toLowerCase().includes(selectedFilter.toLowerCase())
      )
      .sort((a, b) => {
        if (selectedFilter === 'Trending') return (b.views || 0) - (a.views || 0);
        if (selectedFilter === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [searchQuery, selectedFilter, publicVisuals]);

  const openVisualViewer = (visual: PublicVisual) => {
    setSelectedVisual(visual);
    setIsViewerOpen(true);
    
    fetch(`/api/get-public-diagrams/views_increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: visual.id }),
    }).catch(console.error);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (isViewerOpen && selectedVisual) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <button
            onClick={() => setIsViewerOpen(false)}
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{selectedVisual.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {selectedVisual.type}
                  </span>
                  <span>{new Date(selectedVisual.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="text-gray-300">•</span>
                  <span>{(selectedVisual.views || 0) + 1} views</span>
                  <span className="text-gray-300">•</span>
                  <span>{selectedVisual.likes || 0} likes</span>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center p-6">
                    <img
                      src={selectedVisual.previewUrl || '/default-diagram.png'}
                      alt={selectedVisual.title}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={(e) => handleLike(selectedVisual.id, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {selectedVisual.isLiked ? (
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                    <span>{selectedVisual.likes || 0}</span>
                  </button>

                  <button
                    onClick={(e) => handleSave(selectedVisual.id, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {selectedVisual.isSaved ? (
                      <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
                    ) : (
                      <BookmarkIcon className="h-5 w-5 text-gray-600" />
                    )}
                    <span>{selectedVisual.isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                {selectedVisual.description && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                    <div className="text-gray-700 leading-relaxed">
                      {selectedVisual.description}
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Explore Community Creations</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover and get inspired by diagrams created by our community
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-12">
        <div className="relative max-w-xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search diagrams..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedFilter === filter
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Popular This Week</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publicVisuals
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 4)
            .map((visual) => (
              <motion.div
                key={visual.id}
                whileHover={{ y: -5 }}
                className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                onClick={() => openVisualViewer(visual)}
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
                      onClick={(e) => handleLike(visual.id, e)}
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
                      onClick={(e) => handleSave(visual.id, e)}
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
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">{visual.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{visual.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {visual.likes || 0}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {visual.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* All Diagrams Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedFilter === 'Newest' ? 'Recently Added' :
              selectedFilter === 'Trending' ? 'Most Viewed' :
                `${selectedFilter} Diagrams`}
          </h2>
          <div className="text-sm text-gray-500">
            {filteredVisuals.length} {filteredVisuals.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {filteredVisuals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVisuals.map((visual) => (
              <motion.div
                key={visual.id}
                whileHover={{ y: -3 }}
                className="rounded-xl overflow-hidden shadow-sm bg-white cursor-pointer border border-gray-100 hover:shadow-md transition-all duration-200"
                onClick={() => openVisualViewer(visual)}
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
                      onClick={(e) => handleLike(visual.id, e)}
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
                      onClick={(e) => handleSave(visual.id, e)}
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
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 truncate">{visual.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {visual.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 flex items-center">
                        <HeartIcon className="h-3 w-3 mr-1" />
                        {visual.likes || 0}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(visual.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No diagrams found</h3>
            <p className="mt-1 text-gray-500 max-w-md mx-auto">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : 'There are currently no public diagrams available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}