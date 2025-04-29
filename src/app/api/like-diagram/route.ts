import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API;
    const requestBody = await request.json();
    const { diagramId, like } = requestBody;

    if (!diagramId || typeof like !== 'boolean') {
      return NextResponse.json(
        { error: 'Diagram ID and like status are required in request body' },
        { status: 400 }
      );
    }

    // Call your FastAPI endpoint
    const fastApiResponse = await fetch(
      `${API_URL}/v2/diagram-likes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagram_id: diagramId,
          like_status: like
        })
      }
    );

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to update like status' },
        { status: fastApiResponse.status }
      );
    }

    const result = await fastApiResponse.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error updating like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}