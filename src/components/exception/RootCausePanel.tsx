import type { Diagnosis } from '../../types'
import { Card } from '../ui/Card'

export function RootCausePanel({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-white to-ai-soft/50">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ai">Coreveo AI Diagnosis</p>
      <h2 className="mt-2 text-lg font-semibold text-navy-900">Probable root cause</h2>
      <p className="mt-2 text-base font-medium text-navy-800">{diagnosis.rootCause}</p>
      <p className="mt-3 text-sm text-navy-600">
        Confidence: <span className="font-semibold text-ai">{diagnosis.confidence}%</span>
      </p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Evidence</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-navy-700">
          {diagnosis.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white px-3 py-3">
          <p className="text-xs text-navy-500">Possible blast radius</p>
          <p className="text-lg font-semibold text-navy-900">{diagnosis.blastRadius} customer activations</p>
        </div>
        <div className="rounded-lg bg-white px-3 py-3">
          <p className="text-xs text-navy-500">Estimated potential revenue blocked</p>
          <p className="text-lg font-semibold text-navy-900">${diagnosis.revenueBlocked.toLocaleString()} MRR</p>
        </div>
      </div>
    </Card>
  )
}
