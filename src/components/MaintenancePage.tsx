import { PauseCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'

const MaintenancePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 text-zinc-900">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <PauseCircleIcon className="h-16 w-16 text-zinc-900" />
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">
            We'll be back soon
          </h1>

          <p className="text-xl leading-relaxed text-zinc-600">
            We're temporarily pausing FlowCraft's services while we investigate
            and optimize our API usage. Your diagrams and data remain safe.
          </p>
        </div>

        {/* Status Box */}
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
              <span className="text-sm font-medium text-zinc-600">
                Maintenance in Progress
              </span>
            </div>

            <p className="text-sm text-zinc-600">
              We're working to resolve API cost-related issues. During this
              time, all services will be temporarily unavailable.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-12 text-sm text-zinc-400">
          Thank you for your patience and understanding.
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
