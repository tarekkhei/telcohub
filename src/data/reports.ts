import type { ComparisonMetric, ReportMetrics } from '../types'

export const REPORT_METRICS: ReportMetrics = {
  totalExceptions: 147,
  aiDiagnosisRate: 82.3,
  resolutionRate: 66.7,
  autoResolutionRate: 46.3,
  escalationRate: 5.4,
  mttdSeconds: 43,
  mttrMinutes: 18,
  customersAffected: 284,
  customersRecovered: 211,
  revenueProtected: 48750,
  hoursSaved: 62.4,
  engineeringCostAvoided: 9360,
}

export const COMPARISON_BEFORE_AFTER: ComparisonMetric[] = [
  { label: 'Average investigation', before: '37 min', after: '43 sec' },
  { label: 'Average resolution', before: '2h 18m', after: '18 min' },
  { label: 'Engineering escalation', before: '31%', after: '8%' },
  { label: 'Manual touchpoints', before: '7.4', after: '1.8' },
]

export const MONTHLY_HOURS_SAVED = 412

export const REPORT_TRENDS = {
  mttr: [
    { date: 'Aug 23', minutes: 41 },
    { date: 'Aug 24', minutes: 36 },
    { date: 'Aug 25', minutes: 31 },
    { date: 'Aug 26', minutes: 27 },
    { date: 'Aug 27', minutes: 23 },
    { date: 'Aug 28', minutes: 20 },
    { date: 'Aug 29', minutes: 18 },
  ],
  diagnosisRate: [
    { date: 'Aug 23', rate: 60 },
    { date: 'Aug 24', rate: 65 },
    { date: 'Aug 25', rate: 69 },
    { date: 'Aug 26', rate: 73 },
    { date: 'Aug 27', rate: 78 },
    { date: 'Aug 28', rate: 81 },
    { date: 'Aug 29', rate: 82.3 },
  ],
  autoResolution: [
    { date: 'Aug 23', rate: 31 },
    { date: 'Aug 24', rate: 34 },
    { date: 'Aug 25', rate: 37 },
    { date: 'Aug 26', rate: 40 },
    { date: 'Aug 27', rate: 43 },
    { date: 'Aug 28', rate: 45 },
    { date: 'Aug 29', rate: 46.3 },
  ],
  escalations: [
    { date: 'Aug 23', count: 18 },
    { date: 'Aug 24', count: 16 },
    { date: 'Aug 25', count: 14 },
    { date: 'Aug 26', count: 12 },
    { date: 'Aug 27', count: 11 },
    { date: 'Aug 28', count: 9 },
    { date: 'Aug 29', count: 8 },
  ],
}
