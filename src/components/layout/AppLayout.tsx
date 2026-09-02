import { useEffect, useState } from 'react'
import { Menu, Sparkles } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { AgentShell } from '../agent/AgentShell'
import { useAgent } from '../../context/AgentContext'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const { setOpen } = useAgent()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (media.matches) setNavOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!navOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [navOpen])

  return (
    <div className="flex min-h-dvh bg-surface">
      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-[min(260px,85vw)] transform transition-transform duration-200 lg:static lg:z-auto lg:w-[260px] lg:shrink-0 lg:translate-x-0 lg:visible ${
          navOpen ? 'translate-x-0' : '-translate-x-full max-lg:invisible'
        }`}
      >
        <Sidebar onNavigate={() => setNavOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-navy-100 bg-white/90 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-700 hover:bg-navy-50 lg:hidden"
                aria-label="Open navigation"
                aria-expanded={navOpen}
                aria-controls="app-sidebar"
                onClick={() => setNavOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <p className="truncate text-sm font-semibold text-navy-900 lg:hidden">TelcoHub</p>
              <p className="hidden min-w-0 truncate text-xs text-navy-500 lg:block">
                Your systems automate the happy path.{' '}
                <span className="font-medium text-navy-800">TelcoHub AI gets exceptions back on track.</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <p className="hidden text-[11px] text-navy-400 xl:block">
                Synthetic demo data · Ice Wireless / Telehop / Iristel / MVNO Alpha
              </p>
              <button
                type="button"
                onClick={() => {
                  setNavOpen(false)
                  setOpen(true)
                }}
                className="hidden items-center gap-1.5 rounded-full bg-ai-soft px-3 py-1.5 text-xs font-semibold text-ai hover:bg-indigo-100 sm:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask TelcoHub
              </button>
            </div>
          </div>
        </header>
        <main className="px-3 py-4 pb-24 sm:px-4 sm:py-6 lg:px-6 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <AgentShell />
    </div>
  )
}
