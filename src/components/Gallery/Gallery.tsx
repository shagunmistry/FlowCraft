'use client';

import { useState, useMemo, useEffect, use } from 'react';
import GalleryHeader from './GalleryHeader';
import GallerySearchAndFilter from './GallerySearchAndFilter';
import GalleryFeaturedSection from './GalleryFeaturedSection';
import GalleryGrid from './GalleryGrid';
import GalleryViewer from './GalleryViewer';
import PageLoader from '@/components/PageLoader';
import { PublicVisual } from './PublicVisualType';
import { sanitizeMermaid, sanitizeSVG } from '@/lib/utils'

interface GalleryProps {
    user_id?: string | null; // Accept user_id as a prop
}

export default function Gallery({ user_id }: GalleryProps) {
    const userId = user_id || null; // Use the prop or set to null if not provided
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Newest');
    const [publicVisuals, setPublicVisuals] = useState<PublicVisual[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVisual, setSelectedVisual] = useState<PublicVisual | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        const fetchPublicVisuals = async () => {
            try {
                const response = await fetch('/api/get-public-diagrams');
                const { diagrams } = await response.json();

                const transformedDiagrams = diagrams.map((diagram: any) => {
                    return {
                        ...diagram,
                        previewUrl: diagram.type === 'illustration' ? diagram.image_url : 
                                   diagram.type === 'infographic' ? `data:image/svg+xml;utf8,${encodeURIComponent(diagram.data)}` : 
                                   '@/images/FlowCraftLogo_New.png',
                        data: diagram.data,
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

    const handleLike = async (visualId: string) => {
        if (!userId) return false;

        try {
            const visualIndex = publicVisuals.findIndex(v => v.id === visualId);
            if (visualIndex === -1) return false;

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
                body: JSON.stringify({ diagramId: visualId, userID: userId }),
            });

            return response.ok;
        } catch (error) {
            console.error('Error liking visual:', error);
            return false;
        }
    };

    const handleSave = async (visualId: string) => {
        if (!userId) return false;

        try {
            const visualIndex = publicVisuals.findIndex(v => v.id === visualId);
            if (visualIndex === -1) return false;

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
                body: JSON.stringify({ diagramId: visualId, userID: userId }),
            });

            return response.ok;
        } catch (error) {
            console.error('Error saving visual:', error);
            return false;
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
            <GalleryViewer
                user_id={userId}
                visual={selectedVisual}
                onClose={() => setIsViewerOpen(false)}
                onLike={handleLike}
                onSave={handleSave}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <GalleryHeader />

            <GallerySearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
            />

            <GalleryFeaturedSection
                visuals={publicVisuals}
                onVisualClick={openVisualViewer}
                onLike={handleLike}
                onSave={handleSave}
            />

            <GalleryGrid
                visuals={filteredVisuals}
                selectedFilter={selectedFilter}
                searchQuery={searchQuery}
                onVisualClick={openVisualViewer}
                onLike={handleLike}
                onSave={handleSave}
            />
        </div>
    );
}