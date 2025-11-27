import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 GET /api/get-public-diagrams/[id] - Route hit with ID:', id)
    console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()))

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

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log('❌ Diagram not found')
        return NextResponse.json({ error: 'Diagram not found' }, { status: 404 })
      }
      throw new Error(`API call failed with status ${response.status}`)
    }

    const diagram = await response.json()

    console.log('✅ Successfully returning diagram:', diagram.id)
    return NextResponse.json({ diagram })
  } catch (error) {
    console.error('❌ Error fetching diagram:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}