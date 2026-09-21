import { Check, X } from 'lucide-react'
import type { StateComparisonRow } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function StateDivergencePanel({
  rows,
  divergence,
}: {
  rows: StateComparisonRow[]
  divergence?: string
}) {
  return (
    <Card>
      <CardTitle title="Expected vs Observed" subtitle="State divergence between the expected path and what systems report." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-navy-100 bg-navy-50/50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Expected</p>
          <ul className="mt-3 space-y-2">
            {rows.map((row) => (
              <li key={`exp-${row.label}`} className="flex items-center justify-between text-sm">
                <span className="text-navy-600">{row.label}</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-navy-800">
                  {row.expected}
                  <Check className="h-3.5 w-3.5 text-success" />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-navy-100 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Observed</p>
          <ul className="mt-3 space-y-2">
            {rows.map((row) => (
              <li key={`obs-${row.label}`} className="flex items-center justify-between text-sm">
                <span className="text-navy-600">{row.label}</span>
                <span
                  className={`inline-flex items-center gap-1.5 font-medium ${
                    row.aligned ? 'text-success' : 'text-danger'
                  }`}
                >
                  {row.observed}
                  {row.aligned ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {divergence ? (
        <div className="mt-4 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
          <span className="font-semibold">State Divergence: </span>
          {divergence}
        </div>
      ) : null}
    </Card>
  )
}
