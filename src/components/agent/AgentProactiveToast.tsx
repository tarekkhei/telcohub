import { useAgent } from '../../context/AgentContext'
import { usePageAgentContext } from '../../hooks/usePageAgentContext'

export function AgentProactiveToast() {
  const { open, proactive, dismissProactive, openWithPrompt, setOpen } = useAgent()
  const pageContext = usePageAgentContext()
  if (!proactive || open) return null

  return (
    <div className="fixed right-4 left-4 z-30 w-auto rounded-xl border border-indigo-100 bg-white p-4 shadow-xl bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:left-auto md:right-6 md:w-80">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ai">{proactive.title}</p>
      <p className="mt-2 text-sm leading-5 text-navy-800">{proactive.body}</p>
      <p className="mt-2 text-xs font-semibold text-ai">{proactive.metric}</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="rounded-lg bg-ai px-3 py-1.5 text-xs font-medium text-white"
          onClick={() => {
            dismissProactive()
            openWithPrompt(proactive.primary.intent, pageContext)
          }}
        >
          {proactive.primary.label}
        </button>
        <button
          type="button"
          className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs text-navy-700"
          onClick={() => {
            dismissProactive()
            setOpen(false)
          }}
        >
          {proactive.secondary.label}
        </button>
      </div>
    </div>
  )
}
