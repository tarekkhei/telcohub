import type { ExceptionDetail, ExceptionRecord, JourneyStep, SystemInvestigation } from '../types'
import { HERO_EXCEPTION_ID } from './constants'
import { getHeroDetailOverlay } from './featuredDetails'

function timeParts(iso: string) {
  const date = new Date(iso)
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return { hh, mm, ss, base: `${hh}:${mm}` }
}

function addSeconds(iso: string, seconds: number) {
  return new Date(new Date(iso).getTime() + seconds * 1000)
}

function clock(iso: string, seconds: number) {
  const d = addSeconds(iso, seconds)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

function journeyFor(record: ExceptionRecord): JourneyStep[] {
  const t = timeParts(record.detectedAt)
  if (record.category === 'Number Portability') {
    return [
      { name: 'Port Request', status: 'completed', timestamp: `${t.base}:01`, detail: 'Submitted' },
      { name: 'Validation', status: 'completed', timestamp: `${t.base}:08`, detail: 'Accepted' },
      { name: 'Losing Carrier', status: 'failed', timestamp: `${t.base}:21`, detail: 'No response' },
      { name: 'Cutover', status: 'not_started', detail: 'Not Started' },
    ]
  }
  if (record.category === 'DID Routing' || record.service === 'voip') {
    return [
      { name: 'Order', status: 'completed', timestamp: `${t.base}:04`, detail: 'Completed' },
      { name: 'Inventory Assign', status: 'completed', timestamp: `${t.base}:11`, detail: 'Assigned' },
      { name: 'Routing Publish', status: 'failed', timestamp: `${t.base}:18`, detail: 'Missing route' },
      { name: 'Inbound Test', status: 'not_started', detail: 'Not Started' },
    ]
  }
  if (record.category === 'Billing State Mismatch') {
    return [
      { name: 'Order', status: 'completed', timestamp: `${t.base}:03`, detail: 'Completed' },
      { name: 'Billing', status: record.exceptionType.includes('Billing Inactive') ? 'failed' : 'completed', timestamp: `${t.base}:09`, detail: 'Diverged' },
      { name: 'Network', status: record.exceptionType.includes('Network Inactive') ? 'failed' : 'completed', timestamp: `${t.base}:14`, detail: 'Diverged' },
    ]
  }
  return [
    { name: 'Order', status: 'completed', timestamp: `${t.base}:02`, detail: 'Completed' },
    { name: 'Payment', status: 'completed', timestamp: `${t.base}:05`, detail: 'Approved' },
    { name: 'Billing Account', status: 'completed', timestamp: `${t.base}:08`, detail: 'Created' },
    { name: 'Inventory', status: 'completed', timestamp: `${t.base}:11`, detail: 'Assigned' },
    { name: record.system, status: 'failed', timestamp: `${t.hh}:${t.mm}:${t.ss}`, detail: 'Failed' },
    { name: 'Expected Outcome', status: 'not_started', detail: 'Not Started' },
  ]
}

function systemsFor(record: ExceptionRecord): SystemInvestigation[] {
  return [
    { name: 'Ordering API', status: 'ok', finding: 'Order retrieved' },
    { name: 'Billing / BSS', status: record.category === 'Billing State Mismatch' ? 'failed' : 'ok', finding: record.category === 'Billing State Mismatch' ? 'State mismatch' : 'Account active' },
    { name: record.system, status: 'failed', finding: record.exceptionType },
    { name: 'Application Logs', status: 'ok', finding: `${8 + (record.id.charCodeAt(10) % 20)} correlated entries` },
    { name: 'Ticketing', status: 'ok', finding: 'Historical matches available' },
    { name: 'Knowledge Base', status: 'ok', finding: 'Matching resolution pattern found' },
  ]
}

export function buildExceptionDetail(record: ExceptionRecord): ExceptionDetail {
  if (record.id === HERO_EXCEPTION_ID) {
    return { ...record, ...getHeroDetailOverlay() }
  }

  return {
    ...record,
    journey: journeyFor(record),
    systems: systemsFor(record),
    timeline: [
      { timestamp: clock(record.detectedAt, 0), description: 'Exception detected.' },
      { timestamp: clock(record.detectedAt, 2), description: 'Customer, order and service identifiers correlated.' },
      { timestamp: clock(record.detectedAt, 8), description: `${record.system} evidence collected.` },
      { timestamp: clock(record.detectedAt, 14), description: `Compared against recent successful ${record.service} transactions.` },
      { timestamp: clock(record.detectedAt, 21), description: 'Similar historical incidents retrieved.' },
      { timestamp: clock(record.detectedAt, 28), description: 'Root cause hypothesis generated.' },
    ],
    diagnosis: {
      rootCause: record.rootCause,
      confidence: record.aiConfidence,
      evidence: [
        `${record.system} reported: ${record.exceptionType}.`,
        'Adjacent OSS/BSS states were compared for divergence.',
        `${record.customersImpacted} customer transaction(s) share this failure signature.`,
        'A matching operational knowledge pattern was located.',
      ],
      blastRadius: record.customersImpacted,
      revenueBlocked: record.revenueImpact,
    },
    similarIncidents: [
      {
        id: `INC-0${2000 + Number(record.id.slice(-3))}`,
        date: 'Aug 11',
        cause: record.rootCause,
        resolution: 'Known corrective playbook applied',
        confidence: Math.min(98, record.aiConfidence + 2),
      },
      {
        id: `INC-0${1800 + Number(record.id.slice(-3))}`,
        date: 'Jul 03',
        cause: 'Related integration defect',
        resolution: 'Configuration corrected',
        confidence: Math.max(70, record.aiConfidence - 8),
      },
    ],
    recommendedActions: [
      `Inspect the failing ${record.system} transaction.`,
      'Compare expected vs actual business state.',
      'Apply the matching knowledge-base correction.',
      'Retry the failed business transaction.',
      'Verify the customer service reaches the expected state.',
    ],
    risk: record.severity === 'critical' ? 'high' : record.severity === 'high' ? 'medium' : 'low',
    automationEligibility:
      record.severity === 'critical' ? 'Human approval required' : 'Supervised automation eligible',
    beforeState: {
      Billing: record.category === 'Billing State Mismatch' ? 'Diverged' : 'Active',
      Inventory: 'Assigned',
      [record.system]: 'Failed',
      Expected: 'Incomplete',
    },
    afterState: {
      Billing: 'Active',
      Inventory: 'Assigned',
      [record.system]: 'Healthy',
      Expected: 'Complete',
    },
    investigationSeconds: 22 + (Number(record.id.slice(-2)) % 20),
  }
}
