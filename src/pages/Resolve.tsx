import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { SoftBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { useAppState } from '../context/AppStateContext'
import { HERO_EXCEPTION_ID } from '../data/constants'

type Tab = 'recommendations' | 'awaiting' | 'executing' | 'verified'

export function Resolve() {
  const { exceptions, resolutionOutcome } = useAppState()
  const [tab, setTab] = useState<Tab>('awaiting')

  const items = useMemo(() => {
    const open = exceptions.filter((item) =>
      ['diagnosed', 'awaiting_approval', 'resolving', 'verified'].includes(item.status) ||
      resolutionOutcome[item.id],
    )

    return open.map((item) => {
      const outcome = resolutionOutcome[item.id]
      let lane: Tab = 'recommendations'
      if (outcome === 'verified' || item.status === 'verified') lane = 'verified'
      else if (outcome === 'running' || item.status === 'resolving') lane = 'executing'
      else if (item.status === 'awaiting_approval') lane = 'awaiting'
      else lane = 'recommendations'
      return { ...item, lane }
    })
  }, [exceptions, resolutionOutcome])

  const visible = items.filter((item) => item.lane === tab)
  const tabs: { id: Tab; label: string }[] = [
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'awaiting', label: 'Awaiting Approval' },
    { id: 'executing', label: 'Executing' },
    { id: 'verified', label: 'Verified' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Intelligent Resolution & Automation"
        subtitle="Turn diagnosis into governed actions, verify recovery and return transactions to the happy path."
      />

      <div className="flex flex-wrap gap-1 rounded-lg border border-navy-100 bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              tab === item.id ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visible.length === 0 ? (
          <Card>
            <p className="text-sm text-navy-500">No items in this queue.</p>
          </Card>
        ) : (
          visible.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle title={item.title} subtitle={`${item.customersImpacted} affected transactions`} />
                  <p className="mt-2 text-sm text-navy-600">
                    Recommended: {item.id === HERO_EXCEPTION_ID ? 'Validate endpoint + controlled retry' : item.rootCause}
                  </p>
                </div>
                <SoftBadge tone="success">Risk LOW</SoftBadge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-medium text-ai">Confidence {item.aiConfidence}%</span>
                {tab === 'awaiting' ? <SoftBadge tone="warning">APPROVAL REQUIRED</SoftBadge> : null}
              </div>
              <div className="mt-4">
                <Link to={`/exceptions/${item.id}`}>
                  <Button variant={tab === 'awaiting' ? 'ai' : 'secondary'}>Review</Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
