'use client'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/20/solid'
import { tiers } from './Pricing.utils'
import SwitchButton from '../Switch'
import { useState } from 'react'
import Link from 'next/link'
import SimpleNotification from '../SimpleNotification'
import { loadStripe } from '@stripe/stripe-js'

export default function PricingTemplate({
  sourcePage,
  shouldGoToCheckout,
}: {
  sourcePage: 'landing' | 'dashboard'
  shouldGoToCheckout?: boolean
}) {
  const [yearly, setYearly] = useState(false)

  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>(
    'success',
  )
  const [openNotification, setOpenNotification] = useState(false)

  const openErrorNotification = () => {
    setNotificationMessage(
      'There was an error processing your request. Please try again later.',
    )
    setNotificationType('error')
    setOpenNotification(true)
  }

  const openSuccessNotification = () => {
    setNotificationMessage('Success! Your request was processed.')
    setNotificationType('success')
    setOpenNotification(true)
  }

  const handleGoingToCheckout = async (id: string, isYearly: boolean) => {
    console.log('Going to checkout', id)
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
    )

    if (stripe) {
      const { id: sessionId } = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: id, isYearly: isYearly }),
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error('Error fetching checkout session', error)
          openErrorNotification()
          return { id: '' }
        })

      if (!sessionId) {
        openErrorNotification()
        return
      }

      console.log('Session ID', sessionId)
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        console.error('Error redirecting to checkout', error)
        openErrorNotification()
      }
    } else {
      openErrorNotification()
    }
  }

  return (
    <div className="relative isolate bg-gray-100 px-6 py-24 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        {sourcePage === 'landing' ? (
          <>
            <h2 className="leading-2 text-base font-semibold text-pink-500">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing.
            </p>
          </>
        ) : (
          <>
            <h2 className="leading-2 text-base font-semibold text-pink-500">
              To continue using FlowCraft, please choose a plan.
            </h2>
          </>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-2xl text-center text-lg leading-8 text-pink-600">
        We offer two flexible subscription plans to fit your needs.
      </p>
      <SwitchButton
        enabled={yearly}
        setEnabled={setYearly}
        message="Yearly saves you 20%! 🎉"
      />
      <div className="mx-auto mt-4 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-8 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cn(
              tier.featured
                ? 'relative bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-2xl'
                : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : 'transition-shadow duration-200 ease-in-out hover:shadow-lg',
              'rounded-3xl p-8',
            )}
          >
            <h3
              id={tier.id}
              className={
                tier.featured
                  ? 'text-2xl font-bold tracking-tight'
                  : 'text-2xl font-semibold tracking-tight text-gray-900'
              }
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={cn(
                  'text-5xl font-bold tracking-tight',
                  tier.featured ? 'text-white' : 'text-gray-900',
                )}
              >
                {yearly ? tier.price.annually : tier.price.monthly}
              </span>
              <span
                className={cn(tier.featured ? 'text-white' : 'text-gray-900')}
              >
                /{yearly ? 'year' : 'month'}
              </span>
            </p>
            <p
              className={cn(
                'mt-6 text-base leading-7',
                tier.featured ? 'text-white' : 'text-gray-900',
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={cn(
                'mt-6 text-base leading-7',
                tier.featured ? 'text-white' : 'text-gray-900',
              )}
            >
              {tier.mainFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className={cn(
                      tier.featured ? 'text-white' : 'text-gray-900',
                      'h-5 w-5 flex-shrink-0',
                    )}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            {shouldGoToCheckout ? (
              <button
                className={cn(
                  tier.featured
                    ? 'bg-white text-pink-600 hover:bg-pink-50'
                    : 'text-pink-600 ring-1 ring-inset ring-pink-200 hover:ring-pink-300',
                  'mt-8 block transform rounded-md px-3.5 py-2.5 text-center text-lg font-semibold transition-all duration-200 ease-in-out hover:scale-105',
                )}
                onClick={() => handleGoingToCheckout(tier.id, yearly)}
              >
                Get started today
              </button>
            ) : (
              <Link
                href={tier.href}
                aria-describedby={tier.id}
                className={cn(
                  tier.featured
                    ? 'bg-white text-pink-600 hover:bg-pink-50'
                    : 'text-pink-600 ring-1 ring-inset ring-pink-200 hover:ring-pink-300',
                  'mt-8 block transform rounded-md px-3.5 py-2.5 text-center text-lg font-semibold transition-all duration-200 ease-in-out hover:scale-105',
                )}
              >
                Get started today
              </Link>
            )}
          </div>
        ))}
      </div>

      <SimpleNotification
        message={notificationMessage}
        type={notificationType}
        title="FlowCraft"
        open={openNotification}
        setOpen={setOpenNotification}
      />
    </div>
  )
}
