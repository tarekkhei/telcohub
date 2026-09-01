import type {
  ExceptionRecord,
  ExceptionStatus,
  Provider,
  Region,
  Severity,
} from '../types'
import { HERO_EXCEPTION_ID, PROVIDERS, REGIONS } from './constants'
import { SCENARIOS } from './scenarios'

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)] as T
}

function pad(n: number, width = 4) {
  return String(n).padStart(width, '0')
}

function formatImpact(scenarioImpact: string, customers: number, revenue: number): string {
  if (revenue >= 80 && scenarioImpact.includes('MRR')) return `$${revenue} MRR`
  if (customers > 1) return `${customers} related`
  return scenarioImpact
}

const FEATURED_ROWS: Array<Partial<ExceptionRecord> & { id: string; scenarioIndex: number }> = [
  {
    id: 'EXC-2026-0147',
    scenarioIndex: 0,
    customerId: 'CUST-88231',
    service: 'esim',
    exceptionType: 'HSS Subscriber Missing',
    system: 'Titan HSS',
    severity: 'critical',
    aiConfidence: 96,
    status: 'awaiting_approval',
    potentialImpact: '1 customer',
    provider: 'Ice Wireless',
    region: 'Quebec',
    customersImpacted: 1,
    revenueImpact: 70,
    detectedAt: '2026-08-29T14:26:11',
    title: 'HSS Subscriber Missing',
  },
  {
    id: HERO_EXCEPTION_ID,
    scenarioIndex: 4,
    customerId: 'CUST-88174',
    service: 'mobile',
    exceptionType: 'Provisioning API HTTP 404',
    system: 'Provisioning API',
    severity: 'high',
    aiConfidence: 94,
    status: 'awaiting_approval',
    potentialImpact: '38 related',
    provider: 'Ice Wireless',
    region: 'Quebec',
    customersImpacted: 38,
    revenueImpact: 2660,
    detectedAt: '2026-08-29T14:21:08',
    title: 'Mobile Activation Failed',
    rootCause: 'Provisioning configuration',
  },
  {
    id: 'EXC-2026-0145',
    scenarioIndex: 7,
    customerId: 'CUST-88151',
    service: 'did',
    exceptionType: 'Number Not Routed',
    system: 'Routing Platform',
    severity: 'high',
    aiConfidence: 91,
    status: 'investigating',
    potentialImpact: '143 numbers',
    provider: 'Telehop',
    region: 'Ontario',
    customersImpacted: 143,
    revenueImpact: 4290,
    detectedAt: '2026-08-29T13:58:44',
    title: 'DID Inbound Route Missing',
  },
  {
    id: 'EXC-2026-0144',
    scenarioIndex: 17,
    customerId: 'CUST-88098',
    service: 'wireless',
    exceptionType: 'Billing / Network State Mismatch',
    system: 'Billing',
    severity: 'medium',
    aiConfidence: 89,
    status: 'resolved',
    potentialImpact: '$120 MRR',
    provider: 'Iristel',
    region: 'Ontario',
    customersImpacted: 1,
    revenueImpact: 120,
    detectedAt: '2026-08-29T12:41:19',
    title: 'Billing / Network State Mismatch',
    autoResolved: true,
  },
  {
    id: 'EXC-2026-0143',
    scenarioIndex: 12,
    customerId: 'CUST-88043',
    service: 'portability',
    exceptionType: 'Port Request Stuck',
    system: 'LNP Gateway',
    severity: 'medium',
    aiConfidence: 86,
    status: 'escalated',
    potentialImpact: '1 customer',
    provider: 'MVNO Alpha',
    region: 'Alberta',
    customersImpacted: 1,
    revenueImpact: 55,
    detectedAt: '2026-08-29T11:17:02',
    title: 'Port Request Stuck',
  },
  {
    id: 'EXC-2026-0142',
    scenarioIndex: 29,
    customerId: 'CUST-87991',
    service: 'esim',
    exceptionType: 'QR Assigned / Not Activated',
    system: 'Ordering',
    severity: 'high',
    aiConfidence: 93,
    status: 'verified',
    potentialImpact: '1 customer',
    provider: 'Ice Wireless',
    region: 'British Columbia',
    customersImpacted: 1,
    revenueImpact: 70,
    detectedAt: '2026-08-29T10:04:33',
    title: 'eSIM QR Issued Without Activation',
    autoResolved: true,
  },
]

