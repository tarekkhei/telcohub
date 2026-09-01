import { Check, X } from 'lucide-react'
import type { SystemInvestigation } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function SystemCorrelation({ systems }: { systems: SystemInvestigation[] }) {
  return (
    <Card>
      <CardTitle
        title="Systems investigated by Coreveo AI"
        subtitle="Cross-system reasoning: the agent gathers evidence rather than waiting on a single alarm."
      />
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {systems.map((system) => (
          <li
            key={system.name}
            className={`flex items-start justify-between rounded-lg border px-3 py-2.5 ${
              system.status === 'failed' ? 'border-red-200 bg-danger-soft' : 'border-navy-100 bg-navy-50'
            }`}
          >
            <div>
              <p className="text-sm font-medium text-navy-900">{system.name}</p>
              <p className="text-xs text-navy-600">{system.finding}</p>
            </div>
            {system.status === 'ok' ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <X className="h-4 w-4 text-danger" />
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
