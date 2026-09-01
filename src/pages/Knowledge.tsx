import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

export function Knowledge() {
  const result = useAsyncData(() => mockApi.knowledge(), [])
  if (result.loading || !result.data) return <PageSkeleton />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Operational knowledge"
        title="Knowledge"
        subtitle="Each resolved exception becomes a reusable pattern — the operational knowledge moat."
      />
      <div className="space-y-5">
        {result.data.map((pattern) => (
          <Card key={pattern.id}>
            <p className="text-xs font-semibold text-ai">{pattern.id}</p>
            <h2 className="mt-1 text-lg font-semibold text-navy-900">Pattern: {pattern.title}</h2>
            <p className="mt-1 text-xs text-navy-500">
              Used {pattern.timesUsed} times · {pattern.successRate}% historical resolution success
            </p>
            <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Conditions</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                  {pattern.conditions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Likely causes</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
                  {pattern.likelyCauses.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-400">Historical resolution success</h3>
                <ul className="mt-2 space-y-1 text-sm text-navy-700">
                  {pattern.historicalResolutions.map((item) => (
                    <li key={item.cause} className="flex justify-between">
                      <span>{item.cause}</span>
                      <span className="font-semibold">{item.percent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">Recommended investigation sequence</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-navy-700">
                  {pattern.investigationSequence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
