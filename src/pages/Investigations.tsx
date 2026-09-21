import { Link } from 'react-router-dom'
import { SoftBadge, StatusBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function Investigations() {
  const result = useAsyncData(() => mockApi.investigations(), [])

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI-Powered Investigation"
        subtitle="Reconstruct operational journeys, correlate evidence and identify probable root causes across connected systems."
      />
      {result.loading || !result.data ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {result.data.slice(0, 12).map((row) => (
            <Link key={row.id} to={`/exceptions/${row.exceptionId}`} className="block">
              <Card className="h-full transition hover:border-accent/40 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{row.title}</p>
                    <p className="mt-1 text-xs text-navy-500">{row.durationSeconds < 60 ? `${row.durationSeconds} seconds` : `${Math.round(row.durationSeconds / 60)} minutes`}</p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-[11px] text-navy-400">Systems checked</dt>
                    <dd className="font-medium text-navy-800">{row.systemsTouched}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-navy-400">Evidence</dt>
                    <dd className="font-medium text-navy-800">{row.systemsTouched * 6 + 11}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-navy-400">Hypotheses</dt>
                    <dd className="font-medium text-navy-800">3</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-navy-400">Confidence</dt>
                    <dd className="font-semibold text-ai">{row.confidence}%</dd>
                  </div>
                </dl>
                <div className="mt-3">
                  <SoftBadge tone="ai">
                    {row.status === 'awaiting_approval' || row.status === 'diagnosed'
                      ? 'Diagnosis Ready'
                      : row.status === 'investigating'
                        ? 'Investigating'
                        : 'Active'}
                  </SoftBadge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
