'use client'

import { cn } from '@/lib/utils'
import type { PricingTier } from '@/lib/pricing'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import SimpleNotification from '../SimpleNotification'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'

type PricingPageSource = 'landing' | 'dashboard' | 'mermaid' | 'chart'

export default function PricingTemplate({
  sourcePage,
  shouldGoToCheckout,
  tiers,
}: {
  sourcePage: PricingPageSource
  shouldGoToCheckout?: boolean
  tiers: PricingTier[]
}) {
  const [yearly, setYearly] = useState(false)
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>(
    'success',
  )
  const [openNotification, setOpenNotification] = useState(false)

  useEffect(() => {
    track('pricing_viewed', { source: sourcePage })
  }, [sourcePage])

  const openErrorNotification = () => {
    setNotificationMessage(
      'There was an error processing your request. Please try again later.',
    )
    setNotificationType('error')
    setOpenNotification(true)
  }

  const handleGoingToCheckout = async (
    id: 'tier-pro' | 'tier-hobby' | 'tier-teams',
    isYearly: boolean,
  ) => {
    if (loadingTier) return
    setLoadingTier(id)
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data && !!data.error) {
        window.location.href = '/login'
        return
      }

      if (data && data.user && data.user.subscribed) {
        setNotificationMessage('You are already subscribed to a plan.')
        setNotificationType('success')
        setOpenNotification(true)
        return
      }

      track('checkout_started', {
        tier: id,
        interval: isYearly ? 'yearly' : 'monthly',
        source: sourcePage,
      })

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
      )

      if (!stripe) {
        openErrorNotification()
        return
      }

      const { id: sessionId } = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: id, isYearly }),
      })
        .then((res) => res.json())
        .catch(() => {
          openErrorNotification()
          return { id: '' }
        })

      if (!sessionId) {
        openErrorNotification()
        return
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        openErrorNotification()
      }
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <div className="relative min-h-screen bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-24 opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-48 h-[520px] w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--color-signal) / 0.10), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 pb-24 pt-24 lg:px-8 lg:pt-32">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.01em] text-paper md:text-7xl">
              Straight lines,
              <br />
              <span className="italic text-signal">fair rates</span>
              <span className="text-paper">.</span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-lg leading-relaxed text-paper/60">
              Draft as much as you want on the free tier. Step up to Pro when
              your ideas need more volume, or when the team catches on.
            </p>
          </div>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-14 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => setYearly(false)}
            className={cn(
              'rounded-sm px-5 py-2 text-sm font-medium transition-colors',
              !yearly
                ? 'bg-signal text-ink'
                : 'border border-rule text-paper/60 hover:text-paper',
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={cn(
              'relative rounded-sm px-5 py-2 text-sm font-medium transition-colors',
              yearly
                ? 'bg-signal text-ink'
                : 'border border-rule text-paper/60 hover:text-paper',
            )}
          >
            Annual
            <span
              className={cn(
                'absolute -top-2 -right-2 rounded-sm border px-1.5 py-0.5 text-[10px]',
                yearly
                  ? 'border-ink bg-ink text-signal'
                  : 'border-signal bg-ink text-signal',
              )}
            >
              −17%
            </span>
          </button>
        </motion.div>

        {/* Tiers */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.4 },
            },
          }}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule lg:grid-cols-3"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'group relative flex flex-col bg-graphite p-8 transition-colors duration-300',
                tier.featured ? 'bg-ink' : 'hover:bg-ink',
              )}
            >
              {tier.featured && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgb(var(--color-signal) / 0.12) 1px, transparent 1px)',
                    backgroundSize: '14px 14px',
                  }}
                />
              )}
              {tier.featured && <TierCornerTicks />}

              {tier.featured && (
                <div className="relative flex items-center justify-end text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5 text-signal">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                    Recommended
                  </span>
                </div>
              )}

              <div className="relative mt-8 flex-1">
                <h3 className="font-serif text-4xl text-paper">{tier.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">
                  {tier.description}
                </p>

                <div className="mt-8 flex items-baseline gap-1.5 border-y border-rule py-6">
                  <span className="font-serif text-6xl text-paper">
                    {yearly ? tier.price.annually : tier.price.monthly}
                  </span>
                  <span className="text-xs text-fog">
                    /{yearly ? 'yr' : 'mo'}
                  </span>
                </div>

                <ul className="mt-8 space-y-3.5">
                  {tier.mainFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-paper/80"
                    >
                      <span className="mt-1.5 inline-block h-px w-4 flex-none bg-signal" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-10">
                {tier.id === 'tier-teams' ? (
                  <Link
                    href="/support"
                    className="group/cta flex w-full items-center justify-center rounded-sm border border-rule bg-transparent px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-signal/50 hover:text-signal"
                  >
                    <span>{tier.cta}</span>
                  </Link>
                ) : shouldGoToCheckout ? (
                  <button
                    onClick={() =>
                      handleGoingToCheckout(
                        tier.id as 'tier-hobby' | 'tier-pro',
                        yearly,
                      )
                    }
                    disabled={loadingTier !== null}
                    className={cn(
                      'group/cta flex w-full items-center justify-center rounded-sm px-5 py-3 text-sm font-medium transition-colors',
                      tier.featured
                        ? 'bg-signal text-ink hover:bg-paper'
                        : 'border border-rule text-paper hover:border-signal/50 hover:text-signal',
                      loadingTier !== null &&
                        loadingTier !== tier.id &&
                        'opacity-40',
                      loadingTier === tier.id && 'opacity-80',
                    )}
                  >
                    {loadingTier === tier.id ? (
                      <>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              'h-1.5 w-1.5 animate-pulse rounded-full',
                              tier.featured ? 'bg-ink' : 'bg-signal',
                            )}
                          />
                          Redirecting…
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Upgrade</span>
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={tier.href}
                    className={cn(
                      'group/cta flex w-full items-center justify-center rounded-sm px-5 py-3 text-sm font-medium transition-colors',
                      tier.featured
                        ? 'bg-signal text-ink hover:bg-paper'
                        : 'border border-rule text-paper hover:border-signal/50 hover:text-signal',
                    )}
                  >
                    <span>{tier.cta}</span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Common features strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-3xl rounded-sm border border-rule bg-graphite/60 p-8"
        >
          <div className="text-sm font-medium text-fog">
            Included in every tier
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
            {[
              'Export PNG / SVG / PDF',
              'Share & collaborate',
              'Customer support',
              'Regular updates',
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm text-paper/70"
              >
                <span className="inline-block h-px w-4 bg-signal" />
                {f}
              </div>
            ))}
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

function TierCornerTicks() {
  return (
    <>
    </>
  )
}
