'use client'
import Image from 'next/image'
import Link from 'next/link'

import FlowCraftLogo from '@/images/FlowCraftLogo.png'
import { EditorSection } from './EditorSection'
import { TinyWaveFormIcon } from './TinyWaveFormIcon'
import { useState } from 'react'

export default function ChartDescriptionInput() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <EditorSection />
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
      </section>
    </div>
  )
}
