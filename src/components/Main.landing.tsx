'use client'
import { Fragment, useEffect, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-auth/client'

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
      console.log('data: ', data)
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
                  <img
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
        <div className="bg-gradient-to-r from-indigo-400 via-pink-500 to-pink-700 pt-10 sm:pt-16 lg:overflow-hidden lg:pb-14 lg:pt-8">
          <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                <div className="lg:py-24">
                  <div className="hidden sm:mb-5 sm:flex sm:justify-center lg:justify-start">
                    <a
                      href="#"
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
                    </a>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-5xl lg:mt-6 xl:text-6xl">
                    <span className="block text-gray-200">
                      Generate stunning
                    </span>
                    <span className="block text-yellow-300">
                      Diagrams, Charts, and Whiteboard Sketches in Seconds!
                    </span>
                  </h1>
                  <p className="mt-3 text-gray-200 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Turn your ideas and data into professional visuals
                    effortlessly. No design skills required.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <Link
                      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-300 px-8 py-3 font-medium text-gray-500 text-indigo-600 hover:bg-pink-300 sm:inline-flex sm:w-auto sm:items-center sm:px-6"
                      href={authenticated ? '/dashboard' : '/login'}
                    >
                      {authenticated ? 'Go to Dashboard' : 'Get Started'}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="-mb-16 mt-12 sm:-mb-48 lg:relative lg:m-0">
                <Image
                  height={500}
                  width={500}
                  src="https://firebasestorage.googleapis.com/v0/b/immipal.appspot.com/o/a_cat_teacher.png?alt=media&token=ab1f1534-6163-4b48-8dc3-8abc2fa34fb9"
                  alt="Illustration of a person using a computer"
                  className="mx mx-auto rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-96 lg:mt-5 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-base font-semibold leading-7 text-white">
                Everything you need
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-yellow-200 sm:text-4xl">
                All-in-one tool to create stunning diagrams, charts, and,
                sketches
              </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-2xl leading-7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold text-yellow-300">
                    <feature.icon
                      className="absolute left-1 top-1 h-5 w-5 text-yellow-300"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>{' '}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
    </div>
  )
}
