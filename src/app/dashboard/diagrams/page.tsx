'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DiagramData } from '@/lib/DiagramType.db'
import { cn } from '@/lib/utils'

type SortKey = 'recent' | 'oldest' | 'title'

// --- Skeleton ------------------------------------------------------------
const DiagramSkeleton = () => (
  <div className="relative flex min-h-[240px] flex-col justify-between gap-6 bg-graphite p-6">
    <div className="flex items-center justify-between">
      <span className="h-2 w-16 animate-pulse bg-rule" />
      <span className="h-2 w-10 animate-pulse bg-rule" />
    </div>
    <div className="space-y-3">
      <div className="h-3 w-20 animate-pulse bg-rule" />
      <div className="h-7 w-3/4 animate-pulse bg-rule" />
      <div className="h-7 w-1/2 animate-pulse bg-rule" />
    </div>
    <div className="h-3 w-24 animate-pulse bg-rule" />
  </div>
)

// --- Main Page -----------------------------------------------------------
export default function AllDiagramsPage() {
  const [data, setData] = useState<DiagramData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('recent')

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const res = await fetch('/api/get-diagrams')
        const json = await res.json()
        if (res.ok && json.diagrams) setData(json.diagrams)
      } catch (error) {
        console.error('Failed to load diagrams', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDiagrams()
  }, [])

  const types = useMemo(() => {
    const set = new Set<string>()
    data.forEach((d) => d.type && set.add(d.type))
    return ['all', ...Array.from(set)]
  }, [data])

  const filteredDiagrams = useMemo(() => {
    let list = data
    if (typeFilter !== 'all') list = list.filter((d) => d.type === typeFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q),
      )
    }
    const sorted = [...list]
    if (sort === 'recent') {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    } else if (sort === 'oldest') {
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
    } else {
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }
    return sorted
  }, [data, searchQuery, typeFilter, sort])

  const finalizedDiagrams = useMemo(
    () => filteredDiagrams.filter((d) => d.finalized),
    [filteredDiagrams],
  )
  const draftDiagrams = useMemo(
    () => filteredDiagrams.filter((d) => !d.finalized),
    [filteredDiagrams],
  )

  const headerDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="relative min-h-screen bg-ink pb-24 pt-12 text-paper">
      <div className="pointer-events-none fixed inset-x-0 bottom-0 top-[76px] bg-dot-grid bg-dot-24 opacity-60" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
        <p className="mb-10 text-sm text-fog">
          {headerDate} ·{' '}
          <span className="text-paper">
            {data.length} {data.length === 1 ? 'entry' : 'entries'}
          </span>
        </p>

        {/* Masthead */}
        <section className="mb-14 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-6xl leading-[0.95] tracking-[-0.01em] text-paper md:text-7xl">
              <span className="text-paper/70">Every draft,</span>{' '}
              <span className="italic text-signal">catalogued</span>
              <span className="text-paper/70">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/60">
              A complete ledger of your visual thinking. Search a phrase, filter
              by form, or scan the grid for the one you can&apos;t quite place.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <Link
              href="/dashboard/diagrams/new"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              <span className="relative z-10">+ New draft</span>
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 text-sm text-fog transition-colors hover:text-paper"
            >
              <span className="h-px w-6 bg-current transition-all group-hover:w-10" />
              Back to dashboard
            </Link>
          </div>
        </section>

        {/* Toolbar */}
        <section
          aria-label="Filters"
          className="mb-10 flex flex-col gap-6 border-y border-rule py-5 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Search */}
          <div className="group relative flex items-center gap-3 lg:w-[420px]">
            <span className="text-sm text-signal">Find</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="title, description, or phrase…"
                className="w-full border-b border-rule bg-transparent pb-2 pr-8 font-serif text-xl italic text-paper placeholder:text-fog/60 focus:border-signal focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute bottom-2 right-0 text-xs text-fog transition-colors hover:text-signal"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm text-fog">Form</span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  'rounded-sm border px-3 py-1.5 text-xs transition-colors',
                  typeFilter === t
                    ? 'border-signal bg-signal text-ink'
                    : 'border-rule bg-graphite/60 text-fog hover:border-signal/40 hover:text-paper',
                )}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="mr-2 text-sm text-fog">Order</span>
            {(
              [
                ['recent', 'New → Old'],
                ['oldest', 'Old → New'],
                ['title', 'A → Z'],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={cn(
                  'text-xs transition-colors',
                  sort === key
                    ? 'text-signal'
                    : 'text-fog hover:text-paper',
                )}
              >
                {label}
              </button>
            )).reduce<React.ReactNode[]>((acc, el, i) => {
              if (i > 0)
                acc.push(
                  <span key={`s-${i}`} className="text-rule">
                    ·
                  </span>,
                )
              acc.push(el)
              return acc
            }, [])}
          </div>
        </section>

        {/* Results meta */}
        <div className="mb-6 flex items-center justify-between text-sm text-fog">
          <span>
            Showing{' '}
            <span className="text-paper">{filteredDiagrams.length}</span> of{' '}
            <span className="text-paper">{data.length}</span>
          </span>
          {(searchQuery || typeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setTypeFilter('all')
              }}
              className="text-fog transition-colors hover:text-signal"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="min-h-[400px] space-y-14">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <DiagramSkeleton key={i} />
              ))}
            </div>
          ) : filteredDiagrams.length > 0 ? (
            <>
              {finalizedDiagrams.length > 0 && (
                <SectionGrid
                  label="Finalized"
                  count={finalizedDiagrams.length}
                  diagrams={finalizedDiagrams}
                  variant="finalized"
                />
              )}
              {draftDiagrams.length > 0 && (
                <SectionGrid
                  label="Drafts"
                  count={draftDiagrams.length}
                  diagrams={draftDiagrams}
                  variant="draft"
                />
              )}
            </>
          ) : (
            <EmptyState
              isSearching={!!searchQuery || typeFilter !== 'all'}
              onClear={() => {
                setSearchQuery('')
                setTypeFilter('all')
              }}
            />
          )}
        </div>

      </div>
    </main>
  )
}

