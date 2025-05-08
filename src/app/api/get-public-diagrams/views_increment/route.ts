import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
    const requestBody = await request.json();
    const diagramId = requestBody.id;
    if (!diagramId) {
      return NextResponse.json(
        { error: 'Diagram ID is required in request body' },
        { status: 400 }
      );
    }

    // Call your FastAPI endpoint
    const fastApiResponse = await fetch(
      `${API_URL}/v2/public-diagrams-views-increment?diagram_ID=${diagramId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to increment views' },
        { status: fastApiResponse.status }
      );
    }

    const result = await fastApiResponse.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error incrementing diagram views:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
