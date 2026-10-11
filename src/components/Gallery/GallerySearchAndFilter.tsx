'use client'

import { motion } from 'framer-motion'

interface GallerySearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  'Newest',
  'Trending',
  'Flow',
  'Chart',
  'Whiteboard',
  'Mind Map',
  'Generated Images',
]

export default function GallerySearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: GallerySearchAndFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 mb-14"
    >
      {/* Search field */}
      <div className="grid grid-cols-1 gap-6 border-y border-rule py-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-12">
          <div className="group relative flex items-center gap-3 border-b border-rule/60 pb-2 transition-colors focus-within:border-signal/60">
            <svg
              className="h-4 w-4 text-fog transition-colors group-focus-within:text-signal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Describe a diagram, a topic, a shape…"
              className="w-full border-0 bg-transparent p-0 font-serif text-xl text-paper placeholder:font-serif placeholder:text-fog/70 focus:outline-none focus:ring-0 md:text-2xl"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="text-xs text-fog transition-colors hover:text-signal"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex items-center gap-4">
        <div className="-mx-1 flex flex-1 flex-wrap gap-1 overflow-x-auto">
          {filters.map((filter) => {
            const selected = selectedFilter === filter
            return (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={
                  'group relative rounded-sm border px-3 py-1.5 text-sm transition-colors ' +
                  (selected
                    ? 'border-signal bg-signal text-ink'
                    : 'border-rule text-paper/70 hover:border-signal/50 hover:text-paper')
                }
              >
                <span className="relative">
                  {filter}
                  {!selected && (
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full" />
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
