import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-auth/server'
import { generateInviteCode } from '@/lib/utils'

export const maxDuration = 200

export async function POST(req: Request) {
  const body = await req.json()

  const { diagramData, diagramId, type, title, imagePng } = body

  // Check if the user is authenticated with supabase auth
  const supabaseClient = await createClient()

  // Resolve user from Bearer token (VS Code extension) or cookie session (web).
  const authHeader = req.headers.get('authorization')
  let bearerUserId: string | null = null
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length)
    const { data: tokenData, error: tokenError } = await supabaseClient.auth.getUser(token)
    if (tokenError || !tokenData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 },
      )
    }
    bearerUserId = tokenData.user.id
  }

  const { data: userData, error } = await supabaseClient.auth.getUser()

  // Prefer bearer token user; fall back to cookie session user
  const sessionUserId = !error && userData?.user ? userData.user.id : null
  const userId = bearerUserId ?? sessionUserId

  if (!userId) {
    if (error) console.error('Error getting user', error)
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }
  if (!diagramData) {
    return new Response(
      JSON.stringify({ error: 'Missing diagramData' }),
      { status: 400 }
    )
  }

  const inviteCode = generateInviteCode(7)

  console.log(
    'Saving link with invite code:',
    inviteCode,
    'for diagram:',
    diagramId,
  )

  // Upload PNG to storage if provided (non-fatal on failure)
  let imageUrl: string | undefined
  if (typeof imagePng === 'string' && imagePng.length > 0) {
    const base64 = imagePng.replace(/^data:image\/png;base64,/, '')
    const bytes = Buffer.from(base64, 'base64')
    const objectPath = `shares/${userId}/${inviteCode}.png`
    const { error: uploadError } = await supabaseClient.storage
      .from('images')
      .upload(objectPath, bytes, { contentType: 'image/png', upsert: true })
    if (!uploadError) {
      const { data: pub } = supabaseClient.storage.from('images').getPublicUrl(objectPath)
      imageUrl = pub.publicUrl
    } else {
      console.error('Non-fatal: PNG upload failed', uploadError)
    }
  }

  // Create a new link
  const { data: link, error: linkError } = await supabaseClient
    .from('shareable_links')
    .insert([
      {
        user_id: userId,
        invite_code: inviteCode,
        diagram_id: diagramId,
        created_at: new Date().toISOString(),
        type: type,
        title: title,
        data: typeof diagramData === 'string' ? diagramData : JSON.stringify(diagramData),
        image_url: imageUrl ?? null,
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
        imageUrl,
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

  const supabaseClient = await createClient()

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
