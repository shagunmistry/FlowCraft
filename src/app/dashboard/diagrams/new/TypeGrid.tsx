'use client'

import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { OptionType } from '@/lib/utils'

const CATEGORIES = [
  { key: 'ALL', label: 'All' },
  { key: 'FLOW', label: 'Flow' },
  { key: 'DATA', label: 'Data' },
  { key: 'SOFTWARE', label: 'Software' },
  { key: 'PLANNING', label: 'Planning' },
] as const
type CatKey = (typeof CATEGORIES)[number]['key']

type Entry = { type: OptionType; description: string; category: CatKey }

const ENTRIES: Entry[] = [
  { type: 'Flowchart', description: 'Process flows & decisions', category: 'FLOW' },
  { type: 'Sequence Diagram', description: 'Interactions between components', category: 'FLOW' },
  { type: 'State Diagram', description: 'States & transitions', category: 'FLOW' },
  { type: 'User Journey', description: 'Experiences step by step', category: 'FLOW' },
  { type: 'Block Diagram', description: 'Components & connections', category: 'FLOW' },
  { type: 'Pie Chart', description: 'Proportional segments', category: 'DATA' },
  { type: 'Quadrant Chart', description: 'Items across four sections', category: 'DATA' },
  { type: 'Sankey', description: 'Flow quantities', category: 'DATA' },
  { type: 'XY Chart', description: 'Two-dimensional data', category: 'DATA' },
  { type: 'Radar', description: 'Compare across axes', category: 'DATA' },
  { type: 'Treemap', description: 'Nested hierarchies', category: 'DATA' },
  { type: 'Class Diagram', description: 'Object-oriented structure', category: 'SOFTWARE' },
  {
    type: 'Entity Relationship Diagram',
    description: 'Relationships between entities',
    category: 'SOFTWARE',
  },
  { type: 'Requirement Diagram', description: 'Requirements & deps', category: 'SOFTWARE' },
  { type: 'Git Graph', description: 'Branches & merges', category: 'SOFTWARE' },
  { type: 'C4 Diagram', description: 'Architecture by level', category: 'SOFTWARE' },
  { type: 'Packet', description: 'Network packet structure', category: 'SOFTWARE' },
  { type: 'Architecture', description: 'System architecture', category: 'SOFTWARE' },
  { type: 'ZenUML', description: 'Text-based UML', category: 'SOFTWARE' },
  { type: 'Gantt', description: 'Project timelines', category: 'PLANNING' },
  { type: 'Mindmaps', description: 'Hierarchical ideas', category: 'PLANNING' },
  { type: 'Timeline', description: 'Chronological events', category: 'PLANNING' },
  { type: 'Kanban', description: 'Progress across stages', category: 'PLANNING' },
]

export default function TypeGrid({
  value,
  onChange,
}: {
  value: OptionType
  onChange: (v: OptionType) => void
}) {
  const [cat, setCat] = useState<CatKey>('ALL')

  const visible = useMemo(
    () => (cat === 'ALL' ? ENTRIES : ENTRIES.filter((e) => e.category === cat)),
    [cat],
  )

  return (
    <div className="space-y-5">
      <div className="text-sm text-fog">Choose a type</div>

      <div className="flex flex-wrap items-center gap-1 border-b border-rule/60">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={clsx(
              '-mb-px px-3 py-2 text-xs transition',
              cat === c.key
                ? 'border-b-2 border-signal text-paper'
                : 'border-b-2 border-transparent text-fog hover:text-paper',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((entry, i) => {
          const selected = value === entry.type
          return (
            <motion.button
              key={entry.type as string}
              type="button"
              onClick={() => onChange(entry.type)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.012, 0.15) }}
              className={clsx(
                'group relative flex flex-col items-start gap-1 overflow-hidden rounded-md border px-4 py-3 text-left transition',
                selected
                  ? 'border-signal bg-signal/10 shadow-[0_0_0_1px_rgb(196_255_61_/_0.4)]'
                  : 'border-rule bg-graphite/40 hover:border-signal/60 hover:bg-graphite',
              )}
            >
              <span
                className={clsx(
                  'font-serif text-base leading-tight',
                  selected ? 'text-paper' : 'text-paper',
                )}
              >
                {entry.type}
              </span>
              <span className="font-sans text-[11px] leading-snug text-fog">
                {entry.description}
              </span>
              {selected && (
                <span className="pointer-events-none absolute right-2 top-2 text-xs text-signal">
                  ✓
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
