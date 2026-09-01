import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FilterBar } from '../components/command/FilterBar'
import { Card, CardTitle } from '../components/ui/Card'
import { DemoBanner } from '../components/ui/DemoBanner'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function Reports() {
  const { filters, setFilters } = useAppState()
  const result = useAsyncData(() => mockApi.reports(), [])
  if (result.loading || !result.data) return <PageSkeleton />
  const { metrics, comparison, hoursSaved, trends } = result.data

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Executive reporting"
        title="Reports"
        subtitle="Operational visibility around the agent's resolution work — not another KPI wall."
      />
      <DemoBanner>All report figures are synthetic and intended for product demonstration only.</DemoBanner>
      <FilterBar filters={filters} onChange={setFilters} />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy-900">Operations performance</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric label="Total exceptions" value={String(metrics.totalExceptions)} />
          <Metric label="AI diagnosis rate" value={`${metrics.aiDiagnosisRate}%`} />
          <Metric label="Resolution rate" value={`${metrics.resolutionRate}%`} />
          <Metric label="Auto resolution rate" value={`${metrics.autoResolutionRate}%`} />
          <Metric label="Escalation rate" value={`${metrics.escalationRate}%`} />
          <Metric label="Mean time to diagnose" value={`${metrics.mttdSeconds} sec`} />
          <Metric label="Mean time to resolve" value={`${metrics.mttrMinutes} min`} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy-900">Business impact</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Metric label="Customers affected" value={String(metrics.customersAffected)} />
          <Metric label="Customers recovered" value={String(metrics.customersRecovered)} />
          <Metric label="Potential revenue protected" value={`$${metrics.revenueProtected.toLocaleString()}`} />
          <Metric label="Estimated operational hours saved" value={`${metrics.hoursSaved} h`} />
          <Metric label="Estimated engineering cost avoided" value={`$${metrics.engineeringCostAvoided.toLocaleString()}`} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy-900">Trend report</h2>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <MiniLine title="MTTR over time" data={trends.mttr} dataKey="minutes" />
          <MiniLine title="AI diagnosis rate" data={trends.diagnosisRate} dataKey="rate" />
          <MiniLine title="Auto-resolution rate" data={trends.autoResolution} dataKey="rate" />
          <MiniLine title="Engineering escalations" data={trends.escalations} dataKey="count" />
        </div>
      </section>

      <Card>
        <CardTitle title="AI vs manual comparison" subtitle="Demo / illustrative metrics" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-navy-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Before Coreveo AI</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-700">
              {comparison.map((row) => (
                <li key={row.label} className="flex justify-between">
                  <span>{row.label}</span>
                  <span className="font-semibold">{row.before}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-ai-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ai">After Coreveo AI</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-800">
              {comparison.map((row) => (
                <li key={row.label} className="flex justify-between">
                  <span>{row.label}</span>
                  <span className="font-semibold">{row.after}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-navy-700">
          Estimated monthly savings: <span className="text-lg font-semibold text-navy-900">{hoursSaved} operations hours</span>
        </p>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-navy-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-navy-900">{value}</p>
    </Card>
  )
}

function MiniLine({
  title,
  data,
  dataKey,
}: {
  title: string
  data: Record<string, string | number>[]
  dataKey: string
}) {
  return (
    <Card>
      <CardTitle title={title} />
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e4ebf2" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#4a6a94' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#4a6a94' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
