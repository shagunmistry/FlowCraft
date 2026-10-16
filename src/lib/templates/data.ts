// Server-side data layer for diagram_templates. Reads use the service role
// client so they work at build time inside `generateStaticParams` /
// `generateMetadata`.
import { createClient } from '@supabase/supabase-js'
import { TEMPLATE_TYPES } from './types'
import { TEMPLATE_TOPICS } from './topics'
import { isExcluded } from './exclusions'

export interface TemplateRow {
  id: string
  type: string
  topic_slug: string
  topic_title: string
  topic_category: string
  data: any
  thumbnail_svg: string | null
  title: string
  description: string
  long_description: string
  faqs: { q: string; a: string }[]
  seo_keywords: string[]
  hidden: boolean
  updated_at: string
}

/**
 * Lightweight projection for list/gallery views — omits the heavy
 * `data`, `long_description`, `faqs`, `seo_keywords`, and `thumbnail_svg`
 * columns so RSC payloads/ISR fallbacks stay small. Thumbnails are served
 * on demand via /api/templates/[id]/thumbnail.
 */
export interface TemplateListRow {
  id: string
  type: string
  topic_slug: string
  topic_title: string
  topic_category: string
  title: string
  description: string
  updated_at: string
}

const LIST_COLUMNS =
  'id,type,topic_slug,topic_title,topic_category,title,description,updated_at'

function adminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PRIVATE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_PRIVATE_KEY env for templates data layer',
    )
  }
  // Fail fast instead of hanging until the function timeout (300s) when
  // Supabase is slow; callers already degrade gracefully on error.
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(10_000) }),
    },
  })
}

export async function getTemplate(
  typeId: string,
  topicSlug: string,
): Promise<TemplateRow | null> {
  const sb = adminClient()
  const { data, error } = await sb
    .from('diagram_templates')
    .select('*')
    .eq('type', typeId)
    .eq('topic_slug', topicSlug)
    .eq('hidden', false)
    .maybeSingle()
  if (error) throw error
  return data as TemplateRow | null
}

export async function listTemplates(filter?: {
  type?: string
  topic?: string
  category?: string
}): Promise<TemplateListRow[]> {
  const sb = adminClient()
  let q = sb.from('diagram_templates').select(LIST_COLUMNS).eq('hidden', false)
  if (filter?.type) q = q.eq('type', filter.type)
  if (filter?.topic) q = q.eq('topic_slug', filter.topic)
  if (filter?.category) q = q.eq('topic_category', filter.category)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as unknown as TemplateListRow[]
}

/** Fetch just the SVG thumbnail blob for a single template. */
export async function getTemplateThumbnail(
  id: string,
): Promise<string | null> {
  const sb = adminClient()
  const { data, error } = await sb
    .from('diagram_templates')
    .select('thumbnail_svg')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data?.thumbnail_svg as string | null) ?? null
}

/** Returns every (type, topic) pair the gallery should statically generate. */
export function allTemplatePairs(): { typeId: string; topicSlug: string }[] {
  const out: { typeId: string; topicSlug: string }[] = []
  for (const t of TEMPLATE_TYPES) {
    for (const topic of TEMPLATE_TOPICS) {
      if (isExcluded(t.id, topic.slug)) continue
      out.push({ typeId: t.id, topicSlug: topic.slug })
    }
  }
  return out
}
