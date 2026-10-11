'use client'

import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/20/solid'
import type { ToolPage } from '@/lib/tools/types'

const STASH_KEY = 'flowcraft.toolDemoSeed'

export default function ToolLiveDemoCta({ tool }: { tool: ToolPage }) {
  const signUpHref = `/sign-up?prompt=${encodeURIComponent(
    tool.example_prompt,
  )}&type=${encodeURIComponent(tool.diagram_type)}`

  const stash = () => {
    try {
      sessionStorage.setItem(
        STASH_KEY,
        JSON.stringify({
          prompt: tool.example_prompt,
          type: tool.diagram_type,
          slug: tool.slug,
          ts: Date.now(),
        }),
      )
    } catch {
      // ignore — sessionStorage may be disabled
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <label
        htmlFor="tool-demo-prompt"
        className="flex items-center gap-2 text-sm font-semibold text-gray-500"
      >
        <SparklesIcon className="h-4 w-4 text-pink-500" />
        Try this prompt
      </label>
      <textarea
        id="tool-demo-prompt"
        readOnly
        rows={3}
        value={tool.example_prompt}
        className="mt-3 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-4 text-base leading-relaxed text-gray-800 focus:outline-none"
      />
      <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Sign up free — get 3 AI generations on the house.
        </p>
        <Link
          href={signUpHref}
          onClick={stash}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Generate with AI — Free
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
