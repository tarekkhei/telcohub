import type { ChangeCorrelation } from '../types/ops'
import { HERO_EXCEPTION_ID } from './constants'

export const HERO_CHANGE_CORRELATION: ChangeCorrelation = {
  title: 'Potential Change-Related Root Cause',
  summary:
    'Provisioning service v2.8 was deployed 17 minutes before the first occurrence. 36 of 38 failed transactions used the changed HSS endpoint.',
  confidence: 96,
  supportingFacts: [
    'First activation failure occurred 17 minutes after deployment completed.',
    '36 of 38 failed transactions used /api/v1/hss/subscriber/create.',
    'Successful activations continue to use /api/v2/hss/subscribers.',
    'HSS endpoint configuration changed at 13:21.',
  ],
  changeEvents: [
    {
      id: 'chg-1',
      timestamp: '13:00',
      source: 'Jenkins',
      title: 'Deployment started — provisioning-service v2.8',
      kind: 'deployment',
      relatedSystem: 'Provisioning',
    },
    {
      id: 'chg-2',
      timestamp: '13:12',
      source: 'Kubernetes',
      title: 'Deployment completed — 3 pods rolled',
      kind: 'deployment',
      relatedSystem: 'Provisioning',
    },
    {
      id: 'chg-3',
      timestamp: '13:21',
      source: 'Azure DevOps',
      title: 'HSS endpoint config changed',
      kind: 'config',
      relatedSystem: 'Provisioning',
    },
    {
      id: 'chg-4',
      timestamp: '13:38',
      source: 'TERA',
      title: 'First wireless activation failure detected',
      kind: 'incident_signal',
      relatedSystem: 'Titan HSS',
    },
    {
      id: 'chg-5',
      timestamp: '13:41',
      source: 'TERA',
      title: 'Exception count rises across Ontario',
      kind: 'incident_signal',
      relatedSystem: 'Provisioning',
    },
    {
      id: 'chg-6',
      timestamp: '14:00',
      source: 'TERA',
      title: '38 customers affected',
      kind: 'incident_signal',
      relatedSystem: 'Wireless Activation',
    },
  ],
}

export function changeCorrelationFor(exceptionId: string): ChangeCorrelation | null {
  if (exceptionId === HERO_EXCEPTION_ID) return HERO_CHANGE_CORRELATION
  return {
    title: 'No strong change correlation',
    summary: 'No recent deployment or configuration change clearly precedes this exception cluster.',
    confidence: 41,
    supportingFacts: ['Checked GitHub, Jenkins, Kubernetes and ServiceNow Change for the prior 6 hours.'],
    changeEvents: [],
  }
}
