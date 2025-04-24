import { NextResponse } from 'next/server';

interface PublicVisual {
  id: string;
  title: string;
  data: string; // SVG code as string
  type: string;
  description: string;
  views: number;
  createdAt: string;
  isPublic: boolean;
}

export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
    const response = await fetch(`${API_URL}/v2/public-diagrams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Optional: Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const diagrams = await response.json();

    // Convert to frontend interface format
    const formattedDiagrams: PublicVisual[] = diagrams.map((diagram: any) => ({
      id: diagram.id,
      title: diagram.title,
      data: diagram.data,
      description: diagram.description,
      views: diagram.views,
      type: diagram.type,
      createdAt: diagram.created_at,
      isPublic: diagram.is_public,
    }));
    return NextResponse.json({ diagrams: formattedDiagrams });
  } catch (error) {
    console.error('Error fetching public diagrams:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while fetching public diagrams',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}