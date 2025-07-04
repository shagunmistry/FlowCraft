import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-auth/server'

const NEXT_PUBLIC_FLOWCRAFT_API =
  process.env.NEXT_PUBLIC_FLOWCRAFT_API || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      aspect_ratio = '1:1',
      seed,
      output_format = 'jpg',
      safety_tolerance = 2,
      is_public = false,
    } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const requestData = {
      prompt,
      aspect_ratio,
      output_format,
      safety_tolerance,
      is_public,
      ...(seed && { seed }),
    }

    const supabaseClient = createClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid session found' },
        { status: 401 },
      )
    }

    const response = await fetch(
      `${NEXT_PUBLIC_FLOWCRAFT_API}/v2/generate-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData),
      },
    )

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to generate image' },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    )
  }
}
