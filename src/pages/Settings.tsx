import { useNavigate } from 'react-router-dom'
import { SoftBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { DemoBanner } from '../components/ui/DemoBanner'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function Settings() {
  const navigate = useNavigate()
  const result = useAsyncData(() => mockApi.systems(), [])
  if (result.loading || !result.data) return <PageSkeleton />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Integrations"
        title="Settings"
        subtitle="Connected OSS/BSS systems the agent can query during investigation. No live connections in this mockup."
        actions={
          <Button variant="secondary" onClick={() => navigate('/marketplace')}>
            Connector Marketplace
          </Button>
        }
      />
      <DemoBanner>Statuses, latency and event counts are synthetic.</DemoBanner>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {result.data.map((system) => (
          <Card key={system.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle title={system.name} subtitle={system.description} />
              </div>
              <SoftBadge tone={system.status === 'connected' ? 'success' : 'navy'}>
                {system.status === 'connected' ? 'Connected' : 'Demo'}
              </SoftBadge>
            </div>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-xs text-navy-400">Last synchronization</dt>
                <dd className="mt-1 font-medium text-navy-800">{system.lastSync}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-400">API latency</dt>
                <dd className="mt-1 font-medium text-navy-800">{system.latencyMs ? `${system.latencyMs} ms` : '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-400">Events processed</dt>
                <dd className="mt-1 font-medium text-navy-800">{system.eventsProcessed.toLocaleString()}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  )
}
