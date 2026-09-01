import type { ActionRisk } from './index'

export type ConnectorCategory =
  | 'CRM'
  | 'Billing & BSS'
  | 'ITSM'
  | 'Telecom'
  | 'ERP & Finance'
  | 'Messaging'
  | 'Databases'
  | 'Observability'
  | 'Cloud'
  | 'Generic APIs'

export type ConnectorCertification =
  | 'CONNECTED'
  | 'AVAILABLE'
  | 'CERTIFIED'
  | 'COREVEO_NATIVE'
  | 'MARKETPLACE_PACK'
  | 'COMING_SOON'

export type ConnectorKind = 'native' | 'pack' | 'generic'

export type ConnectorIconId =
  | 'building'
  | 'headset'
  | 'ticket'
  | 'credit-card'
  | 'radio'
  | 'phone'
  | 'hash'
  | 'calculator'
  | 'messages'
  | 'database'
  | 'activity'
  | 'cloud'
  | 'plug'
  | 'webhook'
  | 'file-code'
  | 'folder-sync'
  | 'scroll'
  | 'layers'
  | 'globe'
  | 'workflow'

export type ActionGovernance = 'READ_ONLY' | 'SAFE_TO_AUTOMATE' | 'APPROVAL_REQUIRED' | 'RESTRICTED'

export interface ConnectorAction {
  name: string
  governance: ActionGovernance
  description?: string
}

export interface SemanticDiscovery {
  endpoint: string
  method: string
  capability: string
  entity: string
  lifecycleStage?: string
  risk: 'Low' | 'Medium' | 'High'
  aiExecution: string
}

export interface ConnectorAiCapabilities {
  investigation: boolean
  correlation: boolean
  rootCauseAnalysis: boolean
  recommendations: boolean
  supervisedRemediation: boolean
  autonomousRemediation: boolean
}

export interface CoreveoConnectorDefinition {
  id: string
  name: string
  vendor?: string
  category: ConnectorCategory
  description: string
  shortDescription: string
  overview: string
  icon: ConnectorIconId
  kind: ConnectorKind
  featured?: boolean
  connectedByDefault?: boolean
  plgLabel?: string
  plgFree?: boolean
  connectionMethods: string[]
  connectionType: string
  authMethods?: string[]
  entities: string[]
  capabilities: string[]
  lifecycleStages?: string[]
  supportedEvents?: string[]
  actions: ConnectorAction[]
  aiCapabilities: ConnectorAiCapabilities
  certificationStatus: ConnectorCertification
  useCase?: string
  semanticDiscoveries?: SemanticDiscovery[]
  databaseReadOnlyNote?: boolean
}

export interface ConnectorInstance extends CoreveoConnectorDefinition {
  connected: boolean
  displayStatus: ConnectorCertification
}

export interface ConnectorQuery {
  search?: string
  category?: ConnectorCategory | 'All'
  availability?: 'all' | 'connected' | 'available' | 'coming_soon'
  certification?: ConnectorCertification | 'all'
  kind?: ConnectorKind | 'all'
  featuredOnly?: boolean
}

export interface ConnectionTestResult {
  success: boolean
  capabilitiesDiscovered: number
  entitiesIdentified: number
  readOperations: number
  writeOperations: number
  restrictedActions: number
  message: string
}

export const GOVERNANCE_TO_RISK: Record<ActionGovernance, ActionRisk> = {
  READ_ONLY: 'read_only',
  SAFE_TO_AUTOMATE: 'safe',
  APPROVAL_REQUIRED: 'approval',
  RESTRICTED: 'restricted',
}

export const CONNECTOR_CATEGORIES: Array<ConnectorCategory | 'All'> = [
  'All',
  'CRM',
  'Billing & BSS',
  'ITSM',
  'Telecom',
  'ERP & Finance',
  'Messaging',
  'Databases',
  'Observability',
  'Cloud',
  'Generic APIs',
]
