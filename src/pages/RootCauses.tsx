import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardTitle } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { mockApi } from '../services/mockApi'

export function RootCauses() {
  const result = useAsyncData(() => mockApi.rootCauses(), [])
  const isTablet = useMediaQuery('(min-width: 768px)')
  if (result.loading || !result.data) return <PageSkeleton />
  const data = result.data

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Diagnosis"
        title="Root Causes"
        subtitle="Recurring failure signatures the agent can recognize, reuse and eventually prevent."
      />
      <Card>
        <CardTitle title="Top recurring root causes this month" subtitle="Pareto view of exception volume." />
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: isTablet ? 12 : 4, right: 8 }}>
              <CartesianGrid stroke="#e4ebf2" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#4a6a94', fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={isTablet ? 210 : 108}
                tick={{ fill: '#1a2b45', fontSize: isTablet ? 12 : 10 }}
                tickFormatter={(value: string) => (isTablet || value.length <= 16 ? value : `${value.slice(0, 14)}…`)}
              />
              <Tooltip />
              <Bar dataKey="exceptions" fill="#2563eb" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <CauseTable title="By lost engineering hours" rows={sortCopy(data, 'engineeringHours')} field="engineeringHours" suffix="h" />
        <CauseTable title="By affected customers" rows={sortCopy(data, 'customers')} field="customers" />
        <CauseTable title="By potential revenue impact" rows={sortCopy(data, 'revenueImpact')} field="revenueImpact" prefix="$" />
      </div>
    </div>
  )
}

function sortCopy<T extends { engineeringHours: number; customers: number; revenueImpact: number }>(
  rows: T[],
  field: 'engineeringHours' | 'customers' | 'revenueImpact',
) {
  return [...rows].sort((a, b) => b[field] - a[field])
}

function CauseTable({
  title,
  rows,
  field,
  prefix = '',
  suffix = '',
}: {
  title: string
  rows: { name: string; engineeringHours: number; customers: number; revenueImpact: number }[]
  field: 'engineeringHours' | 'customers' | 'revenueImpact'
  prefix?: string
  suffix?: string
}) {
  return (
    <Card>
      <CardTitle title={title} />
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.name} className="flex items-start justify-between gap-3 text-sm">
            <span className="min-w-0 text-navy-700">{row.name}</span>
            <span className="shrink-0 font-semibold text-navy-900">
              {prefix}
              {row[field].toLocaleString()}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
