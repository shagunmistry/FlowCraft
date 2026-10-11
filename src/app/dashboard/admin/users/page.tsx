import { adminFetch } from '../lib/admin-api'
import { Kpi } from '../components/Kpi'
import { SimpleLineChart } from '../components/AdminChart.client'

export const dynamic = 'force-dynamic'

type Overview = {
  users: { total: number; new_today: number; new_7d: number; new_30d: number }
  subscriptions: { active: number; mrr_estimate: number }
}
type UserTs = { rows: { day: string; count: number }[] }
type TopUsers = {
  rows: {
    user_id: string
    email: string
    diagrams_created: number
    subscribed: boolean
    plan: string | null
  }[]
}

export default async function AdminUsersPage() {
  const [overview, ts, top] = await Promise.all([
    adminFetch<Overview>('/overview'),
    adminFetch<UserTs>('/users/timeseries?days=30'),
    adminFetch<TopUsers>('/users/top?limit=15'),
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="Total" value={overview.users.total} />
        <Kpi label="New today" value={overview.users.new_today} />
        <Kpi label="Active subs" value={overview.subscriptions.active} />
        <Kpi label="MRR (est)" value={`$${overview.subscriptions.mrr_estimate.toLocaleString()}`} />
      </div>

      <SimpleLineChart rows={ts.rows} title="New users per day, last 30d" />

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 text-sm font-medium">Top users by diagrams created</div>
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-gray-500">
            <tr>
              <th className="py-1">Email</th>
              <th className="py-1">Diagrams</th>
              <th className="py-1">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {top.rows.map((u) => (
              <tr key={u.user_id} className="border-t border-gray-100">
                <td className="py-1 truncate">{u.email || u.user_id}</td>
                <td className="py-1 tabular-nums">{u.diagrams_created ?? 0}</td>
                <td className="py-1">{u.subscribed ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
