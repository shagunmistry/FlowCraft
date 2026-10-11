import { cn } from '@/lib/utils'

export function SkeletonBlock({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-sm border border-rule bg-graphite',
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-24 animate-scan bg-gradient-to-r from-transparent via-signal/15 to-transparent" />
    </div>
  )
}

export function SkeletonLine({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative h-3 overflow-hidden rounded-sm bg-graphite',
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-16 animate-scan bg-gradient-to-r from-transparent via-signal/15 to-transparent" />
    </div>
  )
}

export function SkeletonHeader({ label }: { label: string }) {
  return (
    <div className="mb-8 border-b border-rule pb-4 text-sm text-fog">
      {label}
    </div>
  )
}
