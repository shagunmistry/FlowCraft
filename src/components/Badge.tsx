import { cn } from '@/lib/utils'
import {
  CakeIcon,
  CursorArrowRaysIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  PlusIcon,
} from '@heroicons/react/20/solid'

type BadgeType =
  | 'popular'
  | 'new'
  | 'coming-soon'
  | 'experimental'
  | 'subscribed'
  | 'not-subscribed'

export const Badge = ({ badgeType }: { badgeType: BadgeType }) => {
  const getBadgeColor = (badgeType: BadgeType) => {
    switch (badgeType) {
      case 'popular':
        return 'bg-green-500'
      case 'new':
        return 'bg-blue-500'
      case 'coming-soon':
        return 'bg-yellow-500'
      case 'experimental':
        return 'bg-yellow-500'
      case 'subscribed':
        return 'bg-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getBadgeFill = (badgeType: BadgeType) => {
    switch (badgeType) {
      case 'popular':
        return 'fill-green-500'
      case 'new':
        return 'fill-blue-500'
      case 'coming-soon':
        return 'fill-yellow-500'
      case 'experimental':
        return 'fill-yellow-500'
      case 'subscribed':
        return 'fill-pink-500'
      default:
        return 'fill-gray-500'
    }
  }

  const getBadgeText = (badgeType: BadgeType) => {
    switch (badgeType) {
      case 'popular':
        return 'Popular'
      case 'new':
        return 'New'
      case 'coming-soon':
        return 'Coming Soon'
      case 'experimental':
        return 'Experimental'
      case 'subscribed':
        return 'Subscribed'
      default:
        return 'Experimental'
    }
  }

  const getBadgeIcon = (badgeType: BadgeType): React.ReactNode => {
    switch (badgeType) {
      case 'popular':
        return <CakeIcon className="h-3 w-3 text-white" />
      case 'new':
        return <PlusIcon className="h-3 w-3 text-white" />
      case 'coming-soon':
        return <CursorArrowRaysIcon className="h-3 w-3 text-white" />
      case 'experimental':
        return <ExclamationTriangleIcon className="h-3 w-3 text-white" />
      case 'subscribed':
        return <PlusCircleIcon className="h-3 w-3 text-white" />
      default:
        return (
          <svg
            className="h-3 w-3 fill-gray-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
        )
    }
  }

  return (
    <>
      <span
        className={cn(
          'inline-flex items-center gap-x-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium',
          getBadgeColor(badgeType),
        )}
      >
        {getBadgeIcon(badgeType)}
        {getBadgeText(badgeType)}
      </span>
    </>
  )
}
