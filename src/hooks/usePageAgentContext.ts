import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CONNECTED_SYSTEM_COUNT, HERO_EXCEPTION_ID, SERVICE_LABELS, STATUS_LABELS } from '../data/constants'
import { useAppState } from '../context/AppStateContext'
import type { AgentPage, PageAgentContext } from '../types'

function pageFromPath(pathname: string): AgentPage {
  if (pathname === '/') return 'command-center'
  if (pathname.startsWith('/exceptions/')) return 'exception-detail'
  if (pathname.startsWith('/exceptions')) return 'exceptions'
  if (pathname.startsWith('/investigate') || pathname.startsWith('/investigations')) return 'investigations'
  if (pathname.startsWith('/resolve')) return 'resolve'
  if (
    pathname.startsWith('/connected-systems/') ||
    pathname.startsWith('/integrations/') ||
    pathname.startsWith('/marketplace/')
  ) {
    return 'connector-detail'
  }
  if (
    pathname.startsWith('/connected-systems') ||
    pathname.startsWith('/integrations') ||
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/data-sources')
  ) {
    return 'integrations'
  }
  if (pathname.startsWith('/insights') || pathname.startsWith('/reports')) return 'reports'
  if (pathname.startsWith('/ai-insights')) return 'insights'
  if (pathname.startsWith('/services')) return 'services'
  if (pathname.startsWith('/operational-blueprint')) return 'operational-blueprint'
  if (pathname.startsWith('/exception-packs')) return 'exception-packs'
  if (pathname.startsWith('/resolution-memory')) return 'resolution-memory'
  if (pathname.startsWith('/root-causes')) return 'root-causes'
  if (pathname.startsWith('/knowledge')) return 'knowledge'
  if (pathname.startsWith('/settings')) return 'settings'
  return 'command-center'
}

export function usePageAgentContext(): PageAgentContext {
  const location = useLocation()
  const params = useParams()
  const { exceptions } = useAppState()

  return useMemo(() => {
    const page = pageFromPath(location.pathname)
    const exceptionId = params.id
    const record = exceptionId ? exceptions.find((item) => item.id === exceptionId) : undefined
    const hero = exceptions.find((item) => item.id === HERO_EXCEPTION_ID)

    if (page === 'exception-detail' && record) {
      const diagnosis =
        record.id === HERO_EXCEPTION_ID ? 'HSS endpoint configuration.' : record.rootCause
      return {
        page,
        exceptionId: record.id,
        customerId: record.customerId,
        serviceLabel: SERVICE_LABELS[record.service],
        problem: record.exceptionType,
        status: STATUS_LABELS[record.status],
        diagnosis,
        confidence: record.aiConfidence,
        relatedCount: record.id === HERO_EXCEPTION_ID ? 37 : record.customersImpacted,
        chips: [
          record.id,
          `Customer ${record.customerId}`,
          record.title,
          `${CONNECTED_SYSTEM_COUNT} Connected Systems`,
        ],
      }
    }

    return {
      page,
      exceptionId: hero?.id,
      customerId: hero?.customerId,
      serviceLabel: 'Mobile',
      problem: 'Wireless Activation Failure',
      status: 'Awaiting Approval',
      diagnosis: 'HSS endpoint configuration.',
      confidence: 96,
      relatedCount: 37,
      chips: [
        page === 'command-center' ? 'Command Center' : page.replace(/-/g, ' '),
        'Ontario CRITICAL',
        'EXC-2026-0146',
        `${CONNECTED_SYSTEM_COUNT} Connected Systems`,
      ],
    }
  }, [exceptions, location.pathname, params.id])
}
