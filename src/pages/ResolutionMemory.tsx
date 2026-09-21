import { SoftBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function ResolutionMemory() {
  const result = useAsyncData(() => mockApi.resolutionMemory(), [])
  if (result.loading || !result.data) return <PageSkeleton />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Learn from resolved exceptions"
        title="Resolution Memory"
        subtitle="What failed before, what fixed it, and whether the expected business state was verified — the operational knowledge moat."
      />
      <div className="space-y-4">
        {result.data.map((entry) => (
          <Card key={entry.id}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ai">{entry.id}</p>
                <h2 className="mt-1 text-base font-semibold text-navy-900">{entry.pattern}</h2>
                <p className="mt-2 text-sm text-navy-600">
                  Confirmed root cause: <span className="font-medium text-navy-800">{entry.confirmedRootCause}</span>
                </p>
                <p className="mt-1 text-sm text-navy-600">
                  Resolution used: <span className="font-medium text-navy-800">{entry.resolutionUsed}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SoftBadge tone="ai">{entry.occurrences} occurrences</SoftBadge>
                <SoftBadge tone="success">
                  {entry.successCount}/{entry.successAttempts} success
                </SoftBadge>
                {entry.humanApprovalRequired ? <SoftBadge tone="warning">Approval required</SoftBadge> : null}
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-navy-400">Last seen</dt>
                <dd className="font-medium text-navy-800">{entry.lastSeen}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-400">Systems involved</dt>
                <dd className="font-medium text-navy-800">{entry.systemsInvolved.join(' · ')}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-400">Verification outcome</dt>
                <dd className="font-medium text-navy-800">{entry.verificationOutcome.join(' · ')}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  )
}
