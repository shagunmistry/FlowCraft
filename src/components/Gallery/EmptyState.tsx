import Link from 'next/link'

interface EmptyStateProps {
  searchQuery: string
}

export default function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="relative mt-10 overflow-hidden rounded-sm border border-dashed border-rule bg-graphite/40 p-12 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgb(var(--color-signal) / 0.10) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div className="relative mx-auto max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm border border-rule bg-ink">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-fog"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="font-serif text-3xl text-paper">
          {searchQuery ? 'No matching drafts.' : 'Archive is empty.'}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/60">
          {searchQuery
            ? `Nothing filed under "${searchQuery}". Try a different term or clear the search.`
            : 'There are no public drafts yet. Be the first to publish one.'}
        </p>
        <Link
          href="/dashboard/diagrams/new"
          className="group mt-6 inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          <span>Start a draft</span>
        </Link>
      </div>
    </div>
  )
}
