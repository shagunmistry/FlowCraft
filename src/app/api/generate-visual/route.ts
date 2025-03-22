import { createClient } from '@/lib/supabase-auth/server'

export async function POST(req: Request) {

    try {
        const supabaseClient = createClient()
        const token = req.headers.get('Authorization')!
        const { data: userData, error: userDataError } = 
            await supabaseClient.auth.getUser()

        if (!userData) {
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

        const body = await req.json()
        const { type, description } = body

        const endpoint = type === 'Illustration' ? 'Illustration' : 'Infographic'

        const API_URL = process.env.NEXT_PUBLIC_FLOWCRAFT_API
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                prompt: description,
                type: type.toLowerCase(),
            }),
        })

        if (!res.ok) {
            if (res.status === 401) {
                return new Response(
                    JSON.stringify({
                        error: 'Unauthorized - Please log in again',
                    }),
                    {
                        status: 401,
                        headers: {
                            'content-type': 'application/json',
                        },
                    },
                )
            }

            throw new Error(`API Error: ${res.status}`)
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
