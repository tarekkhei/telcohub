import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BusinessImpactCard } from '../components/exception/BusinessImpactCard'
import { RecommendedAction } from '../components/exception/RecommendedAction'
import { ResolutionModal } from '../components/exception/ResolutionModal'
import { RootCausePanel } from '../components/exception/RootCausePanel'
import { StateDivergencePanel } from '../components/exception/StateDivergencePanel'
import { TransactionJourney } from '../components/exception/TransactionJourney'
import { VerifyPanel } from '../components/exception/VerifyPanel'
import { SeverityBadge, SoftBadge, StatusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAgent } from '../context/AgentContext'
import { useAppState } from '../context/AppStateContext'
import { HERO_EXCEPTION_ID } from '../data/constants'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePageAgentContext } from '../hooks/usePageAgentContext'
import { useResolution } from '../hooks/useResolution'
import { exceptionService } from '../services/exceptionService'

function relativeAge(iso: string) {
  const detected = new Date(iso).getTime()
  const now = new Date('2026-08-29T14:29:00').getTime()
  const mins = Math.max(1, Math.round((now - detected) / 60000))
  if (mins < 60) return `${mins} minutes ago`
  return `${Math.round(mins / 60)}h ago`
}

export function ExceptionDetail() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const { exceptions, resolutionOutcome } = useAppState()
  const { openWithPrompt } = useAgent()
  const pageContext = usePageAgentContext()
  const result = useAsyncData(() => exceptionService.get(id, exceptions), [id, exceptions])
  const memory = useAsyncData(
    () => exceptionService.matchResolutionMemory(result.data?.exceptionType ?? result.data?.rootCause ?? 'hss'),
    [result.data?.exceptionType, result.data?.rootCause],
  )
  const impact = useAsyncData(
    async () => (result.data ? exceptionService.businessImpact(result.data) : null),
    [result.data?.id],
  )
  const resolution = useResolution(id)
  const verified = resolutionOutcome[id] === 'verified' || result.data?.status === 'verified'
  const [showEvidence, setShowEvidence] = useState(false)
  const [testRan, setTestRan] = useState(false)

  useEffect(() => {
    if (params.get('focus') === 'evidence') setShowEvidence(true)
  }, [params])

  if (result.loading) return <PageSkeleton />
  if (!result.data) {
    return (
      <EmptyState
        title="Exception not found"
        description="This identifier is not part of the synthetic demo dataset."
      />
    )
  }

  const detail = result.data
  const journey = verified
    ? detail.journey.map((step) => ({
        ...step,
        status: 'completed' as const,
        detail: step.status === 'failed' || step.status === 'not_started' ? 'Recovered' : step.detail,
      }))
    : detail.journey

  const aiSummary =
    detail.id === HERO_EXCEPTION_ID
      ? 'Billing and SIM assignment completed successfully, but HSS subscriber creation failed. Network activation was therefore not completed.'
      : `AI reconstructed this ${detail.service} transaction. Likely cause: ${detail.rootCause}.`

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/exceptions"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-navy-500 hover:text-navy-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to exceptions
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy-900">{detail.title}</h1>
          <p className="mt-1 text-sm text-navy-500">{detail.id}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={detail.severity} />
            <SoftBadge tone="navy">{detail.region}</SoftBadge>
            <span className="text-sm text-navy-500">Detected {relativeAge(detail.detectedAt)}</span>
            <StatusBadge status={verified ? 'verified' : detail.status} />
          </div>
          <p className="mt-3 text-sm font-medium text-navy-800">
            {detail.customersImpacted} Customers Potentially Impacted
          </p>
        </div>
      </div>

      <Card className="border-indigo-100">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ai">What Happened</p>
        <h2 className="mt-2 text-sm font-semibold text-navy-900">AI Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-700">{aiSummary}</p>
        <p className="mt-3 text-sm text-navy-600">
          Confidence: <span className="font-semibold text-ai">{detail.diagnosis.confidence}%</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ai" onClick={() => openWithPrompt('What caused this?', pageContext)}>
            Ask TERA
          </Button>
          <Button variant="secondary" onClick={() => setShowEvidence((value) => !value)}>
            {showEvidence ? 'Hide Evidence' : 'Show Evidence'}
          </Button>
        </div>
        {showEvidence ? (
          <div className="mt-4 rounded-lg border border-navy-100 bg-navy-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Evidence</p>
            <ul className="mt-2 space-y-1.5 text-sm text-navy-700">
              {detail.diagnosis.evidence.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-success">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-navy-500 sm:grid-cols-4">
              <span>Logs</span>
              <span>API responses</span>
              <span>Database states</span>
              <span>Change records</span>
            </div>
          </div>
        ) : null}
      </Card>

      <TransactionJourney steps={journey} />

      {detail.stateComparison?.length ? (
        <StateDivergencePanel rows={detail.stateComparison} divergence={detail.stateDivergence} />
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RootCausePanel
          diagnosis={detail.diagnosis}
          compact
          onShowEvidence={() => setShowEvidence(true)}
          memoryHint={
            memory.data
              ? `Compared against ${memory.data.occurrences} previous resolutions · ${memory.data.successCount}/${memory.data.successAttempts} similar cases resolved`
              : undefined
          }
        />
        {impact.data ? <BusinessImpactCard impact={impact.data} compact /> : null}
      </div>

      <RecommendedAction
        actions={
          detail.id === HERO_EXCEPTION_ID
            ? [
                'Validate HSS endpoint configuration',
                'Run controlled retry against one subscriber',
                'Verify HSS subscriber',
                'Verify network activation',
                'Retry remaining eligible transactions',
              ]
            : detail.recommendedActions
        }
        risk={detail.risk}
        eligibility={
          detail.automationEligibility.includes('approval') || detail.automationEligibility.includes('APPROVAL')
            ? 'APPROVAL REQUIRED'
            : detail.automationEligibility
        }
        historicalSuccess={
          memory.data ? `${memory.data.successCount} / ${memory.data.successAttempts} similar cases` : undefined
        }
        disabled={verified}
        testRan={testRan}
        onTest={() => {
          setTestRan(true)
          resolution.notify('Controlled retry succeeded on test subscriber (demo).')
        }}
        onApprove={resolution.run}
      />

      {(verified || resolutionOutcome[id] === 'running') && (
        <VerifyPanel detail={detail} verified={verified} />
      )}

      {verified ? (
        <Card className="border-emerald-200 bg-success-soft/40">
          <CardTitle title="Resolution Verified" />
          <p className="text-sm text-navy-700">
            {detail.diagnosis.blastRadius} eligible transactions can now be retried.
          </p>
          <div className="mt-3">
            <Link to="/" className="text-sm font-medium text-accent hover:underline">
            Return to Command Center →
            </Link>
          </div>
        </Card>
      ) : null}

      <ResolutionModal
        open={resolution.open}
        steps={resolution.steps}
        stepIndex={resolution.stepIndex}
        complete={resolution.complete}
        onClose={resolution.close}
      />
      {resolution.toast ? (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-lg bg-navy-900 px-4 py-2 text-sm text-white shadow-lg">
          {resolution.toast}
        </div>
      ) : null}
    </div>
  )
}
