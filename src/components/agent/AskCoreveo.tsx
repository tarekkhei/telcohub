import { ArrowUp, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { HOMEPAGE_PROMPTS } from '../../data/agentCatalog'
import { useAgent } from '../../context/AgentContext'
import { usePageAgentContext } from '../../hooks/usePageAgentContext'

export function AskCoreveo() {
  const { openWithPrompt } = useAgent()
  const pageContext = usePageAgentContext()
  const [value, setValue] = useState('')

  const submit = (text: string) => {
    const next = text.trim()
    if (!next) return
    openWithPrompt(next, pageContext)
    setValue('')
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,28,46,0.04),0_12px_32px_rgba(91,92,224,0.08)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-ai" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ai">Ask TelcoHub</p>
          <h2 className="text-lg font-semibold text-navy-900">What do you want to investigate?</h2>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit(value)
        }}
        className="flex items-end gap-2 rounded-xl border border-navy-200 bg-navy-50/50 px-3 py-2"
      >
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submit(value)
            }
          }}
          rows={2}
          placeholder="Why are wireless activations failing today?"
          className="min-h-[56px] flex-1 resize-none bg-transparent text-base text-navy-800 outline-none placeholder:text-navy-400 md:text-sm"
        />
        <button
          type="submit"
          className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-ai text-white hover:bg-indigo-600"
          aria-label="Ask TelcoHub"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {HOMEPAGE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submit(prompt)}
            className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-xs text-navy-700 hover:border-ai hover:text-ai"
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  )
}
