'use client'

import { Fragment, useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { EditorSection } from '@/components/EditorSection'
import { AudioPlayer } from '@/components/player/AudioPlayer'
import { TinyWaveFormIcon } from '@/components/TinyWaveFormIcon'
import { Waveform } from '@/components/Waveform'
import FlowCraftLogo from '@/images/FlowCraftLogo.png'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { Edge, Node } from 'reactflow'

import { Analytics } from '@vercel/analytics/react'
import { exampleTitlesAndDescriptions } from '@/components/TextBox'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let hosts = ['Shagun Mistry']

  const [title, setTitle] = useState<string>(
    exampleTitlesAndDescriptions[2].title,
  )
  const [description, setDescription] = useState<string>(
    exampleTitlesAndDescriptions[2].description,
  )
  const [isOpen, setIsOpen] = useState(false)

  const [nodes, _setNodes] = useState<Node[]>([])
  const [edges, _setEdges] = useState<Edge[]>([])

  const [loading, _setLoading] = useState<boolean>(false)

  return (
    <DiagramContext.Provider
      value={{
        nodes: nodes,
        edges: edges,
        setNodes: _setNodes,
        setEdges: _setEdges,
        title: title,
        description: description,
        loading: loading,
        setLoading: _setLoading,
      }}
    >
      <header className="bg-pink-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
        <div className="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:whitespace-nowrap lg:py-12 lg:text-sm lg:leading-7 lg:[writing-mode:vertical-rl]">
          <span className="font-mono text-slate-500">Hosted by</span>
          <span className="mt-6 flex gap-6 font-bold text-slate-900">
            {hosts.map((host, hostIndex) => (
              <Fragment key={host}>
                {hostIndex !== 0 && (
                  <span aria-hidden="true" className="text-slate-400">
                    /
                  </span>
                )}
                {host}
              </Fragment>
            ))}
          </span>
        </div>
        <div className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:px-8 lg:py-12 xl:px-12">
          <Link
            href="/"
            className="relative mx-auto block w-48 overflow-hidden rounded-lg bg-pink-200 shadow-xl shadow-slate-200 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
            aria-label="Homepage"
          >
            <Image
              className="w-full"
              src={FlowCraftLogo}
              alt=""
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
              priority
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 sm:rounded-xl lg:rounded-2xl" />
          </Link>
          <div className="mt-10 text-center lg:mt-12 lg:text-left">
            <p className="text-xl font-bold text-slate-900">
              <Link href="/">FlowCraft</Link>
            </p>
            <p className="mt-3 text-lg font-medium leading-8 text-slate-700">
              Where Ideas Take Shape
            </p>
          </div>
          <div className="mt-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-md flex w-full items-center justify-between text-left font-medium text-pink-500 hover:text-pink-600 hover:underline focus:outline-none"
            >
              How to Use
              <span className="ml-2">{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && (
              <div className="mt-2">
                <p className="text-sm text-pink-500">
                  We use the power of AI to help you create beautiful diagrams.
                  <br />
                  Simply type in the title of your diagram and a description of
                  what you want to create. The more descriptive you are, the
                  better the diagram will be.
                </p>
              </div>
            )}
          </div>

          <EditorSection className="mt-12 hidden lg:block" />
          <section className="mt-10 lg:mt-12">
            <Link href="https://forms.gle/xPfF3KtEYMNg5M8D9">
              <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2">
                <TinyWaveFormIcon
                  colors={['fill-indigo-300', 'fill-blue-300']}
                  className="h-2.5 w-2.5"
                />
                <span className="ml-2.5">Give Feedback</span>
              </button>
            </Link>
            <div className="h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden" />
          </section>
        </div>
      </header>
      <main className="border-t border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
        <Waveform className="absolute left-0 top-0 h-20 w-full" />
        <div className="relative">{children}</div>
      </main>
      <footer className="border-t border-slate-200 bg-pink-50 py-10 pb-40 sm:py-16 sm:pb-32 lg:hidden">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          <EditorSection />
          <h2 className="mt-8 flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
            <span className="ml-2.5">Hosted by</span>
          </h2>
          <div className="mt-2 flex gap-6 text-sm font-bold leading-7 text-slate-900">
            {hosts.map((host, hostIndex) => (
              <Fragment key={host}>
                {hostIndex !== 0 && (
                  <span aria-hidden="true" className="text-slate-400">
                    /
                  </span>
                )}
                {host}
              </Fragment>
            ))}
          </div>
        </div>
      </footer>
      {/* <div className="fixed inset-x-0 bottom-0 z-10 lg:left-112 xl:left-120">
        <AudioPlayer />
      </div> */}
      <Analytics />
    </DiagramContext.Provider>
  )
}
