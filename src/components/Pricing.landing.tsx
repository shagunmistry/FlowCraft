import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { cn, frequencies, tiers } from '@/lib/utils'

export default function PricingTiers() {
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div className="isolate overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="flow-root rounded-xl bg-gray-900 pb-16 pt-24 shadow-lg sm:pt-32 lg:pb-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10">
            <h2 className="mx-auto max-w-4xl text-center text-5xl font-bold tracking-tight text-white">
              Simple pricing, no hidden fees.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-white/60">
              Choose the FlowCraft plan that fits your needs!
            </p>
            <div className="mt-16 flex justify-center">
              <RadioGroup
                value={frequency}
                onChange={setFrequency}
                className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"
              >
                <RadioGroup.Label className="sr-only">
                  Payment frequency
                </RadioGroup.Label>
                {frequencies.map((option) => (
                  <RadioGroup.Option
                    key={option.value}
                    value={option}
                    className={({ checked }) =>
                      cn(
                        checked ? 'bg-pink-500' : '',
                        'cursor-pointer rounded-full px-2.5 py-1',
                      )
                    }
                  >
                    <span>{option.label}</span>
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:-mb-14 lg:max-w-none lg:grid-cols-2">
            <svg
              viewBox="0 0 1208 1024"
              aria-hidden="true"
              className="absolute -bottom-48 left-1/2 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] lg:-top-48 lg:bottom-auto lg:translate-y-0"
            >
              <ellipse
                cx={604}
                cy={512}
                fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)"
                rx={604}
                ry={512}
              />
              <defs>
                <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
                  <stop stopColor="#FF00FF" />
                  <stop offset={1} stopColor="#FF00FF" />
                </radialGradient>
              </defs>
            </svg>
            <div
              className="hidden lg:absolute lg:inset-x-px lg:bottom-0 lg:top-4 lg:block lg:rounded-t-2xl lg:bg-gray-800/80 lg:ring-1 lg:ring-white/10"
              aria-hidden="true"
            />
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  tier.featured
                    ? 'z-10 bg-white shadow-xl ring-1 ring-gray-900/10'
                    : 'bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0',
                  'relative rounded-2xl',
                )}
              >
                <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                  {tier.featured ? (
                    <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                      <svg
                        className="h-1.5 w-1.5 fill-green-500"
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                      >
                        <circle cx={3} cy={3} r={3} />
                      </svg>
                      Popular
                    </span>
                  ) : null}
                  <h3
                    id={tier.id}
                    className={cn(
                      tier.featured ? 'text-gray-900' : 'text-white',
                      'text-sm font-semibold leading-6',
                    )}
                  >
                    {tier.name}
                  </h3>

                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                    <div className="mt-2 flex items-center gap-x-4">
                      <p
                        className={cn(
                          tier.featured ? 'text-gray-900' : 'text-white',
                          'text-4xl font-bold tracking-tight',
                        )}
                      >
                        {tier.price[frequency.value as keyof typeof tier.price]}
                      </p>
                      <div className="text-sm leading-5">
                        <p
                          className={
                            tier.featured ? 'text-gray-900' : 'text-white'
                          }
                        >
                          USD
                        </p>
                        <p
                          className={
                            tier.featured ? 'text-gray-500' : 'text-gray-400'
                          }
                        >{`Billed ${frequency.value}`}</p>
                      </div>
                    </div>
                    <a
                      href={tier.href}
                      aria-describedby={tier.id}
                      className={cn(
                        tier.featured
                          ? 'bg-pink-600 shadow-sm hover:bg-pink-500 focus-visible:outline-pink-600'
                          : 'bg-white/10 hover:bg-white/20 focus-visible:outline-white',
                        'rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                      )}
                    >
                      {tier.cta}
                    </a>
                  </div>
                  <div className="mt-8 flow-root sm:mt-10">
                    <ul
                      role="list"
                      className={cn(
                        tier.featured
                          ? 'divide-gray-900/5 border-gray-900/5 text-gray-600'
                          : 'divide-white/5 border-white/5 text-white',
                        '-my-2 divide-y border-t text-sm leading-6 lg:border-t-0',
                      )}
                    >
                      {tier.mainFeatures.map((mainFeature) => (
                        <li key={mainFeature} className="flex gap-x-3 py-2">
                          <CheckIcon
                            className={cn(
                              tier.featured ? 'text-pink-600' : 'text-gray-500',
                              'h-6 w-5 flex-none',
                            )}
                            aria-hidden="true"
                          />
                          {mainFeature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative bg-gray-100 pb-8 lg:pt-14"></div>
    </div>
  )
}
