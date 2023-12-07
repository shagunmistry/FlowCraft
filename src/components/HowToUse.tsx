'use client'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

import DemoImage from '@/images/CachingDiagram_FlowCraft_Demo3.png'
import 'reactflow/dist/style.css'
import ReactFlow, { Background } from 'reactflow'
import FlowCraftLogo from '@/images/FlowCraftLogo.png'
import Link from 'next/link'

const exampleEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'Customer contacts Amazon',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    label: 'Amazon identifies the issue',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    label: 'Amazon resolves the issue',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: true,
    label: 'Customer is satisfied',
  },
]

const exampleNodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Customer has an issue',
    },
    position: {
      x: 50,
      y: 50,
    },
  },
  {
    id: '2',
    type: 'default',
    data: {
      label: 'Customer contacts Amazon service',
    },
    position: {
      x: 200,
      y: 50,
    },
  },
  {
    id: '3',
    type: 'default',
    data: {
      label: 'Amazon service identifies the issue',
    },
    position: {
      x: 350,
      y: 50,
    },
  },
  {
    id: '4',
    type: 'default',
    data: {
      label: 'Amazon service resolves the issue',
    },
    position: {
      x: 500,
      y: 50,
    },
  },
  {
    id: '5',
    type: 'output',
    data: {
      label: 'Customer is satisfied',
    },
    position: {
      x: 650,
      y: 50,
    },
  },
]

export default function HowToUse() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">FlowCraft</span>
              <Image className="h-8 w-auto" src={FlowCraftLogo} alt="" />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/"
              className="rounded-md bg-pink-500 px-3 py-2.5 text-sm font-semibold leading-6 text-white hover:bg-pink-200"
            >
              Try Now <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">FlowCraft</span>
                <Image
                  className="h-8 w-auto"
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
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="py-6">
                  <Link
                    href="/"
                    className="-mx-3 block rounded-lg bg-pink-500 px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Try Now
                  </Link>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="relative isolate pt-14">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
          />
        </svg>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="mt-5 max-w-lg text-2xl font-bold tracking-tight text-pink-900 sm:text-6xl">
              Stop Wasting Time Creating Diagrams
            </h1>
            <p className="mt-6 text-lg leading-8 text-pink-600">
              Effortlessly create beautiful and professional diagrams using only
              your natural language descriptions.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/"
                className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Start Creating Diagrams Now <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="relative ml-3 lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
            <div className="ml-5 mt-14 h-screen w-11/12 rounded-xl bg-pink-50 shadow-lg">
              <ReactFlow
                nodes={exampleNodes}
                edges={exampleEdges}
                fitView={true}
              >
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
