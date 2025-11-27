import { createClient } from '@/lib/supabase-auth/server'

export async function GET() {
  try {
    const supabaseClient = await createClient()
    const { data: userData } = await supabaseClient.auth.getUser()

    if (!userData) {
      return new Response(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 404,
        },
      )
    }

    // Get the user information from Supabase DB
    const { data: userInformation, error } = await supabaseClient
      .from('users')
      .select()
      .eq('user_id', userData.user?.id)
      .single()

    const { data: userDiagramsData, error: userDiagramsError } =
      await supabaseClient
        .from('diagrams')
        .select()
        .eq('user_id', userData.user?.id)
        .order('created_at', { ascending: false })

    if (error || userDiagramsError) {
      return new Response(
        JSON.stringify({
          error: `Error getting user information: ${
            error?.message ?? userDiagramsError?.message
          }`,
        }),
        {
          status: 500,
        },
      )
    }

    return new Response(
      JSON.stringify({
        user: {
          ...userData.user,
          ...userInformation,
        },
        diagrams: userDiagramsData,
      }),
      {
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: `Error getting user informatio: ${error.message}`,
      }),
      {
        status: 500,
      },
    )
  }
}
