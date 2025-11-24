import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-auth/server'
import { generateInviteCode } from '@/lib/utils'

export const maxDuration = 200

export async function POST(req: Request) {
  const body = await req.json()

  const { diagramData, diagramId, type, title } = body

  // Check if the user is authenticated with supabase auth
  const supabaseClient = createClient()
  const { data: userData, error } = await supabaseClient.auth.getUser()

  if (error || !diagramData) {
    console.error('Error getting user', error)
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  const inviteCode = generateInviteCode(7)

  console.log(
    'Saving link with invite code:',
    inviteCode,
    'for diagram:',
    diagramId,
  )

  // Create a new link
  const { data: link, error: linkError } = await supabaseClient
    .from('shareable_links')
    .insert([
      {
        user_id: userData.user.id,
        invite_code: inviteCode,
        diagram_id: diagramId,
        created_at: new Date().toISOString(),
        type: type,
        title: title,
        data: JSON.stringify(diagramData),
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

  const supabaseClient = createClient()

  console.log('searching for invite code:', inviteCode, 'for link:', linkId)
  // Check if the invite code matches the shared link
  const { data: linkData, error: linkError } = await supabaseClient
    .from('shareable_links')
    .select('type, data, title, user_id, invite_code')
    .eq('invite_code', inviteCode)

  console.log('Link Data:', linkData, 'Link Error:', linkError)

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

  return new Response(
    JSON.stringify({
      result: 'Success',
      diagramData: linkData[0],
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  )
}
