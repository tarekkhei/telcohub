import { PLG_SLOTS } from '../../connectors/catalog'
import { getConnectorDefinition } from '../../connectors/catalog'
import { Card } from '../ui/Card'

const LADDER = [
  { range: '1 system', label: 'See', min: 1, max: 1 },
  { range: '2–3 systems', label: 'Correlate', min: 2, max: 3 },
  { range: '4–8 systems', label: 'Diagnose & resolve', min: 4, max: 8 },
  { range: 'Enterprise', label: 'Automate', min: 9, max: 99 },
]

export function ConnectedSystemsPanel({
  connectedIds,
  onConnect,
}: {
  connectedIds: string[]
  onConnect: (id: string) => void
}) {
  const count = connectedIds.length
  const activeStep = LADDER.findIndex((step) => count >= step.min && count <= step.max)

  return (
    <Card>
      <h2 className="text-sm font-semibold text-navy-900">Connected systems</h2>
      <p className="mt-1 text-xs text-navy-500">
        One connected system provides visibility. Connecting additional systems enables cross-system
        correlation, root-cause analysis and automated resolution.
      </p>
      <ul className="mt-4 space-y-2">
        {PLG_SLOTS.map((slot) => {
          const definition = getConnectorDefinition(slot.id)
          const connected = connectedIds.includes(slot.id)
          const free = definition?.plgFree
          return (
            <li key={slot.id} className="flex items-center justify-between rounded-lg bg-navy-50 px-3 py-2 text-sm">
              <span className="font-medium text-navy-800">{slot.label}</span>
              {connected ? (
                <span className="text-xs font-semibold text-success">{free ? '✓ Free system' : '✓ Connected'}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onConnect(slot.id)}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Connect
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {LADDER.map((step, index) => (
          <div
            key={step.label}
            className={`rounded-lg px-2.5 py-2 text-center ${
              index === activeStep ? 'bg-ai-soft text-ai' : 'bg-navy-50 text-navy-500'
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide">{step.range}</p>
            <p className="text-xs font-semibold">{step.label}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
