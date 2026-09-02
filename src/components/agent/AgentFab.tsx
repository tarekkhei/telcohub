import { Sparkles } from 'lucide-react'
import { useAgent } from '../../context/AgentContext'

export function AgentFab() {
  const { open, setOpen } = useAgent()
  if (open) return null
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-2 rounded-full bg-ai px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/40 hover:bg-indigo-600 md:right-6 md:bottom-6"
    >
      <Sparkles className="h-4 w-4" />
      Ask TelcoHub
    </button>
  )
}
