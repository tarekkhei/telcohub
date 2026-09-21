import { useMemo, useState } from 'react'
import { Circle } from 'lucide-react'
import { AttentionRequired } from '../components/command/AttentionRequired'
import { KpiGrid } from '../components/command/KpiGrid'
import { RegionalHealthList } from '../components/command/RegionalHealthList'
import { RegionDrawer } from '../components/command/RegionDrawer'
import { WorldOperationsMap } from '../components/command/WorldOperationsMap'
import { Select } from '../components/ui/Select'
import { Skeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { HERO_EXCEPTION_ID } from '../data/constants'
import { useAsyncData } from '../hooks/useAsyncData'
import { commandCenterService } from '../services/commandCenterService'
import { exceptionService } from '../services/exceptionService'
import type { RegionHealth } from '../types/ops'

export function CommandCenter() {
  const { exceptions, filters, setFilters, resolutionOutcome } = useAppState()
  const verifiedHeroCount = useMemo(() => {
    const fromOutcome = Object.values(resolutionOutcome).filter((status) => status === 'verified').length
    const heroVerified = exceptions.some((item) => item.id === HERO_EXCEPTION_ID && item.status === 'verified')
    return Math.max(fromOutcome, heroVerified ? 1 : 0)
  }, [exceptions, resolutionOutcome])

  const snapshot = useAsyncData(() => commandCenterService.getSnapshot(verifiedHeroCount), [verifiedHeroCount])
  const table = useAsyncData(() => exceptionService.list(filters, exceptions), [filters, exceptions])
  const [selectedRegion, setSelectedRegion] = useState<RegionHealth | null>(null)

  const regions = useMemo(() => {
    const all = snapshot.data?.regions ?? []
    if (!selectedRegion) return all
    // Filtering by selected region is visual focus only — keep all markers, drawer provides detail
    return all
  }, [selectedRegion, snapshot.data?.regions])

  const attentionRows = useMemo(() => {
    const rows = table.data ?? []
    const priority = [...rows].sort((a, b) => {
      const sev = { critical: 0, high: 1, medium: 2, low: 3 }
      return sev[a.severity] - sev[b.severity] || b.aiConfidence - a.aiConfidence
    })
    const open = priority.filter((item) => !['resolved', 'verified'].includes(item.status))
    return open.length ? open : priority
  }, [table.data])

  const ready = Boolean(snapshot.data?.kpi)
  const kpi = snapshot.data?.kpi

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-400">
            Coreveo TERA · Command Center
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy-900">Operational Intelligence</h1>
          <p className="mt-1 max-w-2xl text-sm text-navy-500">
            Real-time intelligence across exceptions, customer journeys, connected systems and business impact.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.timeRange}
            onChange={(value) => setFilters({ timeRange: value as typeof filters.timeRange })}
            options={[
              { value: '24h', label: 'Last 24 Hours' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
            ]}
            className="min-w-[140px]"
          />
          <Select
            value={filters.serviceType || 'all'}
            onChange={(value) => setFilters({ serviceType: value === 'all' ? '' : value })}
            options={[
              { value: 'all', label: 'All Services' },
              { value: 'mobile', label: 'Mobile' },
              { value: 'wireless', label: 'Wireless' },
              { value: 'did', label: 'Voice / DID' },
              { value: 'esim', label: 'eSIM' },
            ]}
            className="min-w-[140px]"
          />
          <Select
            value={filters.region || 'all'}
            onChange={(value) => setFilters({ region: value === 'all' ? '' : value })}
            options={[
              { value: 'all', label: 'All Regions' },
              { value: 'Ontario', label: 'Ontario' },
              { value: 'Quebec', label: 'Quebec' },
              { value: 'Alberta', label: 'Alberta' },
              { value: 'British Columbia', label: 'British Columbia' },
            ]}
            className="min-w-[140px]"
          />
          <div className="inline-flex items-center gap-2 rounded-lg border border-navy-100 bg-white px-3 py-2 text-xs text-navy-600">
            <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
            TERA Online
          </div>
        </div>
      </header>

      {!ready || !kpi ? (
        <Skeleton className="h-28 w-full" />
      ) : (
        <KpiGrid kpi={kpi} />
      )}

      <div
        id="world-operations-map"
        className="grid scroll-mt-20 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]"
      >
        {ready ? (
          <>
            <WorldOperationsMap regions={regions} selectedId={selectedRegion?.id} onSelect={setSelectedRegion} />
            <RegionalHealthList
              regions={regions}
              selectedId={selectedRegion?.id}
              onSelect={(region) => {
                setSelectedRegion(region)
                if (filters.region !== region.name) {
                  setFilters({ region: region.name })
                }
              }}
            />
          </>
        ) : (
          <>
            <Skeleton className="h-[320px] w-full sm:h-[400px]" />
            <Skeleton className="h-[320px] w-full sm:h-[400px]" />
          </>
        )}
      </div>

      {table.loading ? <Skeleton className="h-64 w-full" /> : <AttentionRequired rows={attentionRows} />}

      <RegionDrawer region={selectedRegion} onClose={() => setSelectedRegion(null)} />
    </div>
  )
}
