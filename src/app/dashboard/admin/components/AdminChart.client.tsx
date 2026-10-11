'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
)

const PALETTE = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

type Row = { day: string; bucket?: string; count?: number; likes?: number; saves?: number }

function bucketsFromRows(rows: Row[]): { days: string[]; series: Record<string, number[]> } {
  const days = Array.from(new Set(rows.map((r) => r.day))).sort()
  const series: Record<string, number[]> = {}
  for (const r of rows) {
    const key = r.bucket || 'count'
    if (!series[key]) series[key] = days.map(() => 0)
    const i = days.indexOf(r.day)
    series[key][i] = (r.count ?? 0) as number
  }
  return { days, series }
}

export function StackedAreaChart({ rows, title }: { rows: Row[]; title?: string }) {
  const { days, series } = bucketsFromRows(rows)
  const data = {
    labels: days,
    datasets: Object.entries(series).map(([k, vals], idx) => ({
      label: k,
      data: vals,
      backgroundColor: PALETTE[idx % PALETTE.length] + '80',
      borderColor: PALETTE[idx % PALETTE.length],
      fill: true,
      tension: 0.3,
    })),
  }
  return (
    <div className="rounded-lg border border-rule bg-graphite p-4">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { position: 'bottom' } },
          scales: { y: { stacked: true, beginAtZero: true } },
        }}
      />
    </div>
  )
}

export function SimpleLineChart({
  rows,
  title,
}: {
  rows: { day: string; count: number }[]
  title?: string
}) {
  const data = {
    labels: rows.map((r) => r.day),
    datasets: [
      {
        label: 'count',
        data: rows.map((r) => r.count),
        borderColor: PALETTE[0],
        backgroundColor: PALETTE[0] + '40',
        fill: true,
        tension: 0.3,
      },
    ],
  }
  return (
    <div className="rounded-lg border border-rule bg-graphite p-4">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  )
}

export function EngagementChart({
  rows,
  title,
}: {
  rows: { day: string; likes: number; saves: number }[]
  title?: string
}) {
  const data = {
    labels: rows.map((r) => r.day),
    datasets: [
      {
        label: 'likes',
        data: rows.map((r) => r.likes),
        backgroundColor: PALETTE[0] + '80',
        borderColor: PALETTE[0],
        fill: true,
        tension: 0.3,
      },
      {
        label: 'saves',
        data: rows.map((r) => r.saves),
        backgroundColor: PALETTE[1] + '80',
        borderColor: PALETTE[1],
        fill: true,
        tension: 0.3,
      },
    ],
  }
  return (
    <div className="rounded-lg border border-rule bg-graphite p-4">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { position: 'bottom' } },
          scales: { y: { stacked: true, beginAtZero: true } },
        }}
      />
    </div>
  )
}

export function CategoryDoughnut({
  data,
  title,
}: {
  data: Record<string, number>
  title?: string
}) {
  const labels = Object.keys(data)
  const values = Object.values(data)
  return (
    <div className="rounded-lg border border-rule bg-graphite p-4">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
            },
          ],
        }}
        options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
      />
    </div>
  )
}

export function CategoryBar({
  data,
  title,
}: {
  data: Record<string, number>
  title?: string
}) {
  const labels = Object.keys(data)
  const values = Object.values(data)
  return (
    <div className="rounded-lg border border-rule bg-graphite p-4">
      {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'count',
              data: values,
              backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
            },
          ],
        }}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
    </div>
  )
}
