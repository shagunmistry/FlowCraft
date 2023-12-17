'use client'

import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$0',
    description:
      'Create as many diagrams as you need, experiment, and refine your ideas',
    features: [
      'Unlimited Diagrams',
      'Unlimited Charts',
      'Download Diagrams & Charts',
    ],
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '#',
    priceMonthly: '$10',
    description:
      'Get all the features you need to easily create, edit, and share diagrams',
    features: [
      'Unlimited Diagrams',
      'Unlimited Charts',
      'Download Diagrams & Charts',
      'Edit Diagrams & Charts',
      'Premium Templates',
      'Priority Support',
      'No Watermark',
    ],
  },
]

export default function PricingTier() {
  return (
    <div className="isolate mt-14 overflow-hidden rounded-lg bg-gradient-to-l from-indigo-400 via-indigo-500 to-pink-700 shadow-xl">
      <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold text-pink-400 text-white">
            Pricing For Everyone
          </h2>
        </div>
        <div className="relative mt-6">
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse
              cx={604}
              cy={512}
              fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)"
              rx={604}
              ry={512}
            />
            <defs>
              <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flow-root bg-gradient-to-r from-indigo-400 via-indigo-500 to-pink-700 pb-24 sm:pb-32">
        <div className="-mt-80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl sm:p-10"
                >
                  <div>
                    <h3
                      id={tier.id}
                      className="text-base font-semibold leading-7 text-pink-600"
                    >
                      {tier.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-x-2">
                      <span className="text-5xl font-bold tracking-tight text-indigo-600">
                        {tier.priceMonthly}
                      </span>
                      <span className="text-base font-semibold leading-7 text-indigo-600">
                        /month
                      </span>
                    </div>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                      {tier.description}
                    </p>
                    <ul
                      role="list"
                      className="mt-10 space-y-4 text-sm leading-6 text-gray-600"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-pink-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    // href={tier.href}
                    aria-describedby={tier.id}
                    className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    disabled
                  >
                    Get started today (coming soon!)
                  </button>
                </div>
              ))}
              {/* <div className="flex flex-col items-start gap-x-8 gap-y-6 rounded-xl bg-indigo-600 p-8 shadow-xl ring-1 ring-indigo-900/10 sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center">
                <div className="lg:min-w-0 lg:flex-1">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-white">
                    Discounted
                  </h3>
                  <p className="mt-1 text-base leading-7 text-white">
                    Get a discounted plan if you are a student, teacher, or
                    non-profit organization.
                  </p>
                </div>
                <a
                  href="#"
                  className="rounded-md bg-pink-600 px-3.5 py-2 text-sm font-semibold leading-6 text-white hover:bg-pink-900"
                >
                  Contact Us <span aria-hidden="true">&rarr;</span>
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
