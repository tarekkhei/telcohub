import { ALL_EXCEPTIONS } from '../data/generateExceptions'
import { BLAST_RADIUS_REGIONS, BUSINESS_IMPACT, DEMO_CATEGORY_COUNTS, DEMO_SEVERITY, EXECUTIVE_FUNNEL, EXECUTIVE_KPI, EXECUTIVE_TREND, KPI_SPARKLINES } from '../data/kpis'
import { INSIGHTS } from '../data/insights'
import { INVESTIGATIONS } from '../data/investigations'
import { KNOWLEDGE_PATTERNS } from '../data/knowledge'
import { COMPARISON_BEFORE_AFTER, MONTHLY_HOURS_SAVED, REPORT_METRICS, REPORT_TRENDS } from '../data/reports'
import { ROOT_CAUSE_STATS } from '../data/rootCauses'
import { ALL_SERVICES } from '../data/services'
import { CONNECTED_SYSTEMS } from '../data/systems'
import { buildExceptionDetail } from '../data/buildDetail'
import type { ExceptionDetail, ExceptionRecord, ExceptionStatus, Filters, ServiceRecord } from '../types'

const delay = (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms))

function matchesFilters(record: ExceptionRecord, filters: Partial<Filters>) {
  if (filters.provider && filters.provider !== 'all' && record.provider !== filters.provider) return false
  if (filters.serviceType && filters.serviceType !== 'all' && record.service !== filters.serviceType) return false
  if (filters.severity && filters.severity !== 'all' && record.severity !== filters.severity) return false
  if (filters.exceptionType && filters.exceptionType !== 'all' && record.exceptionType !== filters.exceptionType) return false
  if (filters.status && filters.status !== 'all' && record.status !== filters.status) return false
  if (filters.region && filters.region !== 'all' && record.region !== filters.region) return false
  return true
}

export const mockApi = {
  async listExceptions(filters: Partial<Filters> = {}, source?: ExceptionRecord[]) {
    await delay()
    const data = (source ?? ALL_EXCEPTIONS).filter((item) => matchesFilters(item, filters))
    return data
  },

  async getException(id: string, source?: ExceptionRecord[]): Promise<ExceptionDetail | null> {
    await delay(260)
    const record = (source ?? ALL_EXCEPTIONS).find((item) => item.id === id)
    return record ? buildExceptionDetail(record) : null
  },

  async listServices(query = ''): Promise<ServiceRecord[]> {
    await delay(240)
    const q = query.trim().toLowerCase()
    if (!q) return ALL_SERVICES
    return ALL_SERVICES.filter((row) =>
      [row.customerId, row.msisdn, row.sim, row.account, row.servicePlan].some((value) =>
        value.toLowerCase().includes(q),
      ),
    )
  },

  async commandCenter() {
    await delay(280)
    return {
      kpi: EXECUTIVE_KPI,
      funnel: EXECUTIVE_FUNNEL,
      trend: EXECUTIVE_TREND,
      categories: DEMO_CATEGORY_COUNTS,
      severity: DEMO_SEVERITY,
      impact: BUSINESS_IMPACT,
      sparklines: KPI_SPARKLINES,
    }
  },

  async insights() {
    await delay(240)
    return INSIGHTS
  },

  async knowledge() {
    await delay(240)
    return KNOWLEDGE_PATTERNS
  },

  async rootCauses() {
    await delay(240)
    return ROOT_CAUSE_STATS
  },

  async reports() {
    await delay(260)
    return {
      metrics: REPORT_METRICS,
      comparison: COMPARISON_BEFORE_AFTER,
      hoursSaved: MONTHLY_HOURS_SAVED,
      trends: REPORT_TRENDS,
    }
  },

  async investigations() {
    await delay(240)
    return INVESTIGATIONS
  },

  async systems() {
    await delay(220)
    return CONNECTED_SYSTEMS
  },

  async blastRadius() {
    await delay(180)
    return BLAST_RADIUS_REGIONS
  },

  exceptionTypes() {
    return [...new Set(ALL_EXCEPTIONS.map((item) => item.exceptionType))].sort()
  },
}

export function applyStatus(records: ExceptionRecord[], id: string, status: ExceptionStatus): ExceptionRecord[] {
  return records.map((item) => (item.id === id ? { ...item, status, aiDiagnosed: true } : item))
}
