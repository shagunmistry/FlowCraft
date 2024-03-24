import { cn } from '@/lib/utils'

export const Badge = ({
  badgeType,
}: {
  badgeType: 'popular' | 'new' | 'coming-soon'
}) => {
  const className =
    badgeType === 'popular'
      ? 'bg-blue-100 text-blue-500'
      : badgeType === 'new'
        ? 'bg-green-100 text-green-500'
        : 'bg-yellow-100 text-yellow-500'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium border border-gray-200',
        className,
      )}
    >
      <svg
        className={cn(
          'h-2 w-2',
          badgeType === 'popular'
            ? 'fill-green-500'
            : badgeType === 'new'
              ? 'fill-blue-500'
              : 'fill-yellow-500',
        )}
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      {badgeType === 'popular' && 'Popular'}
      {badgeType === 'new' && 'New'}
      {badgeType === 'coming-soon' && 'Coming Soon'}
    </span>
  )
}
