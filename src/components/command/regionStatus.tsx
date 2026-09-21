import type { RegionHealthStatus } from '../../types/ops'

export const STATUS_META: Record<
  RegionHealthStatus,
  { label: string; color: string; fill: string; ring: string; order: number }
> = {
  CRITICAL: { label: 'Critical', color: 'text-danger', fill: '#b91c1c', ring: 'ring-red-200', order: 0 },
  DEGRADED: { label: 'Degraded', color: 'text-warning', fill: '#b45309', ring: 'ring-amber-200', order: 1 },
  HEALTHY: { label: 'Healthy', color: 'text-success', fill: '#15803d', ring: 'ring-emerald-200', order: 2 },
  NO_DATA: { label: 'No data', color: 'text-navy-400', fill: '#94a3b8', ring: 'ring-slate-200', order: 3 },
}

export function StatusDot({ status, pulse }: { status: RegionHealthStatus; pulse?: boolean }) {
  const meta = STATUS_META[status]
  return (
    <span className="relative inline-flex h-2.5 w-2.5 shrink-0" title={meta.label} aria-label={meta.label}>
      <span
        className={`absolute inset-0 rounded-full ${pulse && status === 'CRITICAL' ? 'animate-ping opacity-40' : ''}`}
        style={{ background: meta.fill }}
      />
      <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: meta.fill }} />
    </span>
  )
}
