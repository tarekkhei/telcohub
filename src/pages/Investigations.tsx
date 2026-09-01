import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/ui/Badge'
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
        eyebrow="Investigation"
        title="Investigations"
        subtitle="Coreveo gathers evidence across OSS/BSS systems instead of waiting on a single alert owner."
      />
      {result.loading || !result.data ? (
        <TableSkeleton rows={8} />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="border-b border-navy-100 bg-navy-50 text-[11px] uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Investigation</th>
                  <th className="px-4 py-2.5 font-medium">Exception</th>
                  <th className="px-4 py-2.5 font-medium">Title</th>
                  <th className="px-4 py-2.5 font-medium">Started</th>
                  <th className="px-4 py-2.5 font-medium">Duration</th>
                  <th className="px-4 py-2.5 font-medium">Systems</th>
                  <th className="px-4 py-2.5 font-medium">Confidence</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((row) => (
                  <tr key={row.id} className="border-b border-navy-50">
                    <td className="px-4 py-3 font-medium text-navy-900">{row.id}</td>
                    <td className="px-4 py-3">
                      <Link className="font-medium text-accent hover:underline" to={`/exceptions/${row.exceptionId}`}>
                        {row.exceptionId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-navy-700">{row.title}</td>
                    <td className="px-4 py-3 text-navy-600">{row.startedAt.replace('T', ' ').slice(0, 19)}</td>
                    <td className="px-4 py-3 text-navy-700">{row.durationSeconds}s</td>
                    <td className="px-4 py-3 text-navy-700">{row.systemsTouched}</td>
                    <td className="px-4 py-3 text-ai">{row.confidence}%</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
