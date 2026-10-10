import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 GET /api/get-public-diagrams/[id] - Route hit with ID:', id)

    const userId = request.headers.get('User-Id')
    console.log('🔍 User ID from header:', userId)

    // Call external API endpoint
    const apiUrl = `${process.env.NEXT_PUBLIC_FLOWCRAFT_API}/v2/public-diagrams/${id}`
    console.log('🔍 Calling external API:', apiUrl)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (userId) {
      headers['User-Id'] = userId
    }

    // Fail fast (before Vercel's 15s function limit) so a cold-starting
    // backend returns a clean 504 instead of an unhandled runtime timeout.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)
    let response: Response
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timer)
    }

    if (!response.ok) {
      if (response.status === 404) {
        console.log('❌ Diagram not found')
        return NextResponse.json({ error: 'Diagram not found' }, { status: 404 })
      }
      throw new Error(`API call failed with status ${response.status}`)
    }

    const diagram = await response.json()

    console.log('✅ Successfully returning diagram:', diagram.id)
    // Anonymous responses are identical for every caller, so let the CDN cache them.
    return NextResponse.json(
      { diagram },
      {
        headers: userId
          ? undefined
          : { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      },
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Public diagram fetch timed out')
      return NextResponse.json({ error: 'Upstream timed out' }, { status: 504 })
    }
    console.error('❌ Error fetching diagram:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}