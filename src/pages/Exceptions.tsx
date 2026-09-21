import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExceptionTable } from '../components/command/ExceptionTable'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { TableSkeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { REGIONS, SERVICE_LABELS, SERVICE_TYPES, SEVERITIES } from '../data/constants'
import { useAsyncData } from '../hooks/useAsyncData'
import { exceptionService } from '../services/exceptionService'
import type { ExceptionStatus } from '../types'

type Tab = 'active' | 'critical' | 'awaiting' | 'resolved'

const TAB_STATUSES: Record<Tab, ExceptionStatus[] | 'open' | 'critical' | 'resolved'> = {
  active: 'open',
  critical: 'critical',
  awaiting: ['awaiting_approval'],
  resolved: 'resolved',
}

export function Exceptions() {
  const { exceptions, filters, setFilters, resetFilters } = useAppState()
  const [params] = useSearchParams()
  const regionParam = params.get('region')
  const [tab, setTab] = useState<Tab>('active')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (regionParam && filters.region !== regionParam) {
      setFilters({ region: regionParam })
    }
  }, [filters.region, regionParam, setFilters])

  const result = useAsyncData(() => exceptionService.list(filters, exceptions), [filters, exceptions])

  const rows = useMemo(() => {
    let data = result.data ?? []
    const tabDef = TAB_STATUSES[tab]
    if (tabDef === 'open') {
      data = data.filter((item) => !['resolved', 'verified'].includes(item.status))
    } else if (tabDef === 'critical') {
      data = data.filter((item) => item.severity === 'critical' && !['resolved', 'verified'].includes(item.status))
    } else if (tabDef === 'resolved') {
      data = data.filter((item) => ['resolved', 'verified'].includes(item.status))
    } else {
      data = data.filter((item) => tabDef.includes(item.status))
    }

    const q = search.trim().toLowerCase()
    if (q) {
      data = data.filter((item) =>
        [item.id, item.customerId, item.orderId, item.msisdn, item.title, item.exceptionType].some((value) =>
          value.toLowerCase().includes(q),
        ),
      )
    }
    return data
  }, [result.data, search, tab])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Intelligent Exception Management"
        subtitle="Detect and prioritize transactions that deviate from their expected operational path."
      />

      <div className="flex flex-wrap gap-1 rounded-lg border border-navy-100 bg-white p-1">
        {(
          [
            { id: 'active' as const, label: 'Active' },
            { id: 'critical' as const, label: 'Critical' },
            { id: 'awaiting' as const, label: 'Awaiting Action' },
            { id: 'resolved' as const, label: 'Resolved' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              tab === item.id ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Customer / Account / Order / MSISDN / Exception ID"
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none focus:border-accent focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Select
            label="Severity"
            value={filters.severity}
            onChange={(value) => setFilters({ severity: value })}
            options={[
              { value: 'all', label: 'All' },
              ...SEVERITIES.map((item) => ({ value: item, label: item })),
            ]}
          />
          <Select
            label="Service"
            value={filters.serviceType}
            onChange={(value) => setFilters({ serviceType: value })}
            options={[
              { value: 'all', label: 'All' },
              ...SERVICE_TYPES.map((item) => ({ value: item, label: SERVICE_LABELS[item] })),
            ]}
          />
          <Select
            label="Region"
            value={filters.region}
            onChange={(value) => setFilters({ region: value })}
            options={[{ value: 'all', label: 'All' }, ...REGIONS.map((item) => ({ value: item, label: item }))]}
          />
          <Select
            label="System"
            value={filters.exceptionType}
            onChange={(value) => setFilters({ exceptionType: value })}
            options={[
              { value: 'all', label: 'All' },
              { value: 'Provisioning', label: 'Provisioning' },
              { value: 'HSS', label: 'HSS' },
              { value: 'Billing', label: 'Billing' },
              { value: 'Routing', label: 'Routing' },
            ]}
          />
        </div>
      </div>

      {result.loading ? (
        <TableSkeleton rows={10} />
      ) : (
        <ExceptionTable
          rows={rows}
          title={regionParam ? `Exceptions · ${regionParam}` : 'Exceptions'}
          subtitle={`${rows.length} records`}
          onReset={resetFilters}
          compact
        />
      )}
    </div>
  )
}
