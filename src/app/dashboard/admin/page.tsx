import { adminFetch } from './lib/admin-api'
import { Kpi } from './components/Kpi'
import { StackedAreaChart } from './components/AdminChart.client'

export const dynamic = 'force-dynamic'

type Overview = {
  users: { total: number; new_today: number; new_7d: number; new_30d: number }
  diagrams: {
    total: number
    today: number
    last_7d: number
    last_30d: number
    by_source: Record<string, number>
    by_type: Record<string, number>
  }
  subscriptions: { active: number; mrr_estimate: number }
  legacy: { diagrams_from_api_total: number }
}

type Timeseries = {
  days: number
  group_by: string
  rows: { day: string; bucket: string; count: number }[]
}

export default async function AdminOverviewPage() {
  const [overview, timeseries] = await Promise.all([
    adminFetch<Overview>('/overview'),
    adminFetch<Timeseries>('/diagrams/timeseries?days=30&group_by=source'),
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="Total users" value={overview.users.total} sub={`+${overview.users.new_7d} in 7d`} />
        <Kpi
          label="Total diagrams"
          value={overview.diagrams.total}
          sub={`+${overview.diagrams.last_7d} in 7d`}
        />
        <Kpi label="Active subs" value={overview.subscriptions.active} />
        <Kpi
          label="MRR (est)"
          value={`$${overview.subscriptions.mrr_estimate.toLocaleString()}`}
          sub="est. flat-rate"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="New today" value={overview.users.new_today} />
        <Kpi label="Diagrams today" value={overview.diagrams.today} />
        <Kpi label="Web" value={overview.diagrams.by_source['web'] ?? 0} />
        <Kpi label="VS Code" value={overview.diagrams.by_source['vscode'] ?? 0} />
      </div>

      <StackedAreaChart
        rows={timeseries.rows}
        title="Diagrams per day, last 30d (by source)"
      />

      {overview.legacy.diagrams_from_api_total > 0 ? (
        <div className="text-xs text-fog">
          Legacy v1 API table (`diagrams_from_api`) has{' '}
          {overview.legacy.diagrams_from_api_total} rows, counted under VS Code.
        </div>
      ) : null}
    </div>
  )
}
