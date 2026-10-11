import DiagramSkeleton from '@/components/skeletons/DiagramSkeleton'
import { SkeletonLine } from '@/components/skeletons/SkeletonBlock'

export default function DiagramLoading() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-6 space-y-3">
          <SkeletonLine className="h-8 w-72 max-w-full" />
          <SkeletonLine className="h-4 w-48" />
        </div>
        <DiagramSkeleton />
      </div>
    </div>
  )
}
