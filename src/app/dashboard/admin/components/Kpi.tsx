export function Kpi({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="rounded-lg border border-rule bg-graphite p-4">
      <div className="text-xs text-fog">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub ? <div className="mt-1 text-xs text-fog">{sub}</div> : null}
    </div>
  )
}
