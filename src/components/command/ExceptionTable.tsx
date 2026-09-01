import { useNavigate } from 'react-router-dom'
import { SERVICE_LABELS } from '../../data/constants'
import type { ExceptionRecord } from '../../types'
import { SeverityBadge, StatusBadge } from '../ui/Badge'
import { Card, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

function formatDetected(iso: string) {
  return iso.replace('T', ' ').slice(0, 19)
}

export function ExceptionTable({
  rows,
  title = 'Live exceptions',
  subtitle = 'Click a row to open the reconstructed business transaction.',
  onReset,
}: {
  rows: ExceptionRecord[]
  title?: string
  subtitle?: string
  onReset?: () => void
}) {
  const navigate = useNavigate()

  return (
    <Card padding={false}>
      <div className="px-5 pt-5">
        <CardTitle title={title} subtitle={subtitle} />
      </div>
      {rows.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState
            title="No exceptions match these filters"
            description="Adjust provider, service, severity or status to continue the operational view."
            onReset={onReset}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="border-y border-navy-100 bg-navy-50 text-[11px] uppercase tracking-wide text-navy-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Exception ID</th>
                <th className="px-4 py-2.5 font-medium">Detected</th>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Service</th>
                <th className="px-4 py-2.5 font-medium">Exception</th>
                <th className="px-4 py-2.5 font-medium">System</th>
                <th className="px-4 py-2.5 font-medium">Severity</th>
                <th className="px-4 py-2.5 font-medium">AI Confidence</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Potential Impact</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(`/exceptions/${row.id}`)}
                  className="cursor-pointer border-b border-navy-50 transition hover:bg-accent-soft"
                >
                  <td className="px-4 py-3 font-medium text-accent">{row.id}</td>
                  <td className="px-4 py-3 text-navy-600">{formatDetected(row.detectedAt)}</td>
                  <td className="px-4 py-3 text-navy-800">{row.customerId}</td>
                  <td className="px-4 py-3 text-navy-700">{SERVICE_LABELS[row.service]}</td>
                  <td className="px-4 py-3 text-navy-800">{row.exceptionType}</td>
                  <td className="px-4 py-3 text-navy-600">{row.system}</td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={row.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-navy-100">
                        <div className="h-full bg-ai" style={{ width: `${row.aiConfidence}%` }} />
                      </div>
                      <span className="text-xs font-medium text-navy-700">{row.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-navy-700">{row.potentialImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
