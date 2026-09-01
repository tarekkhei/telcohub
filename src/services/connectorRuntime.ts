import { CONNECTOR_CATALOG, getConnectorDefinition } from '../connectors/catalog'
import type {
  ConnectionTestResult,
  ConnectorInstance,
  ConnectorQuery,
  CoreveoConnectorDefinition,
  SemanticDiscovery,
} from '../types/connectors'

function toInstance(definition: CoreveoConnectorDefinition, connectedIds: string[]): ConnectorInstance {
  const connected = connectedIds.includes(definition.id)
  return {
    ...definition,
    connected,
    displayStatus: connected ? 'CONNECTED' : definition.certificationStatus,
  }
}

function matchesQuery(item: ConnectorInstance, query: ConnectorQuery) {
  const search = query.search?.trim().toLowerCase() ?? ''
  if (search) {
    const haystack = [
      item.name,
      item.vendor,
      item.category,
      item.description,
      item.shortDescription,
      ...item.capabilities,
      ...item.entities,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(search)) return false
  }

  if (query.category && query.category !== 'All' && item.category !== query.category) return false

  if (query.availability === 'connected' && !item.connected) return false
  if (query.availability === 'available' && (item.connected || item.certificationStatus === 'COMING_SOON')) return false
  if (query.availability === 'coming_soon' && item.certificationStatus !== 'COMING_SOON') return false

  if (query.certification && query.certification !== 'all' && item.certificationStatus !== query.certification) {
    return false
  }

  if (query.kind && query.kind !== 'all' && item.kind !== query.kind) return false

  if (query.featuredOnly && !item.featured) return false

  return true
}

export function listConnectorInstances(query: ConnectorQuery, connectedIds: string[]): ConnectorInstance[] {
  return CONNECTOR_CATALOG.map((item) => toInstance(item, connectedIds)).filter((item) => matchesQuery(item, query))
}

export function getConnectorInstance(id: string, connectedIds: string[]): ConnectorInstance | null {
  const definition = getConnectorDefinition(id)
  return definition ? toInstance(definition, connectedIds) : null
}

export function simulateConnectionTest(id: string): ConnectionTestResult {
  const definition = getConnectorDefinition(id)
  if (!definition) {
    return {
      success: false,
      capabilitiesDiscovered: 0,
      entitiesIdentified: 0,
      readOperations: 0,
      writeOperations: 0,
      restrictedActions: 0,
      message: 'Unknown connector.',
    }
  }

  const readOperations = definition.actions.filter((action) => action.governance === 'READ_ONLY').length
  const writeOperations = definition.actions.filter(
    (action) => action.governance === 'SAFE_TO_AUTOMATE' || action.governance === 'APPROVAL_REQUIRED',
  ).length
  const restrictedActions = definition.actions.filter((action) => action.governance === 'RESTRICTED').length

  return {
    success: true,
    capabilitiesDiscovered: definition.capabilities.length,
    entitiesIdentified: definition.entities.length,
    readOperations,
    writeOperations,
    restrictedActions,
    message: 'Connection Successful',
  }
}

export function simulateSemanticDiscovery(id: string): SemanticDiscovery[] {
  const definition = getConnectorDefinition(id)
  if (!definition) return []
  if (definition.semanticDiscoveries?.length) return definition.semanticDiscoveries

  const read = definition.actions.find((action) => action.governance === 'READ_ONLY')
  const write = definition.actions.find((action) => action.governance !== 'READ_ONLY')
  const entity = definition.entities[0] ?? 'Resource'
  const discoveries: SemanticDiscovery[] = []

  if (read) {
    discoveries.push({
      endpoint: `/api/${entity.toLowerCase().replace(/\s+/g, '-')}s/{id}`,
      method: 'GET',
      capability: read.name,
      entity,
      lifecycleStage: 'Investigation',
      risk: 'Low',
      aiExecution: 'Read Only',
    })
  }
  if (write) {
    discoveries.push({
      endpoint: `/api/${entity.toLowerCase().replace(/\s+/g, '-')}s`,
      method: 'POST',
      capability: write.name,
      entity,
      lifecycleStage: 'Provisioning',
      risk: write.governance === 'RESTRICTED' ? 'High' : 'Medium',
      aiExecution:
        write.governance === 'RESTRICTED'
          ? 'Restricted'
          : write.governance === 'APPROVAL_REQUIRED'
            ? 'Approval Required'
            : 'Safe to Automate',
    })
  }
  return discoveries
}

/** Production would call the Coreveo connector runtime instead of these simulators. */
export const connectorRuntime = {
  list: listConnectorInstances,
  get: getConnectorInstance,
  test: simulateConnectionTest,
  discover: simulateSemanticDiscovery,
}
