import type { AgentConversation, AgentPage, ChatMessage } from '../types'

export const DEFAULT_SOURCES = [
  'Ordering Platform',
  'Billing/BSS',
  'SIM Inventory',
  'Provisioning API',
  'Titan HSS',
  'Application Logs',
  'Historical Incidents',
]

export const SUGGESTIONS: Record<AgentPage, string[]> = {
  'command-center': [
    'What should I look at first?',
    'What is the biggest problem today?',
    'Which exceptions are affecting the most customers?',
    'What changed in the last 6 hours?',
    'Which root cause is increasing?',
    'Where are we losing the most operational time?',
    'Which issues could be automated safely?',
    "Summarize today's operations.",
  ],
  exceptions: [
    'Show me all critical activation failures from the last 4 hours.',
    'Which issue should operations prioritize?',
    'Is this affecting other customers?',
    'What should we do next?',
  ],
  'exception-detail': [
    'What happened?',
    'Why did this fail?',
    'Show me the evidence.',
    'Is this affecting other customers?',
    'Compare this with a successful activation.',
    'What should we do next?',
    'Is it safe to retry?',
    'Explain this to an operations manager.',
    'Prepare an engineering escalation.',
    'Create a ticket summary.',
  ],
  investigations: [
    'Which investigation should I open first?',
    'How long are investigations taking?',
    'Show high-confidence diagnoses awaiting approval.',
  ],
  services: [
    'Show state mismatches.',
    'Where is billing active but the network missing?',
    'How many customers have open exceptions?',
  ],
  'root-causes': [
    'Which root causes should we prioritize?',
    'Where are we losing the most operational time?',
    'Which issues could be automated safely?',
  ],
  reports: [
    'Explain this chart.',
    'Why did MTTR increase?',
    'What caused the spike on August 29?',
    'Compare this week with last week.',
    'Which root causes should we prioritize?',
    'Estimate potential operational savings.',
  ],
  insights: [
    'What is the emerging incident pattern?',
    'Which automation opportunity matters most?',
    'Where are we leaking revenue?',
  ],
  knowledge: [
    'Which pattern matches the current HSS failure?',
    'How has this pattern been resolved historically?',
  ],
  marketplace: [
    'Which systems should we connect first?',
    'What does Salesforce give Coreveo?',
    'How is ServiceNow used in investigations?',
    'Show me Titan HSS governance.',
  ],
  'connector-detail': [
    'What can Coreveo do with this system?',
    'Which actions require approval?',
    'Explain semantic discovery.',
  ],
  settings: [
    'Which systems were used in the last investigation?',
    'Is Titan HSS healthy?',
  ],
}

export const HOMEPAGE_PROMPTS = [
  'Why are activations failing today?',
  'Show the biggest customer-impacting issue.',
  'What changed in the last 6 hours?',
  'Find recurring provisioning failures.',
  'Where are we losing revenue?',
  'Summarize operations for management.',
]

function msg(id: string, role: ChatMessage['role'], text: string, extras: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id,
    role,
    blocks: [{ type: 'text', text }],
    createdAt: '2026-08-29T13:10:00',
    sources: role === 'assistant' ? DEFAULT_SOURCES.slice(0, 5) : undefined,
    ...extras,
  }
}

export const SAVED_CONVERSATIONS: AgentConversation[] = [
  {
    id: 'conv-provisioning',
    title: 'Provisioning spike investigation',
    updatedAt: '2026-08-29 14:28',
    storyStep: 'idle',
    messages: [
      msg('p1', 'user', 'Why are wireless activations failing today?'),
      msg(
        'p2',
        'assistant',
        'I found 42 wireless provisioning exceptions today. 38 share the same failure pattern. Transactions complete through billing and SIM assignment, then fail during HSS subscriber creation.',
        {
          actions: [
            { id: 'invest', label: 'Investigate', intent: 'Yes' },
            { id: 'view', label: 'View 38 Exceptions', href: '/exceptions?related=provisioning' },
          ],
        },
      ),
    ],
  },
  {
    id: 'conv-did',
    title: 'DID routing batch issue',
    updatedAt: '2026-08-29 13:42',
    messages: [
      msg('d1', 'user', 'Investigate why DID routing failures increased today.'),
      {
        id: 'd2',
        role: 'assistant',
        createdAt: '2026-08-29T13:42:20',
        sources: ['Routing Platform', 'Number Inventory', 'Application Logs'],
        risk: 'approval',
        blocks: [
          { type: 'text', text: 'I identified 21 DID routing exceptions.' },
          { type: 'text', text: '17 belong to the same inventory batch: DID-BATCH-QC-0829-04. All 17 were assigned successfully but were never added to the routing table.' },
          { type: 'metrics', rows: [
            { label: 'Probable root cause', value: 'Batch routing job did not complete' },
            { label: 'Confidence', value: '92%' },
            { label: 'Potential affected numbers', value: '143' },
          ]},
          { type: 'text', text: 'Suggested action: rerun the routing job for the affected batch after validating the destination route.' },
        ],
      },
    ],
  },
  {
    id: 'conv-billing',
    title: 'Billing/network mismatch analysis',
    updatedAt: '2026-08-29 12:18',
    messages: [
      msg('b1', 'user', 'Where is billing active but the network missing?'),
      msg(
        'b2',
        'assistant',
        '14 services appear active in the network but inactive in billing, and several activations are the inverse: billed but not on the network. Estimated leakage is $4,380/month. Open Services and look for rows marked State mismatch.',
        { actions: [{ id: 'svc', label: 'Open Services', href: '/services' }] },
      ),
    ],
  },
  {
    id: 'conv-weekly',
    title: 'Weekly operations summary',
    updatedAt: '2026-08-28 17:05',
    messages: [
      msg('w1', 'user', 'Summarize this week for management.'),
      msg(
        'w2',
        'assistant',
        'This week the agent diagnosed a rising share of exceptions automatically and reduced engineering escalations. The remaining concentration is provisioning configuration. Correcting the HSS endpoint is the highest-leverage action before the week closes.',
      ),
    ],
  },
]
