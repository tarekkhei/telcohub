import { DEFAULT_SOURCES } from '../data/agentCatalog'
import type { ActionRisk, AgentMode, ChatAction, ChatBlock, ChatMessage, PageAgentContext } from '../types'

export interface AgentReply {
  blocks: ChatBlock[]
  actions?: ChatAction[]
  sources?: string[]
  risk?: ActionRisk
  processSteps?: string[]
  nextStoryStep?: string
}

function has(text: string, ...needles: string[]) {
  return needles.some((needle) => text.includes(needle))
}

function reply(
  blocks: ChatBlock[],
  extras: Partial<AgentReply> = {},
): AgentReply {
  return {
    blocks,
    sources: extras.sources ?? DEFAULT_SOURCES,
    risk: extras.risk ?? 'read_only',
    ...extras,
  }
}

function evidenceReply(): AgentReply {
  return reply(
    [
      { type: 'heading', text: 'Evidence Used' },
      { type: 'text', text: 'Provisioning API log — 2026-08-29 14:21:03' },
      { type: 'code', text: 'POST /api/v1/hss/subscriber/create\n404 Not Found' },
      { type: 'text', text: 'Titan HSS query for subscriber 4385550187 returned NOT FOUND.' },
      { type: 'text', text: 'Successful comparison: of the last 500 successful activations, 482 used /api/v2/hss/subscribers.' },
      { type: 'text', text: 'Similar incidents: 37 matching failures in the last 6 hours.' },
    ],
    { risk: 'read_only' },
  )
}

function whatHappened(ctx: PageAgentContext): AgentReply {
  const focused = ctx.exceptionId === 'EXC-2026-0146' || ctx.page === 'command-center' || ctx.page === 'exception-detail'
  if (focused) {
    return reply(
      [
        {
          type: 'text',
          text: 'The customer completed the ordering, payment, billing and SIM assignment stages successfully. The transaction failed when the provisioning service attempted to create the subscriber in Titan HSS.',
        },
        { type: 'text', text: 'The provisioning API returned:' },
        { type: 'code', text: 'HTTP 404' },
        {
          type: 'text',
          text: 'I then checked Titan HSS and confirmed that the subscriber was never created. I found 37 similar activation failures in the last 6 hours, suggesting this is a shared provisioning configuration issue rather than a customer-specific problem.',
        },
        { type: 'metrics', rows: [{ label: 'Current confidence', value: '94%' }] },
        {
          type: 'text',
          text: 'Suggested next step: validate the active HSS provisioning endpoint before retrying the affected activations.',
        },
      ],
      {
        risk: 'read_only',
        actions: [
          { id: 'evidence', label: 'Show Evidence', kind: 'evidence' },
          { id: 'similar', label: 'Find Similar Cases', intent: 'Find similar cases' },
          { id: 'explain', label: 'Explain Recommendation', intent: 'Why do you think the endpoint is the problem?' },
          { id: 'prepare', label: 'Prepare Resolution', intent: 'What should we do next?' },
        ],
      },
    )
  }
  return reply([
    {
      type: 'text',
      text: `${ctx.customerId ?? 'The customer'} completed upstream steps, then failed at ${ctx.problem ?? 'the expected network outcome'}. This is an exception — a business transaction that did not reach its expected state — not just an alert.`,
    },
  ])
}

function activationDemo(): AgentReply {
  return reply(
    [
      { type: 'text', text: 'I found 42 wireless provisioning exceptions today.' },
      { type: 'text', text: '38 share the same failure pattern.' },
      {
        type: 'text',
        text: 'The transactions complete successfully through billing and SIM assignment but fail during HSS subscriber creation.',
      },
      {
        type: 'metrics',
        rows: [
          { label: 'Probable root cause', value: 'Provisioning endpoint configuration' },
          { label: 'Confidence', value: '94%' },
        ],
      },
      { type: 'text', text: 'Would you like me to investigate the affected transactions?' },
    ],
    {
      nextStoryStep: 'asked_activations',
      actions: [
        { id: 'yes', label: 'Investigate', intent: 'Yes' },
        { id: 'view', label: 'View 38 Exceptions', href: '/exceptions?related=provisioning' },
      ],
    },
  )
}

