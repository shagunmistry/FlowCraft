import { createClient } from '@/lib/supabase-auth/server'
import { NextRequest } from 'next/server'

/**
 * GET endpoint to fetch user settings
 * Returns user profile information and preferences
 */
export async function GET() {
  try {
    const supabaseClient = await createClient()
    const { data: userData, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized - User not authenticated',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Fetch user information from the database
    const { data: userInfo, error: dbError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('user_id', userData.user.id)
      .single()

    if (dbError) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch user settings: ${dbError.message}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('Fetched user info:', userInfo)

    // Combine auth data with database user info
    const settings = {
      email: userData.user.email || userInfo?.email,
      user_id: userInfo?.user_id,
      subscription: {
        plan: userInfo?.subscribed ? 'pro' : 'free',
        subscribed: userInfo?.subscribed || false,
        date_subscribed: userInfo?.date_subscribed,
        date_cancelled: userInfo?.date_cancelled,
      },
      created_at: userInfo?.created_at,
    }

    return new Response(JSON.stringify({ settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return new Response(
      JSON.stringify({
        error: `Internal server error: ${error.message}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

/**
 * PATCH endpoint to update user settings
 * Note: Based on current schema, most fields are managed by the system
 * This endpoint is reserved for future extensibility
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabaseClient = await createClient()
    const { data: userData, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized - User not authenticated',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Currently, all fields in the users table are system-managed
    // plan, subscribed, date_subscribed, date_cancelled are managed by payment system
    // This endpoint exists for future extensibility when user-editable fields are added

    return new Response(
      JSON.stringify({
        message: 'Settings are currently managed by the system. User profile fields will be available in a future update.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return new Response(
      JSON.stringify({
        error: `Internal server error: ${error.message}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

/**
 * DELETE endpoint to delete user account
 * This is a destructive operation that removes all user data
 */
export async function DELETE() {
  try {
    const supabaseClient = await createClient()
    const { data: userData, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized - User not authenticated',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Delete user's diagrams first (cascade delete)
    const { error: diagramsError } = await supabaseClient
      .from('diagrams')
      .delete()
      .eq('user_id', userData.user.id)

    if (diagramsError) {
      console.error('Error deleting diagrams:', diagramsError)
    }

    // Delete user record from database
    const { error: deleteError } = await supabaseClient
      .from('users')
      .delete()
      .eq('user_id', userData.user.id)

    if (deleteError) {
      return new Response(
        JSON.stringify({
          error: `Failed to delete account: ${deleteError.message}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Delete from Supabase Auth
    const { error: authDeleteError } = await supabaseClient.auth.admin.deleteUser(
      userData.user.id,
    )

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError)
      // Continue anyway as database user is already deleted
    }

    return new Response(
      JSON.stringify({
        message: 'Account deleted successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('Error deleting account:', error)
    return new Response(
      JSON.stringify({
        error: `Internal server error: ${error.message}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
