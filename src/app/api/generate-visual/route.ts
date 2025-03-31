import { createClient } from '@/lib/supabase-auth/server'

export async function POST(req: Request) {

    try {
        const supabaseClient = createClient()
        const token = req.headers.get('Authorization')!

        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()

        if (sessionError || !session) {
            console.error('Session error: ', sessionError)
            return new Response(
                JSON.stringify({
                    error: 'Unauthorized - Please log in to generate a diagram'
                }),
                {
                    status: 401,
                    headers: {
                        'content-type': 'application/json'
                    },
                },
            )
        }

        console.log('Access Token:', session.access_token)

        const body = await req.json()
        const { type, description } = body

        const endpoint = type === 'Illustration' ? 'Illustration' : 'Infographic'

        const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
        const res = await fetch(`${API_URL}/v2/${endpoint.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                prompt: description,
                type: type.toLowerCase(),
            }),
        })

        if (!res.ok) {
            const errorData = await res.text()
            console.error('API Error Response:', {
                status: res.status,
                statusText: res.statusText,
                body: errorData,
                headers: Object.fromEntries(res.headers),
            })
            if (res.status === 401 || res.status === 403) {
                return new Response(
                    JSON.stringify({
                        error: 'Authentication failed - Please log in again',
                    }),
                    {
                        status: 401,
                        headers: {
                            'content-type': 'application/json',
                        },
                    },
                )
            }

            throw new Error(`API Error: ${res.status} - ${errorData}`)
        }

        const data = await res.json()
        return new Response(JSON.stringify(data), {
            headers: {
                'content-type': 'application/json',
            },
        })

    } catch (error) {
        console.error('Error generating visual:', error)
        return new Response(JSON.stringify({
            error: 'An error occurred while generating the visual',
            details: error instanceof Error ? error.message : 'Unknown error',
        }),
            {
                status: 500,
                headers: {
                    'content-type': 'application/json',
                },
            },
        )
    }
}