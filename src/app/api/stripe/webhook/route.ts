import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Use the service-role Supabase client since webhooks have no user session
function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_PRIVATE_KEY!,
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing signature' }), {
      status: 400,
    })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
    })
  }

  const supabase = getSupabaseAdmin()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.customer_email) {
          // Backup handler: update user if the redirect didn't catch it
          const { error } = await supabase
            .from('users')
            .update({
              subscribed: true,
              plan: session.subscription as string,
              date_subscribed: new Date().toISOString(),
            })
            .eq('email', session.customer_email)

          if (error) {
            console.error(
              'Webhook: Error updating user on checkout.session.completed',
              error,
            )
            throw new Error(
              'Webhook: Error updating user on checkout.session.completed: ' +
                error.message,
            )
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        const updateData: Record<string, any> = {
          subscribed: subscription.status === 'active',
        }

        if (subscription.cancel_at_period_end) {
          updateData.date_cancelled = new Date(
            subscription.current_period_end * 1000,
          ).toISOString()
        } else {
          updateData.date_cancelled = null
        }

        const { error } = await supabase
          .from('users')
          .update(updateData)
          .eq('plan', subscription.id)

        if (error) {
          console.error('Webhook: Error updating user on subscription.updated', error)
          throw new Error('Webhook: Error updating user on subscription.updated' + ': ' + error.message)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const { error } = await supabase
          .from('users')
          .update({
            subscribed: false,
            date_cancelled: new Date().toISOString(),
          })
          .eq('plan', subscription.id)

        if (error) {
          console.error('Webhook: Error updating user on subscription.deleted', error)
          throw new Error('Webhook: Error updating user on subscription.deleted' + ': ' + error.message)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId =
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription?.id

        if (subscriptionId) {
          console.warn(
            `Webhook: Payment failed for subscription ${subscriptionId}`,
          )
          // Don't immediately unsubscribe — Stripe will retry.
          // The subscription.deleted event handles final cancellation.
        }
        break
      }

      default:
        // Unhandled event type — ignore
        break
    }
  } catch (err: any) {
    console.error(`Webhook handler error for ${event.type}:`, err.message)
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
