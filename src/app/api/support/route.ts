import { createClient } from '@/lib/supabase-auth/server'

export async function POST(req: Request) {
  try {
    let { firstName, lastName, email, message, type, rating } = await req.json()

    const supabaseClient = await createClient()

    const { data: userData } = await supabaseClient.auth.getUser()

    email = email || userData?.user?.email

    const { data, error } = await supabaseClient.from('support').insert([
      {
        firstname: firstName,
        lastname: lastName,
        email,
        message,
        created_at: new Date().toISOString(),
        type,
        rating,
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
