export interface PublicVisual {
  id: string;
  title: string;
  data: string;
  description: string;
  type: 'mermaid' | 'infographic' | 'illustration';
  createdAt: string;
  isPublic: boolean;
  previewUrl?: string;
  image_url?: string;
  views?: number;
  likes?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  userId?: string;
}