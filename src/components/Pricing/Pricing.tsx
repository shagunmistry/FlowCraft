'use client'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/20/solid'
import { tiers } from './Pricing.utils'
import SwitchButton from '../Switch'
import { useState } from 'react'
import Link from 'next/link'
import SimpleNotification from '../SimpleNotification'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

type PricingPageSource = 'landing' | 'dashboard' | 'mermaid' | 'chart'

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
    id: 'tier-pro' | 'tier-hobby' | 'tier-teams',
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

    if(data && data.user && data.user.subscribed) {
      // User is already subscribed
      setNotificationMessage('You are already subscribed to a plan.')
      setNotificationType('success')
      setOpenNotification(true)
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gray-50/50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
        >
          {sourcePage === 'landing' ? (
            <>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Choose the plan that fits your needs. All plans include core features.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {PricingHeaderMessage(sourcePage)}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Select a plan to continue using FlowCraft
              </p>
            </>
          )}
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <div className="rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-200">
            <SwitchButton
              enabled={yearly}
              setEnabled={setYearly}
              message="Save 17% with annual billing"
            />
          </div>
        </motion.div>

        {/* Pricing Tiers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-3"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={cn(
                'relative flex flex-col rounded-2xl bg-white p-8 shadow-sm transition-all duration-300',
                tier.featured
                  ? 'border-2 border-gray-900 ring-1 ring-gray-900/5 hover:shadow-lg'
                  : 'border border-gray-200 hover:border-gray-300 hover:shadow-md',
              )}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                  {tier.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{tier.description}</p>

                <div className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {yearly ? tier.price.annually : tier.price.monthly}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {yearly ? '/year' : '/month'}
                  </span>
                </div>

                {/* Features */}
                <ul role="list" className="mt-8 space-y-3">
                  {tier.mainFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-x-3">
                      <CheckIcon
                        className="h-5 w-5 flex-none text-gray-900"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                {tier.id === 'tier-teams' ? (
                  <Link
                    href="/support"
                    className="block w-full rounded-full border border-gray-300 bg-white px-6 py-3 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    {tier.cta}
                  </Link>
                ) : shouldGoToCheckout ? (
                  <Button
                    onClick={() =>
                      handleGoingToCheckout(
                        tier.id as 'tier-hobby' | 'tier-pro',
                        yearly,
                      )
                    }
                    className={cn(
                      'block w-full rounded-full px-6 py-3 text-sm font-medium transition-all',
                      tier.featured
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-900 text-white hover:bg-gray-800',
                    )}
                  >
                    {tier.cta}
                  </Button>
                ) : (
                  <Link
                    href={tier.href}
                    className={cn(
                      'block w-full rounded-full px-6 py-3 text-center text-sm font-medium transition-all',
                      tier.featured
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-900 text-white hover:bg-gray-800',
                    )}
                  >
                    {tier.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-gray-900">
              All plans include
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <span className="flex items-center gap-x-2">
                <CheckIcon className="h-4 w-4 text-gray-900" />
                Export diagrams
              </span>
              <span className="flex items-center gap-x-2">
                <CheckIcon className="h-4 w-4 text-gray-900" />
                Share & collaborate
              </span>
              <span className="flex items-center gap-x-2">
                <CheckIcon className="h-4 w-4 text-gray-900" />
                Customer support
              </span>
              <span className="flex items-center gap-x-2">
                <CheckIcon className="h-4 w-4 text-gray-900" />
                Regular updates
              </span>
            </div>
          </div>
        </motion.div>
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
