export type RegionHealthStatus = 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'NO_DATA'

export type BlueprintStageStatus = 'expected' | 'failed' | 'delayed' | 'not_reached'

export type DataSourceKind =
  | 'SYSTEM'
  | 'TELEMETRY'
  | 'EVENT_STREAM'
  | 'DATABASE'
  | 'FILE_BATCH'
  | 'ITSM'
  | 'CHANGE_DEPLOYMENT'
  | 'OBSERVABILITY'

export interface RegionSystem {
  id: string
  name: string
  role: string
  status: 'healthy' | 'degraded' | 'faulty'
  exceptions: number
  detail?: string
  /** Offset from region center in degrees for map placement */
  offsetLat: number
  offsetLng: number
}

export interface RegionHealth {
  id: string
  name: string
  country: string
  status: RegionHealthStatus
  latitude: number
  longitude: number
  activeExceptions: number
  criticalExceptions: number
  customersImpacted: number
  mrrAtRisk: number
  topExceptionPattern?: string
  aiConfidence?: number
  likelyTrigger?: string
  recommendedAction?: string
  affectedServices?: string[]
  recentChanges?: string[]
  topRootCauses?: string[]
  systems?: RegionSystem[]
}

export interface LifecycleStage {
  key: string
  label: string
  status: BlueprintStageStatus
  detail?: string
}

export interface ExpectedStateItem {
  system: string
  expected: string
  observed?: string
  aligned: boolean
}

export interface OperationalBlueprint {
  id: string
  name: string
  lifecycle: string
  systems: string[]
  criticalIdentifiers: string[]
  expectedEndState: string
  knownExceptions: string[]
  linkedPackId: string
  linkedPackName: string
  lastUpdated: string
  status: 'ACTIVE' | 'DRAFT' | 'DEPRECATED'
  stages: LifecycleStage[]
  expectedStates: ExpectedStateItem[]
}

export interface ExceptionPack {
  id: string
  name: string
  category: string
  version: string
  coverage: string
  knownPatterns: number
  investigationPlaybooks: number
  resolutionPlaybooks: number
  successRate: number
  status: 'ACTIVE' | 'BETA' | 'COMING_SOON'
  lifecycleModel: string[]
  expectedStates: string[]
  requiredIdentifiers: string[]
  exceptionSignatures: string[]
  supportedActions: { name: string; governance: string; riskLevel: string }[]
  verificationRules: string[]
}

export interface ChangeEvent {
  id: string
  timestamp: string
  source: string
  title: string
  kind: 'deployment' | 'config' | 'release' | 'incident_signal'
  relatedSystem: string
}

export interface ChangeCorrelation {
  title: string
  summary: string
  confidence: number
  changeEvents: ChangeEvent[]
  supportingFacts: string[]
}

export interface BusinessImpact {
  activationsBlocked: number
  customersImpacted: number
  enterpriseCustomers: number
  mrrAtRisk: number
  slaBreaches: number
  regions: number
  oldestFailure: string
  servicesImpacted: string[]
  transactionsBlocked: number
}

export interface ResolutionMemoryEntry {
  id: string
  pattern: string
  occurrences: number
  confirmedRootCause: string
  resolutionUsed: string
  successCount: number
  successAttempts: number
  lastSeen: string
  systemsInvolved: string[]
  humanApprovalRequired: boolean
  verificationOutcome: string[]
}

export interface StateComparisonRow {
  label: string
  expected: string
  observed: string
  aligned: boolean
}

export interface ExtendedKpiSnapshot {
  activeCriticalRegions: number
  mrrAtRisk: number
  servicesDegraded: number
  exceptionsLinkedToChanges: number
}

export interface CommandCenterExtras {
  extendedKpi: ExtendedKpiSnapshot
  topPatterns: { name: string; count: number; region: string }[]
  changeLinked: { id: string; title: string; change: string; confidence: number }[]
  awaitingApprovalPreview: { id: string; title: string; impact: string }[]
  recentInvestigations: { id: string; title: string; confidence: number; href: string }[]
}
