'use client'

import PageLoader from '@/components/PageLoader'
import { DiagramData } from '@/lib/DiagramType.db'
import {
  ChevronRightIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AllDiagramsPage() {
  const [originalDiagrams, setOriginalDiagrams] = useState<DiagramData[]>([])
  const [diagrams, setDiagrams] = useState<DiagramData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserDiagrams = async () => {
      const res = await fetch('/api/get-diagrams')
      const data = await res.json()

      if (!res.ok || !data) {
        console.error('Failed to fetch user diagrams:', data)
        return
      }

      const diagrams = data.diagrams as DiagramData[]

      setDiagrams(diagrams)
      setOriginalDiagrams(diagrams)
      setIsLoading(false)
    }

    setIsLoading(true)
    fetchUserDiagrams()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value

    if (!search) {
      return setDiagrams(originalDiagrams)
    }

    const filteredDiagrams = diagrams.filter((diagram) =>
      diagram.title.toLowerCase().includes(search.toLowerCase()),
    )

    setDiagrams(filteredDiagrams)
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            All Diagrams
          </h2>
        </div>{' '}
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search"
                type="search"
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="mt-6 divide-y divide-indigo-400 overflow-visible shadow-md ring-1 ring-indigo-900/5 sm:rounded-xl"
      >
        {diagrams.map((diagram) => (
          <li
            key={diagram.id}
            className="relative flex justify-between gap-x-6 px-4 py-5 transition-all duration-200 hover:scale-105 hover:bg-gray-50 hover:shadow-lg sm:px-6"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-md font-semibold leading-6 text-indigo-600">
                  <Link href={`/dashboard/diagram/${diagram.id}`}>
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {diagram.title}
                  </Link>
                </p>
                <p className="mt-1 flex text-sm leading-5 text-gray-500">
                  <Link
                    href={`/dashboard/diagram/${diagram.id}`}
                    className="relative truncate"
                  >
                    {diagram.description}
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {new Date(diagram.created_at).toLocaleDateString()}
                </p>
                <div className="mt-1 flex items-center gap-x-1.5">
                  <p className="text-xs leading-5 text-gray-500">
                    {diagram.type}
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

      {diagrams.length === 0 && (
        <div className="mt-6 flex h-[50vh] flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-gray-500">
            No diagrams found.{' '}
            <Link
              href="/dashboard/flow-diagram"
              className="text-indigo-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
