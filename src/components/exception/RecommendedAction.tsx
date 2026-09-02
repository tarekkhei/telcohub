import { Button } from '../ui/Button'
import { Card, CardTitle } from '../ui/Card'

export function RecommendedAction({
  actions,
  risk,
  eligibility,
  disabled,
  onApprove,
  onAssign,
  onIncident,
  onDismiss,
}: {
  actions: string[]
  risk: string
  eligibility: string
  disabled?: boolean
  onApprove: () => void
  onAssign: () => void
  onIncident: () => void
  onDismiss: () => void
}) {
  return (
    <Card>
      <CardTitle title="Recommended action" subtitle="Supervised remediation. No live OSS/BSS writes are performed in this demo." />
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-navy-800">
        {actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <p className="rounded-lg bg-success-soft px-3 py-1.5 text-success">
          Risk: <span className="font-semibold uppercase">{risk}</span>
        </p>
        <p className="rounded-lg bg-warning-soft px-3 py-1.5 text-warning">{eligibility}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="ai" className="w-full sm:w-auto" onClick={onApprove} disabled={disabled}>
          Approve & Execute
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto" onClick={onAssign}>
          Assign to Engineer
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto" onClick={onIncident}>
          Create Incident
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onDismiss}>
          Dismiss Recommendation
        </Button>
      </div>
    </Card>
  )
}
