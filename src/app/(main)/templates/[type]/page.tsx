import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TEMPLATE_TYPES, TEMPLATE_TYPE_BY_SLUG } from '@/lib/templates/types'
import { listTemplates } from '@/lib/templates/data'

export const revalidate = 86400

export async function generateStaticParams() {
  return TEMPLATE_TYPES.map((t) => ({ type: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>
}): Promise<Metadata> {
  const { type } = await params
  const t = TEMPLATE_TYPE_BY_SLUG[type]
  if (!t) return { title: 'Templates' }
  const url = `https://flowcraft.app/templates/${t.slug}`
  return {
    title: `${t.title} Templates — Free, Editable`,
    description: `${t.blurb} Browse ready-to-use ${t.title.toLowerCase()} templates from FlowCraft.`,
    alternates: { canonical: url },
    openGraph: { title: `${t.title} Templates`, description: t.blurb, url },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const t = TEMPLATE_TYPE_BY_SLUG[type]
  if (!t) notFound()

  const rows = await listTemplates({ type: t.id })

  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-dot-grid bg-dot-24 opacity-60"
      />

      <div className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-20">
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-rule pb-4 text-sm text-fog">
          <nav className="flex items-center gap-2">
            <Link href="/templates" className="transition-colors hover:text-paper">
              Templates
            </Link>
            <span className="text-rule">/</span>
            <span className="text-paper">{t.title}</span>
          </nav>
          <span className="hidden md:inline">
            {rows.length} template{rows.length === 1 ? '' : 's'}
          </span>
        </div>

        <header className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-[44px] leading-[0.95] tracking-[-0.01em] text-paper md:text-[72px]">
              {t.title}
              <br />
              <span className="italic text-signal">templates.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-12">
            <p className="max-w-md text-lg leading-relaxed text-paper/70">
              {t.whenToUse}
            </p>
          </div>
        </header>

        {rows.length > 0 ? (
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/templates/${t.slug}/${r.topic_slug}`}
                  className="group flex h-full flex-col bg-ink transition-colors duration-300 hover:bg-graphite"
                >
                  <div className="relative overflow-hidden border-b border-rule bg-graphite/60">
                    <img
                      src={`/api/templates/${r.id}/thumbnail`}
                      alt={`${r.topic_title} thumbnail`}
                      loading="lazy"
                      decoding="async"
                      className="h-44 w-full object-contain p-4"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-center justify-between text-xs text-fog">
                      <span className="text-signal">{t.title}</span>
                    </div>
                    <div className="font-serif text-xl text-paper">
                      {r.topic_title}
                    </div>
                    <div className="line-clamp-2 text-xs leading-relaxed text-paper/60">
                      {r.description}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-sm border border-dashed border-rule bg-graphite/40 p-16 text-center">
            <div className="text-sm text-fog">
              No templates yet
            </div>
            <p className="mt-4 text-paper/70">
              Templates for this type are in the drafting room.
            </p>
          </div>
        )}

        <div className="mt-16 flex items-center justify-between border-t border-rule pt-6 text-sm text-fog">
          <Link
            href="/templates"
            className="group inline-flex items-center gap-3 transition-colors hover:text-signal"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>All templates</span>
          </Link>
          <span className="hidden md:inline">Browse by topic instead</span>
        </div>
      </div>
    </main>
  )
}
