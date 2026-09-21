import type { BusinessImpact } from '../types/ops'
import type { ExceptionRecord } from '../types'
import { HERO_EXCEPTION_ID } from './constants'

export const HERO_BUSINESS_IMPACT: BusinessImpact = {
  activationsBlocked: 38,
  customersImpacted: 73,
  enterpriseCustomers: 3,
  mrrAtRisk: 18450,
  slaBreaches: 7,
  regions: 1,
  oldestFailure: '3h 12m',
  servicesImpacted: ['Wireless Activation', 'Mobile'],
  transactionsBlocked: 38,
}

export function businessImpactFor(record: ExceptionRecord): BusinessImpact {
  if (record.id === HERO_EXCEPTION_ID) return HERO_BUSINESS_IMPACT
  return {
    activationsBlocked: record.customersImpacted,
    customersImpacted: record.customersImpacted,
    enterpriseCustomers: record.severity === 'critical' ? 1 : 0,
    mrrAtRisk: record.revenueImpact,
    slaBreaches: record.severity === 'critical' ? 2 : record.severity === 'high' ? 1 : 0,
    regions: 1,
    oldestFailure: '1h 05m',
    servicesImpacted: [record.service],
    transactionsBlocked: Math.max(1, record.customersImpacted),
  }
}
