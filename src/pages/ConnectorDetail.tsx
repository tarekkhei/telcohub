import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ConnectorIcon } from '../components/marketplace/ConnectorIcon'
import { ConnectorStatusBadge, GovernanceBadge } from '../components/marketplace/ConnectorStatusBadge'
import { ConnectorWizard } from '../components/marketplace/ConnectorWizard'
import { Button } from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { DemoBanner } from '../components/ui/DemoBanner'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function ConnectorDetail() {
  const { id = '' } = useParams()
  const { connectedConnectorIds, activateConnector } = useAppState()
  const [wizardOpen, setWizardOpen] = useState(false)
  const result = useAsyncData(() => mockApi.getConnector(id, connectedConnectorIds), [id, connectedConnectorIds])
  const discoveries = useAsyncData(() => mockApi.discoverConnector(id), [id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (result.loading) return <PageSkeleton />
  if (!result.data) {
    return (
      <div className="space-y-4">
        <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-800">
          <ArrowLeft className="h-4 w-4" />
          Connector Marketplace
        </Link>
        <p className="text-sm text-navy-600">That connector is not in the demo catalog.</p>
      </div>
    )
  }
  const connector = result.data
  const ai = connector.aiCapabilities

  return (
    <div className="space-y-5">
      <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-800">
        <ArrowLeft className="h-4 w-4" />
        Connector Marketplace
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
            <ConnectorIcon name={connector.icon} className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">{connector.category}</p>
            <h1 className="text-xl font-semibold text-navy-900 sm:text-2xl">{connector.name}</h1>
            <p className="mt-1 text-sm text-navy-500">{connector.overview}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConnectorStatusBadge status={connector.displayStatus} />
          {!connector.connected && connector.certificationStatus !== 'COMING_SOON' ? (
            <Button onClick={() => setWizardOpen(true)}>Add Connector</Button>
          ) : null}
        </div>
      </div>

      <DemoBanner>This connector pack is synthetic metadata for the Coreveo demo. No live vendor session is established.</DemoBanner>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle title="Overview" subtitle={connector.description} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Capabilities</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                {connector.capabilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Entities</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                {connector.entities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          {connector.lifecycleStages?.length ? (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Lifecycle</h3>
              <p className="mt-2 text-sm text-navy-700">{connector.lifecycleStages.join(' → ')}</p>
            </div>
          ) : null}
        </Card>

        <Card>
          <CardTitle title="Authentication" subtitle={connector.connectionType} />
          <ul className="space-y-1 text-sm text-navy-700">
            {(connector.authMethods ?? connector.connectionMethods).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-navy-400">Coreveo AI support</h3>
          <ul className="mt-2 space-y-1 text-sm text-navy-700">
            <li>Investigation {ai.investigation ? '✓' : '—'}</li>
            <li>Cross-system correlation {ai.correlation ? '✓' : '—'}</li>
            <li>Root-cause analysis {ai.rootCauseAnalysis ? '✓' : '—'}</li>
            <li>Recommended actions {ai.recommendations ? '✓' : '—'}</li>
            <li>Automated actions {ai.autonomousRemediation ? '✓' : ai.supervisedRemediation ? 'Limited' : '—'}</li>
          </ul>
        </Card>
      </div>

      <Card>
          <CardTitle
            title="Supported actions"
            subtitle="Governance is evaluated before any simulated write."
            action={
              !connector.connected && connector.certificationStatus !== 'COMING_SOON' ? (
                <Button onClick={() => setWizardOpen(true)}>Add Connector</Button>
              ) : null
            }
          />
        <div className="space-y-2">
          {connector.actions.map((action) => (
            <div key={action.name} className="flex flex-col gap-2 rounded-lg border border-navy-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-navy-900">{action.name}</p>
                {action.description ? <p className="text-xs text-navy-500">{action.description}</p> : null}
              </div>
              <GovernanceBadge governance={action.governance} />
            </div>
          ))}
        </div>
        {connector.databaseReadOnlyNote ? (
          <p className="mt-4 text-sm text-navy-600">
            Coreveo recommends read-only database access for operational investigation.
          </p>
        ) : null}
      </Card>

      <Card>
        <CardTitle
          title="AI semantic discovery"
          subtitle="After importing an API contract, Coreveo interprets operational meaning — entity, lifecycle, risk and execution policy."
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {(discoveries.data ?? []).map((item) => (
            <div key={`${item.method}-${item.endpoint}`} className="rounded-lg border border-navy-100 p-4">
              <p className="font-mono text-xs text-navy-500">
                {item.method} {item.endpoint}
              </p>
              <p className="mt-2 text-sm font-semibold text-navy-900">{item.capability}</p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-navy-600">
                <div>
                  <dt className="text-navy-400">Entity</dt>
                  <dd>{item.entity}</dd>
                </div>
                <div>
                  <dt className="text-navy-400">Lifecycle</dt>
                  <dd>{item.lifecycleStage ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-navy-400">Risk</dt>
                  <dd>{item.risk}</dd>
                </div>
                <div>
                  <dt className="text-navy-400">AI execution</dt>
                  <dd>{item.aiExecution}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Card>

      {connector.useCase ? (
        <Card>
          <CardTitle title="Example operational use case" />
          <p className="text-sm leading-6 text-navy-700">{connector.useCase}</p>
        </Card>
      ) : null}

      <ConnectorWizard
        open={wizardOpen}
        initialId={connector.id}
        connectedIds={connectedConnectorIds}
        onClose={() => setWizardOpen(false)}
        onActivated={activateConnector}
      />
    </div>
  )
}
