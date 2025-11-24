'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'

interface UpgradePromptProps {
  currentUsage: number
  limit: number
  onClose?: () => void
}

export default function UpgradePrompt({ currentUsage, limit, onClose }: UpgradePromptProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const isAtLimit = currentUsage >= limit
  const isNearLimit = currentUsage >= limit - 2 && currentUsage < limit

  if (!isAtLimit && !isNearLimit) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-2.5 sm:px-3.5 border border-indigo-200 rounded-lg">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-gray-900">
          {isAtLimit ? (
            <strong className="font-semibold">You've reached your monthly limit</strong>
          ) : (
            <strong className="font-semibold">
              {currentUsage}/{limit} diagrams used this month
            </strong>
          )}
          <span className="mx-3 inline-block h-4 w-px bg-gray-300" aria-hidden="true" />
          {isAtLimit
            ? 'Upgrade to continue creating diagrams'
            : 'Upgrade now for unlimited creations'}
        </p>
        <Link
          href="/pricing"
          className="flex-none rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
        >
          Upgrade now <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          onClick={handleClose}
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
