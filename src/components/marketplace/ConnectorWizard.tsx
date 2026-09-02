import { useEffect, useMemo, useState } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { CONNECTOR_CATALOG } from '../../connectors/catalog'
import { useAsyncData } from '../../hooks/useAsyncData'
import { mockApi } from '../../services/mockApi'
import type { ConnectorInstance } from '../../types/connectors'
import { Button } from '../ui/Button'
import { DemoBanner } from '../ui/DemoBanner'
import { Modal } from '../ui/Modal'
import { ConnectorIcon } from './ConnectorIcon'
import { GovernanceBadge } from './ConnectorStatusBadge'

const STEPS = [
  'Select connector',
  'Connection method',
  'Credentials',
  'Import API',
  'Map entities',
  'Permissions',
  'Test connection',
  'Activate',
]

export function ConnectorWizard({
  open,
  initialId,
  connectedIds,
  onClose,
  onActivated,
}: {
  open: boolean
  initialId?: string
  connectedIds: string[]
  onClose: () => void
  onActivated: (id: string) => void
}) {
  const [step, setStep] = useState(0)
  const [selectedId, setSelectedId] = useState(initialId ?? 'rest-api')
  const [method, setMethod] = useState('')
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)
  const [discovering, setDiscovering] = useState(false)
  const [discovered, setDiscovered] = useState(false)

  const catalog = useAsyncData(() => mockApi.listConnectors({ featuredOnly: false }, connectedIds), [
    open,
    connectedIds.join(','),
  ])
  const selected = catalog.data?.find((item) => item.id === selectedId) ?? null
  const discoveries = useAsyncData(
    () => (selectedId ? mockApi.discoverConnector(selectedId) : Promise.resolve([])),
    [selectedId, discovered],
  )
  const testResult = useAsyncData(
    () => (tested && selectedId ? mockApi.testConnector(selectedId) : Promise.resolve(null)),
    [tested, selectedId],
  )

  useEffect(() => {
    if (!open) return
    setStep(initialId ? 1 : 0)
    setSelectedId(initialId ?? 'rest-api')
    setMethod('')
    setTesting(false)
    setTested(false)
    setDiscovering(false)
    setDiscovered(false)
  }, [open, initialId])

  useEffect(() => {
    if (selected && !method) setMethod(selected.connectionMethods[0] ?? '')
  }, [method, selected])

  const canNext = useMemo(() => {
    if (step === 0) return Boolean(selectedId)
    if (step === 1) return Boolean(method)
    if (step === 3) return discovered
    if (step === 6) return tested && testResult.data?.success
    return true
  }, [discovered, method, selectedId, step, testResult.data?.success, tested])

  async function runDiscover() {
    setDiscovering(true)
    await mockApi.discoverConnector(selectedId)
    setDiscovering(false)
    setDiscovered(true)
  }

  async function runTest() {
    setTesting(true)
    await mockApi.testConnector(selectedId)
    setTesting(false)
    setTested(true)
  }

  function activate() {
    if (!selected) return
    onActivated(selected.id)
    onClose()
  }

  return (
    <Modal open={open} title="Add connector" onClose={onClose} size="xl">
      <DemoBanner>All credentials are synthetic. No vendor APIs or databases are contacted.</DemoBanner>
      <ol className="mt-4 flex flex-wrap gap-1.5">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`rounded-full px-2 py-1 text-[11px] font-medium ${
              index === step ? 'bg-ai-soft text-ai' : index < step ? 'bg-success-soft text-success' : 'bg-navy-50 text-navy-400'
            }`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="mt-5 min-h-[280px]">
        {step === 0 ? <SelectStep connectors={catalog.data ?? []} selectedId={selectedId} onSelect={setSelectedId} /> : null}
        {step === 1 && selected ? (
          <MethodStep connector={selected} method={method} onChange={setMethod} />
        ) : null}
        {step === 2 && selected ? <CredentialsStep connector={selected} method={method} /> : null}
        {step === 3 && selected ? (
          <DiscoverStep
            connector={selected}
            discovering={discovering}
            discovered={discovered}
            discoveries={discoveries.data ?? []}
            onDiscover={runDiscover}
          />
        ) : null}
        {step === 4 && selected ? <MapStep connector={selected} /> : null}
        {step === 5 && selected ? <PermissionsStep connector={selected} /> : null}
        {step === 6 && selected ? (
          <TestStep
            testing={testing}
            tested={tested}
            result={testResult.data}
            onTest={runTest}
          />
        ) : null}
        {step === 7 && selected ? <ActivateStep connector={selected} /> : null}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={step === 0 ? onClose : () => setStep((value) => value - 1)}>
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button disabled={!canNext} onClick={() => setStep((value) => value + 1)}>
            Continue
          </Button>
        ) : (
          <Button onClick={activate} disabled={!selected}>
            Activate connector
          </Button>
        )}
      </div>
    </Modal>
  )
}

