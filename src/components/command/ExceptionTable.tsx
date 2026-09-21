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
  title = 'Exceptions',
  subtitle = 'Click a row to open exception detail.',
  onReset,
  compact = false,
}: {
  rows: ExceptionRecord[]
  title?: string
  subtitle?: string
  onReset?: () => void
  compact?: boolean
}) {
  const navigate = useNavigate()

  return (
    <Card padding={false}>
      <div className="px-4 pt-5 sm:px-5">
        <CardTitle title={title} subtitle={subtitle} />
      </div>
      {rows.length === 0 ? (
        <div className="px-4 pb-5 sm:px-5">
          <EmptyState
            title="No exceptions match these filters"
            description="Adjust severity, service, region or search to continue."
            onReset={onReset}
          />
        </div>
      ) : (
        <>
          <div className="divide-y divide-navy-50 md:hidden">
            {rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => navigate(`/exceptions/${row.id}`)}
                className="flex w-full flex-col gap-2 px-4 py-3 text-left hover:bg-accent-soft"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-navy-900">{row.title}</span>
                  <SeverityBadge severity={row.severity} />
                </div>
                <p className="text-xs text-navy-500">
                  {row.customerId} · {SERVICE_LABELS[row.service]} · {row.region}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={row.status} />
                  <span className="text-xs text-ai">{row.aiConfidence}%</span>
                </div>
              </button>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className={`w-full text-left text-sm ${compact ? 'min-w-[880px]' : 'min-w-[1000px]'}`}>
              <thead className="border-y border-navy-100 bg-navy-50 text-[11px] uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Severity</th>
                  <th className="px-4 py-2.5 font-medium">Exception</th>
                  <th className="px-4 py-2.5 font-medium">Customer / Service</th>
                  <th className="px-4 py-2.5 font-medium">Region</th>
                  <th className="px-4 py-2.5 font-medium">Detected</th>
                  <th className="px-4 py-2.5 font-medium">Impact</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">AI Confidence</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/exceptions/${row.id}`)}
                    className="cursor-pointer border-b border-navy-50 transition hover:bg-accent-soft"
                  >
                    <td className="px-4 py-3">
                      <SeverityBadge severity={row.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-900">{row.title}</p>
                      <p className="text-[11px] text-navy-400">{row.id}</p>
                    </td>
                    <td className="px-4 py-3 text-navy-700">
                      {row.customerId}
                      <span className="mt-0.5 block text-xs text-navy-500">{SERVICE_LABELS[row.service]}</span>
                    </td>
                    <td className="px-4 py-3 text-navy-700">{row.region}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy-600">{formatDetected(row.detectedAt)}</td>
                    <td className="px-4 py-3 text-navy-700">{row.potentialImpact}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-ai">{row.aiConfidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  )
}
