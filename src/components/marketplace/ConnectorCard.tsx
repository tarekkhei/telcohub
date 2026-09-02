import { useNavigate } from 'react-router-dom'
import type { ConnectorInstance } from '../../types/connectors'
import { Card } from '../ui/Card'
import { ConnectorIcon } from './ConnectorIcon'
import { ConnectorStatusBadge } from './ConnectorStatusBadge'

function aiLabels(connector: ConnectorInstance) {
  const items: string[] = []
  if (connector.aiCapabilities.investigation) items.push('Investigation')
  if (connector.aiCapabilities.correlation) items.push('State Correlation')
  if (connector.aiCapabilities.rootCauseAnalysis) items.push('Root Cause Context')
  if (connector.aiCapabilities.recommendations) items.push('Recommended Actions')
  if (connector.aiCapabilities.supervisedRemediation) items.push('Ticket / Case Update')
  return items.slice(0, 4)
}

export function ConnectorCard({ connector }: { connector: ConnectorInstance }) {
  const navigate = useNavigate()
  const labels = aiLabels(connector)

  return (
    <button
      type="button"
      onClick={() => navigate(`/marketplace/${connector.id}`)}
      className="h-full w-full text-left"
    >
      <Card className="h-full transition hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
              <ConnectorIcon name={connector.icon} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-navy-900">{connector.name}</h3>
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{connector.category}</p>
            </div>
          </div>
          <div className="shrink-0">
            <ConnectorStatusBadge status={connector.displayStatus} />
          </div>
        </div>
        <p className="mt-3 text-sm text-navy-600">{connector.shortDescription}</p>
        <p className="mt-2 text-[11px] text-navy-400">{connector.connectionType}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {connector.capabilities.slice(0, 3).map((item) => (
            <span key={item} className="rounded-md bg-navy-50 px-1.5 py-0.5 text-[11px] text-navy-600">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-4 border-t border-navy-50 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-navy-400">AI capabilities</p>
          <ul className="mt-1.5 space-y-0.5 text-xs text-navy-700">
            {labels.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </div>
      </Card>
    </button>
  )
}
