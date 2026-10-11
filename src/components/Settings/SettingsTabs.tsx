'use client'

import {
  UserCircleIcon,
  CreditCardIcon,
  KeyIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

export const tabs = [
  { id: 'profile', label: 'Profile', icon: UserCircleIcon },
  { id: 'billing', label: 'Subscription & Billing', icon: CreditCardIcon },
  { id: 'api-keys', label: 'API Keys', icon: KeyIcon },
  { id: 'account', label: 'Account', icon: ShieldExclamationIcon },
] as const

export type TabId = (typeof tabs)[number]['id']

export default function SettingsTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}) {
  return (
    <>
      {/* Desktop: vertical sidebar */}
      <nav className="hidden lg:block">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={clsx(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-fog hover:bg-ink hover:text-paper',
                )}
              >
                <tab.icon className={clsx('h-5 w-5', isActive ? 'text-paper' : 'text-fog')} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile: horizontal scrollable tabs */}
      <nav className="lg:hidden">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={clsx(
                  'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-signal text-ink'
                    : 'bg-ink text-fog hover:bg-ink',
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
