import type { KnowledgePattern } from '../types'

export const KNOWLEDGE_PATTERNS: KnowledgePattern[] = [
  {
    id: 'PAT-HSS-001',
    title: 'HSS Subscriber Missing After Successful Billing Activation',
    conditions: [
      'Billing account = active',
      'SIM = assigned',
      'CREATE_SUBSCRIBER = failed',
      'HSS subscriber = absent',
    ],
    likelyCauses: [
      'API endpoint',
      'Authentication issue',
      'Invalid provisioning payload',
      'Network timeout',
    ],
    historicalResolutions: [
      { cause: 'Endpoint/config issue', percent: 61 },
      { cause: 'Payload issue', percent: 24 },
      { cause: 'Authentication', percent: 9 },
      { cause: 'Other', percent: 6 },
    ],
    investigationSequence: [
      'Validate transaction identifiers',
      'Compare billing/network state',
      'Inspect provisioning API response',
      'Validate subscriber payload',
      'Query HSS',
      'Compare with successful activation',
      'Search matching incident patterns',
    ],
    timesUsed: 126,
    successRate: 94,
  },
  {
    id: 'PAT-DID-014',
    title: 'DID Assigned in Inventory but Not Present in Routing',
    conditions: [
      'Number inventory = assigned',
      'Billing DID quantity = billed',
      'Routing table = missing destination',
    ],
    likelyCauses: ['Route publish lag', 'Switch translation error', 'Stale route cache'],
    historicalResolutions: [
      { cause: 'Route republish', percent: 54 },
      { cause: 'Switch translation fix', percent: 31 },
      { cause: 'Cache flush', percent: 15 },
    ],
    investigationSequence: [
      'Confirm DID ownership',
      'Compare inventory and routing',
      'Inspect last route publish job',
      'Validate switch translations',
      'Test inbound call path',
    ],
    timesUsed: 41,
    successRate: 88,
  },
  {
    id: 'PAT-LNP-008',
    title: 'Port Request Stuck in Pending After Losing-Carrier Submit',
    conditions: [
      'Port request = pending',
      'Losing carrier response = absent or timeout',
      'Customer service = not yet cutover',
    ],
    likelyCauses: ['LNP gateway timeout', 'Invalid account PIN', 'Conflicting port'],
    historicalResolutions: [
      { cause: 'Gateway retry', percent: 47 },
      { cause: 'Account validation', percent: 33 },
      { cause: 'Conflict cancel/refile', percent: 20 },
    ],
    investigationSequence: [
      'Retrieve port request identifiers',
      'Confirm losing-carrier payload',
      'Inspect LNP gateway timers',
      'Search conflicting requests',
      'Recommend refile or escalate',
    ],
    timesUsed: 39,
    successRate: 79,
  },
  {
    id: 'PAT-BIL-022',
    title: 'Network Active While Billing Remains Inactive',
    conditions: [
      'Network subscriber = active',
      'Billing service = inactive or missing quantity',
    ],
    likelyCauses: ['BSS sync lag', 'Order quantity omitted', 'Manual override'],
    historicalResolutions: [
      { cause: 'BSS resync', percent: 58 },
      { cause: 'Quantity correction', percent: 29 },
      { cause: 'Manual billing fix', percent: 13 },
    ],
    investigationSequence: [
      'Confirm network state',
      'Inspect billing service records',
      'Trace order-to-bill mapping',
      'Propose resync or charge correction',
    ],
    timesUsed: 22,
    successRate: 91,
  },
]
