import type { RegionHealth, RegionHealthStatus } from '../../types/ops'
import { Card, CardTitle } from '../ui/Card'
import { STATUS_META, StatusDot } from './regionStatus'

const GROUPS: RegionHealthStatus[] = ['CRITICAL', 'DEGRADED', 'HEALTHY']

export function RegionalHealthList({
  regions,
  selectedId,
  onSelect,
}: {
  regions: RegionHealth[]
  selectedId?: string | null
  onSelect: (region: RegionHealth) => void
}) {
  const visible = regions.filter(
    (item) => item.country === 'Canada' || item.id === 'us-west' || item.id === 'uk' || item.id === 'germany' || item.status !== 'HEALTHY',
  )

  return (
    <Card>
      <CardTitle title="Operations Health" subtitle="Click a region to focus the dashboard." />
      <div className="space-y-4">
        {GROUPS.map((status) => {
          const rows = visible
            .filter((item) => item.status === status)
            .sort((a, b) => b.activeExceptions - a.activeExceptions)
          if (!rows.length) return null
          return (
            <div key={status}>
              <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_META[status].color}`}>
                {STATUS_META[status].label}
              </p>
              <ul className="space-y-0.5">
                {rows.map((region) => {
                  const active = selectedId === region.id
                  return (
                    <li key={region.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(region)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                          active ? 'bg-accent-soft ring-1 ring-accent/30' : 'hover:bg-navy-50'
                        }`}
                      >
                        <StatusDot status={region.status} pulse={region.status === 'CRITICAL'} />
                        <span className="min-w-0 flex-1 truncate font-medium text-navy-800">{region.name}</span>
                        <span className="text-xs font-semibold text-navy-900">{region.activeExceptions}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
