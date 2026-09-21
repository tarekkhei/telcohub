import { businessImpactFor } from '../data/businessImpact'
import type { ExceptionRecord } from '../types'
import type { BusinessImpact } from '../types/ops'

const delay = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms))

export const businessImpactService = {
  async forRecord(record: ExceptionRecord): Promise<BusinessImpact> {
    await delay()
    return businessImpactFor(record)
  },
}
