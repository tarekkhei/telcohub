import { ArrowUp, History, Plus, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUGGESTIONS } from '../../data/agentCatalog'
import { useAgent } from '../../context/AgentContext'
import { useAppState } from '../../context/AppStateContext'
import { usePageAgentContext } from '../../hooks/usePageAgentContext'
import type { AgentMode, ChatAction } from '../../types'
import { AgentMessage } from './AgentMessage'

const MODES: { id: AgentMode; label: string }[] = [
  { id: 'ask', label: 'Ask' },
  { id: 'investigate', label: 'Investigate' },
  { id: 'resolve', label: 'Resolve' },
  { id: 'report', label: 'Report' },
]

export function AgentPanel() {
  const navigate = useNavigate()
  const { setFilters } = useAppState()
  const pageContext = usePageAgentContext()
  const {
    open,
    setOpen,
    mode,
    setMode,
    conversations,
    activeId,
    messages,
    typing,
    processLabel,
    send,
    newConversation,
    loadConversation,
  } = useAgent()
  const [draft, setDraft] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [ticketNote, setTicketNote] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, processLabel, typing])

  if (!open) return null

  const suggestions = SUGGESTIONS[pageContext.page] ?? SUGGESTIONS['command-center']
  const showSuggestions = draft.length === 0 && !typing

  const handleAction = (action: ChatAction) => {
    if (action.filters) setFilters(action.filters)
    if (action.href) navigate(action.href)
    if (action.kind === 'ticket') {
      setTicketNote('ServiceNow incident INC-DEMO-4412 created (synthetic). No live ticket was opened.')
      window.setTimeout(() => setTicketNote(null), 3200)
      return
    }
    if (action.kind === 'evidence') {
      send('Show evidence', pageContext)
      return
    }
    if (action.intent) send(action.intent, pageContext)
  }

  return (
    <aside className="fixed inset-0 z-50 flex w-full flex-col border-navy-200 bg-navy-50 shadow-[-16px_0_40px_rgba(15,28,46,0.08)] md:inset-y-0 md:right-0 md:left-auto md:max-w-[420px] md:border-l">
      <header className="border-b border-navy-100 bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">TelcoHub Agent</p>
              <p className="text-[11px] text-emerald-600">Online • Operational Context Loaded</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setHistoryOpen((value) => !value)}
              className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50"
              aria-label="Conversation history"
            >
              <History className="h-4 w-4" />
            </button>
            <button type="button" onClick={newConversation} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50" aria-label="New conversation">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50" aria-label="Close agent">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                mode === item.id ? 'bg-ai text-white' : 'bg-navy-50 text-navy-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pageContext.chips.map((chip) => (
            <span key={chip} className="rounded-full bg-ai-soft px-2 py-0.5 text-[10px] font-medium text-ai">
              {chip}
            </span>
          ))}
        </div>
        {historyOpen ? (
          <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-navy-100 bg-navy-50 p-2">
            {conversations.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    loadConversation(item.id)
                    setHistoryOpen(false)
                  }}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-xs ${
                    item.id === activeId ? 'bg-white font-medium text-navy-900' : 'text-navy-600 hover:bg-white'
                  }`}
                >
                  <span className="block truncate">{item.title}</span>
                  <span className="text-[10px] text-navy-400">{item.updatedAt}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-navy-200 bg-white px-3 py-4 text-sm text-navy-600">
            The dashboard shows what is happening. Ask TelcoHub why it is happening and what should happen next.
            {pageContext.exceptionId ? (
              <p className="mt-2 text-xs text-navy-500">
                Context loaded: {pageContext.exceptionId} · {pageContext.customerId} · {pageContext.problem} · {pageContext.status} · {pageContext.confidence}% confidence
              </p>
            ) : null}
          </div>
        ) : null}
        {messages.map((message) => (
          <AgentMessage key={message.id} message={message} onAction={handleAction} />
        ))}
        {typing ? (
          <div className="rounded-xl border border-indigo-100 bg-ai-soft/60 px-3 py-2 text-xs text-ai">
            {processLabel ?? 'Coreveo is correlating operational context...'}
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <footer className="border-t border-navy-100 bg-white p-3">
        {showSuggestions ? (
          <div className="mb-2 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
            {suggestions.slice(0, 6).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt, pageContext)}
                className="rounded-full border border-navy-200 px-2.5 py-1 text-[11px] text-navy-600 hover:border-ai hover:text-ai"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : null}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            send(draft, pageContext)
            setDraft('')
          }}
          className="flex items-end gap-2 rounded-xl border border-navy-200 bg-navy-50/40 px-2.5 py-2"
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                send(draft, pageContext)
                setDraft('')
              }
            }}
            rows={2}
            placeholder="Ask TelcoHub about this exception, customer, service or operational trend..."
            className="max-h-28 flex-1 resize-none bg-transparent text-base text-navy-800 outline-none placeholder:text-navy-400 md:text-sm"
          />
          <button
            type="submit"
            disabled={!draft.trim() || typing}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai text-white disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-[10px] text-navy-400">Synthetic demo data · Slash commands: /investigate /compare /blast-radius /summarize /escalate</p>
      </footer>
      {ticketNote ? (
        <div className="absolute bottom-28 left-4 right-4 rounded-lg bg-navy-900 px-3 py-2 text-xs text-white shadow-lg">
          {ticketNote}
        </div>
      ) : null}
    </aside>
  )
}
