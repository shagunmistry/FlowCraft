'use client'
import Link from 'next/link'

import { EditorSection } from './EditorSection'
import { TinyWaveFormIcon } from './TinyWaveFormIcon'

export default function ChartDescriptionInput() {
  return (
    <div>
      <EditorSection />
      <section className="mt-10 lg:mt-12">
        <Link
          href="https://forms.gle/xPfF3KtEYMNg5M8D9"
          passHref
          target="_blank"
        >
          <button className="mx-auto flex w-max items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
            <TinyWaveFormIcon
              colors={['fill-green-300', 'fill-pink-300']}
              className="h-2.5 w-2.5"
            />
            <span className="ml-2.5">Give Feedback</span>
          </button>
        </Link>
      </section>
    </div>
  )
}
