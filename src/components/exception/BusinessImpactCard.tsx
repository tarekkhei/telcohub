import type { BusinessImpact } from '../../types/ops'
import { Card, CardTitle } from '../ui/Card'

export function BusinessImpactCard({
  impact,
  compact,
}: {
  impact: BusinessImpact
  compact?: boolean
}) {
  const slaRisk = impact.slaBreaches > 0 ? 'High' : 'Low'

  return (
    <Card>
      <CardTitle title="Business Impact" />
      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
        <Stat label="Customers Impacted" value={String(impact.customersImpacted)} />
        <Stat label="Transactions Blocked" value={String(impact.transactionsBlocked)} />
        <Stat label="Revenue at Risk" value={`$${impact.mrrAtRisk.toLocaleString()}`} />
        <Stat label="Regions" value={String(impact.regions)} />
        {!compact ? <Stat label="Oldest Failure" value={impact.oldestFailure} /> : null}
        <Stat label="SLA Risk" value={slaRisk} accent={slaRisk === 'High'} />
        {!compact ? <Stat label="Activations Blocked" value={String(impact.activationsBlocked)} /> : null}
      </div>
    </Card>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-navy-50 px-3 py-2">
      <p className="text-[11px] text-navy-400">{label}</p>
      <p className={`text-sm font-semibold ${accent ? 'text-danger' : 'text-navy-900'}`}>{value}</p>
    </div>
  )
}
