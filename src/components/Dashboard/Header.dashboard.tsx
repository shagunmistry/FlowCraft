import Link from 'next/link'

export default function DashboardHeading({
  subscribed,
  name,
  imageUrl,
  stats,
}: {
  subscribed: boolean
  name: string
  imageUrl: string
  stats: { id: number; name: string; value: number }[]
}) {
  return (
    <>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <img
                  className="mx-auto h-20 w-20 rounded-full"
                  src={imageUrl}
                  alt={name}
                />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">
                  Welcome back,
                </p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {name}
                </p>
                {/* <button
                  type="button"
                  className="mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Request A Feature
                </button> */}
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
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
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-indigo-200 bg-gray-100 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="px-6 py-5 text-center text-sm font-medium"
            >
              <span className="text-indigo-900">{stat.value}</span>{' '}
              <span className="text-indigo-600">{stat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
