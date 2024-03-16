'use client'
import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowDownCircleIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Start Here', href: '/dashboard' },
  { name: 'For Teachers', href: '/demos/teachers' },
  { name: 'For Students', href: '/demos/students' },
  { name: 'For Healthcare', href: '/demos/healthcare' },
  { name: 'For Engineers', href: '/demos/engineers' },
  { name: 'Blog', href: '/blogs' },
]

const mainNavigation = [
  { name: 'Start Here', href: '/dashboard' },
  { name: 'Blog', href: '/blogs' },
]

const useCasesNavigation = [
  { name: 'For Teachers', href: '/demos/teachers' },
  { name: 'For Students', href: '/demos/students' },
  { name: 'For Healthcare', href: '/demos/healthcare' },
  { name: 'For Engineers', href: '/demos/engineers' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gray-100">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">FlowCraft</span>
            <Image
              className="h-14 w-auto transform rounded-lg shadow-lg transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-xl"
              src={FlowCraftLogo}
              alt="FlowCraft Logo"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-indigo-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <div className="space-x-4">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg bg-indigo-500 px-3 py-2 font-semibold text-white transition duration-150 ease-in-out hover:bg-pink-500"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Menu as="div" className="relative">
            <Menu.Button className="rounded-lg px-3 font-semibold transition duration-150 ease-in-out hover:text-indigo-500">
              <ArrowDownCircleIcon className="h-5 w-5 inline-block -mt-1 mr-3" />
              Use Cases
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {useCasesNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={cn(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-700 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">FlowCraft</span>
              <Image
                className="h-14 w-auto transform rounded-lg shadow-lg transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-xl"
                src={FlowCraftLogo}
                alt="FlowCraft Logo"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg bg-white px-3 py-2 text-base font-semibold leading-7 text-pink-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
