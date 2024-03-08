import { createClient } from '@/lib/supabase-auth/server'
import { PlayIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface Option {
  title: string
  icon: string // Replace with appropriate icon class names
  link: string // Replace with actual links to corresponding pages
  source: string
  description: string
}

const options: Option[] = [
  {
    title: 'Flow Diagram',
    icon: 'fas fa-chart-branch',
    link: '/dashboard/flow-diagram',
    source:
      'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2Fpexels_diagram.jpg?alt=media&token=779cd4b2-3f5d-43e4-999e-369405c4aeff',
    description:
      'Flow diagrams are a great way to Visually represent processes, workflows, and algorithms with clear steps and decision points.',
  },
  {
    title: 'Whiteboard',
    icon: 'fas fa-chalkboard',
    link: '/dashboard/whiteboard',
    source:
      'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2Fpexels_whiteboard.jpg?alt=media&token=eb068b8d-bfcf-41bd-9b5d-986ad0ed235f',
    description:
      'Brainstorm visually using freehand drawing, shapes, and text. This is great for freeform thinking and collaboration.',
  },
  {
    title: 'Chart',
    icon: 'fas fa-chart-bar',
    link: '/dashboard/chart',
    source:
      'https://firebasestorage.googleapis.com/v0/b/shagunresume.appspot.com/o/FlowCraft%2Fpexels_chart.jpg?alt=media&token=6223a617-0ef3-4dd2-8f40-1dfbee282773',
    description:
      'Communicate data insights effectively with various chart types like bar charts, line charts, and pie charts.',
  },
]

export default async function Dashboard() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-black sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="min-h-screen rounded-md p-4">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold leading-9 text-indigo-500">
                What do you want to create today?
              </h1>
              <Link
                className="rounded-md bg-indigo-700 px-4 py-2 font-medium leading-5 text-white text-white shadow-xl hover:bg-pink-500"
                href="/auth/logout"
              >
                Logout
              </Link>
            </div>
            <ul
              role="list"
              className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {options.map((option) => (
                <li
                  key={option.title}
                  className="col-span-1 flex transform flex-col divide-y divide-gray-200 rounded-lg bg-gradient-to-b from-black to-indigo-500 text-center transition duration-300 ease-in-out hover:scale-105"
                >
                  <div className="flex flex-1 flex-col p-8">
                    <Image
                      className="mx-auto h-32 w-32 flex-shrink-0 rounded-full object-cover"
                      src={option.source}
                      height={128}
                      width={128}
                      alt={option.title}
                    />
                    <h3 className="font-large mt-6 text-lg font-bold text-gray-50 sm:text-sm md:text-xl">
                      {option.title}
                    </h3>
                    <dl className="mt-1 flex flex-grow flex-col justify-between">
                      <dt className="sr-only">Description</dt>
                      <dd className="text-md text-white">
                        {option.description}
                      </dd>
                    </dl>
                  </div>
                  <div>
                    <div className="-mt-px flex">
                      <div className="flex w-0 flex-1">
                        <Link
                          href={option.link}
                          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg rounded-br-lg border border-transparent py-4 text-lg font-medium text-gray-50 transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700 hover:text-white"
                        >
                          <PlayIcon
                            className="h-5 w-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Create
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
