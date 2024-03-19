import { createClient } from '@/lib/supabase-auth/server'

export async function GET() {
  // Get user informatiom from Supabase DB
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return new Response(
      JSON.stringify({
        error: 'Error fetching user data',
      }),
      {
        status: 500,
      },
    )
  }

  const { user } = data

  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)

  if (subscriptionError || !subscriptionData) {
    return new Response(
      JSON.stringify({
        error: 'Error fetching subscription data',
      }),
      {
        status: 500,
      },
    )
  }

  return new Response(JSON.stringify(subscriptionData), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
