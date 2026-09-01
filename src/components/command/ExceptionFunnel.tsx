import type { FunnelStage } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function ExceptionFunnel({ stages }: { stages: FunnelStage[] }) {
  const max = stages[0]?.count || 1
  return (
    <Card>
      <CardTitle
        title="Exception lifecycle"
        subtitle="Coreveo manages the full path from detection to verified outcome — not just an alert count."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stages.map((stage, index) => {
          const width = Math.max(36, Math.round((stage.count / max) * 100))
          return (
            <div key={stage.label} className="relative rounded-lg border border-navy-100 bg-navy-50/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy-500">{stage.label}</p>
              <p className="mt-1 text-2xl font-semibold text-navy-900">{stage.count}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-accent" style={{ width: `${width}%` }} />
              </div>
              {index < stages.length - 1 ? (
                <p className="mt-2 text-[10px] text-navy-400">continues →</p>
              ) : (
                <p className="mt-2 text-[10px] text-success">business outcome confirmed</p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
