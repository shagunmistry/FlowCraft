import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-auth/server'
import { generateInviteCode } from '@/lib/utils'

export const maxDuration = 200

export async function POST(req: Request) {
  const body = await req.json()
  const { type, diagramData, title, description } = body

  // Check if the user is authenticated with supabase auth
  const supabaseClient = createClient()
  const { data: userData, error } = await supabaseClient.auth.getUser()

  console.log('User: ', diagramData)
  if (error || !diagramData) {
    console.error('Error getting user', error)
    return { status: 401, body: { error: 'Unauthorized' } }
  }

  // Save the diagram information to the database
  const { error: diagramError, data: insertedDiagram } = await supabase
    .from('diagrams')
    .insert([
      {
        type,
        data: diagramData,
        title,
        description,
        user_id: userData.user.id,
        private: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select('id')

  if (diagramError) {
    console.error('Error saving diagram', diagramError)
    return new Response(
      JSON.stringify({ error: 'There was an error saving the diagram' }),
      { status: 500 },
    )
  }

  const inviteCode = generateInviteCode(7)

  // Create a new link
  const { data: link, error: linkError } = await supabase
    .from('shareable_links')
    .insert([
      {
        user_id: userData.user.id,
        invite_code: inviteCode,
        diagram_id: insertedDiagram[0].id,
        created_at: new Date().toISOString(),
      },
    ])
    .select('id')

  if (linkError) {
    console.error('Error saving link', linkError)
    return new Response(
      JSON.stringify({ error: 'There was an error saving the link' }),
      { status: 500 },
    )
  }

  const isLocalHost = req.headers.get('origin')?.includes('localhost')
  const domainToUse = isLocalHost
    ? 'localhost:3000'
    : process.env.NEXT_PUBLIC_ROOT_DOMAIN

  const subUrlLinkToShare = `${domainToUse}/shared/${link[0].id}`

  return new Response(
    JSON.stringify({
      result: {
        link: subUrlLinkToShare,
        inviteCode,
      },
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  )
}

/** A PUT request handler to handle confirming the access code matches the shared link  */
export async function PUT(req: Request) {
  const body = await req.json()
  const { inviteCode, linkId } = body

  // Check if the invite code matches the shared link
  const { data: linkData, error: linkError } = await supabase
    .from('shareable_links')
    .select('diagram_id, invite_code')
    .eq('invite_code', inviteCode)

  if (linkError) {
    console.error('Error getting link data', linkError)
    return new Response(
      JSON.stringify({ error: 'There was an error getting the link data' }),
      { status: 500 },
    )
  }

  if (!linkData || linkData.length === 0) {
    return new Response(
      JSON.stringify({ error: 'The invite code is invalid' }),
      { status: 404 },
    )
  }

  if (linkData[0].invite_code !== inviteCode) {
    return new Response(
      JSON.stringify({ error: 'The invite code does not match the diagram' }),
      { status: 404 },
    )
  }

  // Get diagram data
  const { data: diagramData, error: diagramError } = await supabase
    .from('diagrams')
    .select('title, data, type, description')
    .eq('id', linkData[0].diagram_id)

  if (diagramError) {
    console.error('Error getting diagram data', diagramError)
    return new Response(
      JSON.stringify({ error: 'There was an error getting the diagram data' }),
      { status: 500 },
    )
  }

  return new Response(
    JSON.stringify({
      result: 'Success',
      diagramData: diagramData[0],
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  )
}