function investigateActivations(): AgentReply {
  return reply(
    [
      { type: 'text', text: 'I confirmed 38 affected activations across four regions.' },
      { type: 'text', text: 'All 38 used the same failing provisioning endpoint.' },
      {
        type: 'text',
        text: 'I found a validated endpoint from successful transactions and historical incidents.',
      },
      {
        type: 'text',
        text: 'Recommended next action: validate the endpoint configuration and retry one test activation before bulk remediation.',
      },
    ],
    {
      processSteps: [
        'Searching recent wireless activation exceptions...',
        'Correlating billing, SIM and HSS state...',
        'Comparing last 500 successful activations...',
        'Matching historical incidents...',
        'Generating recommended next action...',
      ],
      nextStoryStep: 'ready_retry',
      risk: 'approval',
      actions: [
        { id: 'test', label: 'Run Test Retry', intent: 'Run test retry' },
        { id: 'evidence', label: 'Show Evidence', kind: 'evidence' },
        { id: 'view', label: 'View 38 Exceptions', href: '/exceptions?related=provisioning' },
      ],
    },
  )
}

function testRetry(): AgentReply {
  return reply(
    [
      { type: 'text', text: 'Test activation completed successfully.' },
      {
        type: 'list',
        items: ['Order ✓', 'Billing ✓', 'SIM ✓', 'HSS ✓', 'Network ✓'],
      },
      { type: 'text', text: 'I recommend retrying the remaining 37 affected activations.' },
    ],
    {
      processSteps: [
        'Validating /api/v2/hss/subscribers...',
        'Retrying CREATE_SUBSCRIBER on a single test order...',
        'Querying Titan HSS...',
        'Confirming network activation...',
      ],
      nextStoryStep: 'test_done',
      risk: 'approval',
      actions: [
        { id: 'bulk', label: 'Approve Bulk Retry', intent: 'Approve bulk retry' },
        { id: 'export', label: 'Export Impact Report', intent: 'Export impact report' },
      ],
    },
  )
}

