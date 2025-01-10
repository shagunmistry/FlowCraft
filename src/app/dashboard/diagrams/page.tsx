'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import PageLoader from '@/components/PageLoader'
import { DiagramData } from '@/lib/DiagramType.db'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

export default function AllDiagramsPage() {
  const [originalDiagrams, setOriginalDiagrams] = useState<DiagramData[]>([])
  const [diagrams, setDiagrams] = useState<DiagramData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const fetchUserDiagrams = async () => {
      const res = await fetch('/api/get-diagrams')
      const data = await res.json()

      if (!res.ok || !data) {
        console.error('Failed to fetch diagrams:', data)
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

    const filteredDiagrams = originalDiagrams.filter((diagram) =>
      diagram.title.toLowerCase().includes(search.toLowerCase()),
    )
    setDiagrams(filteredDiagrams)
  }

  if (isLoading) return <PageLoader />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="space-y-8">
        <motion.div
          className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Diagrams
          </h1>

          <motion.div
            className="relative w-full md:w-72"
            animate={{ width: searchFocused ? '100%' : undefined }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search diagrams..."
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full rounded-full bg-gray-50 px-10 py-2.5 text-sm text-gray-900 outline-none ring-1 ring-gray-200 transition-shadow duration-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {diagrams.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {diagrams.map((diagram, index) => (
                <motion.div
                  key={diagram.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/diagram/${diagram.id}`}
                    className="block"
                  >
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h2 className="text-lg font-medium text-gray-900">
                          {diagram.title}
                        </h2>
                        <p className="line-clamp-2 text-sm text-gray-500">
                          {diagram.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {diagram.type}
                        </span>
                        <time className="text-sm text-gray-500">
                          {new Date(diagram.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )}
                        </time>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[40vh] flex-col items-center justify-center space-y-4 rounded-2xl bg-gray-50 p-12 text-center"
            >
              <p className="text-lg text-gray-600">
                No diagrams found.{' '}
                <Link
                  href="/dashboard/flow-diagram"
                  className="text-blue-600 hover:underline"
                >
                  Create your first diagram
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
