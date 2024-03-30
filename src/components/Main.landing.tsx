'use client'
import { Fragment, useEffect, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import {
  BellIcon,
  BoltIcon,
  ChartBarIcon,
  ChevronRightIcon,
  CubeIcon,
  GifIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-auth/client'
import PricingTemplate from './Pricing/Pricing.template'
import HowToUseSteps from './HowToUseSteps'
import FAQs from './FAQ'

const features = [
  {
    name: 'Effortless Creation',
    description:
      'Simply type your idea and let the tool do the rest. No design skills required.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Customization Options',
    description: 'Easily edit the results to fit your needs.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Export & Share',
    description: 'Download your creation as an image or share it with others.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Save Time & Effort',
    description: 'Save hours of work and get more done.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Professional Results',
    description: 'Get professional results without the hassle.',
    icon: CheckCircleIcon,
  },
]

export default function MainLanding() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const fetchAuthenticationStatus = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        setAuthenticated(false)
      }

      if (data?.user) {
        setAuthenticated(true)
      }
    }

    fetchAuthenticationStatus()
  }, [])

  return (
    <div className="relative overflow-hidden">
      <Popover as="header" className="relative">
        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 z-10 origin-top transform p-2 transition md:hidden"
          >
            <div className="overflow-hidden rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between px-5 pt-4">
                <div>
                  <Image
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      <main>
        <div className="bg-gray-100 pt-10 sm:pt-16 lg:overflow-hidden lg:pb-14 lg:pt-8">
          <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                <div className="lg:py-24">
                  <div className="hidden sm:mb-5 sm:flex sm:justify-center lg:justify-start">
                    <Link
                      href="/login"
                      className="flex items-center rounded-full bg-black p-1 pr-2 text-white hover:text-gray-200 sm:text-base lg:text-sm xl:text-base"
                    >
                      <span className="rounded-full bg-pink-500 px-3 py-0.5 text-sm font-semibold leading-5 text-white">
                        Early Access
                      </span>
                      <span className="ml-4 text-sm">Don't miss out!</span>
                      <ChevronRightIcon
                        className="ml-2 h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight sm:mx-auto sm:text-5xl lg:mx-0 lg:mt-6 xl:text-6xl">
                    <span className="block">Create stunning</span>
                    <ul className="list-disc pl-5">
                      <li className="block text-pink-500">
                        <BoltIcon className="inline-block h-7 w-7" />
                        <span className="ml-2">Diagrams</span>
                      </li>
                      <li className="block text-pink-500">
                        <ChartBarIcon className="inline-block h-7 w-7" />
                        <span className="ml-2">Charts</span>
                      </li>
                      <li className="block text-pink-500">
                        <CubeIcon className="inline-block h-7 w-7" />
                        <span className="ml-2">Sketches</span>
                      </li>
                    </ul>
                    <span className="block">with AI in seconds</span>
                  </h1>
                  <p className="mt-3 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Turn your ideas and data into professional visuals
                    effortlessly. No design skills required.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <Link
                      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-pink-500 px-8 py-3 font-medium text-gray-500 text-indigo-600 text-white transition-all duration-300 ease-in-out hover:scale-125 hover:bg-indigo-500 sm:inline-flex sm:w-auto sm:items-center sm:px-6"
                      href={authenticated ? '/dashboard' : '/login'}
                    >
                      {authenticated ? 'Go to Dashboard' : 'Get Started'}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="-mb-16 mt-12 sm:-mb-48 lg:relative lg:m-0">
                <Image
                  height={700}
                  width={700}
                  src="https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FDashboard%20-%20FlowCraft.jpeg?alt=media&token=2ba5c2db-a62c-48e5-ba05-c50c18e97865"
                  alt="Illustration of a person using a computer"
                  className="mx mx-auto rounded-xl shadow-xl mt-12"
                />
              </div>
            </div>
          </div>

          {/** How It works section */}
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-96 lg:mt-5 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <p className="mt-2 text-3xl font-bold tracking-tight text-pink-500 sm:text-4xl">
                3 Simple Steps
              </p>
            </div>
            <HowToUseSteps />
          </div>

          {/** Features section */}
          <div className="mx-auto mt-10 max-w-7xl px-6 sm:mt-12 lg:mt-20 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-base font-semibold leading-7">
                Everything you need
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-pink-500 sm:text-4xl">
                All-in-one tool to create stunning diagrams, charts, and,
                sketches
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-2xl leading-7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold text-pink-500">
                    <feature.icon
                      className="absolute left-1 top-1 h-5 w-5 text-pink-500"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>{' '}
                  <dd className="inline text-gray-900">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/** Pricing Section */}
          <PricingTemplate sourcePage="landing" />

          {/** CTA section */}
          <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                aria-hidden="true"
              >
                <circle
                  cx={512}
                  cy={512}
                  r={512}
                  fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                  fillOpacity="0.7"
                />
                <defs>
                  <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                    <stop stopColor="#7775D6" />
                    <stop offset={1} stopColor="#E935C1" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Diagramiming made easy
                  <br className="hidden lg:inline" />
                  <span className="text-yellow-300">with AI</span>
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  FlowCraft boosts your productivity by automating the process
                  of creating diagrams, charts, and sketches. No design skills
                  required.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <Link
                    href="/login"
                    className="rounded-md border border-transparent bg-pink-500 px-3.5 px-8 py-2.5 py-3 text-lg font-medium font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-125 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Get started
                  </Link>
                </div>
              </div>
              <div className="relative mt-16 h-80 lg:mt-8">
                <Image
                  className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                  src="https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FFlowCraft_Ss.png?alt=media&token=dc26595e-537f-43c9-956a-e25eb19a5f86"
                  alt="FlowCraft App screenshot"
                  width={1824}
                  height={1080}
                />
              </div>
            </div>
          </div>

          {/** FAQ section */}
          <FAQs />
        </div>
      </main>
    </div>
  )
}
