import ToolLiveDemoCta from './ToolLiveDemoCta'
import type { ToolPage } from '@/lib/tools/types'

export default function ToolHero({ tool }: { tool: ToolPage }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-200 to-indigo-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-12 pt-20 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-gray-900 md:text-6xl">
            {tool.h1 ?? tool.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
            {tool.meta_description}
          </p>
        </div>

        <div className="mt-10">
          <ToolLiveDemoCta tool={tool} />
        </div>
      </div>
    </section>
  )
}
