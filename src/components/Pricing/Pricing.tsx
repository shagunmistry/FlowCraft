'use client'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/20/solid'
import { tiers } from './Pricing.utils'
import SwitchButton from '../Switch'
import { useState } from 'react'
import Link from 'next/link'
import SimpleNotification from '../SimpleNotification'
import { loadStripe } from '@stripe/stripe-js'

type PricingPageSource = 'landing' | 'dashboard' | 'mermaid' | 'chart'

const includedFeatures = [
  '20 Diagrams per month',
  'Access to Complex Diagram generation',
  'Export and Share',
  'Priority Customer support',
]

const PricingHeaderMessage = (sourcePage: PricingPageSource) => {
  switch (sourcePage) {
    case 'landing':
      return 'Simple, transparent pricing.'
    case 'dashboard':
      return 'To continue using FlowCraft, please choose a plan.'
    case 'mermaid':
      return 'To create complex diagrams, please choose a plan.'
    case 'chart':
      return 'To create charts, please choose a plan.'
    default:
      return 'To use FlowCraft, please choose a plan.'
  }
}

export default function PricingTemplate({
  sourcePage,
  shouldGoToCheckout,
}: {
  sourcePage: PricingPageSource
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

  const handleGoingToCheckout = async (
    id: 'tier-pro' | 'tier-hobby',
    isYearly: boolean,
  ) => {
    console.log('Going to checkout', id)

    // Make sure user is logged in
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    console.log('User data', data)

    if (data && !!data.error) {
      // Send them to Login page
      window.location.href = '/login'
      return
    }

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
            <p className="mt-2 text-4xl font-bold tracking-tight text-pink-500 sm:text-5xl">
              Simple, transparent pricing.
            </p>
          </>
        ) : (
          <>
            <h2 className="leading-2 text-2xl font-semibold text-pink-500">
              {PricingHeaderMessage(sourcePage)}
            </h2>
          </>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-2xl text-center text-lg leading-8 text-pink-600">
        We offer a monthly and yearly affordable plan to fit your needs.
      </p>
      <SwitchButton
        enabled={yearly}
        setEnabled={setYearly}
        message="Yearly saves you 20%! 🎉"
      />
      <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-pink-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Hobby Membership
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Perfect for individual users and small teams who create diagrams for
            work, school, or personal projects.
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-pink-600">
              What’s included
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
          >
            {includedFeatures.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-pink-600"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-gray-50 py-10 text-center shadow-lg ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-pink-500">
                  ${yearly ? '48.00' : '5.00'}
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-pink-600">
                  USD
                </span>
              </p>
              {shouldGoToCheckout ? (
                <button
                  onClick={() => handleGoingToCheckout('tier-hobby', yearly)}
                  className="mt-10 block w-full rounded-md bg-pink-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                >
                  Get Started
                </button>
              ) : (
                <Link
                  href="/login"
                  className="mt-10 block w-full rounded-md bg-pink-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                >
                  Get Started
                </Link>
              )}
              <p className="mt-6 text-xs leading-5 text-gray-600">Per month</p>
            </div>
          </div>
        </div>
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