function SelectStep({
  connectors,
  selectedId,
  onSelect,
}: {
  connectors: ConnectorInstance[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const options = connectors.length ? connectors : CONNECTOR_CATALOG.map((item) => ({ ...item, connected: false, displayStatus: item.certificationStatus }))
  return (
    <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
      {options.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm ${
            selectedId === item.id ? 'border-accent bg-accent-soft' : 'border-navy-100 hover:bg-navy-50'
          }`}
        >
          <ConnectorIcon name={item.icon} className="h-4 w-4 text-navy-600" />
          <span>
            <span className="block font-medium text-navy-900">{item.name}</span>
            <span className="text-[11px] text-navy-400">{item.category}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

function MethodStep({
  connector,
  method,
  onChange,
}: {
  connector: ConnectorInstance
  method: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-navy-600">Choose how Coreveo should reach {connector.name} in this demo.</p>
      {connector.connectionMethods.map((item) => (
        <label key={item} className="flex items-center gap-2 rounded-lg border border-navy-100 px-3 py-2 text-sm">
          <input type="radio" name="method" checked={method === item} onChange={() => onChange(item)} />
          {item}
        </label>
      ))}
    </div>
  )
}

function CredentialsStep({ connector, method }: { connector: ConnectorInstance; method: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-navy-600">
        Demo credentials for {connector.name} via {method}. Values are illustrative and never sent.
      </p>
      <label className="block text-sm">
        <span className="text-xs text-navy-500">Client ID / Username</span>
        <input readOnly value="demo-coreveo-client" className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-base md:text-sm" />
      </label>
      <label className="block text-sm">
        <span className="text-xs text-navy-500">Secret / Token</span>
        <input readOnly type="password" value="synthetic-secret" className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-base md:text-sm" />
      </label>
      <label className="block text-sm">
        <span className="text-xs text-navy-500">Environment</span>
        <input readOnly value="sandbox.demo.coreveo.local" className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-base md:text-sm" />
      </label>
    </div>
  )
}

function DiscoverStep({
  connector,
  discovering,
  discovered,
  discoveries,
  onDiscover,
}: {
  connector: ConnectorInstance
  discovering: boolean
  discovered: boolean
  discoveries: Awaited<ReturnType<typeof mockApi.discoverConnector>>
  onDiscover: () => void
}) {
  return (
    <div>
      <p className="text-sm text-navy-600">
        Coreveo imports the API contract and assigns operational meaning to each endpoint. This is not simple API
        connectivity.
      </p>
      <Button className="mt-3" variant="ai" onClick={onDiscover} disabled={discovering}>
        {discovering ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {discovered ? 'Re-run semantic discovery' : 'Import API / discover capabilities'}
      </Button>
      {discovered ? (
        <ul className="mt-4 space-y-3">
          {discoveries.map((item) => (
            <li key={`${item.method}-${item.endpoint}`} className="rounded-lg border border-navy-100 p-3 text-sm">
              <p className="font-mono text-xs text-navy-500">
                {item.method} {item.endpoint}
              </p>
              <p className="mt-1 font-semibold text-navy-900">{item.capability}</p>
              <p className="text-xs text-navy-500">
                Entity {item.entity}
                {item.lifecycleStage ? ` · ${item.lifecycleStage}` : ''} · Risk {item.risk} · {item.aiExecution}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-navy-400">Run discovery against the synthetic {connector.name} contract.</p>
      )}
    </div>
  )
}

function MapStep({ connector }: { connector: ConnectorInstance }) {
  const pairs = [
    ['Customer', connector.entities.find((item) => /customer|account/i.test(item)) ?? connector.entities[0]],
    ['MSISDN', connector.entities.find((item) => /msisdn|subscriber|did/i.test(item)) ?? 'external_id'],
    ['Order', connector.entities.find((item) => /order/i.test(item)) ?? 'order_id'],
  ]
  return (
    <div>
      <p className="text-sm text-navy-600">Map Coreveo operational IDs to {connector.name} entities.</p>
      <table className="mt-3 w-full text-left text-sm">
        <thead className="text-[11px] uppercase tracking-wide text-navy-400">
          <tr>
            <th className="py-1">Coreveo</th>
            <th className="py-1">{connector.name}</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map(([left, right]) => (
            <tr key={left} className="border-t border-navy-50">
              <td className="py-2 font-medium text-navy-800">{left}</td>
              <td className="py-2 text-navy-600">{right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PermissionsStep({ connector }: { connector: ConnectorInstance }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-navy-600">
        Restricted actions cannot be enabled in the public demo. Write actions remain simulated.
      </p>
      {connector.actions.map((action) => (
        <div key={action.name} className="flex flex-col gap-2 rounded-lg border border-navy-100 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={action.governance !== 'RESTRICTED'} disabled={action.governance === 'RESTRICTED'} />
            {action.name}
          </label>
          <GovernanceBadge governance={action.governance} />
        </div>
      ))}
    </div>
  )
}

function TestStep({
  testing,
  tested,
  result,
  onTest,
}: {
  testing: boolean
  tested: boolean
  result: Awaited<ReturnType<typeof mockApi.testConnector>> | null
  onTest: () => void
}) {
  return (
    <div>
      <Button variant="ai" onClick={onTest} disabled={testing}>
        {testing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {tested ? 'Re-run simulated test' : 'Test connection'}
      </Button>
      {tested && result?.success ? (
        <div className="mt-4 rounded-xl bg-success-soft p-4 text-sm text-navy-800">
          <p className="flex items-center gap-2 font-semibold text-success">
            <Check className="h-4 w-4" />
            {result.message} ✓
          </p>
          <ul className="mt-2 space-y-1 text-navy-700">
            <li>{result.capabilitiesDiscovered} API capabilities discovered</li>
            <li>{result.entitiesIdentified} operational entities identified</li>
            <li>{result.readOperations} read operations</li>
            <li>{result.writeOperations} write operations</li>
            <li>{result.restrictedActions} restricted action{result.restrictedActions === 1 ? '' : 's'}</li>
          </ul>
          <p className="mt-2 text-xs text-navy-500">Ready for Coreveo validation.</p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-navy-400">The test is simulated. It never reaches a live vendor API.</p>
      )}
    </div>
  )
}

function ActivateStep({ connector }: { connector: ConnectorInstance }) {
  return (
    <div className="rounded-xl bg-navy-50 p-4 text-sm text-navy-700">
      <p className="font-semibold text-navy-900">Activate {connector.name}</p>
      <p className="mt-2">
        The connector will appear as connected in this demo session. Coreveo will use its metadata for investigation
        narratives. No production runtime is started.
      </p>
    </div>
  )
}
