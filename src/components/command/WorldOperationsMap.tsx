import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import worldCountries from '../../data/countries-110m.json'
import type { RegionHealth } from '../../types/ops'
import { Card, CardTitle } from '../ui/Card'
import { STATUS_META, StatusDot } from './regionStatus'

export function WorldOperationsMap({
  regions,
  selectedId,
  onSelect,
}: {
  regions: RegionHealth[]
  selectedId?: string | null
  onSelect: (region: RegionHealth) => void
}) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const hovered = regions.find((item) => item.id === hoverId) ?? null

  const markers = useMemo(
    () => regions.filter((item) => item.status !== 'NO_DATA' || item.activeExceptions > 0),
    [regions],
  )

  return (
    <Card padding={false} className="overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <CardTitle title="Global Operations Health" subtitle="Operational health across monitored regions and services." />
        <div className="hidden shrink-0 flex-wrap gap-2 text-[10px] sm:flex">
          {(['CRITICAL', 'DEGRADED', 'HEALTHY', 'NO_DATA'] as const).map((status) => (
            <span key={status} className="inline-flex items-center gap-1 text-navy-500">
              <StatusDot status={status} />
              {STATUS_META[status].label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-[240px] px-2 pb-2 sm:min-h-[320px] sm:px-4">
        <ComposableMap
          projectionConfig={{ scale: 147, center: [-20, 20] }}
          width={800}
          height={380}
          className="block h-auto w-full"
        >
          <Geographies geography={worldCountries as object}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e8eef4"
                  stroke="#c5d2e0"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#dde6ef' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map((region) => {
            const meta = STATUS_META[region.status]
            const active = hoverId === region.id || selectedId === region.id
            return (
              <Marker key={region.id} coordinates={[region.longitude, region.latitude]}>
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverId(region.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => onSelect(region)}
                >
                  {region.status === 'CRITICAL' ? (
                    <circle r={active ? 11 : 9} fill={meta.fill} opacity={0.18} />
                  ) : null}
                  <circle r={active ? 6.5 : 5} fill={meta.fill} stroke="#fff" strokeWidth={1.5} />
                  <text
                    textAnchor="middle"
                    y={16}
                    className="fill-navy-700 text-[8px] font-semibold"
                    style={{ pointerEvents: 'none' }}
                  >
                    {region.name.length > 12 ? `${region.name.slice(0, 11)}…` : region.name}
                  </text>
                </g>
              </Marker>
            )
          })}
        </ComposableMap>

        {hovered ? (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-xl border border-navy-100 bg-white/95 p-3 text-xs shadow-lg sm:left-auto sm:right-6 sm:w-72">
            <div className="flex items-center gap-2">
              <StatusDot status={hovered.status} pulse />
              <p className="font-semibold text-navy-900">{hovered.name}</p>
            </div>
            <p className={`mt-0.5 text-[11px] font-semibold ${STATUS_META[hovered.status].color}`}>
              {STATUS_META[hovered.status].label}
            </p>
            <dl className="mt-2 grid grid-cols-2 gap-1.5 text-navy-600">
              <div>
                <dt className="text-navy-400">Active Exceptions</dt>
                <dd className="font-medium text-navy-800">{hovered.activeExceptions}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Critical</dt>
                <dd className="font-medium text-navy-800">{hovered.criticalExceptions}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Customers Impacted</dt>
                <dd className="font-medium text-navy-800">{hovered.customersImpacted}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Revenue at Risk</dt>
                <dd className="font-medium text-navy-800">${hovered.mrrAtRisk.toLocaleString()}</dd>
              </div>
            </dl>
            {hovered.topExceptionPattern ? (
              <p className="mt-2 text-navy-600">
                Top Issue: <span className="font-medium text-navy-800">{hovered.topExceptionPattern}</span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
