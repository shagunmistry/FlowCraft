import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

export async function GET(request: NextRequest) {
  console.log('GET /auth/checkout: ', request.url.toString())
  const { searchParams } = new URL(request.url)

  console.log('GET /auth/checkout SEARCH PARAMS: ', searchParams.toString())

  const checkoutSessionId = searchParams.get('session_id')

  if (checkoutSessionId && process.env.STRIPE_SECRET_KEY) {
    const _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return redirect('/login')
    }

    const session = await _stripe.checkout.sessions.retrieve(checkoutSessionId)
    console.log('GET /auth/checkout: ', session)
    if (
      session &&
      session.payment_status === 'paid' &&
      session.mode === 'subscription'
    ) {
      // Check if user exists and is already subscribed. if user doesn't exist, create user
      const { data: checkUserData, error: checkUserError } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.user.email)

      if (checkUserError) {
        console.error('Error checking user', checkUserError)
        return redirect(
          '/error?message=Error checking user! Please contact support.',
        )
      }

      if (checkUserData.length === 0) {
        const { data: createUserData, error: createUserError } = await supabase
          .from('users')
          .insert([
            {
              email: data.user.email,
              subscribed: true,
              plan: session.subscription,
              date_subscribed: new Date().toISOString(),
            },
          ])
          .select('*')

        if (createUserError) {
          console.error('Error creating user', createUserError)
          return redirect(
            '/error?message=Error creating user! Please contact support.',
          )
        }
      }

      // update user subscription status in DB and redirect to dashboard
      const { data: userData, error } = await supabase
        .from('users')
        .update({
          subscribed: true,
          plan: session.subscription,
          date_subscribed: new Date().toISOString(),
        })
        .eq('email', data.user.email)
        .select('*')

      console.log('GET /auth/checkout AFTER Update: ', userData, error)
      if (error) {
        console.error('Error updating user subscription status', error)
        return redirect(
          '/error?message=Error updating user subscription status! Please contact support.',
        )
      }

      return redirect('/dashboard')
    } else {
      return redirect('/dashboard')
    }
  }
}
