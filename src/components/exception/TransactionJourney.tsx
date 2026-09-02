import { Check, Circle, X } from 'lucide-react'
import type { JourneyStep } from '../../types'
import { Card, CardTitle } from '../ui/Card'

const styles = {
  completed: 'border-emerald-200 bg-success-soft text-success',
  failed: 'border-red-300 bg-danger-soft text-danger ring-2 ring-red-100',
  not_started: 'border-navy-200 bg-navy-50 text-navy-400',
}

export function TransactionJourney({ steps }: { steps: JourneyStep[] }) {
  return (
    <Card>
      <CardTitle
        title="Business transaction journey"
        subtitle="The customer activation is reconstructed across systems. The failed step is the exception — not the alert."
      />
      <div className="flex flex-col gap-0 xl:flex-row xl:items-stretch">
        {steps.map((step, index) => (
          <div key={step.name} className="flex flex-1 flex-col xl:flex-row xl:items-center">
            <div className={`flex-1 rounded-xl border px-3 py-3 ${styles[step.status]}`}>
              <div className="flex items-center gap-2">
                {step.status === 'completed' ? <Check className="h-4 w-4" /> : null}
                {step.status === 'failed' ? <X className="h-4 w-4" /> : null}
                {step.status === 'not_started' ? <Circle className="h-3.5 w-3.5" /> : null}
                <p className="text-sm font-semibold">{step.name}</p>
              </div>
              <p className="mt-1 text-xs opacity-80">
                {step.status === 'completed' ? '✓' : step.status === 'failed' ? '✕' : '○'} {step.detail}
              </p>
              {step.timestamp ? <p className="mt-1 text-[11px] opacity-70">{step.timestamp}</p> : null}
            </div>
            {index < steps.length - 1 ? (
              <div className="mx-auto h-6 w-px bg-navy-200 xl:mx-1 xl:h-px xl:w-4" />
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  )
}
