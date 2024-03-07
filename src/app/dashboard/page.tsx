import { createClient } from '@/lib/supabase-auth/server'
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
            <ul role="list">
              {options.map((option) => (
                <li
                  key={option.title}
                  className="mt-4 flex transform justify-between gap-x-6 rounded-xl bg-gray-700 px-6 py-5 shadow-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <Image
                      className="h-24 w-24 flex-none rounded-xl object-cover shadow-xl sm:h-48 sm:w-48"
                      src={option.source}
                      alt={option.title}
                      height={192}
                      width={192}
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="mt-1 text-2xl font-semibold leading-6 text-pink-500">
                        {option.title}
                      </p>
                      <p className="mt-1 text-xl leading-5 text-white">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {/** Show a button to go to the page for the diagram */}
                  <Link
                    href={option.link}
                    className="text-md flex h-24 w-24 items-center justify-center rounded-xl border border-transparent bg-indigo-700 px-4 py-2 font-medium leading-5 text-white shadow-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-pink-500 hover:shadow-2xl"
                  >
                    Create
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
