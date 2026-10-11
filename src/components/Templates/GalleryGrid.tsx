'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['engineering', 'product', 'ops', 'business', 'data'] as const

interface Row {
  id: string
  type: string
  topic_slug: string
  topic_title: string
  topic_category: string
  description: string
}

interface TypeMeta {
  id: string
  slug: string
  title: string
}

interface TopicMeta {
  slug: string
  title: string
  category: string
}

export function GalleryGrid({
  rows,
  types,
}: {
  rows: Row[]
  types: TypeMeta[]
  topics: ReadonlyArray<TopicMeta>
}) {
  const [q, setQ] = useState('')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set())
  const [activeCats, setActiveCats] = useState<Set<string>>(new Set())

  const typeById = useMemo(
    () => Object.fromEntries(types.map((t) => [t.id, t])),
    [types],
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (activeTypes.size && !activeTypes.has(r.type)) return false
      if (activeCats.size && !activeCats.has(r.topic_category)) return false
      if (
        needle &&
        !`${r.topic_title} ${r.description}`.toLowerCase().includes(needle)
      )
        return false
      return true
    })
  }, [rows, q, activeTypes, activeCats])

  const toggle = (
    set: Set<string>,
    val: string,
    setter: (s: Set<string>) => void,
  ) => {
    const next = new Set(set)
    if (next.has(val)) next.delete(val)
    else next.add(val)
    setter(next)
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:w-64 lg:shrink-0">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search templates…"
          className="w-full rounded-sm border border-rule bg-ink/60 px-4 py-2.5 text-sm text-paper placeholder:text-fog focus:border-signal/40 focus:outline-none"
        />
        <Section title="Diagram type">
          {types.map((t) => (
            <Chip
              key={t.id}
              label={t.title}
              active={activeTypes.has(t.id)}
              onClick={() => toggle(activeTypes, t.id, setActiveTypes)}
            />
          ))}
        </Section>
        <Section title="Category">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c}
              active={activeCats.has(c)}
              onClick={() => toggle(activeCats, c, setActiveCats)}
            />
          ))}
        </Section>
      </aside>

      <div className="flex-1">
        <div className="mb-4 text-sm text-fog">
          {filtered.length} templates
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const t = typeById[r.type]
            if (!t) return null
            return (
              <li key={r.id}>
                <Link
                  href={`/templates/${t.slug}/${r.topic_slug}`}
                  className="block overflow-hidden rounded-sm border border-rule bg-ink/60 transition hover:-translate-y-0.5 hover:border-signal/40"
                >
                  <img
                    src={`/api/templates/${r.id}/thumbnail`}
                    alt={`${r.topic_title} thumbnail`}
                    loading="lazy"
                    decoding="async"
                    className="h-40 w-full bg-graphite object-contain"
                  />
                  <div className="p-4">
                    <div className="mb-2 inline-block rounded-sm border border-rule px-2 py-0.5 text-xs text-signal">
                      {t.title}
                    </div>
                    <div className="text-sm font-medium text-paper">
                      {r.topic_title}
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-fog">
                      {r.description}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
        {filtered.length === 0 && (
          <div className="rounded-sm border border-dashed border-rule p-12 text-center text-fog">
            No templates match your filters.
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-xs font-medium text-fog">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border px-3 py-1 text-sm transition ${
        active
          ? 'border-signal bg-signal text-ink'
          : 'border-rule bg-ink/60 text-fog hover:border-signal/40 hover:text-paper'
      }`}
    >
      {label}
    </button>
  )
}
