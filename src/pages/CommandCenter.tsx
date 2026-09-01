import { useMemo } from 'react'
import { AskCoreveo } from '../components/agent/AskCoreveo'
import { CategoryChart } from '../components/command/CategoryChart'
import { ExceptionFunnel } from '../components/command/ExceptionFunnel'
import { ExceptionTable } from '../components/command/ExceptionTable'
import { FilterBar } from '../components/command/FilterBar'
import { KpiGrid } from '../components/command/KpiGrid'
import { SeverityImpact } from '../components/command/SeverityImpact'
import { TrendChart } from '../components/command/TrendChart'
import { LifecycleStrip } from '../components/ui/LifecycleStrip'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton, TableSkeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function CommandCenter() {
  const { exceptions, filters, setFilters, resetFilters } = useAppState()
  const snapshot = useAsyncData(() => mockApi.commandCenter(), [])
  const table = useAsyncData(() => mockApi.listExceptions(filters, exceptions), [filters, exceptions])

  const previewRows = useMemo(() => (table.data ?? []).slice(0, 12), [table.data])

  if (snapshot.loading || !snapshot.data) return <PageSkeleton />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operations"
        title="Operations Command Center"
        subtitle="From Observability to Resolution"
      />
      <AskCoreveo />
      <LifecycleStrip active="exception" />
      <FilterBar filters={filters} onChange={setFilters} />
      <KpiGrid kpi={snapshot.data.kpi} sparklines={snapshot.data.sparklines} />
      <ExceptionFunnel stages={snapshot.data.funnel} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <CategoryChart data={snapshot.data.categories} />
        <TrendChart data={snapshot.data.trend} />
      </div>
      <SeverityImpact data={snapshot.data.severity} />
      {table.loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <ExceptionTable rows={previewRows} onReset={resetFilters} />
      )}
    </div>
  )
}
