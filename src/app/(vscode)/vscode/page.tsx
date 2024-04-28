import {
  ChevronRightIcon,
  CloudArrowUpIcon,
  ComputerDesktopIcon,
  EyeIcon,
  UsersIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'

import FlowCraftLogo from '@/images/FlowCraftLogo_New.png'
import Link from 'next/link'

const features = [
  {
    name: 'Effortless Conversion',
    description:
      'Select your code (a block or the whole file, your call) and convert it into any of the supported diagrams with a single click.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Code Clarity',
    description:
      'Get a bird’s eye view of your code structure and logic. No more getting lost in the weeds.',
    icon: EyeIcon,
  },
  {
    name: 'Built for Devs',
    description:
      'We built this extension for devs, by devs. It’s designed to make your life easier and your code more readable.',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Communication Made Easy',
    description:
      'Share your diagrams with your team or stakeholders. No more long-winded explanations.',
    icon: UsersIcon,
  },
]

export default function VsCodeExtensionPage() {
  return (
    <div className="bg-gray-100">
      {/** Hero Section */}
      <div className="relative isolate overflow-hidden">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-blue-500 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
          />
        </svg>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <Image
              className="h-11 w-11"
              src={FlowCraftLogo}
              alt="FlowCraft Logo"
            />
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              FlowCraft now in
              <br />
              <span className="text-blue-600">VS Code</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Hey devs, tired of staring at lines of code and trying to untangle
              the logic spaghetti?
              <br />
              <span className="font-semibold text-blue-500">
                Been there, done that.
              </span>
              <br />
              That's why we built the FlowCraft VS Code extension - to bring the
              power of visual flowcharts straight to your editor. <br />
              No more context switching, no more head-scratching. <br />
              <span className="font-semibold text-blue-500">
                Just pure, diagramming awesomeness.
              </span>
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="https://marketplace.visualstudio.com/items?itemName=FlowCraft.flowcraft"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-300 ease-in-out hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get VS Code Extension
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-x-2 font-semibold text-blue-600 transition-colors duration-300 ease-in-out hover:text-blue-500"
              >
                Sign up for FlowCraft
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-blue-900/5 p-2 ring-1 ring-inset ring-blue-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2FFlowCraft_VSCodeScreenshot.png?alt=media&token=acf80398-203c-4b0d-a135-fa9b0273fe85"
                  alt="FlowCraft VS Code Extension Screenshot"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-blue-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** Features Section */}
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">
            Features
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Visualize your code with ease
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            FlowCraft VS Code extension is designed for devs by devs. Here's
            what it offers:
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/** CTA Section */}
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Code Reborn As Beautiful Diagrams
            <br />
            <span className="text-blue-600">Get started now.</span>
          </h2>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="https://marketplace.visualstudio.com/items?itemName=FlowCraft.flowcraft"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get VS Code Extension
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
