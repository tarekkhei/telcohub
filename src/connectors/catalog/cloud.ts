import { defineConnector } from './helpers'
import type { CoreveoConnectorDefinition } from '../../types/connectors'

export const CLOUD_CONNECTORS: CoreveoConnectorDefinition[] = [
  defineConnector({
    id: 'aws',
    name: 'AWS',
    vendor: 'Amazon',
    category: 'Cloud',
    kind: 'pack',
    icon: 'cloud',
    shortDescription: 'CloudWatch, Lambda, API Gateway, SQS and SNS.',
    description: 'AWS operational telemetry and event services — not infrastructure management.',
    overview:
      'AWS is an operational connector for CloudWatch Logs/Metrics, Lambda, API Gateway, SQS and SNS. Coreveo does not manage infrastructure from this connector.',
    connectionMethods: ['AWS APIs', 'IAM Role'],
    connectionType: 'AWS APIs • IAM',
    entities: ['Log Group', 'Metric', 'Function', 'Queue', 'Topic', 'API'],
    capabilities: ['CloudWatch Logs', 'CloudWatch Metrics', 'Lambda', 'API Gateway', 'SQS', 'SNS'],
    actions: [
      { name: 'Read Logs', governance: 'READ_ONLY' },
      { name: 'Read Metrics', governance: 'READ_ONLY' },
      { name: 'Inspect Queue', governance: 'READ_ONLY' },
      { name: 'Invoke Function', governance: 'RESTRICTED' },
    ],
    certificationStatus: 'AVAILABLE',
  }),
  defineConnector({
    id: 'azure',
    name: 'Microsoft Azure',
    vendor: 'Microsoft',
    category: 'Cloud',
    kind: 'pack',
    icon: 'cloud',
    shortDescription: 'Monitor, Log Analytics, Service Bus and Functions.',
    description: 'Azure operational telemetry — not subscription administration.',
    overview:
      'Microsoft Azure provides Azure Monitor, Log Analytics, Service Bus, Functions and Application Insights as operational evidence sources.',
    connectionMethods: ['Azure APIs', 'OAuth 2.0'],
    connectionType: 'Azure APIs • OAuth 2.0',
    entities: ['Log', 'Metric', 'Function', 'Queue', 'Insight'],
    capabilities: ['Azure Monitor', 'Log Analytics', 'Service Bus', 'Functions', 'Application Insights'],
    actions: [
      { name: 'Query Logs', governance: 'READ_ONLY' },
      { name: 'Read Metrics', governance: 'READ_ONLY' },
    ],
    certificationStatus: 'AVAILABLE',
  }),
  defineConnector({
    id: 'gcp',
    name: 'Google Cloud',
    vendor: 'Google',
    category: 'Cloud',
    kind: 'pack',
    icon: 'cloud',
    shortDescription: 'Cloud Logging, Monitoring and Pub/Sub.',
    description: 'GCP operational telemetry — not project administration.',
    overview: 'Google Cloud is used for Cloud Logging, Monitoring and Pub/Sub during investigation.',
    connectionMethods: ['REST API', 'Service Account'],
    connectionType: 'REST API • Service Account',
    entities: ['Log', 'Metric', 'Topic', 'Subscription'],
    capabilities: ['Cloud Logging', 'Monitoring', 'Pub/Sub'],
    actions: [
      { name: 'Read Logs', governance: 'READ_ONLY' },
      { name: 'Read Metrics', governance: 'READ_ONLY' },
    ],
    certificationStatus: 'AVAILABLE',
  }),
]
