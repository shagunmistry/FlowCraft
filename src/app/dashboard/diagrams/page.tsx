'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DiagramData } from '@/lib/DiagramType.db'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  DocumentPlusIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// --- Components ---

// 1. Skeleton Loader for "Instant" feel
const DiagramSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
    </div>
    <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-100" />
    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
  </div>
)

// 2. Main Page
export default function AllDiagramsPage() {
  const [data, setData] = useState<DiagramData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const res = await fetch('/api/get-diagrams')
        const json = await res.json()
        if (res.ok && json.diagrams) {
          setData(json.diagrams)
        }
      } catch (error) {
        console.error('Failed to load diagrams', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDiagrams()
  }, [])

  // Optimized filtering
  const filteredDiagrams = useMemo(() => {
    if (!searchQuery) return data
    return data.filter((d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [data, searchQuery])

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              All Diagrams
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {data.length} {data.length === 1 ? 'file' : 'files'} in your
              workspace
            </p>
          </div>

          {/* Search Bar */}
          <div className="group relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-gray-900" />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm leading-6 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-900"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <DiagramSkeleton key={i} />
              ))}
            </div>
          ) : filteredDiagrams.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {filteredDiagrams.map((diagram) => (
                  <DiagramCard key={diagram.id} diagram={diagram} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState
              isSearching={!!searchQuery}
              onClear={() => setSearchQuery('')}
            />
          )}
        </div>
      </div>
    </main>
  )
}

// 3. Diagram Card Component
function DiagramCard({ diagram }: { diagram: DiagramData }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
            // Minimalist badge styling
            'bg-gray-50 text-gray-600 ring-gray-500/10',
          )}
        >
          {diagram.type}
        </span>
        <Squares2X2Icon className="h-5 w-5 text-gray-300" />
      </div>

      <div className="space-y-2">
        <h3 className="line-clamp-1 font-semibold text-gray-900 group-hover:text-black">
          <Link href={`/dashboard/diagram/${diagram.id}`}>
            <span className="absolute inset-0" />
            {diagram.title}
          </Link>
        </h3>
        <p className="line-clamp-2 min-h-[2.5em] text-sm text-gray-500">
          {diagram.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-400">
        <time dateTime={diagram.created_at}>
          {new Date(diagram.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
        <span className="font-medium text-gray-900 opacity-0 transition-opacity group-hover:opacity-100">
          Open Project &rarr;
        </span>
      </div>
    </motion.article>
  )
}

// 4. Empty State Component
function EmptyState({
  isSearching,
  onClear,
}: {
  isSearching: boolean
  onClear: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50/50 py-24 text-center"
    >
      <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
        <DocumentPlusIcon className="h-8 w-8 text-gray-400" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {isSearching ? 'No results found' : 'No diagrams yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
        {isSearching
          ? "We couldn't find any diagrams matching your search. Try a different term."
          : 'Create your first diagram to start visualizing your ideas.'}
      </p>

      <div className="mt-6">
        {isSearching ? (
          <button
            onClick={onClear}
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            Clear search
          </button>
        ) : (
          <Link
            href="/dashboard/diagrams/new"
            className="inline-flex items-center rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Create Diagram
          </Link>
        )}
      </div>
    </motion.div>
  )
}
