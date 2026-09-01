import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

const accents = {
  emerging: 'border-l-4 border-l-danger',
  manual: 'border-l-4 border-l-ai',
  revenue: 'border-l-4 border-l-amber-500',
  preventable: 'border-l-4 border-l-accent',
}

export function AIInsights() {
  const result = useAsyncData(() => mockApi.insights(), [])
  if (result.loading || !result.data) return <PageSkeleton />

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Proactive agent"
        title="AI Insights"
        subtitle="Don't add another dashboard. Add an AI operations engineer that notices systemic problems."
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {result.data.map((card) => (
          <Card key={card.id} className={accents[card.type]}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-400">{card.title}</p>
            <p className="mt-3 text-sm leading-6 text-navy-800">{card.body}</p>
            <p className="mt-3 text-sm font-semibold text-ai">{card.metric}</p>
            {card.href ? (
              <Link to={card.href}>
                <Button variant="secondary" className="mt-4">
                  {card.cta}
                </Button>
              </Link>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  )
}
