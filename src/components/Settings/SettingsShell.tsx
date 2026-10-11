'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import SettingsTabs, { type TabId } from './SettingsTabs'

export default function SettingsShell({
  activeTab,
  onTabChange,
  children,
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-ink pt-14">
      {/* Navigation Header */}
      <header className="sticky top-0 z-10 border-b border-rule bg-graphite/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="-ml-2 flex items-center gap-1 rounded-lg px-2 py-1 text-fog transition-colors hover:bg-ink hover:text-signal"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <h1 className="text-base font-semibold text-paper">Settings</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Mobile tabs */}
        <div className="mb-6 lg:hidden">
          <SettingsTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>

        {/* Desktop: sidebar + content grid */}
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[7.5rem]">
              <SettingsTabs activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          </div>

          {/* Content area */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}
