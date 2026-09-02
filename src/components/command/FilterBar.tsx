import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PROVIDERS, REGIONS, SERVICE_LABELS, SERVICE_TYPES, SEVERITIES, STATUSES, STATUS_LABELS, TIME_RANGES } from '../../data/constants'
import { mockApi } from '../../services/mockApi'
import type { Filters } from '../../types'
import { Select } from '../ui/Select'

export function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Partial<Filters>) => void
}) {
  const exceptionTypes = mockApi.exceptionTypes()
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-navy-100 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left md:hidden"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-sm font-semibold text-navy-800">Filters</span>
        <ChevronDown className={`h-4 w-4 text-navy-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid grid-cols-1 gap-3 border-t border-navy-50 p-4 sm:grid-cols-2 md:grid-cols-3 md:border-t-0 xl:grid-cols-7 ${
          open ? '' : 'max-md:hidden'
        }`}
      >
        <Select
          label="Time Range"
          value={filters.timeRange}
          onChange={(value) => onChange({ timeRange: value as Filters['timeRange'] })}
          options={TIME_RANGES.map((item) => ({ value: item.value, label: item.label }))}
        />
        <Select
          label="Provider"
          value={filters.provider}
          onChange={(value) => onChange({ provider: value })}
          options={[{ value: 'all', label: 'All providers' }, ...PROVIDERS.map((item) => ({ value: item, label: item }))]}
        />
        <Select
          label="Service Type"
          value={filters.serviceType}
          onChange={(value) => onChange({ serviceType: value })}
          options={[
            { value: 'all', label: 'All services' },
            ...SERVICE_TYPES.map((item) => ({ value: item, label: SERVICE_LABELS[item] })),
          ]}
        />
        <Select
          label="Severity"
          value={filters.severity}
          onChange={(value) => onChange({ severity: value })}
          options={[
            { value: 'all', label: 'All severities' },
            ...SEVERITIES.map((item) => ({ value: item, label: item[0].toUpperCase() + item.slice(1) })),
          ]}
        />
        <Select
          label="Exception Type"
          value={filters.exceptionType}
          onChange={(value) => onChange({ exceptionType: value })}
          options={[
            { value: 'all', label: 'All types' },
            ...exceptionTypes.map((item) => ({ value: item, label: item })),
          ]}
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={(value) => onChange({ status: value })}
          options={[
            { value: 'all', label: 'All statuses' },
            ...STATUSES.map((item) => ({ value: item, label: STATUS_LABELS[item] })),
          ]}
        />
        <Select
          label="Region"
          value={filters.region}
          onChange={(value) => onChange({ region: value })}
          options={[{ value: 'all', label: 'All regions' }, ...REGIONS.map((item) => ({ value: item, label: item }))]}
        />
      </div>
    </div>
  )
}
