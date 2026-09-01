import { Bot, User } from 'lucide-react'
import type { ActionRisk, ChatAction, ChatMessage } from '../../types'

const RISK_LABEL: Record<ActionRisk, { label: string; className: string }> = {
  read_only: { label: 'READ ONLY', className: 'bg-navy-50 text-navy-600' },
  safe: { label: 'SAFE TO AUTOMATE', className: 'bg-success-soft text-success' },
  approval: { label: 'APPROVAL REQUIRED', className: 'bg-warning-soft text-warning' },
  restricted: { label: 'RESTRICTED', className: 'bg-danger-soft text-danger' },
}

export function AgentMessage({
  message,
  onAction,
}: {
  message: ChatMessage
  onAction: (action: ChatAction) => void
}) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-navy-800 text-white' : 'bg-ai-soft text-ai'
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={`max-w-[88%] space-y-2 ${isUser ? 'items-end' : ''}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
            isUser ? 'bg-navy-900 text-white' : 'border border-navy-100 bg-white text-navy-800'
          }`}
        >
          {message.blocks.map((block, index) => {
            if (block.type === 'heading') {
              return (
                <p key={index} className="mb-1.5 font-semibold text-navy-900">
                  {block.text}
                </p>
              )
            }
            if (block.type === 'code') {
              return (
                <pre key={index} className="my-2 overflow-x-auto rounded-lg bg-navy-950 px-3 py-2 font-mono text-xs text-sky-100">
                  {block.text}
                </pre>
              )
            }
            if (block.type === 'list') {
              return (
                <ul key={index} className="my-1.5 list-disc space-y-1 pl-4">
                  {block.items?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            }
            if (block.type === 'metrics') {
              return (
                <dl key={index} className="my-2 space-y-1 rounded-lg bg-navy-50 px-3 py-2">
                  {block.rows?.map((row) => (
                    <div key={row.label} className="flex justify-between gap-3 text-xs">
                      <dt className="text-navy-500">{row.label}</dt>
                      <dd className="font-semibold text-navy-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )
            }
            return (
              <p key={index} className={index > 0 ? 'mt-2' : ''}>
                {block.text}
              </p>
            )
          })}
        </div>
        {message.risk && !isUser ? (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${RISK_LABEL[message.risk].className}`}>
            {RISK_LABEL[message.risk].label}
          </span>
        ) : null}
        {message.actions?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {message.actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onAction(action)}
                className="rounded-full border border-navy-200 bg-white px-2.5 py-1 text-[11px] font-medium text-navy-700 hover:border-ai hover:text-ai"
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
        {message.sources?.length ? (
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] uppercase tracking-wide text-navy-400">Sources checked</span>
            {message.sources.map((source) => (
              <span key={source} className="rounded-full bg-navy-50 px-1.5 py-0.5 text-[10px] text-navy-600">
                {source}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
