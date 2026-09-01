import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExceptionTable } from '../components/command/ExceptionTable'
import { FilterBar } from '../components/command/FilterBar'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function Exceptions() {
  const { exceptions, filters, setFilters, resetFilters } = useAppState()
  const [params] = useSearchParams()
  const related = params.get('related')
  const result = useAsyncData(() => mockApi.listExceptions(filters, exceptions), [filters, exceptions])

  const rows = useMemo(() => {
    const data = result.data ?? []
    if (related === 'provisioning') {
      return data.filter((item) => item.exceptionType.includes('Provisioning') || item.rootCause.includes('Provisioning'))
    }
    return data
  }, [related, result.data])

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Exception"
        title="Exceptions"
        subtitle="A business transaction that did not reach its expected state — not just an alert."
      />
      <FilterBar filters={filters} onChange={setFilters} />
      {result.loading ? (
        <TableSkeleton rows={10} />
      ) : (
        <ExceptionTable
          rows={rows}
          title={related ? 'Related provisioning exceptions' : 'All exceptions'}
          subtitle={`${rows.length} synthetic records. Click any row to reconstruct the transaction.`}
          onReset={resetFilters}
        />
      )}
    </div>
  )
}
