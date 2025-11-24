'use client'

import PageLoader from '@/components/PageLoader'
import { getShareableLinkUrl, SharedDiagramResult } from '@/lib/utils'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AllDiagramsPage() {
  const [sharedLinks, setSharedLinks] = useState<SharedDiagramResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserDiagrams = async () => {
      const res = await fetch('/api/shares')
      const data = await res.json()

      if (!res.ok || !data) {
        console.error('Failed to fetch user diagrams:', data)
        return
      }

      const diagrams = data.shares as SharedDiagramResult[]

      setSharedLinks(diagrams)
      setIsLoading(false)
    }

    setIsLoading(true)
    fetchUserDiagrams()
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="mx-auto mt-6 flex h-[50vh] max-w-7xl flex-col py-12 py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            All Diagrams
          </h2>
        </div>{' '}
      </div>
      <ul
        role="list"
        className="mt-6 divide-y divide-red-400 overflow-visible shadow-md ring-1 ring-red-900/5 sm:rounded-xl"
      >
        {sharedLinks.map((sharedLink) => (
          <li
            key={sharedLink.id}
            className="relative flex justify-between gap-x-6 px-4 py-5 transition-all duration-200 hover:scale-105 hover:bg-gray-50 hover:shadow-lg sm:px-6"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-md font-semibold leading-6 text-red-600">
                  <Link
                    href={getShareableLinkUrl(
                      sharedLink.id,
                      process.env.NEXT_PUBLIC_BASE_URL || '',
                    )}
                  >
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {sharedLink.title}
                  </Link>
                </p>
                <p className="text-sm leading-5 text-gray-500">
                  Invite Code: {sharedLink.invite_code}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {new Date(sharedLink.created_at).toLocaleDateString()}
                </p>
                <div className="mt-1 flex items-center gap-x-1.5">
                  <p className="text-xs leading-5 text-gray-500">
                    {sharedLink.type}
                  </p>
                </div>
              </div>
              <ChevronRightIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ul>

      {sharedLinks.length === 0 && (
        <div className="mt-6 flex h-[50vh] flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-gray-500">
            No diagrams shared yet.{' '}
            <Link
              href="/dashboard/flow-diagram"
              className="text-red-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
