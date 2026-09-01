import { BILLING_CONNECTORS } from './billing'
import { CLOUD_CONNECTORS } from './cloud'
import { CRM_CONNECTORS } from './crm'
import { DATABASE_CONNECTORS } from './databases'
import { ERP_CONNECTORS } from './erp'
import { GENERIC_CONNECTORS } from './generic'
import { ITSM_CONNECTORS } from './itsm'
import { MESSAGING_CONNECTORS } from './messaging'
import { OBSERVABILITY_CONNECTORS } from './observability'
import { TELECOM_CONNECTORS } from './telecom'
import type { CoreveoConnectorDefinition } from '../../types/connectors'

export const CONNECTOR_CATALOG: CoreveoConnectorDefinition[] = [
  ...CRM_CONNECTORS,
  ...ITSM_CONNECTORS,
  ...BILLING_CONNECTORS,
  ...TELECOM_CONNECTORS,
  ...ERP_CONNECTORS,
  ...MESSAGING_CONNECTORS,
  ...DATABASE_CONNECTORS,
  ...OBSERVABILITY_CONNECTORS,
  ...CLOUD_CONNECTORS,
  ...GENERIC_CONNECTORS,
]

export const DEFAULT_CONNECTED_CONNECTOR_IDS = CONNECTOR_CATALOG.filter((item) => item.connectedByDefault).map(
  (item) => item.id,
)

export const FEATURED_CONNECTOR_IDS = CONNECTOR_CATALOG.filter((item) => item.featured).map((item) => item.id)

export const PLG_SLOTS = [
  { id: 'did-inventory', label: 'DID Inventory' },
  { id: 'mind-billing', label: 'Billing' },
  { id: 'cisco-broadworks', label: 'Provisioning' },
  { id: 'titan-hss', label: 'HSS' },
  { id: 'salesforce', label: 'CRM' },
  { id: 'servicenow', label: 'ServiceNow' },
] as const

export function getConnectorDefinition(id: string) {
  return CONNECTOR_CATALOG.find((item) => item.id === id) ?? null
}
