import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_FLOWCRAFT_API = process.env.NEXT_PUBLIC_FLOWCRAFT_API || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, input_image, aspect_ratio = '1:1', seed, output_format = 'jpg', safety_tolerance = 2, is_public = false } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!input_image) {
      return NextResponse.json(
        { error: 'Input image is required for editing' },
        { status: 400 }
      );
    }

    const requestData = {
      prompt,
      input_image,
      aspect_ratio,
      output_format,
      safety_tolerance,
      is_public,
      ...(seed && { seed }),
    };

    const response = await fetch(`${NEXT_PUBLIC_FLOWCRAFT_API}/v2/edit-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.error || 'Failed to edit image' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error editing image:', error);
    return NextResponse.json(
      { error: 'Failed to edit image' },
      { status: 500 }
    );
  }
}