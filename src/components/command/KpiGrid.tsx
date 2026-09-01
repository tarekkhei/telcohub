import { Clock, ShieldCheck, Timer, Users, WandSparkles, CircleAlert, Hourglass, BadgeCheck } from 'lucide-react'
import type { KpiSnapshot } from '../../types'
import { Card } from '../ui/Card'
import { Sparkline } from '../ui/Sparkline'

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  spark,
  sparkColor,
}: {
  label: string
  value: string
  hint: string
  icon: typeof Clock
  spark?: number[]
  sparkColor?: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-navy-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-navy-900">{value}</p>
        </div>
        <div className="rounded-lg bg-navy-50 p-2 text-navy-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-xs text-navy-500">{hint}</p>
        {spark ? <Sparkline values={spark} color={sparkColor} /> : null}
      </div>
    </Card>
  )
}

export function KpiGrid({
  kpi,
  sparklines,
}: {
  kpi: KpiSnapshot
  sparklines: { exceptions: number[]; diagnosed: number[]; resolved: number[]; hours: number[] }
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Exceptions Today"
        value={String(kpi.exceptionsToday)}
        hint={`+${kpi.exceptionsChange}% vs yesterday`}
        icon={CircleAlert}
        spark={sparklines.exceptions}
      />
      <KpiCard
        label="AI Diagnosed"
        value={String(kpi.aiDiagnosed)}
        hint={`${kpi.aiDiagnosedRate}% of exceptions`}
        icon={WandSparkles}
        spark={sparklines.diagnosed}
        sparkColor="#5b5ce0"
      />
      <KpiCard
        label="Auto Resolved"
        value={String(kpi.autoResolved)}
        hint={`${kpi.autoResolvedRate}% automatically closed`}
        icon={BadgeCheck}
        spark={sparklines.resolved}
        sparkColor="#15803d"
      />
      <KpiCard
        label="Awaiting Approval"
        value={String(kpi.awaitingApproval)}
        hint="Human-in-the-loop actions"
        icon={Hourglass}
      />
      <KpiCard
        label="Engineering Escalations"
        value={String(kpi.engineeringEscalations)}
        hint={`${kpi.escalationsChange}% vs baseline`}
        icon={ShieldCheck}
      />
      <KpiCard
        label="Mean Time to Diagnose"
        value={`${kpi.mttdSeconds} sec`}
        hint={`Baseline: ${kpi.mttdBaselineMinutes} min`}
        icon={Timer}
      />
      <KpiCard
        label="Estimated Operations Hours Saved"
        value={`${kpi.hoursSaved} h`}
        hint="Illustrative today"
        icon={Clock}
        spark={sparklines.hours}
        sparkColor="#0f766e"
      />
      <KpiCard
        label="Customers Potentially Impacted"
        value={String(kpi.customersImpacted)}
        hint="Across open and recovered work"
        icon={Users}
      />
    </div>
  )
}
