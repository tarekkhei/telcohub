import type { ChangeCorrelation } from '../../types/ops'
import { Card, CardTitle } from '../ui/Card'

export function ChangeContextPanel({ correlation }: { correlation: ChangeCorrelation }) {
  return (
    <Card className="border-amber-100 bg-gradient-to-br from-white to-warning-soft/40">
      <CardTitle title="Change Correlation" subtitle="Deployments and configuration changes correlated with exception onset." />
      <p className="text-sm font-semibold text-navy-900">{correlation.title}</p>
      <p className="mt-2 text-sm leading-6 text-navy-700">{correlation.summary}</p>
      <p className="mt-2 text-sm text-ai">Confidence: {correlation.confidence}%</p>
      {correlation.supportingFacts.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-navy-700">
          {correlation.supportingFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      ) : null}
      {correlation.changeEvents.length ? (
        <ol className="mt-4 space-y-2 border-l border-navy-200 pl-4">
          {correlation.changeEvents.map((event) => (
            <li key={event.id}>
              <p className="text-xs font-semibold text-warning">
                {event.timestamp} · {event.source}
              </p>
              <p className="text-sm text-navy-800">{event.title}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </Card>
  )
}
