import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { FEATURED_CONNECTOR_IDS } from '../connectors/catalog'
import { ConnectedSystemsPanel } from '../components/marketplace/ConnectedSystemsPanel'
import { ConnectorCard } from '../components/marketplace/ConnectorCard'
import { ConnectorWizard } from '../components/marketplace/ConnectorWizard'
import { Button } from '../components/ui/Button'
import { DemoBanner } from '../components/ui/DemoBanner'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'
import type { ConnectorCategory, ConnectorCertification, ConnectorKind, ConnectorQuery } from '../types/connectors'
import { CONNECTOR_CATEGORIES } from '../types/connectors'

const AVAILABILITY = [
  { value: 'all', label: 'All statuses' },
  { value: 'connected', label: 'Connected' },
  { value: 'available', label: 'Available' },
  { value: 'coming_soon', label: 'Coming soon' },
]

const CERTIFICATIONS: { value: ConnectorCertification | 'all'; label: string }[] = [
  { value: 'all', label: 'All certifications' },
  { value: 'CERTIFIED', label: 'Certified' },
  { value: 'COREVEO_NATIVE', label: 'Coreveo Native' },
  { value: 'MARKETPLACE_PACK', label: 'Marketplace Pack' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'COMING_SOON', label: 'Coming soon' },
]

const KINDS: { value: ConnectorKind | 'all'; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'native', label: 'Coreveo native' },
  { value: 'pack', label: 'Connector pack' },
  { value: 'generic', label: 'Generic' },
]

export function Marketplace() {
  const { connectedConnectorIds, activateConnector } = useAppState()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ConnectorCategory | 'All'>('All')
  const [availability, setAvailability] = useState<ConnectorQuery['availability']>('all')
  const [certification, setCertification] = useState<ConnectorCertification | 'all'>('all')
  const [kind, setKind] = useState<ConnectorKind | 'all'>('all')
  const [showAll, setShowAll] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardId, setWizardId] = useState<string | undefined>('rest-api')

  const filtered = Boolean(search.trim()) || category !== 'All' || availability !== 'all' || certification !== 'all' || kind !== 'all'
  const featuredOnly = !filtered && !showAll

  const query: ConnectorQuery = useMemo(
    () => ({
      search,
      category,
      availability,
      certification,
      kind,
      featuredOnly,
    }),
    [availability, category, certification, featuredOnly, kind, search],
  )

  const result = useAsyncData(() => mockApi.listConnectors(query, connectedConnectorIds), [query, connectedConnectorIds])
  const allCount = useAsyncData(() => mockApi.listConnectors({ featuredOnly: false }, connectedConnectorIds), [
    connectedConnectorIds,
  ])

  function openWizard(id?: string) {
    setWizardId(id)
    setWizardOpen(true)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Unified Operational Context"
        subtitle="Connect TERA to the systems and operational evidence you already have."
        actions={
          <Button onClick={() => openWizard('rest-api')}>
            <Plus className="h-4 w-4" />
            Connect System
          </Button>
        }
      />
      <DemoBanner>
        No rip-and-replace. TERA creates intelligence across your existing stack. Connections in this demo are simulated.
      </DemoBanner>

      <div className="flex flex-wrap gap-1.5">
        {['SYSTEM', 'TELEMETRY', 'EVENT STREAM', 'DATABASE', 'ITSM', 'CHANGE / DEPLOYMENT', 'OBSERVABILITY'].map((kind) => (
          <span key={kind} className="rounded-full bg-navy-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy-500">
            {kind}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search connectors, vendors, entities or capabilities"
              className="w-full rounded-lg border border-navy-200 bg-white py-2 pl-9 pr-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 md:text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CONNECTOR_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  category === item ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 ring-1 ring-navy-200 hover:bg-navy-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Select
              label="Availability"
              value={availability ?? 'all'}
              onChange={(value) => setAvailability(value as ConnectorQuery['availability'])}
              options={AVAILABILITY}
            />
            <Select
              label="Certification"
              value={certification}
              onChange={(value) => setCertification(value as ConnectorCertification | 'all')}
              options={CERTIFICATIONS}
            />
            <Select
              label="Connector type"
              value={kind}
              onChange={(value) => setKind(value as ConnectorKind | 'all')}
              options={KINDS}
            />
          </div>

          {result.loading || !result.data ? (
            <PageSkeleton />
          ) : result.data.length === 0 ? (
            <EmptyState
              title="No connectors match"
              description="Try another category, clear search, or add a custom REST/SOAP/database connector."
              onReset={() => {
                setSearch('')
                setCategory('All')
                setAvailability('all')
                setCertification('all')
                setKind('all')
                setShowAll(false)
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {result.data.map((connector) => (
                  <ConnectorCard key={connector.id} connector={connector} />
                ))}
              </div>
              {featuredOnly ? (
                <div className="text-center">
                  <Button variant="secondary" onClick={() => setShowAll(true)}>
                    View all {allCount.data?.length ?? FEATURED_CONNECTOR_IDS.length} connectors
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <ConnectedSystemsPanel connectedIds={connectedConnectorIds} onConnect={(id) => openWizard(id)} />
      </div>

      <ConnectorWizard
        open={wizardOpen}
        initialId={wizardId}
        connectedIds={connectedConnectorIds}
        onClose={() => setWizardOpen(false)}
        onActivated={activateConnector}
      />
    </div>
  )
}
