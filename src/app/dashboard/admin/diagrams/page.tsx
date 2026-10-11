import { adminFetch } from '../lib/admin-api'
import { CategoryBar, CategoryDoughnut, StackedAreaChart } from '../components/AdminChart.client'

export const dynamic = 'force-dynamic'

type Overview = {
  diagrams: { by_source: Record<string, number>; by_type: Record<string, number> }
}
type Timeseries = { rows: { day: string; bucket: string; count: number }[] }
type TopDiagrams = {
  rows: {
    id: number
    title: string
    user_id: string
    type: string
    source: string
    views: number
    likes: number
    created_at: string
  }[]
}

export default async function AdminDiagramsPage() {
  const [overview, byTypeTs, topViews, topLikes] = await Promise.all([
    adminFetch<Overview>('/overview'),
    adminFetch<Timeseries>('/diagrams/timeseries?days=30&group_by=type'),
    adminFetch<TopDiagrams>('/diagrams/top?metric=views&limit=10'),
    adminFetch<TopDiagrams>('/diagrams/top?metric=likes&limit=10'),
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CategoryDoughnut data={overview.diagrams.by_type} title="By type (all-time)" />
        <CategoryBar data={overview.diagrams.by_source} title="By source (all-time)" />
      </div>

      <StackedAreaChart rows={byTypeTs.rows} title="Diagrams per day, last 30d (by type)" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TopList title="Top by views" rows={topViews.rows} metric="views" />
        <TopList title="Top by likes" rows={topLikes.rows} metric="likes" />
      </div>
    </div>
  )
}

function TopList({
  title,
  rows,
  metric,
}: {
  title: string
  rows: TopDiagrams['rows']
  metric: 'views' | 'likes'
}) {
  return (
    <div className="rounded-lg border border-rule bg-graphite p-4">
      <div className="mb-3 text-sm font-medium">{title}</div>
      <ol className="space-y-1 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="flex justify-between gap-2">
            <span className="truncate">
              <span className="text-fog">[{r.source}]</span> {r.title || 'Untitled'}
            </span>
            <span className="tabular-nums text-paper">{r[metric]}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
