import type { TimelineEvent } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function InvestigationTimeline({
  events,
  durationSeconds,
}: {
  events: TimelineEvent[]
  durationSeconds: number
}) {
  return (
    <Card>
      <CardTitle title="AI investigation timeline" subtitle="Autonomous correlation across identifiers, systems and history." />
      <ol className="relative space-y-4 border-l border-navy-200 pl-5">
        {events.map((event) => (
          <li key={`${event.timestamp}-${event.description}`}>
            <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-ai" />
            <p className="text-xs font-semibold text-ai">{event.timestamp}</p>
            <p className="text-sm text-navy-800">{event.description}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 rounded-lg bg-ai-soft px-3 py-2 text-sm text-ai">
        Investigation completed in <span className="font-semibold">{durationSeconds} seconds</span>
      </p>
    </Card>
  )
}
