import {
  SkeletonBlock,
  SkeletonLine,
} from '@/components/skeletons/SkeletonBlock'

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
      className="min-h-screen bg-ink text-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-10 space-y-3">
          <SkeletonLine className="h-8 w-64" />
          <SkeletonLine className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-52" />
          ))}
        </div>
      </div>
    </div>
  )
}
