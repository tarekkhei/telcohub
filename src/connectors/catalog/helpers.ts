import type { ConnectorAiCapabilities, CoreveoConnectorDefinition } from '../../types/connectors'

const DEFAULT_AI: ConnectorAiCapabilities = {
  investigation: true,
  correlation: true,
  rootCauseAnalysis: true,
  recommendations: true,
  supervisedRemediation: false,
  autonomousRemediation: false,
}

type Draft = Omit<CoreveoConnectorDefinition, 'aiCapabilities'> & {
  aiCapabilities?: Partial<ConnectorAiCapabilities>
}

export function defineConnector(draft: Draft): CoreveoConnectorDefinition {
  return {
    ...draft,
    aiCapabilities: { ...DEFAULT_AI, ...draft.aiCapabilities },
  }
}
