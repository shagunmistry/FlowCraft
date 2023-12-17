'use client'
import { ChevronRightIcon, StarIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

import FlowCraftLogo from '@/images/FlowCraftLogo.png'
import ReactFlow, { Controls, MiniMap } from 'reactflow'
import { ReactFlowExamples } from '@/lib/react-flow.code'
import FlowCraftTeacher from '@/images/FlowCraft_ForTeachers_Pic.png'

export default function Example() {
  const squareSvgs = () => {
    return (
      <>
        <defs>
          <pattern
            id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
            x={0}
            y={0}
            width={15}
            height={15}
            patternUnits="userSpaceOnUse"
          >
            <rect
              x={0}
              y={0}
              width={2}
              height={2}
              className="text-pink-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect
          width={404}
          height={392}
          fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
        />
      </>
    )
  }

  return (
    <div className="bg-white">
      <main>
        {/* Hero section */}
        <div className="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-48">
          <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div>
              <div className="mt-20">
                <div className="mt-6 sm:max-w-xl">
                  <h1 className="text-4xl font-bold tracking-tight text-pink-900 sm:text-5xl">
                    Engage Students, Explain Concepts, and Elevate Learning
                  </h1>
                  <p className="mt-6 text-xl text-gray-500">
                    Teachers, say goodbye to static slides and hello to
                    interactive diagrams & charts that bring your lessons to
                    life.
                  </p>
                </div>
                <form
                  action="#"
                  className="mt-12 sm:flex sm:w-full sm:max-w-lg"
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor="hero-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="hero-email"
                      type="email"
                      className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-pink-900 placeholder-gray-500 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:ml-3 sm:mt-0">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent bg-pink-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 sm:px-10"
                    >
                      Get Started
                    </button>
                  </div>
                </form>
                <div className="mt-6">
                  <div className="inline-flex items-center divide-x divide-gray-300">
                    <div className="flex flex-shrink-0 pr-5">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <StarIcon
                          key={item}
                          className="h-5 w-5 text-yellow-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 py-1 pl-5 text-sm text-gray-500 sm:py-3">
                      <span className="font-medium text-pink-900">
                        Rated 5 stars
                      </span>{' '}
                      by{' '}
                      <span className="font-medium text-pink-500">
                        Teachers and Educators
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="hidden sm:block">
                <div className="absolute inset-y-0 left-1/2 w-screen rounded-l-3xl bg-pink-50 lg:left-80 lg:right-0 lg:w-full" />
                <svg
                  className="absolute right-1/2 top-8 -mr-3 lg:left-0 lg:m-0"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  {squareSvgs()}
                </svg>
              </div>
              <div className="relative -mr-40 pl-6 shadow-lg sm:mx-auto sm:max-w-3xl sm:px-0 lg:h-full lg:max-w-none lg:pl-12">
                <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-black text-2xl font-bold text-rose-400">
                  "How does the mitochondria produce energy?"
                </h1>
                <ReactFlow
                  nodes={ReactFlowExamples.forTeachersMitochondria.nodes}
                  edges={ReactFlowExamples.forTeachersMitochondria.edges}
                  fitView={true}
                  className="overflow-hidden rounded-lg bg-black shadow-lg lg:h-full lg:w-full"
                  attributionPosition="top-right"
                >
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial/stats section */}
        <div className="relative mt-20">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24 lg:px-8">
            <div className="relative sm:py-16 lg:py-0">
              <div
                aria-hidden="true"
                className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
              >
                <div className="absolute inset-y-0 right-1/2 w-full rounded-r-3xl bg-pink-50 lg:right-72" />
                <svg
                  className="absolute left-1/2 top-8 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  {squareSvgs()}
                </svg>
              </div>
              <div className="relative mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-none lg:px-0 lg:py-20">
                <div className="relative overflow-hidden rounded-2xl pb-10 pt-64 shadow-xl">
                  <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    src={FlowCraftTeacher}
                    alt="FlowCraft Teacher"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-600 via-pink-600 opacity-90" />
                  <div className="relative px-8">
                    <blockquote className="mt-8">
                      <div className="relative text-lg font-medium text-white md:flex-grow">
                        <svg
                          className="absolute left-0 top-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-pink-400"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="relative">
                          FlowCraft diagrams have become my secret weapon for
                          simple and effective diagrams. I can tailor visuals to
                          different learning styles, and it's like each student
                          finally clicks!
                        </p>
                      </div>

                      <footer className="mt-4">
                        <p className="text-base font-semibold text-pink-200">
                          Mrs. Thompson, 6th Grade Science Teacher
                        </p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto max-w-md px-6 sm:max-w-3xl lg:px-0">
              {/* Content area */}
              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h2 className="text-3xl font-bold tracking-tight text-pink-900 sm:text-4xl">
                  Visually Explain Even the Toughest Topics
                </h2>
                <div className="mt-6 space-y-6 text-gray-500">
                  <p className="text-base leading-7">
                    Our FlowCraft AI-Assisted diagrams transform complex
                    concepts into clear, eye-catching visuals that ignite
                    understanding and leave your students saying "Aha!" not
                    "Huh?".
                  </p>
                </div>
              </div>

              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h2 className="text-3xl font-bold tracking-tight text-pink-900 sm:text-4xl">
                  Boost Engagement and Retention with Interactive Visuals
                </h2>
                <div className="mt-6 space-y-6 text-gray-500">
                  <p className="text-base leading-7">
                    Passive lectures are a thing of the past. Our interactive
                    FlowCraft Diagrams, keep students glued to their screens and
                    actively participate in their learning journey. Say hello to
                    soaring engagement and knowledge retention that sticks!
                  </p>
                </div>
              </div>

              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h2 className="text-3xl font-bold tracking-tight text-pink-900 sm:text-4xl">
                  More Time to Inspire, Less Time Juggling Tools
                </h2>
                <div className="mt-6 space-y-6 text-gray-500">
                  <p className="text-base leading-7">
                    Stop wasting precious hours crafting visuals! Our platform
                    allows you to create professional-quality diagrams & charts
                    in minutes, freeing up your time to focus on what truly
                    matters: inspiring your students and making learning
                    unforgettable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="relative mt-24 sm:mt-32 sm:py-16">
          <div aria-hidden="true" className="hidden sm:block">
            <div className="absolute inset-y-0 left-0 w-1/2 rounded-r-3xl bg-pink-50" />
            <svg
              className="absolute left-1/2 top-8 -ml-3"
              width={404}
              height={392}
              fill="none"
              viewBox="0 0 404 392"
            >
              {squareSvgs()}
            </svg>
          </div>
          <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-7xl lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-pink-500 px-6 py-10 shadow-xl sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                  viewBox="0 0 1463 360"
                >
                  <path
                    className="text-pink-400 text-opacity-40"
                    fill="currentColor"
                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                  />
                  <path
                    className="text-pink-600 text-opacity-40"
                    fill="currentColor"
                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                  />
                </svg>
              </div>
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Get notified when we&rsquo;re launching.
                  </h2>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-pink-100">
                    We&rsquo;re working hard to finish the development of this
                    site. Sign up to receive updates and we&rsquo;ll let you
                    know when we&rsquo;re ready.
                  </p>
                </div>
                <form
                  action="#"
                  className="mt-12 sm:mx-auto sm:flex sm:max-w-lg"
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor="cta-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      className="block w-full rounded-md border border-transparent px-5 py-3 text-base text-pink-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:ml-3 sm:mt-0">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent bg-pink-900 px-5 py-3 text-base font-medium text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-500 sm:px-10"
                    >
                      Notify me
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
