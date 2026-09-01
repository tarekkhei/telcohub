import type {
  ExceptionCategory,
  ExceptionStatus,
  Provider,
  Region,
  ServiceType,
  Severity,
} from '../types'

export const PROVIDERS: Provider[] = ['Ice Wireless', 'Telehop', 'Iristel', 'MVNO Alpha']
export const SERVICE_TYPES: ServiceType[] = [
  'mobile',
  'esim',
  'did',
  'voip',
  'portability',
  'wireless',
]
export const REGIONS: Region[] = ['Ontario', 'Quebec', 'Alberta', 'British Columbia']
export const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low']
export const STATUSES: ExceptionStatus[] = [
  'new',
  'investigating',
  'diagnosed',
  'awaiting_approval',
  'resolving',
  'resolved',
  'verified',
  'escalated',
]
export const CATEGORIES: ExceptionCategory[] = [
  'Provisioning Failure',
  'SIM/eSIM Failure',
  'DID Routing',
  'Number Portability',
  'Billing State Mismatch',
  'Network Subscriber Missing',
  'API / Integration Failure',
  'Other',
]

export const TIME_RANGES = [
  { value: '1h', label: 'Last 1 hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
] as const

export const STATUS_LABELS: Record<ExceptionStatus, string> = {
  new: 'New',
  investigating: 'Investigating',
  diagnosed: 'Diagnosed',
  awaiting_approval: 'Awaiting Approval',
  resolving: 'Resolving',
  resolved: 'Resolved',
  verified: 'Verified',
  escalated: 'Escalated',
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  mobile: 'Mobile',
  esim: 'eSIM',
  did: 'DID',
  voip: 'VoIP',
  portability: 'Portability',
  wireless: 'Wireless',
}

export const LIFECYCLE_STAGES = [
  { key: 'event', label: 'Event', description: 'Something happened.' },
  { key: 'alert', label: 'Alert', description: 'Something looks wrong.' },
  { key: 'exception', label: 'Exception', description: 'A business transaction did not reach its expected state.' },
  { key: 'investigation', label: 'Investigation', description: 'Coreveo gathers evidence across systems.' },
  { key: 'diagnosis', label: 'Diagnosis', description: 'Coreveo determines probable root cause.' },
  { key: 'resolution', label: 'Resolution', description: 'A corrective action is proposed or executed.' },
  { key: 'verification', label: 'Verification', description: 'Coreveo confirms the expected business outcome.' },
] as const

export const CONNECTED_SYSTEM_COUNT = 7

export const HERO_EXCEPTION_ID = 'EXC-2026-0146'
