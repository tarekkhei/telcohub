import { changeCorrelationFor } from '../data/changeContext'
import type { ChangeCorrelation } from '../types/ops'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export const changeContextService = {
  async forException(exceptionId: string): Promise<ChangeCorrelation | null> {
    await delay()
    return changeCorrelationFor(exceptionId)
  },
}
