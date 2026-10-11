'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCardIcon,
  CheckBadgeIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Section, Row, Button } from './SettingsUI'

interface UserSettings {
  email: string
  user_id: string
  display_name: string | null
  subscription: {
    plan: string
    subscribed: boolean
    date_subscribed: string | null
    date_cancelled: string | null
  }
  created_at: string
}

interface SubscriptionDetails {
  id: string
  status: string
  current_period_end: number
  cancel_at_period_end: boolean
  plan: string
  planName: string | null
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function SubscriptionSection({
  settings,
  subscriptionDetails,
  onCancel,
  onReactivate,
  onManage,
  actionLoading,
}: {
  settings: UserSettings
  subscriptionDetails: SubscriptionDetails | null
  onCancel: () => Promise<void>
  onReactivate: () => Promise<void>
  onManage: () => Promise<void>
  actionLoading: boolean
}) {
  const router = useRouter()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const hasActiveSubscription =
    subscriptionDetails &&
    (subscriptionDetails.status === 'active' ||
      (subscriptionDetails.cancel_at_period_end &&
        subscriptionDetails.current_period_end * 1000 > Date.now()))

  const handleCancel = async () => {
    await onCancel()
    setShowCancelConfirm(false)
  }

  return (
    <div>
      {/* Free user upgrade CTA */}
      {!hasActiveSubscription && (
        <div className="mb-8 overflow-hidden rounded-xl bg-signal p-6 text-ink">
          <h3 className="text-lg font-semibold">Upgrade to Pro</h3>
          <p className="mt-1 text-sm text-indigo-100">
            Unlock unlimited AI-generated diagrams, priority support, and more.
          </p>
          <button
            onClick={() => router.push('/pricing?sourcePage=dashboard')}
            className="mt-4 rounded-full bg-graphite px-6 py-2 text-sm font-semibold text-signal transition-transform hover:scale-105 active:scale-95"
          >
            View Plans
          </button>
        </div>
      )}

      <Section title="Current Plan">
        <Row
          label="Plan"
          value={
            <span
              className={clsx(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                hasActiveSubscription
                  ? 'bg-signal/10 text-signal'
                  : 'bg-ink text-fog',
              )}
            >
              {hasActiveSubscription
                ? subscriptionDetails?.planName ||
                  settings.subscription.plan ||
                  'Pro'
                : 'Free Plan'}
            </span>
          }
          icon={CreditCardIcon}
        />

        <Row
          label="Status"
          value={
            <div className="flex items-center gap-1.5">
              {hasActiveSubscription ? (
                <>
                  <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-700">
                    {subscriptionDetails?.cancel_at_period_end
                      ? 'Cancelling'
                      : 'Active'}
                  </span>
                </>
              ) : (
                <span className="text-fog">Inactive</span>
              )}
            </div>
          }
          action={
            hasActiveSubscription ? (
              <div className="flex gap-2">
                <Button
                  onClick={onManage}
                  disabled={actionLoading}
                  variant="primary"
                >
                  {actionLoading ? 'Loading...' : 'Manage'}
                </Button>
                {subscriptionDetails?.cancel_at_period_end ? (
                  <Button
                    onClick={onReactivate}
                    disabled={actionLoading}
                    variant="secondary"
                  >
                    Reactivate
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={actionLoading}
                    variant="danger"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            ) : (
              <Button
                onClick={() => router.push('/pricing?sourcePage=dashboard')}
                variant="primary"
              >
                Upgrade
              </Button>
            )
          }
        />

        {hasActiveSubscription && (
          <>
            <Row
              label="Subscribed Since"
              value={formatDate(settings.subscription.date_subscribed)}
            />
            {subscriptionDetails?.cancel_at_period_end &&
              settings.subscription.date_cancelled && (
                <Row
                  label="Expires On"
                  value={formatDate(settings.subscription.date_cancelled)}
                  className="text-amber-600"
                />
              )}
          </>
        )}
      </Section>

      {/* Billing Portal */}
      {hasActiveSubscription && (
        <Section title="Billing">
          <div className="p-4">
            <p className="text-sm text-fog">
              Manage your payment methods, view invoices, and update billing
              information through the Stripe billing portal.
            </p>
            <button
              onClick={onManage}
              disabled={actionLoading}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-signal transition-colors hover:text-signal disabled:opacity-50"
            >
              Open Billing Portal
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </button>
          </div>
        </Section>
      )}

      {/* Cancel Subscription Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md rounded-xl border border-amber-200 bg-graphite p-6 shadow-xl"
            >
              <h3 className="mb-2 text-lg font-semibold text-paper">
                Cancel Subscription?
              </h3>
              <p className="mb-4 text-sm text-fog">
                Your subscription will remain active until the end of the
                current billing period. You can reactivate anytime before then.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={() => setShowCancelConfirm(false)}
                  variant="secondary"
                  disabled={actionLoading}
                >
                  Keep Subscription
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  variant="danger"
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Subscription'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
