import type { ExceptionDetail } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function VerifyPanel({
  detail,
  verified,
}: {
  detail: ExceptionDetail
  verified: boolean
}) {
  return (
    <Card>
      <CardTitle
        title="Verify expected business outcome"
        subtitle="Resolution is incomplete until Coreveo confirms the customer service is in the intended state."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StateCard title="Before" state={detail.beforeState} />
        <StateCard title="After" state={verified ? detail.afterState : maskedAfter(detail.afterState)} muted={!verified} />
      </div>
      <p className={`mt-4 rounded-lg px-3 py-2 text-sm font-semibold ${verified ? 'bg-success-soft text-success' : 'bg-navy-50 text-navy-500'}`}>
        Final status: {verified ? 'VERIFIED' : 'PENDING VERIFICATION'}
      </p>
    </Card>
  )
}

function maskedAfter(state: Record<string, string>) {
  return Object.fromEntries(Object.keys(state).map((key) => [key, '—']))
}

function StateCard({ title, state, muted }: { title: string; state: Record<string, string>; muted?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${muted ? 'border-navy-100 bg-navy-50' : 'border-navy-100 bg-white'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{title}</p>
      <ul className="mt-3 space-y-2">
        {Object.entries(state).map(([key, value]) => {
          const bad = ['Missing', 'Inactive', 'Failed', 'Diverged', 'Incomplete'].includes(value)
          const good = ['Active', 'Assigned', 'Healthy', 'Complete'].includes(value)
          return (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="text-navy-600">{key}</span>
              <span className={`font-medium ${bad ? 'text-danger' : good ? 'text-success' : 'text-navy-500'}`}>{value}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
