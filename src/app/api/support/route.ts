import { createClient } from '@/lib/supabase-auth/server'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, message } = await req.json()

    const supabase = createClient()

    const { data, error } = await supabase.from('support').insert([
      {
        firstname: firstName,
        lastname: lastName,
        email,
        message,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      return new Response(
        JSON.stringify({
          error: `Error submitting support request: ${error.message}`,
        }),
        {
          status: 500,
        },
      )
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: `Error submitting support request: ${error.message}`,
      }),
      {
        status: 500,
      },
    )
  }
}
