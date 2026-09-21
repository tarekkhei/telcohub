import type { KpiSnapshot } from '../../types'
import { Card } from '../ui/Card'

function KpiCard({
  label,
  value,
  hint,
  tone,
  supporting,
}: {
  label: string
  value: string
  hint: string
  tone?: 'danger' | 'warning' | 'success' | 'neutral' | 'ai'
  supporting?: string
}) {
  const dot =
    tone === 'danger'
      ? 'bg-danger'
      : tone === 'warning'
        ? 'bg-warning'
        : tone === 'success'
          ? 'bg-success'
          : tone === 'ai'
            ? 'bg-ai'
            : 'bg-navy-300'

  return (
    <Card className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-navy-500">{label}</p>
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-navy-900">{value}</p>
      <p className="mt-1.5 text-xs text-navy-500">{hint}</p>
      {supporting ? <p className="mt-1 text-[11px] text-navy-400">{supporting}</p> : null}
    </Card>
  )
}

function formatRevenue(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toLocaleString()}`
}

export function KpiGrid({ kpi }: { kpi: KpiSnapshot }) {
  const offPath = Math.max(0, +(100 - kpi.happyPathRate).toFixed(1))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Happy Path Rate"
          value={`${kpi.happyPathRate}%`}
          hint={`+${kpi.happyPathChange}% vs previous period`}
          supporting={`On path ${kpi.happyPathRate}% · Off path ${offPath}%`}
          tone="success"
        />
        <KpiCard
          label="Active Exceptions"
          value={String(kpi.exceptionsToday)}
          hint={`+${kpi.exceptionsChange}% vs yesterday`}
        />
        <KpiCard
          label="Critical Exceptions"
          value={String(kpi.criticalExceptions)}
          hint="Needs immediate attention"
          tone="danger"
        />
        <KpiCard
          label="Customers Impacted"
          value={String(kpi.customersImpacted)}
          hint="Across open exceptions"
          tone="warning"
        />
        <KpiCard
          label="Revenue at Risk"
          value={formatRevenue(kpi.mrrAtRisk)}
          hint="Estimated MRR exposure"
          tone="warning"
        />
        <KpiCard
          label="Resolved Today"
          value={String(kpi.resolvedToday)}
          hint={`${kpi.autoResolvedRate}% auto-assisted`}
          tone="success"
        />
      </div>
      {kpi.awaitingApproval > 0 ? (
        <p className="text-xs text-navy-500">
          <span className="font-semibold text-warning">{kpi.awaitingApproval} awaiting approval</span>
          {' — '}governed remediations need operator review
        </p>
      ) : null}
    </div>
  )
}
