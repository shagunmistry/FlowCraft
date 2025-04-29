import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API;
    const requestBody = await request.json();
    const { diagramId, save } = requestBody;

    if (!diagramId || typeof save !== 'boolean') {
      return NextResponse.json(
        { error: 'Diagram ID and save status are required in request body' },
        { status: 400 }
      );
    }

    // Call your FastAPI endpoint
    const fastApiResponse = await fetch(
      `${API_URL}/v2/saved-diagrams`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagram_id: diagramId,
          save_status: save
        })
      }
    );

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to update save status' },
        { status: fastApiResponse.status }
      );
    }

    const result = await fastApiResponse.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error updating save status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}