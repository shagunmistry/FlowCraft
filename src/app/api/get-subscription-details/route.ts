import { createClient } from '@/lib/supabase-auth/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response('Stripe secret key not found', { status: 500 })
    }

    const _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const supabase = createClient()

    // Get subscription details based on the subscription id
    const { subscriptionId } = await req.json()

    const subscription = await _stripe.subscriptions.retrieve(subscriptionId)

    // Check if the user is subscribed the PRO plan or the HOBBY plan
    const plan = subscription.items.data[0].price.product

    return new Response(JSON.stringify({ plan }), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error getting subscription details' }),
      { status: 500 },
    )
  }
}
