import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { buildMetadata } from '@/lib/seo'
import PageWithNavbar from '@/components/PageWithNavbar'
import { getAllTools } from '@/lib/tools/loader'

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Free AI Diagram Tools — FlowCraft',
    description:
      'A directory of free AI-powered diagram generators from FlowCraft. Sequence diagrams, ER diagrams, flowcharts, mind maps, and more — generated from a single prompt.',
    path: '/tools',
    keywords: [
      'ai diagram generator',
      'free diagram maker',
      'mermaid ai',
      'flowchart ai',
      'sequence diagram ai',
    ],
  })
}

export default function ToolsIndexPage() {
  const tools = getAllTools()

  return (
    <PageWithNavbar>
      <main className="min-h-screen bg-white pb-24 pt-20">
        <section className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Free AI diagram tools
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Turn a sentence into a diagram. Each tool below is powered by
              FlowCraft&rsquo;s AI — sign up free to generate your own.
            </p>
          </div>

          <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-900 hover:shadow-md"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t.h1 ?? t.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                      {t.meta_description}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center text-sm font-medium text-gray-900">
                    Open tool
                    <ArrowUpRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </PageWithNavbar>
  )
}
