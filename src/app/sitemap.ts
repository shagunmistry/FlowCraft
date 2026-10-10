import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-auth/server'
import { getAllTools } from '@/lib/tools/loader'
import { listTemplates } from '@/lib/templates/data'
import { TEMPLATE_TYPES, TEMPLATE_TYPE_BY_ID } from '@/lib/templates/types'
import { TEMPLATE_TOPICS } from '@/lib/templates/topics'

const SITE = 'https://flowcraft.app'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${SITE}/`, changeFrequency: 'daily', priority: 1 },
  { url: `${SITE}/pricing`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE}/features`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE}/gallery`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${SITE}/blogs`, changeFrequency: 'daily', priority: 0.8 },
  { url: `${SITE}/support`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE}/tools`, changeFrequency: 'weekly', priority: 0.8 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const base: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    ...r,
    lastModified: now,
  }))

  const toolEntries: MetadataRoute.Sitemap = getAllTools().map((t) => ({
    url: `${SITE}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Templates: hub + per-type + per-topic + every detail row.
  let templateEntries: MetadataRoute.Sitemap = []
  try {
    const rows = await listTemplates()
    templateEntries = [
      {
        url: `${SITE}/templates`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...TEMPLATE_TYPES.map((t) => ({
        url: `${SITE}/templates/${t.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...TEMPLATE_TOPICS.map((tp) => ({
        url: `${SITE}/templates/topic/${tp.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...rows.flatMap((r) => {
        const t = TEMPLATE_TYPE_BY_ID[r.type]
        if (!t) return []
        return [
          {
            url: `${SITE}/templates/${t.slug}/${r.topic_slug}`,
            lastModified: r.updated_at ? new Date(r.updated_at) : now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          },
        ]
      }),
    ]
  } catch {
    // If templates DB is not yet seeded, fall back to just the static routes.
    templateEntries = []
  }

  try {
    const supabase = await createClient()

    const [blogsRes, sharedRes] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('id, published_at')
        .order('published_at', { ascending: false })
        .limit(1000),
      supabase
        .from('shareable_links')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(5000),
    ])

    const blogEntries: MetadataRoute.Sitemap = (blogsRes.data ?? []).map(
      (row: { id: string; published_at: string | null }) => ({
        url: `${SITE}/blogs/${row.id}`,
        lastModified: row.published_at ? new Date(row.published_at) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }),
    )

    const sharedEntries: MetadataRoute.Sitemap = (sharedRes.data ?? []).map(
      (row: { id: string; created_at: string | null }) => ({
        url: `${SITE}/shared/${row.id}`,
        lastModified: row.created_at ? new Date(row.created_at) : now,
        changeFrequency: 'monthly',
        priority: 0.5,
      }),
    )

    return [
      ...base,
      ...toolEntries,
      ...templateEntries,
      ...blogEntries,
      ...sharedEntries,
    ]
  } catch {
    return [...base, ...toolEntries, ...templateEntries]
  }
}
