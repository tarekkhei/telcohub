import { ALL_EXCEPTIONS } from '../data/generateExceptions'
import { BLAST_RADIUS_REGIONS, BUSINESS_IMPACT, COMMAND_CENTER_EXTRAS, DEMO_CATEGORY_COUNTS, DEMO_SEVERITY, EXECUTIVE_FUNNEL, EXECUTIVE_KPI, EXECUTIVE_TREND, KPI_SPARKLINES } from '../data/kpis'
import { INSIGHTS } from '../data/insights'
import { INVESTIGATIONS } from '../data/investigations'
import { KNOWLEDGE_PATTERNS } from '../data/knowledge'
import { COMPARISON_BEFORE_AFTER, MONTHLY_HOURS_SAVED, REPORT_METRICS, REPORT_TRENDS } from '../data/reports'
import { ROOT_CAUSE_STATS } from '../data/rootCauses'
import { ALL_SERVICES } from '../data/services'
import { CONNECTED_SYSTEMS } from '../data/systems'
import { buildExceptionDetail } from '../data/buildDetail'
import { connectorRuntime } from './connectorRuntime'
import { regionHealthService } from './regionHealthService'
import { operationalBlueprintService } from './operationalBlueprintService'
import { exceptionPackService } from './exceptionPackService'
import { changeContextService } from './changeContextService'
import { businessImpactService } from './businessImpactService'
import { resolutionMemoryService } from './resolutionMemoryService'
import type { ExceptionDetail, ExceptionRecord, ExceptionStatus, Filters, ServiceRecord } from '../types'
import type { ConnectorQuery } from '../types/connectors'

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

  async commandCenter(verifiedHeroCount = 0) {
    await delay(120)
    const regions = await regionHealthService.list(verifiedHeroCount)
    const critical = regions.filter((item) => item.status === 'CRITICAL').length
    const degraded = regions.filter((item) => item.status === 'DEGRADED').length
    const mrrAtRisk = regions.reduce((sum, item) => sum + item.mrrAtRisk, 0)
    return {
      kpi: {
        ...EXECUTIVE_KPI,
        activeCriticalRegions: critical,
        mrrAtRisk,
        servicesDegraded: Math.max(EXECUTIVE_KPI.servicesDegraded, critical + degraded),
      },
      funnel: EXECUTIVE_FUNNEL,
      trend: EXECUTIVE_TREND,
      categories: DEMO_CATEGORY_COUNTS,
      severity: DEMO_SEVERITY,
      impact: BUSINESS_IMPACT,
      sparklines: KPI_SPARKLINES,
      regions,
      extras: COMMAND_CENTER_EXTRAS,
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

  async regionHealth(verifiedHeroCount = 0) {
    return regionHealthService.list(verifiedHeroCount)
  },

  async getRegion(id: string, verifiedHeroCount = 0) {
    return regionHealthService.get(id, verifiedHeroCount)
  },

  async operationalBlueprints() {
    return operationalBlueprintService.list()
  },

  async getOperationalBlueprint(id: string) {
    return operationalBlueprintService.get(id)
  },

  async exceptionPacks() {
    return exceptionPackService.list()
  },

  async getExceptionPack(id: string) {
    return exceptionPackService.get(id)
  },

  async changeContext(exceptionId: string) {
    return changeContextService.forException(exceptionId)
  },

  async businessImpact(record: ExceptionRecord) {
    return businessImpactService.forRecord(record)
  },

  async resolutionMemory() {
    return resolutionMemoryService.list()
  },

  async matchResolutionMemory(pattern: string) {
    return resolutionMemoryService.matchForPattern(pattern)
  },

  exceptionTypes() {
    return [...new Set(ALL_EXCEPTIONS.map((item) => item.exceptionType))].sort()
  },

  async listConnectors(query: ConnectorQuery = {}, connectedIds: string[] = []) {
    await delay(220)
    return connectorRuntime.list(query, connectedIds)
  },

  async getConnector(id: string, connectedIds: string[] = []) {
    await delay(200)
    return connectorRuntime.get(id, connectedIds)
  },

  async testConnector(id: string) {
    await delay(720)
    return connectorRuntime.test(id)
  },

  async discoverConnector(id: string) {
    await delay(480)
    return connectorRuntime.discover(id)
  },
}

export function applyStatus(records: ExceptionRecord[], id: string, status: ExceptionStatus): ExceptionRecord[] {
  return records.map((item) => (item.id === id ? { ...item, status, aiDiagnosed: true } : item))
}
