import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  TEMPLATE_TOPICS,
  TEMPLATE_TOPIC_BY_SLUG,
} from '@/lib/templates/topics'
import { TEMPLATE_TYPES } from '@/lib/templates/types'
import { listTemplates } from '@/lib/templates/data'

export const revalidate = 86400

export async function generateStaticParams() {
  return TEMPLATE_TOPICS.map((t) => ({ topic: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>
}): Promise<Metadata> {
  const { topic } = await params
  const tp = TEMPLATE_TOPIC_BY_SLUG[topic]
  if (!tp) return { title: 'Topic templates' }
  const url = `https://flowcraft.app/templates/topic/${tp.slug}`
  return {
    title: `${tp.title} — Diagram Templates Across All Types`,
    description: `See ${tp.title} as a flowchart, sequence diagram, mind map, and more. ${tp.blurb}`,
    alternates: { canonical: url },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await params
  const tp = TEMPLATE_TOPIC_BY_SLUG[topic]
  if (!tp) notFound()

  const rows = await listTemplates({ topic: tp.slug })
  const byType = new Map(rows.map((r) => [r.type, r] as const))

  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-dot-grid bg-dot-24 opacity-60"
      />

      <div className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-20">
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-rule pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
          <nav className="flex items-center gap-2">
            <Link href="/templates" className="transition-colors hover:text-paper">
              Templates
            </Link>
            <span className="text-rule">/</span>
            <span className="text-paper">{tp.title}</span>
          </nav>
          <span className="hidden md:inline">Cross-reference</span>
        </div>

        <header className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-[44px] leading-[0.95] tracking-[-0.01em] text-paper md:text-[72px]">
              {tp.title}
              <span className="text-fog">,</span>
              <br />
              <span className="italic text-signal">every diagram type.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-12">
            <p className="max-w-md text-lg leading-relaxed text-paper/70">
              {tp.blurb}
            </p>
          </div>
        </header>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule">
          {TEMPLATE_TYPES.map((t, i) => {
            const r = byType.get(t.id)
            if (!r) return null
            return (
              <li key={t.id}>
                <Link
                  href={`/templates/${t.slug}/${tp.slug}`}
                  className="group flex flex-col gap-5 bg-ink p-5 transition-colors duration-300 hover:bg-graphite sm:flex-row sm:items-center"
                >
                  <div className="relative shrink-0 overflow-hidden rounded-sm border border-rule bg-graphite/60 sm:w-64">
                    <img
                      src={`/api/templates/${r.id}/thumbnail`}
                      alt={`${r.title} thumbnail`}
                      loading="lazy"
                      decoding="async"
                      className="h-36 w-full object-contain p-3"
                    />
                    <span className="absolute bottom-1.5 right-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-fog">
                      Fig. {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
                      <span className="h-px w-8 bg-signal/50" />
                      <span>{t.title}</span>
                    </div>
                    <div className="mt-3 font-serif text-2xl text-paper">
                      {r.title}
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/60">
                      {r.description}
                    </div>
                  </div>
                  <span className="hidden font-mono text-fog transition-all duration-300 group-hover:translate-x-1 group-hover:text-signal sm:inline">
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-16 flex items-center justify-between border-t border-rule pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-fog">
          <Link
            href="/templates"
            className="group inline-flex items-center gap-3 transition-colors hover:text-signal"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>All templates</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