export function generateAgentReply(
  rawInput: string,
  ctx: PageAgentContext,
  mode: AgentMode,
  storyStep = 'idle',
): AgentReply {
  const text = rawInput.trim()
  const q = text.toLowerCase()

  if (q.startsWith('/')) return handleSlash(q, ctx, mode, storyStep)

  if (has(q, 'ontario', 'activations failing in ontario', 'why are activations failing', 'why is ontario red', 'ontario red', 'why is ontario critical', 'ontario critical')) {
    return reply(
      [
        {
          type: 'text',
          text: 'Ontario is critical because 42 active exceptions are affecting 73 customers.',
        },
        {
          type: 'text',
          text: '38 are associated with the same Wireless Activation pattern. Billing and SIM assignment complete successfully, but HSS subscriber creation fails.',
        },
        {
          type: 'text',
          text: 'The failures began shortly after a provisioning configuration change.',
        },
        {
          type: 'metrics',
          rows: [
            { label: 'Probable root cause', value: 'HSS endpoint configuration' },
            { label: 'Confidence', value: '96%' },
            { label: 'Customers impacted', value: '73' },
            { label: 'Revenue at risk', value: '$18,450' },
          ],
        },
      ],
      {
        risk: 'approval',
        nextStoryStep: 'ready_retry',
        actions: [
          { id: 'investigate', label: 'Investigate', href: '/exceptions/EXC-2026-0146' },
          { id: 'evidence', label: 'Show Evidence', kind: 'evidence' },
          { id: 'impact', label: 'View Exceptions', href: '/exceptions?region=Ontario' },
        ],
      },
    )
  }

  if (
    ctx.page === 'marketplace' ||
    ctx.page === 'integrations' ||
    ctx.page === 'resolve' ||
    ctx.page === 'connector-detail' ||
    ctx.page === 'data-sources' ||
    has(q, 'connector marketplace', 'add connector', 'semantic discovery', 'data sources', 'integrations')
  ) {
    if (has(q, 'approval', 'why is approval')) {
      return reply([
        {
          type: 'text',
          text: 'Approval is required because this remediation writes to provisioning systems. Governance policy is APPROVAL REQUIRED for create and retry actions. Run a controlled test first, then Approve & Execute.',
        },
      ], { actions: [{ id: 'resolve', label: 'Open Resolve', href: '/resolve' }] })
    }
    if (has(q, 'salesforce')) {
      return reply([
        {
          type: 'text',
          text: 'Salesforce supplies customer, account, case and order context. Coreveo uses it to correlate complaints with technical exceptions.',
        },
      ], { actions: [{ id: 'sf', label: 'Open Salesforce', href: '/connected-systems/salesforce' }] })
    }
    if (has(q, 'servicenow')) {
      return reply([
        {
          type: 'text',
          text: 'ServiceNow remains your ITSM system of record. TERA correlates exceptions to incidents when connected.',
        },
      ], { actions: [{ id: 'sn', label: 'Open ServiceNow', href: '/connected-systems/servicenow' }] })
    }
    if (has(q, 'titan', 'hss', 'governance', 'contributing')) {
      return reply([
        {
          type: 'text',
          text: 'HSS and Provisioning are contributing to activation failures. Titan HSS lookup is read-only. Create and retry require approval.',
        },
      ], { risk: 'read_only', actions: [{ id: 'hss', label: 'Open Titan HSS', href: '/connected-systems/titan-hss' }] })
    }
    if (has(q, 'semantic')) {
      return reply([
        {
          type: 'text',
          text: 'After connection, TERA discovers entities, identifiers and suggested journeys automatically. Advanced mapping stays under Advanced Configuration.',
        },
      ])
    }
    return reply([
      {
        type: 'text',
        text: 'Connect TERA to the systems you already use — Billing, Provisioning, HSS, Splunk, ServiceNow and more.',
      },
      {
        type: 'text',
        text: 'No rip-and-replace. TERA creates intelligence across your existing stack. Connections in this demo are simulated.',
      },
    ], { actions: [{ id: 'mkt', label: 'Open Connected Systems', href: '/connected-systems' }] })
  }

  if (storyStep === 'asked_activations' && (q === 'yes' || has(q, 'investigate', 'go ahead', 'please'))) {
    return investigateActivations()
  }

  if (has(q, 'run test retry', 'test retry', 'retry one')) return testRetry()

  if (has(q, 'approve bulk', 'bulk retry', 'retry the remaining')) {
    return reply(
      [
        {
          type: 'text',
          text: 'Bulk retry queued for the remaining 37 activations. This is a supervised action. In production it would require human approval and would not write to live OSS/BSS from this mockup.',
        },
        {
          type: 'metrics',
          rows: [
            { label: 'Queued', value: '37 activations' },
            { label: 'Expected outcome', value: 'HSS + network active' },
            { label: 'Control', value: 'APPROVAL REQUIRED' },
          ],
        },
      ],
      { risk: 'approval', nextStoryStep: 'bulk_queued' },
    )
  }

  if (has(q, 'export impact')) {
    return reply(
      [
        {
          type: 'text',
          text: 'Impact summary prepared (synthetic). 38 activations, $18,450 revenue at risk, Ontario cluster. Open Insights for the learning view.',
        },
      ],
      { actions: [{ id: 'reports', label: 'Open Insights', href: '/insights' }] },
    )
  }

  if (
    has(q, 'why are activations failing', 'why are wireless activations', 'activations failing today', 'recurring provisioning')
  ) {
    return activationDemo()
  }

  if (has(q, 'delete the subscriber', 'recreate everything', 'wipe', 'destroy')) {
    return reply(
      [
        {
          type: 'text',
          text: 'I cannot recommend that action based on the current evidence.',
        },
        {
          type: 'text',
          text: 'Deleting the subscriber could affect an existing network state and requires a higher-risk operational approval.',
        },
        {
          type: 'text',
          text: 'Safer next step: validate subscriber state and provisioning configuration first.',
        },
      ],
      { risk: 'restricted' },
    )
  }

  if (has(q, 'show evidence', 'show me the evidence', 'why?') || q === 'why') return evidenceReply()

  if (has(q, 'why do you think the endpoint', 'why is the endpoint', 'endpoint is the problem')) {
    return reply([
      { type: 'text', text: 'The hypothesis is based on four correlated observations:' },
      {
        type: 'list',
        items: [
          'The customer data is valid.',
          'Billing and SIM assignment completed successfully.',
          'The failure occurs specifically at CREATE_SUBSCRIBER.',
          '94% of similar failed transactions used /api/v1/hss/subscriber/create, while successful transactions used /api/v2/hss/subscribers.',
        ],
      },
      {
        type: 'text',
        text: 'Because the failure pattern is shared across multiple customers, the evidence points more strongly to configuration than to customer data.',
      },
    ])
  }

  if (has(q, 'could it be something else', 'alternative', 'what else')) {
    return reply([
      { type: 'text', text: 'Yes. Alternative hypotheses are:' },
      {
        type: 'list',
        items: [
          'Authentication/configuration issue — 4%',
          'Malformed subscriber payload — 1%',
          'Customer-specific data issue — <1%',
        ],
      },
      {
        type: 'text',
        text: 'I recommend validating the endpoint first because it explains the highest number of correlated failures.',
      },
    ])
  }

  if (has(q, 'what happened', 'what happened here')) return whatHappened(ctx)

  if (has(q, 'why did this fail', 'why did it fail')) {
    return reply([
      {
        type: 'text',
        text: ctx.diagnosis
          ? `${ctx.diagnosis} The failure is at the network subscriber create step, after billing and SIM were already successful.`
          : 'The business transaction diverged at the system that owns the expected outcome. Adjacent OSS/BSS states were valid.',
      },
    ])
  }

  if (has(q, 'compare', 'successful activation')) {
    return reply([
      {
        type: 'text',
        text: 'Successful activations in the last 500 samples used /api/v2/hss/subscribers, completed HSS create, and reached network active. This failed transaction used /api/v1/hss/subscriber/create, received HTTP 404, and never created the HSS subscriber.',
      },
    ])
  }

  if (has(q, 'how many customers', 'affecting other', 'blast radius', 'blast-radius')) {
    return reply([
      { type: 'text', text: '38 customers are currently associated with this pattern.' },
      {
        type: 'metrics',
        rows: [
          { label: 'Ontario', value: '16' },
          { label: 'Quebec', value: '12' },
          { label: 'Alberta', value: '6' },
          { label: 'British Columbia', value: '4' },
          { label: 'Potential blocked MRR', value: '$2,660' },
        ],
      },
    ])
  }

  if (has(q, 'critical activation', 'last 4 hours', 'last four hours')) {
    return reply(
      [
        { type: 'heading', text: '12 exceptions found' },
        {
          type: 'list',
          items: ['8 Provisioning API failures', '3 HSS subscriber missing', '1 duplicate SIM assignment'],
        },
      ],
      {
        actions: [
          {
            id: 'open-filtered',
            label: 'Open filtered exceptions',
            href: '/exceptions',
            filters: { severity: 'critical', serviceType: 'mobile' },
          },
        ],
      },
    )
  }

  if (has(q, 'prioritize', 'biggest problem', 'biggest customer', 'look at first', 'what should i look')) {
    return reply([
      { type: 'text', text: 'The highest-priority operational issue is currently:' },
      { type: 'heading', text: 'HSS Provisioning Endpoint Failure' },
      {
        type: 'list',
        items: [
          '38 affected activations',
          'High customer impact',
          'Growing frequency',
          'Known historical resolution',
          'High AI confidence',
        ],
      },
      { type: 'metrics', rows: [{ label: 'Recommended priority', value: 'P1' }] },
    ])
  }

  if (has(q, 'retry this', 'retry the activation') && !has(q, 'bulk', 'test')) {
    return reply(
      [
        { type: 'text', text: 'Before executing, Coreveo checks:' },
        {
          type: 'list',
          items: [
            'Customer data: Valid ✓',
            'Billing state: Active ✓',
            'SIM state: Assigned ✓',
            'Network subscriber: Missing ✓',
            'Current provisioning endpoint: Validation required ⚠',
          ],
        },
        { type: 'text', text: 'I do not recommend retrying until the endpoint configuration is validated.' },
      ],
      {
        risk: 'approval',
        actions: [
          { id: 'validate', label: 'Validate Endpoint', intent: 'Validate it' },
          { id: 'retry-anyway', label: 'Retry Anyway', intent: 'Retry anyway' },
          { id: 'cancel', label: 'Cancel', intent: 'Cancel retry' },
        ],
      },
    )
  }

  if (has(q, 'validate it', 'validate the endpoint', 'validate endpoint')) {
    return reply(
      [
        { type: 'text', text: 'Validated endpoint found:' },
        { type: 'code', text: '/api/v2/hss/subscribers' },
        { type: 'text', text: 'Recommended action: retry using the validated configuration.' },
      ],
      {
        processSteps: [
          'Checking provisioning configuration...',
          'Comparing successful transactions...',
          'Selecting known-good endpoint...',
        ],
        risk: 'approval',
        actions: [{ id: 'approve', label: 'Approve & Execute', intent: 'Approve & execute' }],
      },
    )
  }

  if (has(q, 'retry anyway')) {
    return reply(
      [
        {
          type: 'text',
          text: 'Retrying against the current v1 endpoint is likely to reproduce the HTTP 404. I marked this as a restricted path. Validate the endpoint first.',
        },
      ],
      { risk: 'restricted' },
    )
  }

  if (has(q, 'cancel retry')) {
    return reply([{ type: 'text', text: 'Retry cancelled. No changes were made to OSS/BSS systems.' }])
  }

  if (has(q, 'approve & execute', 'approve and execute')) {
    return reply(
      [
        {
          type: 'text',
          text: 'Supervised remediation simulated. HSS subscriber created, network state active, billing/network aligned. Open the exception to see verification.',
        },
      ],
      {
        processSteps: HERO_STEPS,
        risk: 'approval',
        actions: [{ id: 'open', label: 'Open EXC-2026-0146', href: '/exceptions/EXC-2026-0146' }],
      },
    )
  }

  if (has(q, 'safe to retry', 'is it safe')) {
    return reply(
      [
        {
          type: 'text',
          text: 'Not yet. Billing and SIM states are valid, but the active provisioning endpoint still needs validation. After switching to /api/v2/hss/subscribers, a single test retry is the safe next step.',
        },
      ],
      { risk: 'approval' },
    )
  }

  if (has(q, 'what should we do next', 'recommended', 'next action', 'prepare resolution')) {
    return reply(
      [
        {
          type: 'text',
          text: 'Validate the HSS provisioning endpoint, switch traffic to /api/v2/hss/subscribers, retry one test CREATE_SUBSCRIBER, then verify HSS and network before bulk retry.',
        },
      ],
      {
        risk: 'approval',
        actions: [
          { id: 'validate', label: 'Validate Endpoint', intent: 'Validate it' },
          { id: 'escalate', label: 'Prepare Escalation', intent: 'Prepare an escalation for engineering.' },
        ],
      },
    )
  }

  if (has(q, 'summarize today', 'summarize operations', "today's operations", 'daily summary', 'summarize operations for')) {
    return dailySummary()
  }

  if (has(q, 'vp of operations', 'operations manager', 'explain this for', 'explain this to an operations', 'business language')) {
    return reply([
      {
        type: 'text',
        text: 'A provisioning configuration issue is preventing a group of new wireless customers from completing activation.',
      },
      { type: 'text', text: '38 customers may currently be affected.' },
      {
        type: 'text',
        text: 'The customer accounts and SIM assignments were created successfully, but the network activation step did not complete.',
      },
      {
        type: 'text',
        text: 'The issue appears to be centralized, so correcting one configuration may allow the affected activations to be recovered in bulk.',
      },
      { type: 'metrics', rows: [{ label: 'Current estimated blocked monthly revenue', value: '$2,660' }] },
      { type: 'text', text: 'No customer data corruption has been detected.' },
    ])
  }

  if (has(q, 'escalat', 'ticket summary', 'create a ticket')) {
    return reply(
      [
        { type: 'heading', text: 'Engineering Escalation' },
        {
          type: 'metrics',
          rows: [
            { label: 'Incident', value: ctx.exceptionId ?? 'EXC-2026-0146' },
            { label: 'Severity', value: 'High' },
            { label: 'Impact', value: '38 failed wireless activations' },
            { label: 'Observed failure', value: 'HTTP 404 during CREATE_SUBSCRIBER' },
            { label: 'Endpoint', value: '/api/v1/hss/subscriber/create' },
            { label: 'Expected endpoint', value: '/api/v2/hss/subscribers' },
            { label: 'Billing state', value: 'Valid' },
            { label: 'SIM assignment', value: 'Valid' },
            { label: 'HSS subscriber', value: 'Missing' },
            { label: 'First observed', value: '2026-08-29 08:14' },
            { label: 'Last observed', value: '2026-08-29 14:21' },
          ],
        },
        {
          type: 'text',
          text: 'Recommended investigation: validate provisioning route/configuration and confirm whether the v1 endpoint has been retired or changed.',
        },
      ],
      {
        risk: 'approval',
        actions: [{ id: 'ticket', label: 'Create Ticket', kind: 'ticket' }],
      },
    )
  }

  if (has(q, 'did routing', 'investigate why did')) {
    return reply(
      [
        { type: 'text', text: 'I identified 21 DID routing exceptions.' },
        {
          type: 'text',
          text: '17 belong to the same inventory batch: DID-BATCH-QC-0829-04. All 17 were assigned successfully but were never added to the routing table.',
        },
        {
          type: 'metrics',
          rows: [
            { label: 'Probable root cause', value: 'Batch routing job did not complete' },
            { label: 'Confidence', value: '92%' },
            { label: 'Potential affected numbers', value: '143' },
          ],
        },
        {
          type: 'text',
          text: 'Suggested action: rerun the routing job for the affected batch after validating the destination route.',
        },
      ],
      {
        processSteps: [
          'Searching recent DID exceptions...',
          'Analyzing routing platform...',
          'Comparing successful assignments...',
          'Checking regions...',
          'Correlating provisioning batches...',
        ],
        risk: 'approval',
      },
    )
  }

  if (has(q, 'changed in the last 6', 'last 6 hours', '312')) {
    return reply([
      {
        type: 'text',
        text: 'Provisioning HTTP 404 failures increased 312% in the last 6 hours. 38 activations share /api/v1/hss/subscriber/create. This is the emerging incident pattern — not a single ticket.',
      },
    ])
  }

  if (has(q, 'losing the most operational', 'operational time', 'losing revenue', 'revenue')) {
    return reply([
      {
        type: 'text',
        text: 'Provisioning configuration is consuming the most engineering time (84h this month) and blocking $2,660 MRR on today’s HSS pattern. Separately, 14 network-active / billing-inactive services represent about $4,380/month leakage.',
      },
    ])
  }

  if (has(q, 'automated safely', 'automation')) {
    return reply(
      [
        {
          type: 'text',
          text: 'The same SIM reprovisioning procedure was manually approved 63 times this month. Estimated automation potential is 21 hours/month. That is a candidate for a supervised automation policy — still human-approved, not unsupervised writes.',
        },
      ],
      { risk: 'safe', actions: [{ id: 'knowledge', label: 'Review Opportunity', href: '/knowledge' }] },
    )
  }

  if (has(q, 'root cause is increasing', 'prioritize')) {
    return reply([
      {
        type: 'text',
        text: 'Provisioning configuration is the increasing root cause — 126 exceptions this month and the 312% six-hour spike. It should be P1. API timeouts are second but not accelerating the same way.',
      },
    ])
  }

  if (has(q, 'explain this chart', 'mttr', 'spike on august', 'compare this week', 'operational savings')) {
    return reply([
      {
        type: 'text',
        text: 'These are demo / illustrative metrics. MTTR declined from 41 minutes to 18 minutes across the week as diagnosis and auto-resolution rates rose. The August 29 exception count is higher because of the provisioning 404 cluster, not because investigation slowed. Potential operational savings shown in Insights are 62.4 hours today and 412 hours monthly in the comparison card.',
      },
    ])
  }

  if (has(q, 'most customers', 'affecting the most')) {
    return reply([
      {
        type: 'text',
        text: 'DID inbound routing (EXC-2026-0145) reports 143 numbers, but the systemic priority is still the 38-customer HSS provisioning cluster — it is growing and shares one fix.',
      },
    ])
  }

  if (has(q, 'similar cases', 'similar incidents', '/similar')) {
    return reply([
      {
        type: 'list',
        items: [
          'INC-00981 · Aug 19 · Deprecated provisioning endpoint · 97% match',
          'INC-00843 · Jul 12 · HSS API route changed · 91% match',
          'INC-00716 · Jun 27 · Provisioning proxy misconfiguration · 82% match',
        ],
      },
    ])
  }

  if (mode === 'investigate' && q.length < 24) {
    return investigateActivations()
  }

  if (mode === 'report') {
    return dailySummary()
  }

  return reply([
    {
      type: 'text',
      text: ctx.exceptionId
        ? `I have ${ctx.exceptionId} loaded. Ask what happened, why it failed, who else is affected, or what to do next. I can also prepare an escalation or a management summary.`
        : 'I can explain today’s exceptions, investigate a pattern, recommend a supervised action, or draft an operations summary. Try “Why are wireless activations failing today?”',
    },
  ])
}

