import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Circle, TriangleAlert, X } from 'lucide-react'
import { Card, CardTitle } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { SoftBadge } from '../components/ui/Badge'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'
import type { BlueprintStageStatus, OperationalBlueprint } from '../types/ops'

const STAGE_STYLE: Record<BlueprintStageStatus, string> = {
  expected: 'border-emerald-200 bg-success-soft text-success',
  failed: 'border-red-200 bg-danger-soft text-danger',
  delayed: 'border-amber-200 bg-warning-soft text-warning',
  not_reached: 'border-navy-200 bg-navy-50 text-navy-400',
}

export function OperationalBlueprint() {
  const result = useAsyncData(() => mockApi.operationalBlueprints(), [])
  const [selected, setSelected] = useState<OperationalBlueprint | null>(null)

  if (result.loading || !result.data) return <PageSkeleton />
  const active = selected ?? result.data[0]

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="How telecom is supposed to work"
        title="Operational Blueprint"
        subtitle="Expected journeys, states and identifiers — not a BSS/OSS replacement. TERA understands the happy path so it can detect when it breaks."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {result.data.map((blueprint) => (
          <button key={blueprint.id} type="button" className="text-left" onClick={() => setSelected(blueprint)}>
            <Card
              className={`h-full transition hover:border-accent/40 ${
                active?.id === blueprint.id ? 'ring-2 ring-accent/30' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-navy-900">{blueprint.name}</h2>
                <SoftBadge tone="success">{blueprint.status}</SoftBadge>
              </div>
              <p className="mt-2 text-xs text-navy-500">{blueprint.lifecycle}</p>
              <p className="mt-3 text-[11px] text-navy-400">Systems</p>
              <p className="text-xs text-navy-700">{blueprint.systems.join(' · ')}</p>
              <p className="mt-3 text-[11px] text-navy-400">Critical IDs</p>
              <p className="text-xs text-navy-700">{blueprint.criticalIdentifiers.slice(0, 4).join(', ')}…</p>
              <p className="mt-3 text-[11px] text-navy-400">Known exceptions · {blueprint.knownExceptions.length}</p>
              <p className="text-xs text-navy-600">{blueprint.knownExceptions.slice(0, 3).join(' · ')}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-navy-400">
                <span>Pack: {blueprint.linkedPackName}</span>
                <span>Updated {blueprint.lastUpdated}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {active ? (
        <Card>
          <CardTitle
            title={`${active.name} lifecycle`}
            subtitle={active.expectedEndState}
            action={
              <Link to={`/exception-packs`} className="text-xs font-semibold text-accent hover:underline">
                Open {active.linkedPackName}
              </Link>
            }
          />
          <div className="flex flex-col gap-2 xl:flex-row xl:items-stretch">
            {active.stages.map((stage, index) => (
              <div key={stage.key} className="flex flex-1 flex-col xl:flex-row xl:items-center">
                <div className={`flex-1 rounded-xl border px-3 py-3 ${STAGE_STYLE[stage.status]}`}>
                  <div className="flex items-center gap-2">
                    {stage.status === 'expected' ? <Check className="h-4 w-4" /> : null}
                    {stage.status === 'failed' ? <X className="h-4 w-4" /> : null}
                    {stage.status === 'delayed' ? <TriangleAlert className="h-4 w-4" /> : null}
                    {stage.status === 'not_reached' ? <Circle className="h-3.5 w-3.5" /> : null}
                    <p className="text-sm font-semibold">{stage.label}</p>
                  </div>
                  {stage.detail ? <p className="mt-1 text-xs opacity-80">{stage.detail}</p> : null}
                </div>
                {index < active.stages.length - 1 ? (
                  <div className="mx-auto h-4 w-px bg-navy-200 xl:mx-1 xl:h-px xl:w-3" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {active.expectedStates.map((row) => (
              <div
                key={row.system}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  row.aligned ? 'border-navy-100 bg-navy-50' : 'border-red-200 bg-danger-soft'
                }`}
              >
                <span className="font-medium text-navy-800">{row.system}</span>
                <span className={row.aligned ? 'text-success' : 'text-danger'}>
                  {row.expected} → {row.observed}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
