import { Button } from '../ui/Button'
import { Card, CardTitle } from '../ui/Card'
import { SoftBadge } from '../ui/Badge'

export function RecommendedAction({
  actions,
  risk,
  eligibility,
  historicalSuccess,
  disabled,
  testRan,
  onTest,
  onApprove,
}: {
  actions: string[]
  risk: string
  eligibility: string
  historicalSuccess?: string
  disabled?: boolean
  testRan?: boolean
  onTest?: () => void
  onApprove: () => void
}) {
  return (
    <Card>
      <CardTitle title="Recommended Resolution" subtitle="Governed recovery to return transactions to the happy path." />
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-navy-800">
        {actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {historicalSuccess ? (
          <p className="rounded-lg bg-navy-50 px-3 py-1.5 text-navy-700">
            Historical success <span className="font-semibold">{historicalSuccess}</span>
          </p>
        ) : null}
        <p className="rounded-lg bg-success-soft px-3 py-1.5 text-success">
          Risk <span className="font-semibold uppercase">{risk}</span>
        </p>
        <SoftBadge tone="warning">{eligibility}</SoftBadge>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {onTest ? (
          <Button variant="secondary" className="w-full sm:w-auto" onClick={onTest} disabled={disabled || testRan}>
            {testRan ? 'Test Succeeded' : 'Run Test'}
          </Button>
        ) : null}
        <Button
          variant="ai"
          className="w-full sm:w-auto"
          onClick={onApprove}
          disabled={disabled || (onTest != null && !testRan)}
        >
          Approve & Execute
        </Button>
      </div>
      {onTest && !testRan && !disabled ? (
        <p className="mt-2 text-xs text-navy-400">Run a controlled test before approving production remediation.</p>
      ) : null}
    </Card>
  )
}
