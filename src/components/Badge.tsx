import { cn } from '@/lib/utils'

export const Badge = ({
  badgeType,
}: {
  badgeType: 'popular' | 'new' | 'experimental'
}) => {
  const className =
    badgeType === 'popular'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-x-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      <svg
        className="h-1.5 w-1.5 fill-blue-500"
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      {badgeType === 'popular' ? 'Popular' : 'New'}
    </span>
  )
}
