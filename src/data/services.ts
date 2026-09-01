import type { ServiceRecord } from '../types'
import { ALL_EXCEPTIONS } from './generateExceptions'

const PLANS = [
  'Mobile Unlimited 20GB',
  'eSIM Travel 5GB',
  'DID Local 10-pack',
  'VoIP Seat Standard',
  'Wireless Prepaid',
  'Business Voice Bundle',
]

function stateFromException(active: number, mismatch: boolean): Pick<
  ServiceRecord,
  'billingState' | 'provisioningState' | 'networkState'
> {
  if (!mismatch) {
    return { billingState: 'Active', provisioningState: 'Completed', networkState: 'Active' }
  }
  if (active > 0) {
    return { billingState: 'Active', provisioningState: 'Failed', networkState: 'Missing' }
  }
  return { billingState: 'Active', provisioningState: 'Partial', networkState: 'Inactive' }
}

export function generateServices(): ServiceRecord[] {
  const byCustomer = new Map<string, number>()
  for (const rec of ALL_EXCEPTIONS) {
    if (['verified', 'resolved'].includes(rec.status)) continue
    byCustomer.set(rec.customerId, (byCustomer.get(rec.customerId) ?? 0) + 1)
  }

  const rows: ServiceRecord[] = ALL_EXCEPTIONS.slice(0, 64).map((exc, index) => {
    const active = byCustomer.get(exc.customerId) ?? 0
    const mismatch = active > 0 || index % 5 === 0
    const states = stateFromException(active, mismatch)
    return {
      id: `SVC-${exc.customerId}`,
      customerId: exc.customerId,
      msisdn: exc.msisdn,
      sim: exc.sim,
      account: `ACC-${exc.customerId.slice(5)}`,
      servicePlan: PLANS[index % PLANS.length],
      ...states,
      activeExceptions: active,
      provider: exc.provider,
      region: exc.region,
      service: exc.service,
    }
  })

  const unique = new Map<string, ServiceRecord>()
  for (const row of rows) unique.set(row.customerId, row)
  return [...unique.values()]
}

export const ALL_SERVICES = generateServices()
