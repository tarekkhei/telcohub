import type { ExceptionRecord, Filters } from '../types'
import { mockApi } from './mockApi'

export const exceptionService = {
  list(filters: Filters, records: ExceptionRecord[]) {
    return mockApi.listExceptions(filters, records)
  },
  get(id: string, records: ExceptionRecord[]) {
    return mockApi.getException(id, records)
  },
  businessImpact(record: ExceptionRecord) {
    return mockApi.businessImpact(record)
  },
  changeContext(id: string) {
    return mockApi.changeContext(id)
  },
  matchResolutionMemory(pattern: string) {
    return mockApi.matchResolutionMemory(pattern)
  },
}