function dailySummary(): AgentReply {
  return reply([
    { type: 'heading', text: 'Operations Summary — August 29' },
    {
      type: 'list',
      items: [
        '147 exceptions detected.',
        '121 automatically diagnosed.',
        '98 resolved.',
        '94 verified.',
      ],
    },
    { type: 'text', text: 'Top issue: Provisioning API / HSS subscriber creation — 38 affected activations.' },
    { type: 'text', text: 'Largest improvement: engineering escalations decreased 34% compared with the demo baseline.' },
    {
      type: 'text',
      text: 'Current priority: validate the HSS provisioning configuration before retrying affected customers.',
    },
    { type: 'metrics', rows: [{ label: 'Potential operational time saved', value: '62.4 hours' }] },
  ])
}

const HERO_STEPS = [
  'Validating endpoint...',
  'Retrying provisioning...',
  'Creating HSS subscriber...',
  'Checking network state...',
  'Synchronizing service state...',
  'Verifying activation...',
]

function handleSlash(q: string, ctx: PageAgentContext, mode: AgentMode, storyStep: string): AgentReply {
  if (q.startsWith('/investigate')) {
    if (q.includes('did')) return generateAgentReply('Investigate why DID routing failures increased today.', ctx, mode, storyStep)
    return investigateActivations()
  }
  if (q.startsWith('/compare')) return generateAgentReply('Compare this with a successful activation.', ctx, mode, storyStep)
  if (q.startsWith('/blast-radius')) return generateAgentReply('How many customers are affected by the provisioning issue?', ctx, mode, storyStep)
  if (q.startsWith('/root-cause')) return generateAgentReply('Why do you think the endpoint is the problem?', ctx, mode, storyStep)
  if (q.startsWith('/summarize') || q.startsWith('/report')) return dailySummary()
  if (q.startsWith('/escalate')) return generateAgentReply('Prepare an escalation for engineering.', ctx, mode, storyStep)
  if (q.startsWith('/similar')) return generateAgentReply('Find similar cases', ctx, mode, storyStep)
  if (q.startsWith('/verify')) {
    return reply([
      {
        type: 'text',
        text: 'Verification confirms the expected business outcome. After a successful retry, billing stays Active, SIM stays Assigned, HSS becomes Active, and Network becomes Active.',
      },
    ])
  }
  return reply([{ type: 'text', text: 'Unknown command. Try /investigate, /compare, /blast-radius, /root-cause, /summarize, /escalate, /similar or /verify.' }])
}

export function toAssistantMessage(reply: AgentReply, id: string): ChatMessage {
  return {
    id,
    role: 'assistant',
    blocks: reply.blocks,
    actions: reply.actions,
    sources: reply.sources,
    risk: reply.risk,
    createdAt: new Date().toISOString(),
  }
}
