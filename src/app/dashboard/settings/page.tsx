'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  UserCircleIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import PageLoader from '@/components/PageLoader'
import toast from 'react-hot-toast'

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

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch settings')
      }

      setSettings(data.settings)
    } catch (error: any) {
      console.error('Error fetching settings:', error)
      toast.error(error.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true)
      const response = await fetch('/api/settings', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      toast.success('Account deleted successfully')
      router.push('/login')
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setDeleting(false)
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

  if (loading) {
    return <PageLoader />
  }

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Failed to load settings</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-violet-600 hover:text-violet-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-200 bg-white/80 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 mt-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-slate-600 transition-colors hover:text-violet-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="hidden h-6 w-px bg-slate-300 sm:block"></div>
              <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Account Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-6 w-6 text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Account Information
                </h2>
              </div>
            </div>
            <div className="space-y-6 px-6 py-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700">
                    {settings.email}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    User ID
                  </label>
                  <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 font-mono text-xs text-slate-600">
                    {settings.user_id}
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  <CalendarIcon className="mr-1 inline h-4 w-4" />
                  Account Created
                </label>
                <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-700">
                  {formatDate(settings.created_at)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-6 w-6 text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Subscription
                </h2>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-900">
                      Current Plan
                    </h3>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-100 to-red-100 px-3 py-1 text-sm font-semibold text-violet-700">
                        {settings.subscription.plan || 'Free'}
                      </span>
                      {settings.subscription.subscribed ? (
                        <span className="inline-flex items-center text-sm text-green-600">
                          <CheckCircleIcon className="mr-1 h-4 w-4" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-sm text-slate-500">
                          <XCircleIcon className="mr-1 h-4 w-4" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/pricing')}
                    className="rounded-lg bg-gradient-to-r from-violet-600 to-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-violet-200/50"
                  >
                    Upgrade Plan
                  </button>
                </div>

                {settings.subscription.subscribed && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Subscribed Since
                      </label>
                      <div className="text-sm font-medium text-slate-700">
                        {formatDate(settings.subscription.date_subscribed)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Cancellation Date
                      </label>
                      <div className="text-sm font-medium text-slate-700">
                        {settings.subscription.date_cancelled
                          ? formatDate(settings.subscription.date_cancelled)
                          : 'Not cancelled'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm"
          >
            <div className="border-b border-red-200 bg-red-50/50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <TrashIcon className="h-6 w-6 text-red-600" />
                <h2 className="text-lg font-semibold text-red-900">
                  Danger Zone
                </h2>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                <h3 className="text-sm font-medium text-red-900">
                  Delete Account
                </h3>
                <p className="mt-1 mb-4 text-sm text-red-700">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-red-900">
                      Are you absolutely sure? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Deleting...
                          </>
                        ) : (
                          'Yes, Delete My Account'
                        )}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border border-blue-200 bg-blue-50 p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Additional profile customization features (name, bio, avatar,
                  preferences) will be available in a future update.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
