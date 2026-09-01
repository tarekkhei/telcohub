import { useParams } from 'react-router-dom'
import { BlastRadius } from '../components/exception/BlastRadius'
import { ExceptionHeader } from '../components/exception/ExceptionHeader'
import { InvestigationTimeline } from '../components/exception/InvestigationTimeline'
import { RecommendedAction } from '../components/exception/RecommendedAction'
import { ResolutionModal } from '../components/exception/ResolutionModal'
import { RootCausePanel } from '../components/exception/RootCausePanel'
import { SimilarIncidents } from '../components/exception/SimilarIncidents'
import { SystemCorrelation } from '../components/exception/SystemCorrelation'
import { TransactionJourney } from '../components/exception/TransactionJourney'
import { VerifyPanel } from '../components/exception/VerifyPanel'
import { EmptyState } from '../components/ui/EmptyState'
import { LifecycleStrip } from '../components/ui/LifecycleStrip'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useAppState } from '../context/AppStateContext'
import { HERO_EXCEPTION_ID } from '../data/constants'
import { useAsyncData } from '../hooks/useAsyncData'
import { useResolution } from '../hooks/useResolution'
import { mockApi } from '../services/mockApi'

export function ExceptionDetail() {
  const { id = '' } = useParams()
  const { exceptions, resolutionOutcome } = useAppState()
  const result = useAsyncData(() => mockApi.getException(id, exceptions), [id])
  const resolution = useResolution(id)
  const verified = resolutionOutcome[id] === 'verified' || result.data?.status === 'verified'

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
  const lifecycle =
    verified ? 'verification' : detail.status === 'awaiting_approval' || detail.status === 'resolving' ? 'resolution' : 'diagnosis'
  const journey = verified
    ? detail.journey.map((step) => ({
        ...step,
        status: 'completed' as const,
        detail: step.status === 'failed' || step.status === 'not_started' ? 'Recovered' : step.detail,
      }))
    : detail.journey

  return (
    <div className="space-y-5">
      <ExceptionHeader detail={{ ...detail, status: verified ? 'verified' : detail.status }} />
      <LifecycleStrip active={lifecycle} />
      <TransactionJourney steps={journey} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SystemCorrelation systems={detail.systems} />
        <InvestigationTimeline events={detail.timeline} durationSeconds={detail.investigationSeconds} />
      </div>
      <RootCausePanel diagnosis={detail.diagnosis} />
      <SimilarIncidents incidents={detail.similarIncidents} />
      <RecommendedAction
        actions={detail.recommendedActions}
        risk={detail.risk}
        eligibility={detail.automationEligibility}
        disabled={verified}
        onApprove={resolution.run}
        onAssign={() => resolution.notify('Assigned to on-call engineer (demo).')}
        onIncident={() => resolution.notify('Incident created in ServiceNow (demo).')}
        onDismiss={() => resolution.notify('Recommendation dismissed for this session (demo).')}
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <VerifyPanel detail={detail} verified={verified} />
        {id === HERO_EXCEPTION_ID || detail.customersImpacted > 1 ? (
          <BlastRadius relatedCount={detail.diagnosis.blastRadius} />
        ) : (
          <BlastRadius relatedCount={detail.customersImpacted} />
        )}
      </div>
      <ResolutionModal
        open={resolution.open}
        steps={resolution.steps}
        currentIndex={resolution.stepIndex}
        complete={resolution.complete && resolution.open}
        onClose={resolution.complete ? resolution.close : undefined}
      />
      {resolution.toast ? (
        <div className="fixed bottom-6 right-6 rounded-lg bg-navy-900 px-4 py-3 text-sm text-white shadow-xl">
          {resolution.toast}
        </div>
      ) : null}
    </div>
  )
}
