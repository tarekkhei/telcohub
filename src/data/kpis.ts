import type {
  CategoryCount,
  FunnelStage,
  KpiSnapshot,
  SeverityCount,
  TrendPoint,
} from '../types'
import type { ExceptionRecord } from '../types'

export const EXECUTIVE_KPI: KpiSnapshot = {
  exceptionsToday: 147,
  exceptionsChange: 12,
  aiDiagnosed: 121,
  aiDiagnosedRate: 82.3,
  autoResolved: 68,
  autoResolvedRate: 46.3,
  awaitingApproval: 18,
  engineeringEscalations: 8,
  escalationsChange: -34,
  mttdSeconds: 43,
  mttdBaselineMinutes: 37,
  hoursSaved: 62.4,
  customersImpacted: 284,
}

export const EXECUTIVE_FUNNEL: FunnelStage[] = [
  { label: 'Detected', count: 147 },
  { label: 'Investigated', count: 139 },
  { label: 'Diagnosed', count: 121 },
  { label: 'Resolution Recommended', count: 116 },
  { label: 'Resolved', count: 98 },
  { label: 'Verified', count: 94 },
]

export const EXECUTIVE_TREND: TrendPoint[] = [
  { date: 'Aug 23', total: 118, diagnosed: 71, resolved: 44 },
  { date: 'Aug 24', total: 126, diagnosed: 82, resolved: 53 },
  { date: 'Aug 25', total: 131, diagnosed: 91, resolved: 64 },
  { date: 'Aug 26', total: 124, diagnosed: 96, resolved: 71 },
  { date: 'Aug 27', total: 138, diagnosed: 108, resolved: 82 },
  { date: 'Aug 28', total: 141, diagnosed: 114, resolved: 89 },
  { date: 'Aug 29', total: 147, diagnosed: 121, resolved: 98 },
]

export const KPI_SPARKLINES = {
  exceptions: [118, 126, 131, 124, 138, 141, 147],
  diagnosed: [71, 82, 91, 96, 108, 114, 121],
  resolved: [44, 53, 64, 71, 82, 89, 98],
  hours: [28, 34, 39, 44, 51, 57, 62.4],
}

export function categoryCounts(records: ExceptionRecord[]): CategoryCount[] {
  const map = new Map<CategoryCount['name'], number>()
  for (const record of records) {
    map.set(record.category, (map.get(record.category) ?? 0) + 1)
  }
  return [
    { name: 'Provisioning Failure', value: map.get('Provisioning Failure') ?? 42 },
    { name: 'SIM/eSIM Failure', value: map.get('SIM/eSIM Failure') ?? 27 },
    { name: 'DID Routing', value: map.get('DID Routing') ?? 21 },
    { name: 'Number Portability', value: map.get('Number Portability') ?? 18 },
    { name: 'Billing State Mismatch', value: map.get('Billing State Mismatch') ?? 14 },
    { name: 'Network Subscriber Missing', value: map.get('Network Subscriber Missing') ?? 11 },
    { name: 'API / Integration Failure', value: map.get('API / Integration Failure') ?? 9 },
    { name: 'Other', value: map.get('Other') ?? 5 },
  ]
}

export const DEMO_CATEGORY_COUNTS: CategoryCount[] = [
  { name: 'Provisioning Failure', value: 42 },
  { name: 'SIM/eSIM Failure', value: 27 },
  { name: 'DID Routing', value: 21 },
  { name: 'Number Portability', value: 18 },
  { name: 'Billing State Mismatch', value: 14 },
  { name: 'Network Subscriber Missing', value: 11 },
  { name: 'API / Integration Failure', value: 9 },
  { name: 'Other', value: 5 },
]

export const DEMO_SEVERITY: SeverityCount[] = [
  { name: 'critical', value: 9 },
  { name: 'high', value: 31 },
  { name: 'medium', value: 71 },
  { name: 'low', value: 36 },
]

export const BUSINESS_IMPACT = {
  monthlyRevenue: 48750,
  customersBlocked: 73,
  partialProvisioned: 38,
}

export const BLAST_RADIUS_REGIONS = [
  { name: 'Ontario', value: 16 },
  { name: 'Quebec', value: 12 },
  { name: 'Alberta', value: 6 },
  { name: 'British Columbia', value: 4 },
]
