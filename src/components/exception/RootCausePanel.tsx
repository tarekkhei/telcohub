import type { Diagnosis } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function RootCausePanel({
  diagnosis,
  compact,
  onShowEvidence,
  memoryHint,
}: {
  diagnosis: Diagnosis
  compact?: boolean
  onShowEvidence?: () => void
  memoryHint?: string
}) {
  return (
    <Card className="border-indigo-100">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">Probable Root Cause</p>
      <h2 className="mt-2 text-base font-semibold text-navy-900">{diagnosis.rootCause}</h2>
      <p className="mt-3 text-sm text-navy-600">
        Confidence: <span className="font-semibold text-ai">{diagnosis.confidence}%</span>
      </p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Why TERA thinks this</p>
        <ul className="mt-2 space-y-1.5 text-sm text-navy-700">
          {(compact ? diagnosis.evidence.slice(0, 5) : diagnosis.evidence).map((item) => (
            <li key={item} className="flex gap-2">
              <span className="shrink-0 text-success">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {memoryHint ? <p className="mt-3 text-xs text-navy-500">{memoryHint}</p> : null}

      {onShowEvidence ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={onShowEvidence}>
            Show Evidence
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
