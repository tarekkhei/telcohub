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
> {
  return {
    title: 'Mobile Activation Failed',
    msisdn: '+1 438-555-0187',
    sim: '8930230000008817461',
    orderId: 'ORD-20260829-14782',
    detectedAt: '2026-08-29T14:21:08',
    investigationSeconds: 35,
    journey: [
      { name: 'Order', status: 'completed', timestamp: '14:20:51', detail: 'Completed' },
      { name: 'Payment', status: 'completed', timestamp: '14:20:54', detail: 'Approved' },
      { name: 'Billing Account', status: 'completed', timestamp: '14:20:57', detail: 'Created' },
      { name: 'SIM Assignment', status: 'completed', timestamp: '14:20:59', detail: 'Assigned' },
      { name: 'Provisioning API', status: 'failed', timestamp: '14:21:03', detail: 'Failed' },
      { name: 'HSS Subscriber', status: 'failed', detail: 'Not Created' },
      { name: 'Network Activation', status: 'not_started', detail: 'Not Started' },
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
      rootCause:
        'Incorrect or unavailable provisioning endpoint during HSS subscriber creation',
      confidence: 94,
      evidence: [
        'Provisioning API returned HTTP 404.',
        'Billing and SIM states are valid.',
        'HSS subscriber does not exist.',
        '37 similar failures occurred in the previous 6 hours.',
        '94% of affected transactions used provisioning endpoint: /api/v1/hss/subscriber/create',
        'Successful transactions used: /api/v2/hss/subscribers',
      ],
      blastRadius: 38,
      revenueBlocked: 2660,
    },
    similarIncidents: FEATURED_SIMILAR_INCIDENTS,
    recommendedActions: [
      'Validate current HSS provisioning endpoint configuration.',
      'Switch traffic to the known valid endpoint.',
      'Retry failed CREATE_SUBSCRIBER operation.',
      'Verify HSS subscriber exists.',
      'Confirm network activation.',
      'Verify billing/network states are aligned.',
      'Retry remaining affected transactions.',
    ],
    risk: 'low',
    automationEligibility: 'Human approval required',
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
  }
}
