import type { Metadata } from 'next'
import { listTemplates, type TemplateListRow } from '@/lib/templates/data'
import { TEMPLATE_TYPES } from '@/lib/templates/types'
import { TEMPLATE_TOPICS } from '@/lib/templates/topics'
import { GalleryGrid } from '@/components/Templates/GalleryGrid'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Diagram Templates — Free, Editable | FlowCraft',
  description:
    '420+ ready-to-use diagram templates: flowcharts, sequence diagrams, ER diagrams, Gantt charts, and more. Click to edit in FlowCraft.',
  alternates: { canonical: 'https://flowcraft.app/templates' },
}

function serializeRow(r: TemplateListRow) {
  return {
    id: r.id,
    type: r.type,
    topic_slug: r.topic_slug,
    topic_title: r.topic_title,
    topic_category: r.topic_category,
    description: r.description,
  }
}

export default async function Page() {
  const rows = await listTemplates()

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-paper md:text-5xl">
          {rows.length}+ ready-to-edit diagram templates
        </h1>
        <p className="mt-4 text-lg text-fog">
          Skip the blank canvas. Pick a starting point and edit it in FlowCraft.
        </p>
      </header>
      <GalleryGrid
        rows={rows.map(serializeRow)}
        types={TEMPLATE_TYPES.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
        }))}
        topics={TEMPLATE_TOPICS.map((t) => ({
          slug: t.slug,
          title: t.title,
          category: t.category,
        }))}
      />
    </main>
  )
}
