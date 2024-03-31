import Link from 'next/link'

export default function DashboardHeading({
  subscribed,
  name,
  imageUrl,
}: {
  subscribed: boolean
  name: string
  imageUrl: string
}) {
  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex items-start space-x-5">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              className="h-16 w-16 rounded-full shadow-xl"
              src={imageUrl}
              alt={name}
            />
            <span
              className="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            />
          </div>
        </div>
        {/*
            Use vertical padding to simulate center alignment when both lines of text are one line,
            but preserve the same layout if the text wraps without making the image jump around.
          */}
        <div className="pt-1.5">
          <h1 className="text-2xl font-bold text-indigo-500">{name}</h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
        {subscribed ? (
          <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-indigo-500 ring-1 ring-inset ring-gray-200">
            <svg
              className="h-1.5 w-1.5 fill-indigo-500"
              viewBox="0 0 6 6"
              aria-hidden="true"
            >
              <circle cx={3} cy={3} r={3} />
            </svg>
            Subscribed
          </span>
        ) : (
          <Link
            href={'/dashboard/pricing'}
            className="inline-flex items-center justify-center rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-pink-600"
          >
            Upgrade
          </Link>
        )}
      </div>
    </div>
  )
}
