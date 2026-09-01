import type { SeverityCount } from '../../types'
import { BUSINESS_IMPACT } from '../../data/kpis'
import { Card, CardTitle } from '../ui/Card'

const colors: Record<string, string> = {
  critical: 'bg-danger',
  high: 'bg-orange-500',
  medium: 'bg-amber-400',
  low: 'bg-slate-400',
}

export function SeverityImpact({ data }: { data: SeverityCount[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <Card>
      <CardTitle title="Severity and business impact" subtitle="Operational risk expressed as customer and revenue effect." />
      <div className="flex overflow-hidden rounded-full">
        {data.map((item) => (
          <div
            key={item.name}
            className={`h-2.5 ${colors[item.name]}`}
            style={{ width: `${(item.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {data.map((item) => (
          <div key={item.name} className="rounded-lg bg-navy-50 px-3 py-2">
            <p className="text-xs capitalize text-navy-500">{item.name}</p>
            <p className="text-lg font-semibold text-navy-900">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <ImpactStat label="Potential monthly revenue impact" value={`$${BUSINESS_IMPACT.monthlyRevenue.toLocaleString()}`} />
        <ImpactStat label="Customers blocked from activation" value={String(BUSINESS_IMPACT.customersBlocked)} />
        <ImpactStat label="Services partially provisioned" value={String(BUSINESS_IMPACT.partialProvisioned)} />
      </div>
    </Card>
  )
}

function ImpactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-navy-100 px-3 py-3">
      <p className="text-xs text-navy-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-navy-900">{value}</p>
    </div>
  )
}
