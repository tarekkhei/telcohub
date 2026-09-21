import type { ExceptionDetail } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function VerifyPanel({
  detail,
  verified,
}: {
  detail: ExceptionDetail
  verified: boolean
}) {
  const checks = [
    { label: 'HSS Subscriber', okValue: 'PROVISIONED', before: detail.beforeState.HSS ?? '—' },
    { label: 'Network', okValue: 'ACTIVE', before: detail.beforeState.Network ?? '—' },
    { label: 'Billing', okValue: 'ACTIVE', before: detail.beforeState.Billing ?? '—' },
    { label: 'SIM', okValue: 'ASSIGNED', before: detail.beforeState.SIM ?? '—' },
  ]

  return (
    <Card>
      <CardTitle
        title={verified ? 'Resolution Verification' : 'Verifying…'}
        subtitle="Authoritative state checks — not HTTP 200 alone."
      />
      <ul className="space-y-2">
        {checks.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-navy-700">{item.label}</span>
            <span className={verified ? 'font-semibold text-success' : 'text-navy-400'}>
              {verified ? `✓ ${item.okValue}` : '…'}
            </span>
          </li>
        ))}
      </ul>
      {verified ? (
        <div className="mt-4 space-y-2">
          <p className="rounded-lg bg-success-soft px-3 py-2 text-sm font-semibold text-success">
            Expected State Restored
          </p>
          <p className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-success">
            ✓ Back on Happy Path
          </p>
        </div>
      ) : null}
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-navy-500">State comparison</summary>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StateCard title="Before" state={detail.beforeState} />
          <StateCard
            title="After"
            state={verified ? detail.afterState : Object.fromEntries(Object.keys(detail.afterState).map((key) => [key, '—']))}
            muted={!verified}
          />
        </div>
      </details>
    </Card>
  )
}

function StateCard({ title, state, muted }: { title: string; state: Record<string, string>; muted?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${muted ? 'border-navy-100 bg-navy-50' : 'border-navy-100 bg-white'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {Object.entries(state).map(([key, value]) => (
          <li key={key} className="flex items-center justify-between text-sm">
            <span className="text-navy-600">{key}</span>
            <span className="font-medium text-navy-800">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
