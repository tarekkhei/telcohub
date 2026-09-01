export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type ExceptionStatus =
  | 'new'
  | 'investigating'
  | 'diagnosed'
  | 'awaiting_approval'
  | 'resolving'
  | 'resolved'
  | 'verified'
  | 'escalated'

export type ServiceType = 'mobile' | 'esim' | 'did' | 'voip' | 'portability' | 'wireless'

export type Provider = 'Ice Wireless' | 'Telehop' | 'Iristel' | 'MVNO Alpha'

export type Region = 'Ontario' | 'Quebec' | 'Alberta' | 'British Columbia'

export type ExceptionCategory =
  | 'Provisioning Failure'
  | 'SIM/eSIM Failure'
  | 'DID Routing'
  | 'Number Portability'
  | 'Billing State Mismatch'
  | 'Network Subscriber Missing'
  | 'API / Integration Failure'
  | 'Other'

export type JourneyStepStatus = 'completed' | 'failed' | 'not_started'

export type SystemFindingStatus = 'ok' | 'failed'

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d'

export interface Filters {
  timeRange: TimeRange
  provider: string
  serviceType: string
  severity: string
  exceptionType: string
  status: string
  region: string
}

export interface ExceptionRecord {
  id: string
  title: string
  detectedAt: string
  customerId: string
  msisdn: string
  sim: string
  orderId: string
  service: ServiceType
  exceptionType: string
  category: ExceptionCategory
  system: string
  severity: Severity
  aiConfidence: number
  status: ExceptionStatus
  potentialImpact: string
  provider: Provider
  region: Region
  rootCause: string
  revenueImpact: number
  customersImpacted: number
  autoResolved: boolean
  aiDiagnosed: boolean
}

export interface JourneyStep {
  name: string
  status: JourneyStepStatus
  timestamp?: string
  detail: string
}

export interface SystemInvestigation {
  name: string
  status: SystemFindingStatus
  finding: string
}

export interface TimelineEvent {
  timestamp: string
  description: string
}

export interface SimilarIncident {
  id: string
  date: string
  cause: string
  resolution: string
  confidence: number
}

export interface Diagnosis {
  rootCause: string
  confidence: number
  evidence: string[]
  blastRadius: number
  revenueBlocked: number
}

export interface ExceptionDetail extends ExceptionRecord {
  journey: JourneyStep[]
  systems: SystemInvestigation[]
  timeline: TimelineEvent[]
  diagnosis: Diagnosis
  similarIncidents: SimilarIncident[]
  recommendedActions: string[]
  risk: 'low' | 'medium' | 'high'
  automationEligibility: string
  beforeState: Record<string, string>
  afterState: Record<string, string>
  investigationSeconds: number
}

export interface ServiceRecord {
  id: string
  customerId: string
  msisdn: string
  sim: string
  account: string
  servicePlan: string
  billingState: 'Active' | 'Inactive' | 'Pending'
  provisioningState: 'Completed' | 'Failed' | 'Pending' | 'Partial'
  networkState: 'Active' | 'Inactive' | 'Missing'
  activeExceptions: number
  provider: Provider
  region: Region
  service: ServiceType
}

export interface ConnectedSystem {
  name: string
  status: 'connected' | 'demo'
  lastSync: string
  latencyMs: number
  eventsProcessed: number
  description: string
}

export interface KnowledgePattern {
  id: string
  title: string
  conditions: string[]
  likelyCauses: string[]
  historicalResolutions: { cause: string; percent: number }[]
  investigationSequence: string[]
  timesUsed: number
  successRate: number
}

export interface InsightCard {
  id: string
  type: 'emerging' | 'manual' | 'revenue' | 'preventable'
  title: string
  body: string
  metric: string
  cta: string
  href?: string
}

export interface RootCauseStat {
  name: string
  exceptions: number
  engineeringHours: number
  customers: number
  revenueImpact: number
}

export interface KpiSnapshot {
  exceptionsToday: number
  exceptionsChange: number
  aiDiagnosed: number
  aiDiagnosedRate: number
  autoResolved: number
  autoResolvedRate: number
  awaitingApproval: number
  engineeringEscalations: number
  escalationsChange: number
  mttdSeconds: number
  mttdBaselineMinutes: number
  hoursSaved: number
  customersImpacted: number
}

export interface FunnelStage {
  label: string
  count: number
}

export interface TrendPoint {
  date: string
  total: number
  diagnosed: number
  resolved: number
}

export interface CategoryCount {
  name: ExceptionCategory
  value: number
}

export interface SeverityCount {
  name: Severity
  value: number
}

export interface InvestigationRecord {
  id: string
  exceptionId: string
  title: string
  startedAt: string
  durationSeconds: number
  systemsTouched: number
  status: ExceptionStatus
  confidence: number
  provider: Provider
}

export interface ResolutionStep {
  label: string
}

export interface ReportMetrics {
  totalExceptions: number
  aiDiagnosisRate: number
  resolutionRate: number
  autoResolutionRate: number
  escalationRate: number
  mttdSeconds: number
  mttrMinutes: number
  customersAffected: number
  customersRecovered: number
  revenueProtected: number
  hoursSaved: number
  engineeringCostAvoided: number
}

export interface ComparisonMetric {
  label: string
  before: string
  after: string
}

export type AgentMode = 'ask' | 'investigate' | 'resolve' | 'report'

export type AgentPage =
  | 'command-center'
  | 'exceptions'
  | 'exception-detail'
  | 'investigations'
  | 'services'
  | 'root-causes'
  | 'reports'
  | 'insights'
  | 'knowledge'
  | 'settings'

export type ActionRisk = 'read_only' | 'safe' | 'approval' | 'restricted'

export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatBlock {
  type: 'text' | 'heading' | 'list' | 'code' | 'metrics' | 'process'
  text?: string
  items?: string[]
  rows?: { label: string; value: string }[]
  steps?: string[]
}

export interface ChatAction {
  id: string
  label: string
  intent?: string
  href?: string
  filters?: Partial<Filters>
  kind?: 'message' | 'evidence' | 'ticket' | 'dismiss'
}

export interface ChatMessage {
  id: string
  role: ChatRole
  blocks: ChatBlock[]
  actions?: ChatAction[]
  sources?: string[]
  risk?: ActionRisk
  createdAt: string
}

export interface AgentConversation {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
  storyStep?: string
}

export interface PageAgentContext {
  page: AgentPage
  chips: string[]
  exceptionId?: string
  customerId?: string
  serviceLabel?: string
  problem?: string
  status?: string
  diagnosis?: string
  confidence?: number
  relatedCount?: number
}
