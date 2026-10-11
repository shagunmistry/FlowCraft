'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import SettingsShell from '@/components/Settings/SettingsShell'
import ProfileSection from '@/components/Settings/ProfileSection'
import SubscriptionSection from '@/components/Settings/SubscriptionSection'
import ApiKeysSection from '@/components/Settings/ApiKeysSection'
import AccountSection from '@/components/Settings/AccountSection'
import { Button } from '@/components/Settings/SettingsUI'
import type { TabId } from '@/components/Settings/SettingsTabs'

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

const VALID_TABS: TabId[] = ['profile', 'billing', 'api-keys', 'account']

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-rule border-t-blue-600" />
            <p className="text-sm font-medium text-fog">
              Loading settings...
            </p>
          </div>
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  )
}

function SettingsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tabParam = searchParams.get('tab') as TabId | null
  const initialTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'profile'

  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.replaceState({}, '', url.toString())
  }

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch settings')
      setSettings(data.settings)

      try {
        const subResponse = await fetch('/api/subscription')
        const subData = await subResponse.json()
        if (subResponse.ok && subData.subscription) {
          setSubscriptionDetails(subData.subscription)
        }
      } catch (subError) {
        console.error('Failed to fetch subscription details:', subError)
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

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/settings', { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || 'Failed to delete account')
      toast.success('Account deleted successfully')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rule border-t-blue-600" />
          <p className="text-sm font-medium text-fog">
            Loading settings...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink p-4">
        <div className="max-w-sm text-center">
          <ExclamationCircleIcon className="mx-auto mb-3 h-10 w-10 text-fog" />
          <h2 className="font-semibold text-paper">
            Unable to load settings
          </h2>
          <p className="mb-4 mt-1 text-sm text-fog">
            We couldn&apos;t retrieve your account information at this time.
          </p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection
            settings={settings}
            onSettingsUpdate={fetchSettings}
          />
        )
      case 'billing':
        return (
          <SubscriptionSection
            settings={settings}
            subscriptionDetails={subscriptionDetails}
            onCancel={handleCancelSubscription}
            onReactivate={handleReactivateSubscription}
            onManage={handleManageSubscription}
            actionLoading={actionLoading}
          />
        )
      case 'api-keys':
        return <ApiKeysSection />
      case 'account':
        return <AccountSection onDelete={handleDeleteAccount} />
    }
  }

  return (
    <SettingsShell activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </SettingsShell>
  )
}
