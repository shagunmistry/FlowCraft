import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

export async function GET(request: NextRequest) {
  console.log('GET /auth/checkout: ', request.url.toString())
  const { searchParams } = new URL(request.url)

  console.log('GET /auth/checkout SEARCH PARAMS: ', searchParams.toString())

  const checkoutSessionId = searchParams.get('code')

  if (checkoutSessionId && process.env.STRIPE_SECRET_KEY) {
    const _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return redirect('/login')
    }

    const session = await _stripe.checkout.sessions.retrieve(checkoutSessionId)
    console.log('GET /auth/checkout: ', session)
    if (session && session.payment_status === 'paid') {
      // update user subscription status in DB and redirect to dashboard
      const { error } = await supabase
        .from('users')
        .update({
          subscribed: true,
          plan: session.subscription,
          date_subscribed: new Date().toISOString(),
        })
        .eq('user_id', data.user.id)

      if (error) {
        console.error('Error updating user subscription status', error)
        return redirect(
          '/error?message=Error updating user subscription status! Please contact support.',
        )
      }
    }

    return redirect('/dashboard')
  }
}
