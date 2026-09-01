import { SoftBadge } from '../ui/Badge'
import type { ActionGovernance, ConnectorCertification } from '../../types/connectors'

const STATUS_TONE: Record<ConnectorCertification, 'navy' | 'ai' | 'success' | 'warning' | 'accent' | 'slate'> = {
  CONNECTED: 'success',
  AVAILABLE: 'accent',
  CERTIFIED: 'ai',
  COREVEO_NATIVE: 'navy',
  MARKETPLACE_PACK: 'warning',
  COMING_SOON: 'slate',
}

const STATUS_LABEL: Record<ConnectorCertification, string> = {
  CONNECTED: 'Connected',
  AVAILABLE: 'Available',
  CERTIFIED: 'Certified',
  COREVEO_NATIVE: 'Coreveo Native',
  MARKETPLACE_PACK: 'Marketplace Pack',
  COMING_SOON: 'Coming Soon',
}

const GOVERNANCE_CLASS: Record<ActionGovernance, string> = {
  READ_ONLY: 'bg-navy-50 text-navy-700',
  SAFE_TO_AUTOMATE: 'bg-success-soft text-success',
  APPROVAL_REQUIRED: 'bg-warning-soft text-warning',
  RESTRICTED: 'bg-danger-soft text-danger',
}

const GOVERNANCE_LABEL: Record<ActionGovernance, string> = {
  READ_ONLY: 'Read only',
  SAFE_TO_AUTOMATE: 'Safe to automate',
  APPROVAL_REQUIRED: 'Approval required',
  RESTRICTED: 'Restricted',
}

export function ConnectorStatusBadge({ status }: { status: ConnectorCertification }) {
  return <SoftBadge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</SoftBadge>
}

export function GovernanceBadge({ governance }: { governance: ActionGovernance }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${GOVERNANCE_CLASS[governance]}`}>
      {GOVERNANCE_LABEL[governance]}
    </span>
  )
}
