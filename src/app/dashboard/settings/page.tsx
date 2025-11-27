'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserCircleIcon,
  CreditCardIcon,
  TrashIcon,
  ChevronLeftIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import ApiKeyManager from '@/components/ApiKeys/ApiKeyManager'

// --- Types ---
interface UserSettings {
  email: string
  user_id: string
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
}

// --- UI Components ---

const Section = ({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) => (
  <section className={clsx('mb-8', className)}>
    {title && (
      <h3 className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
    )}
    <div className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {children}
    </div>
  </section>
)

const Row = ({
  label,
  value,
  icon: Icon,
  action,
  className,
}: {
  label: string
  value?: string | React.ReactNode
  icon?: any
  action?: React.ReactNode
  className?: string
}) => (
  <div
    className={clsx(
      'flex min-h-[3.5rem] items-center justify-between p-4',
      className,
    )}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className="h-5 w-5 text-zinc-400" />}
      <span className="text-sm font-medium text-zinc-900">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {value && <span className="text-sm text-zinc-500">{value}</span>}
      {action}
    </div>
  </div>
)

const Button = ({
  children,
  onClick,
  variant = 'secondary',
  disabled,
  className,
}: any) => {
  const base =
    'px-4 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 disabled:opacity-50'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    outline: 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        base,
        variants[variant as keyof typeof variants],
        className,
      )}
    >
      {children}
    </button>
  )
}

// --- Main Page ---

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch settings')
      setSettings(data.settings)

      // Fetch subscription details if user is subscribed
      if (data.settings.subscription.subscribed) {
        try {
          const subResponse = await fetch('/api/subscription')
          const subData = await subResponse.json()
          if (subResponse.ok && subData.subscription) {
            setSubscriptionDetails(subData.subscription)
          }
        } catch (subError) {
          console.error('Failed to fetch subscription details:', subError)
        }
      }
    } catch (error: any) {
      if (error && error.toString().includes('Unauthorized')) {
        router.push('/login')
        return
      }
      toast.error(error.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true)
      const response = await fetch('/api/settings', { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || 'Failed to delete account')
      toast.success('Account deleted successfully')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setActionLoading(true)
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to cancel')
      toast.success('Subscription will be cancelled at period end')
      setShowCancelConfirm(false)
      await fetchSettings()
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      setActionLoading(true)
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reactivate' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to reactivate')
      toast.success('Subscription reactivated successfully')
      await fetchSettings()
    } catch (error: any) {
      toast.error(error.message || 'Failed to reactivate subscription')
    } finally {
      setActionLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setActionLoading(true)
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'portal' }),
      })
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || 'Failed to open portal')
      window.location.href = data.url
    } catch (error: any) {
      toast.error(error.message || 'Failed to open subscription portal')
      setActionLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
          <p className="text-sm font-medium text-zinc-500">
            Loading settings...
          </p>
        </div>
      </div>
    )
  }

  // --- Error State ---
  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="max-w-sm text-center">
          <ExclamationCircleIcon className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
          <h2 className="font-semibold text-zinc-900">
            Unable to load settings
          </h2>
          <p className="mb-4 mt-1 text-sm text-zinc-500">
            We couldn't retrieve your account information at this time.
          </p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 pt-14">
      {/* Navigation Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="-ml-2 flex items-center gap-1 rounded-lg px-2 py-1 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-blue-600"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <h1 className="text-base font-semibold text-zinc-900">Settings</h1>
          <div className="w-16" /> {/* Spacer for visual balance */}
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl px-4 py-8"
      >
        {/* Profile Header */}
        <div className="mb-8 flex items-center gap-4 px-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-zinc-400">
            <UserCircleIcon className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              {settings.email}
            </h2>
            <p className="text-sm text-zinc-500">
              Member since {new Date(settings.created_at).getFullYear()}
            </p>
          </div>
        </div>

        {/* Account Details */}
        <Section title="Account">
          <Row label="Email" value={settings.email} />
          <Row
            label="User ID"
            value={
              <code className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600">
                {settings.user_id}
              </code>
            }
          />
          <Row
            label="Joined"
            value={formatDate(settings.created_at)}
            icon={CalendarDaysIcon}
          />
        </Section>

        {/* Subscription */}
        <Section title="Subscription">
          <Row
            label="Current Plan"
            value={
              <span
                className={clsx(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  settings.subscription.subscribed
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-zinc-100 text-zinc-600',
                )}
              >
                {settings.subscription.plan || 'Free Plan'}
              </span>
            }
            icon={CreditCardIcon}
          />

          <Row
            label="Status"
            value={
              <div className="flex items-center gap-1.5">
                {settings.subscription.subscribed ? (
                  <>
                    <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-700">
                      {subscriptionDetails?.cancel_at_period_end
                        ? 'Cancelling'
                        : 'Active'}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-500">Inactive</span>
                )}
              </div>
            }
            action={
              settings.subscription.subscribed ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleManageSubscription}
                    disabled={actionLoading}
                    variant="primary"
                  >
                    {actionLoading ? 'Loading...' : 'Manage'}
                  </Button>
                  {subscriptionDetails?.cancel_at_period_end ? (
                    <Button
                      onClick={handleReactivateSubscription}
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

          {settings.subscription.subscribed && (
            <>
              <Row
                label="Subscribed Since"
                value={formatDate(settings.subscription.date_subscribed)}
              />
              {settings.subscription.date_cancelled && (
                <Row
                  label="Expires On"
                  value={formatDate(settings.subscription.date_cancelled)}
                  className="text-amber-600"
                />
              )}
            </>
          )}
        </Section>

        {/* API Keys Section */}
        <Section title="Developer">
          <div className="p-4">
            <ApiKeyManager />
          </div>
        </Section>

        {/* Preferences / Info Placeholder */}
        <Section title="Preferences">
          <div className="flex gap-3 p-4">
            <div className="mt-0.5">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">
                More settings coming soon
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Profile customization features will be available in a future
                update.
              </p>
            </div>
          </div>
        </Section>

        {/* Cancel Subscription Confirmation */}
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
                className="max-w-md rounded-xl border border-amber-200 bg-white p-6 shadow-xl"
              >
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                  Cancel Subscription?
                </h3>
                <p className="mb-4 text-sm text-zinc-600">
                  Your subscription will remain active until the end of the
                  current billing period. You can reactivate anytime before
                  then.
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
                    onClick={handleCancelSubscription}
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

        {/* Danger Zone */}
        <div className="mt-10 px-2">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="mx-auto flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
              Delete Account
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-sm rounded-xl border border-red-100 bg-red-50 p-4 text-center"
            >
              <h3 className="mb-1 text-sm font-semibold text-red-900">
                Delete Account?
              </h3>
              <p className="mb-4 text-xs text-red-700">
                This action is permanent and cannot be undone. All your data
                will be lost.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="secondary"
                  className="border border-zinc-200 bg-white hover:bg-zinc-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  variant="danger"
                  className="border-transparent bg-red-600 text-white hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  )
}
