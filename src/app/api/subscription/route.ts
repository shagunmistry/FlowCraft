import { createClient } from '@/lib/supabase-auth/server'
import stripe from '@/lib/stripe'
import { NextRequest } from 'next/server'

/**
 * GET endpoint to fetch current subscription details
 */
export async function GET() {
  try {
    const supabaseClient = await createClient()
    const { data: userData, error: authError } =
      await supabaseClient.auth.getUser()

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

    if (dbError || !userInfo) {
      return new Response(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (!userInfo.subscribed || !userInfo.plan) {
      return new Response(
        JSON.stringify({
          subscription: null,
          message: 'No active subscription',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    try {
      // Fetch subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(userInfo.plan)

      return new Response(
        JSON.stringify({
          subscription: {
            id: subscription.id,
            status: subscription.status,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
            plan: subscription.items.data[0]?.price.id,
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    } catch (stripeError: any) {
      console.error('Error fetching subscription from Stripe:', stripeError)
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch subscription details',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  } catch (error: any) {
    console.error('Error in GET /api/subscription:', error)
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
 * POST endpoint to manage subscriptions
 * Supports: cancel, portal
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const supabaseClient = await createClient()
    const { data: userData, error: authError } =
      await supabaseClient.auth.getUser()

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

    if (dbError || !userInfo) {
      return new Response(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (!userInfo.subscribed || !userInfo.plan) {
      return new Response(
        JSON.stringify({
          error: 'No active subscription found',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Handle different actions
    if (action === 'cancel') {
      try {
        // Cancel the subscription at period end
        const subscription = await stripe.subscriptions.update(userInfo.plan, {
          cancel_at_period_end: true,
        })

        // Update database
        await supabaseClient
          .from('users')
          .update({
            date_cancelled: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
          })
          .eq('user_id', userData.user.id)

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Subscription will be cancelled at period end',
            cancel_at: new Date(subscription.current_period_end * 1000),
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      } catch (stripeError: any) {
        console.error('Error cancelling subscription:', stripeError)
        return new Response(
          JSON.stringify({
            error: `Failed to cancel subscription: ${stripeError.message}`,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    } else if (action === 'reactivate') {
      try {
        // Reactivate the subscription
        const subscription = await stripe.subscriptions.update(userInfo.plan, {
          cancel_at_period_end: false,
        })

        // Update database
        await supabaseClient
          .from('users')
          .update({
            date_cancelled: null,
          })
          .eq('user_id', userData.user.id)

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Subscription reactivated successfully',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      } catch (stripeError: any) {
        console.error('Error reactivating subscription:', stripeError)
        return new Response(
          JSON.stringify({
            error: `Failed to reactivate subscription: ${stripeError.message}`,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    } else if (action === 'portal') {
      try {
        // Get the subscription to find the customer ID
        const subscription = await stripe.subscriptions.retrieve(userInfo.plan)

        if (!subscription.customer) {
          return new Response(
            JSON.stringify({
              error: 'No customer found for this subscription',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }

        const isLocal = process.env.NODE_ENV === 'development'
        const returnUrl = isLocal
          ? 'http://localhost:3000/dashboard/settings'
          : 'https://flowcraft.app/dashboard/settings'

        // Create a portal session
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: subscription.customer as string,
          return_url: returnUrl,
        })

        return new Response(
          JSON.stringify({
            url: portalSession.url,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      } catch (stripeError: any) {
        console.error('Error creating portal session:', stripeError)
        return new Response(
          JSON.stringify({
            error: `Failed to create portal session: ${stripeError.message}`,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    } else {
      return new Response(
        JSON.stringify({
          error: 'Invalid action',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  } catch (error: any) {
    console.error('Error in POST /api/subscription:', error)
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