// --- Section -------------------------------------------------------------
function SectionGrid({
  label,
  count,
  diagrams,
  variant,
}: {
  label: string
  count: number
  diagrams: DiagramData[]
  variant: 'finalized' | 'draft'
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between text-sm text-fog">
        <div className="flex items-center gap-3">
          <span className="text-paper">{label}</span>
          <span className="h-px w-8 bg-rule" />
          <span>
            {count} {count === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>
      <motion.div
        layout
        className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {diagrams.map((diagram, i) => (
            <DiagramCard
              key={diagram.id}
              diagram={diagram}
              index={i}
              variant={variant}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

// --- Card ----------------------------------------------------------------
function DiagramCard({
  diagram,
  index,
  variant,
}: {
  diagram: DiagramData
  index: number
  variant: 'finalized' | 'draft'
}) {
  const created = new Date(diagram.created_at)
  const entryNo = String(index + 1).padStart(3, '0')
  const href =
    variant === 'finalized'
      ? `/dashboard/diagram/${diagram.id}?finalized=1`
      : `/dashboard/diagrams/new?id=${diagram.id}`
  const footerLabel = variant === 'finalized' ? 'View finalized' : 'Open draft'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
      className="group relative flex min-h-[260px] flex-col justify-between gap-6 bg-graphite p-6 transition-colors duration-300 hover:bg-ink"
    >
      {/* Top row: entry number + type + date */}
      <div className="flex items-start justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-fog">№ {entryNo}</span>
          <span className="h-px w-4 bg-rule" />
          <span className="text-signal">{diagram.type || 'Draft'}</span>
          {variant === 'finalized' && (
            <span className="rounded-sm border border-signal/50 px-1.5 py-0.5 text-xs text-signal">
              Finalized
            </span>
          )}
        </div>
        <time className="text-fog" dateTime={diagram.created_at}>
          {created.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit',
          })}
        </time>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="line-clamp-2 font-serif text-2xl leading-tight tracking-[-0.01em] text-paper transition-colors group-hover:text-signal md:text-3xl">
          <Link href={href}>
            <span className="absolute inset-0" aria-hidden />
            {diagram.title || 'Untitled draft'}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 min-h-[2.75em] text-sm leading-relaxed text-paper/55">
          {diagram.description || 'No description attached to this draft.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-rule pt-4">
        <span className="text-sm text-fog transition-colors group-hover:text-signal">
          {footerLabel}
        </span>
      </div>

      {/* Corner tick */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-r border-t border-rule transition-colors group-hover:border-signal"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 border-b border-l border-rule transition-colors group-hover:border-signal"
      />
    </motion.article>
  )
}

// --- Empty State ---------------------------------------------------------
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
      className="relative overflow-hidden rounded-sm border border-dashed border-rule bg-graphite/40 px-8 py-24 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(196,255,61,0.10) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-rule"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-rule"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-rule"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-rule"
      />

      <div className="relative mx-auto max-w-md">
        <h3 className="font-serif text-4xl leading-tight text-paper md:text-5xl">
          {isSearching ? (
            <>
              Nothing{' '}
              <span className="italic text-signal">on that shelf</span>.
            </>
          ) : (
            <>
              Your archive is <span className="italic text-signal">blank</span>.
            </>
          )}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-paper/60">
          {isSearching
            ? 'Try a different phrase, or clear the filters to see the whole catalogue.'
            : 'Every great ledger starts with a single entry. Sketch your first diagram from a sentence.'}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {isSearching ? (
            <button
              onClick={onClear}
              className="group inline-flex items-center gap-2 rounded-sm border border-rule bg-graphite px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-signal/40 hover:text-signal"
            >
              Reset filters
            </button>
          ) : (
            <Link
              href="/dashboard/diagrams/new"
              className="group inline-flex items-center gap-3 rounded-sm bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              + Start first draft
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
