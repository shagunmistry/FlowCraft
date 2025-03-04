'use client'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/20/solid'
import { tiers } from './Pricing.utils'
import SwitchButton from '../Switch'
import { useState } from 'react'
import Link from 'next/link'
import SimpleNotification from '../SimpleNotification'
import { loadStripe } from '@stripe/stripe-js'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

type PricingPageSource = 'landing' | 'dashboard' | 'mermaid' | 'chart'

const includedFeatures = [
  '20 Diagrams per month',
  'Access to Complex Diagram generation',
  'Export and Share',
  'Priority Customer support',
]

// Decorative element component
const DecorativeElement = ({ className }: { className?: string }) => (
  <motion.div
    className={cn(
      'absolute rounded-full bg-gradient-to-r from-fuchsia-300 to-indigo-300 opacity-70 blur-xl',
      className,
    )}
    animate={{
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.7, 0.5],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
)

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
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50 px-6 py-24 sm:py-16 lg:px-8">
      {/* Decorative elements */}
      <DecorativeElement className="-right-20 -top-20 h-64 w-64" />
      <DecorativeElement className="-left-32 bottom-40 h-80 w-80" />
      <DecorativeElement className="-bottom-20 right-1/4 h-72 w-72" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto max-w-2xl text-center lg:max-w-4xl"
      >
        {sourcePage === 'landing' ? (
          <>
            <p className="mt-2 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text font-serif text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Simple, transparent pricing.
            </p>
          </>
        ) : (
          <>
            <h2 className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text font-serif text-3xl font-bold text-transparent">
              {PricingHeaderMessage(sourcePage)}
            </h2>
          </>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-purple-700"
      >
        We offer monthly and yearly affordable plans to fit your creative needs.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mt-8 flex justify-center"
      >
        <SwitchButton
          enabled={yearly}
          setEnabled={setYearly}
          message="Yearly saves you 20%! 🎉"
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto mt-16 max-w-3xl sm:mt-20 lg:mx-0 lg:flex lg:max-w-none"
      >
        <Card className="overflow-hidden rounded-3xl border-0 shadow-xl ring-1 ring-purple-200">
          <div className="flex flex-col lg:flex-row">
            <motion.div
              variants={itemVariants}
              className="p-8 sm:p-10 lg:flex-auto"
            >
              <h3 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
                Hobby Membership
              </h3>
              <p className="mt-6 text-base leading-7 text-gray-700">
                Perfect for individual users and small teams who create diagrams
                for work, school, or personal projects.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-fuchsia-600">
                  What's included
                </h4>
                <div className="h-px flex-auto bg-purple-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-700 sm:grid-cols-2 sm:gap-6"
              >
                {includedFeatures.map((feature) => (
                  <motion.li
                    key={feature}
                    className="flex items-center gap-x-3"
                    variants={itemVariants}
                    whileHover={{
                      x: 5,
                      transition: { type: 'spring', stiffness: 300 },
                    }}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500">
                      <CheckIcon
                        className="h-4 w-4 text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-medium">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-8 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0"
            >
              <div className="flex h-full flex-col justify-center rounded-2xl bg-gradient-to-br from-white to-purple-50 py-10 text-center shadow-lg">
                <div className="mx-auto max-w-xs px-8">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 300,
                    }}
                  >
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <span className="bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text font-serif text-6xl font-bold tracking-tight text-transparent">
                        ${yearly ? '48.00' : '5.00'}
                      </span>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-purple-700">
                        USD
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-purple-700">
                      {yearly ? 'per year' : 'per month'}
                    </p>
                  </motion.div>

                  {shouldGoToCheckout ? (
                    <motion.div whileHover={{ y: -3 }} whileTap={{ y: 0 }}>
                      <Button
                        onClick={() =>
                          handleGoingToCheckout('tier-hobby', yearly)
                        }
                        className="mt-8 block w-full rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                      >
                        <span className="relative z-10">Get Started</span>
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ y: -3 }} whileTap={{ y: 0 }}>
                      <Link
                        href="/login"
                        className="mt-8 block w-full rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  )}

                  <div className="mt-6 flex items-center justify-center gap-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium text-purple-700">
                      Instant access to all features
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

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
