import { Sparkles } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { AgentShell } from '../agent/AgentShell'
import { useAgent } from '../../context/AgentContext'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const { setOpen } = useAgent()
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-navy-100 bg-white/90 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-navy-500">
              Your systems automate the happy path.{' '}
              <span className="font-medium text-navy-800">TelcoHub AI gets exceptions back on track.</span>
            </p>
            <div className="flex items-center gap-3">
              <p className="hidden text-[11px] text-navy-400 md:block">
                Synthetic demo data · Ice Wireless / Telehop / Iristel / MVNO Alpha
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-ai-soft px-3 py-1.5 text-xs font-semibold text-ai hover:bg-indigo-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask TelcoHub
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
      <AgentShell />
    </div>
  )
}
