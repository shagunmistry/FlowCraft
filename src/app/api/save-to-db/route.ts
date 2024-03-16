import { createClient } from '@/lib/supabase-auth/server'
import { DiagramType } from '@/lib/utils'
import { NextRequest } from 'next/server'

/**
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const json = await req.json()
  const { snapshot, title: input } = json

  const supabaseClient = createClient()

  const { data: userData, error: userDataError } =
    await supabaseClient.auth.getUser()

  if (userDataError) {
    console.error(
      'Error getting user data while generating diagram:',
      userDataError,
    )

    return new Response(
      JSON.stringify({
        error: 'Error getting user data while generating diagram',
      }),
      {
        status: 500,
      },
    )
  }

  const { data: diagramData, error: diagramDataError } = await supabaseClient
    .from('diagrams')
    .insert([
      {
        type: DiagramType.Whiteboard,
        data: snapshot,
        title: input,
        user_id: userData.user.id,
        created_at: new Date().toISOString(),
        private: true,
        description: '',
      },
    ])

  if (diagramDataError) {
    console.error('Error saving diagram data:', diagramDataError)

    return new Response(
      JSON.stringify({
        error: 'Error saving diagram data',
      }),
      {
        status: 500,
      },
    )
  }

  return new Response(
    JSON.stringify({
      diagramData,
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  )
}
