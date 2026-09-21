import { useState } from 'react'
import { Check, Circle, Minus, X } from 'lucide-react'
import type { JourneyStep } from '../../types'
import { Card, CardTitle } from '../ui/Card'

const styles = {
  completed: 'border-emerald-200 bg-success-soft text-success',
  failed: 'border-red-200 bg-danger-soft text-danger',
  not_started: 'border-navy-200 bg-navy-50 text-navy-400',
  delayed: 'border-amber-200 bg-warning-soft text-warning',
}

export function TransactionJourney({ steps }: { steps: JourneyStep[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const active = steps.find((step) => step.name === selected)

  return (
    <Card>
      <CardTitle title="Customer Journey" subtitle="Expected path across connected systems. Click a stage for evidence." />
      <div className="flex flex-col gap-0 xl:flex-row xl:items-stretch">
        {steps.map((step, index) => (
          <div key={step.name} className="flex flex-1 flex-col xl:flex-row xl:items-center">
            <button
              type="button"
              onClick={() => setSelected(step.name === selected ? null : step.name)}
              className={`flex-1 rounded-xl border px-3 py-3 text-left transition ${styles[step.status]} ${
                selected === step.name ? 'ring-2 ring-accent/40' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {step.status === 'completed' ? <Check className="h-4 w-4" /> : null}
                {step.status === 'failed' ? <X className="h-4 w-4" /> : null}
                {step.status === 'not_started' ? <Minus className="h-4 w-4" /> : null}
                {step.status === 'delayed' ? <Circle className="h-3.5 w-3.5" /> : null}
                <p className="text-sm font-semibold">{step.name}</p>
              </div>
              <p className="mt-1 text-xs opacity-80">
                {step.status === 'completed' ? '✓' : step.status === 'failed' ? '✕' : '—'} {step.detail}
              </p>
            </button>
            {index < steps.length - 1 ? (
              <div className="mx-auto h-4 w-px bg-navy-200 xl:mx-1 xl:h-px xl:w-3" />
            ) : null}
          </div>
        ))}
      </div>
      {active ? (
        <div className="mt-4 rounded-lg border border-navy-100 bg-navy-50/60 px-3 py-2.5 text-sm text-navy-700">
          <span className="font-semibold text-navy-900">{active.name}: </span>
          {active.detail}
          {active.timestamp ? <span className="ml-2 text-navy-400">{active.timestamp}</span> : null}
        </div>
      ) : null}
    </Card>
  )
}
