import type { ExceptionDetail, SimilarIncident } from '../types'

export const FEATURED_SIMILAR_INCIDENTS: SimilarIncident[] = [
  {
    id: 'INC-00981',
    date: 'Aug 19',
    cause: 'Deprecated provisioning endpoint',
    resolution: 'Endpoint configuration updated',
    confidence: 97,
  },
  {
    id: 'INC-00843',
    date: 'Jul 12',
    cause: 'HSS API route changed',
    resolution: 'API configuration corrected',
    confidence: 91,
  },
  {
    id: 'INC-00716',
    date: 'Jun 27',
    cause: 'Provisioning proxy misconfiguration',
    resolution: 'Proxy redeployed',
    confidence: 82,
  },
]

export const HERO_RESOLUTION_STEPS = [
  'Validating endpoint...',
  'Retrying provisioning...',
  'Creating HSS subscriber...',
  'Checking network state...',
  'Synchronizing service state...',
  'Verifying activation...',
]

export function getHeroDetailOverlay(): Pick<
  ExceptionDetail,
  | 'journey'
  | 'systems'
  | 'timeline'
  | 'diagnosis'
  | 'similarIncidents'
  | 'recommendedActions'
  | 'risk'
  | 'automationEligibility'
  | 'beforeState'
  | 'afterState'
  | 'investigationSeconds'
  | 'title'
  | 'msisdn'
  | 'sim'
  | 'orderId'
  | 'detectedAt'
  | 'stateComparison'
  | 'stateDivergence'
  | 'governedActions'
> {
  return {
    title: 'Wireless Activation Failed',
    msisdn: '+1 438-555-0187',
    sim: '8930230000008817461',
    orderId: 'ORD-20260829-14782',
    detectedAt: '2026-08-29T14:21:08',
    investigationSeconds: 35,
    journey: [
      { name: 'Order', status: 'completed', timestamp: '14:20:51', detail: 'Completed' },
      { name: 'Payment', status: 'completed', timestamp: '14:20:54', detail: 'Approved' },
      { name: 'Billing', status: 'completed', timestamp: '14:20:57', detail: 'Active' },
      { name: 'SIM', status: 'completed', timestamp: '14:20:59', detail: 'Assigned' },
      { name: 'Provisioning', status: 'failed', timestamp: '14:21:03', detail: 'Failed' },
      { name: 'HSS', status: 'failed', detail: 'Not Found' },
      { name: 'Network', status: 'not_started', detail: 'Not reached' },
    ],
    systems: [
      { name: 'Ordering API', status: 'ok', finding: 'Data retrieved' },
      { name: 'Billing / BSS', status: 'ok', finding: 'Account active' },
      { name: 'SIM Inventory', status: 'ok', finding: 'SIM assigned' },
      { name: 'Provisioning API', status: 'failed', finding: 'HTTP 404' },
      { name: 'Titan HSS', status: 'failed', finding: 'Subscriber not found' },
      { name: 'Application Logs', status: 'ok', finding: '18 correlated entries' },
      { name: 'Ticketing', status: 'ok', finding: '4 similar historical incidents' },
      { name: 'Knowledge Base', status: 'ok', finding: 'Matching resolution found' },
    ],
    timeline: [
      { timestamp: '14:21:08', description: 'Exception detected.' },
      { timestamp: '14:21:09', description: 'Customer, order and service identifiers correlated.' },
      { timestamp: '14:21:12', description: 'Billing account confirmed active.' },
      { timestamp: '14:21:16', description: 'SIM assignment confirmed.' },
      { timestamp: '14:21:20', description: 'Provisioning transaction located.' },
      { timestamp: '14:21:23', description: 'HTTP 404 identified during CREATE_SUBSCRIBER operation.' },
      { timestamp: '14:21:27', description: 'Titan HSS queried — subscriber absent.' },
      { timestamp: '14:21:31', description: 'Compared against last 500 successful activations.' },
      { timestamp: '14:21:36', description: 'Found 37 similar failures within 6 hours.' },
      { timestamp: '14:21:39', description: 'Common dependency identified.' },
      { timestamp: '14:21:43', description: 'Root cause hypothesis generated.' },
    ],
    diagnosis: {
      rootCause: 'HSS endpoint configuration issue',
      confidence: 96,
      evidence: [
        'HSS API returned HTTP 404',
        'HSS service itself is reachable',
        '38 transactions show the same pattern',
        'Failures started after a provisioning change',
        'Previous successful activations used another endpoint',
      ],
      blastRadius: 38,
      revenueBlocked: 18450,
    },
    similarIncidents: FEATURED_SIMILAR_INCIDENTS,
    recommendedActions: [
      'Validate HSS endpoint configuration',
      'Run controlled retry against one subscriber',
      'Verify HSS subscriber',
      'Verify network activation',
      'Retry remaining eligible transactions',
    ],
    risk: 'low',
    automationEligibility: 'APPROVAL REQUIRED',
    beforeState: {
      Billing: 'Active',
      SIM: 'Assigned',
      HSS: 'Missing',
      Network: 'Inactive',
    },
    afterState: {
      Billing: 'Active',
      SIM: 'Assigned',
      HSS: 'Active',
      Network: 'Active',
    },
    stateComparison: [
      { label: 'Billing', expected: 'ACTIVE', observed: 'ACTIVE', aligned: true },
      { label: 'SIM', expected: 'ASSIGNED', observed: 'ASSIGNED', aligned: true },
      { label: 'HSS', expected: 'PROVISIONED', observed: 'NOT FOUND', aligned: false },
      { label: 'Network', expected: 'ACTIVE', observed: 'NOT ACTIVE', aligned: false },
    ],
    stateDivergence:
      'HSS subscriber is missing after all required upstream activation steps completed.',
    governedActions: [
      { name: 'GET subscriber', governance: 'READ ONLY', riskLevel: 'low', requiresApproval: false },
      { name: 'Retry provisioning', governance: 'APPROVAL REQUIRED', riskLevel: 'medium', requiresApproval: true },
      { name: 'Bulk retry', governance: 'APPROVAL REQUIRED', riskLevel: 'high', requiresApproval: true },
      { name: 'Delete subscriber', governance: 'RESTRICTED', riskLevel: 'high', requiresApproval: true },
    ],
  }
}