const TODAY_STATUS_PLAN: ExceptionStatus[] = [
  ...Array<ExceptionStatus>(8).fill('new'),
  ...Array<ExceptionStatus>(18).fill('investigating'),
  ...Array<ExceptionStatus>(5).fill('diagnosed'),
  ...Array<ExceptionStatus>(18).fill('awaiting_approval'),
  ...Array<ExceptionStatus>(4).fill('resolved'),
  ...Array<ExceptionStatus>(86).fill('verified'),
  ...Array<ExceptionStatus>(8).fill('escalated'),
]

function severityFor(rand: () => number, categoryWeight: number): Severity {
  const roll = rand() + categoryWeight
  if (roll > 1.55) return 'critical'
  if (roll > 1.15) return 'high'
  if (roll > 0.55) return 'medium'
  return 'low'
}

export function generateExceptions(): ExceptionRecord[] {
  const rand = mulberry32(20260829)
  const featuredIds = new Set(FEATURED_ROWS.map((row) => row.id))
  const records: ExceptionRecord[] = []

  for (const featured of FEATURED_ROWS) {
    const scenario = SCENARIOS[featured.scenarioIndex]
    records.push({
      id: featured.id,
      title: featured.title ?? scenario.title,
      detectedAt: featured.detectedAt ?? '2026-08-29T14:00:00',
      customerId: featured.customerId ?? 'CUST-88000',
      msisdn: `+1 438-555-${pad(Number(featured.id.slice(-4)), 4)}`,
      sim: `893023000000${featured.id.slice(-7)}`,
      orderId: `ORD-20260829-${featured.id.slice(-5)}`,
      service: featured.service ?? scenario.service,
      exceptionType: featured.exceptionType ?? scenario.exceptionType,
      category: scenario.category,
      system: featured.system ?? scenario.system,
      severity: featured.severity ?? 'high',
      aiConfidence: featured.aiConfidence ?? 90,
      status: featured.status ?? 'diagnosed',
      potentialImpact: featured.potentialImpact ?? scenario.defaultImpact,
      provider: featured.provider ?? 'Ice Wireless',
      region: featured.region ?? 'Ontario',
      rootCause: featured.rootCause ?? scenario.rootCause,
      revenueImpact: featured.revenueImpact ?? 70,
      customersImpacted: featured.customersImpacted ?? 1,
      autoResolved: featured.autoResolved ?? false,
      aiDiagnosed: featured.status !== 'new' && featured.status !== 'investigating',
    })
  }

  let statusCursor = 0
  for (let i = 141; i >= 1; i--) {
    const id = `EXC-2026-${pad(i)}`
    if (featuredIds.has(id)) continue
    const scenario = pick(rand, SCENARIOS)
    const provider = pick(rand, PROVIDERS) as Provider
    const region = pick(rand, REGIONS) as Region
    const hour = 8 + Math.floor(rand() * 8)
    const minute = Math.floor(rand() * 60)
    const second = Math.floor(rand() * 60)
    const status = TODAY_STATUS_PLAN[statusCursor] ?? 'verified'
    statusCursor += 1
    const criticalBias = scenario.category === 'Provisioning Failure' ? 0.25 : 0
    const severity = severityFor(rand, criticalBias)
    const customersImpacted =
      scenario.defaultImpact.includes('related') || scenario.defaultImpact.includes('numbers')
        ? 2 + Math.floor(rand() * 40)
        : 1
    const revenueImpact =
      scenario.category === 'Billing State Mismatch'
        ? 45 + Math.floor(rand() * 220)
        : customersImpacted * (55 + Math.floor(rand() * 30))
    const aiDiagnosed = !['new', 'investigating'].includes(status)
    const autoResolved = status === 'verified' && rand() > 0.28

    records.push({
      id,
      title: scenario.title,
      detectedAt: `2026-08-29T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}`,
      customerId: `CUST-${87000 + i}`,
      msisdn: `+1 ${pick(rand, ['416', '437', '438', '514', '587', '604'])}-555-${pad(1000 + i)}`,
      sim: `893023000000${pad(8800000 + i, 7)}`,
      orderId: `ORD-20260829-${pad(10000 + i, 5)}`,
      service: scenario.service,
      exceptionType: scenario.exceptionType,
      category: scenario.category,
      system: scenario.system,
      severity,
      aiConfidence: aiDiagnosed ? 72 + Math.floor(rand() * 27) : 40 + Math.floor(rand() * 30),
      status,
      potentialImpact: formatImpact(scenario.defaultImpact, customersImpacted, revenueImpact),
      provider,
      region,
      rootCause: scenario.rootCause,
      revenueImpact,
      customersImpacted,
      autoResolved,
      aiDiagnosed,
    })
  }

  return records.sort((a, b) => (a.detectedAt < b.detectedAt ? 1 : -1))
}

export const ALL_EXCEPTIONS = generateExceptions()
