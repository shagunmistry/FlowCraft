import { createClient } from '@/lib/supabase-auth/server'

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const { data: shareableLinksData, error: diagramsError } = await supabase
    .from('shareable_links')
    .select('*')
    .eq('user_id', data.user.id)

  if (diagramsError) {
    return new Response(JSON.stringify({ error: diagramsError.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  console.log('Shared Links of User', shareableLinksData)

  return new Response(JSON.stringify({ shares: shareableLinksData }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
