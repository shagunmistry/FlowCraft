import stripe from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { product, isYearly } = await req.json()

    let productId = process.env.STRIPE_PRO_PLAN_ID

    if (product === 'tier-hobby') {
      if (isYearly) {
        productId = process.env.STRIPE_HOBBY_YEARLY_PLAN_ID
      } else {
        productId = process.env.STRIPE_HOBBY_MONTHLY_PLAN_ID
      }
    }

    if (product === 'tier-pro') {
      if (isYearly) {
        productId = process.env.STRIPE_PRO_YEARLY_PLAN_ID
      } else {
        productId = process.env.STRIPE_PRO_MONTHLY_PLAN_ID
      }
    }

    const isLocal = process.env.NODE_ENV === 'development'
    const base_url = isLocal ? 'http://localhost:3000' : 'https://flowcraft.app'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: productId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${base_url}/auth/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base_url}/dashboard`,
    })

    return new Response(JSON.stringify({ id: session.id }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: `Error creating checkout session: ${error.message}`,
      }),
      {
        status: 500,
      },
    )
  }
}
