import { useState } from 'react'
import { SoftBadge } from '../components/ui/Badge'
import { Card, CardTitle } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'
import type { ExceptionPack } from '../types/ops'

export function ExceptionPacks() {
  const result = useAsyncData(() => mockApi.exceptionPacks(), [])
  const [selected, setSelected] = useState<ExceptionPack | null>(null)

  if (result.loading || !result.data) return <PageSkeleton />
  const active = selected ?? result.data[0]

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="How telecom works"
        title="Exception Packs"
        subtitle="Connectors tell Coreveo how to talk to systems. Exception Packs tell Coreveo how telecom journeys are supposed to work."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {result.data.map((pack) => (
          <button key={pack.id} type="button" className="text-left" onClick={() => setSelected(pack)}>
            <Card className={`h-full ${active?.id === pack.id ? 'ring-2 ring-ai/30' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">{pack.category}</p>
                  <h2 className="text-sm font-semibold text-navy-900">{pack.name}</h2>
                </div>
                <SoftBadge tone={pack.status === 'ACTIVE' ? 'success' : 'ai'}>{pack.status}</SoftBadge>
              </div>
              <p className="mt-2 text-xs text-navy-500">Version {pack.version}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-navy-600">
                <div>
                  <dt className="text-navy-400">Known patterns</dt>
                  <dd className="font-semibold text-navy-900">{pack.knownPatterns}</dd>
                </div>
                <div>
                  <dt className="text-navy-400">Investigation</dt>
                  <dd className="font-semibold text-navy-900">{pack.investigationPlaybooks}</dd>
                </div>
                <div>
                  <dt className="text-navy-400">Resolution</dt>
                  <dd className="font-semibold text-navy-900">{pack.resolutionPlaybooks}</dd>
                </div>
                <div>
                  <dt className="text-navy-400">Success</dt>
                  <dd className="font-semibold text-ai">{pack.successRate}%</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-navy-500">{pack.coverage}</p>
            </Card>
          </button>
        ))}
      </div>

      {active ? (
        <Card>
          <CardTitle title={active.name} subtitle={`${active.coverage} · v${active.version}`} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Lifecycle model</h3>
              <p className="mt-2 text-sm text-navy-700">{active.lifecycleModel.join(' → ')}</p>
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Expected states</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                {active.expectedStates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Required identifiers</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                {active.requiredIdentifiers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Exception signatures</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                {active.exceptionSignatures.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Supported actions</h3>
              <ul className="mt-2 space-y-2">
                {active.supportedActions.map((action) => (
                  <li key={action.name} className="rounded-lg border border-navy-100 px-3 py-2 text-sm">
                    <p className="font-medium text-navy-900">{action.name}</p>
                    <p className="text-[11px] text-navy-500">
                      {action.governance} · risk {action.riskLevel}
                    </p>
                  </li>
                ))}
              </ul>
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Verification rules</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                {active.verificationRules.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
