export interface PublicVisual {
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