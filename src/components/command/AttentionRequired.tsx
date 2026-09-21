import { Link, useNavigate } from 'react-router-dom'
import { AI_STATUS_LABELS, SERVICE_LABELS } from '../../data/constants'
import type { ExceptionRecord } from '../../types'
import { SeverityBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card, CardTitle } from '../ui/Card'

function relativeAge(iso: string) {
  const detected = new Date(iso).getTime()
  const now = new Date('2026-08-29T14:29:00').getTime()
  const mins = Math.max(1, Math.round((now - detected) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  return `${hours}h ago`
}

function actionLabel(status: ExceptionRecord['status']) {
  if (status === 'awaiting_approval' || status === 'diagnosed') return 'Review'
  if (status === 'investigating' || status === 'new') return 'Investigate'
  return 'Open'
}

export function AttentionRequired({ rows }: { rows: ExceptionRecord[] }) {
  const navigate = useNavigate()
  const limited = rows.slice(0, 7)

  return (
    <Card padding={false}>
      <div className="flex flex-wrap items-end justify-between gap-3 px-4 pt-5 sm:px-5">
        <CardTitle
          title="Attention Required"
          subtitle="Highest-priority exceptions needing operator action."
        />
        <Link to="/exceptions" className="text-sm font-medium text-accent hover:underline">
          View All Exceptions →
        </Link>
      </div>

      <div className="mt-3 divide-y divide-navy-50 md:hidden">
        {limited.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => navigate(`/exceptions/${row.id}`)}
            className="flex w-full flex-col gap-1.5 px-4 py-3 text-left hover:bg-accent-soft"
          >
            <div className="flex items-center justify-between gap-2">
              <SeverityBadge severity={row.severity} />
              <span className="text-xs text-navy-500">{relativeAge(row.detectedAt)}</span>
            </div>
            <p className="text-sm font-medium text-navy-900">{row.title}</p>
            <p className="text-xs text-navy-500">
              {SERVICE_LABELS[row.service]} · {row.region} · {row.potentialImpact}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-3 hidden overflow-x-auto md:block">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="border-y border-navy-100 bg-navy-50 text-[11px] uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Severity</th>
              <th className="px-4 py-2.5 font-medium">Exception</th>
              <th className="px-4 py-2.5 font-medium">Service</th>
              <th className="px-4 py-2.5 font-medium">Region</th>
              <th className="px-4 py-2.5 font-medium">Impact</th>
              <th className="px-4 py-2.5 font-medium">Detected</th>
              <th className="px-4 py-2.5 font-medium">AI Status</th>
              <th className="px-4 py-2.5 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {limited.map((row) => (
              <tr key={row.id} className="border-b border-navy-50 hover:bg-navy-50/60">
                <td className="px-4 py-3">
                  <SeverityBadge severity={row.severity} />
                </td>
                <td className="px-4 py-3 font-medium text-navy-900">{row.title}</td>
                <td className="px-4 py-3 text-navy-700">{SERVICE_LABELS[row.service]}</td>
                <td className="px-4 py-3 text-navy-700">{row.region}</td>
                <td className="px-4 py-3 text-navy-700">{row.potentialImpact}</td>
                <td className="whitespace-nowrap px-4 py-3 text-navy-500">{relativeAge(row.detectedAt)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-ai">
                    {AI_STATUS_LABELS[row.status] ?? row.status}
                    {row.aiConfidence >= 90 && row.status !== 'investigating' && row.status !== 'new'
                      ? ` ${row.aiConfidence}%`
                      : ''}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant={row.severity === 'critical' ? 'ai' : 'secondary'}
                    className="!px-2.5 !py-1 text-xs"
                    onClick={() => navigate(`/exceptions/${row.id}`)}
                  >
                    {actionLabel(row.status)}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
