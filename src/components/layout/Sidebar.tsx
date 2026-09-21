import {
  Activity,
  Circle,
  LayoutDashboard,
  Network,
  Settings,
  ShieldAlert,
  Sparkles,
  Wrench,
  Workflow,
  X,
  LineChart,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAgent } from '../../context/AgentContext'
import { CONNECTED_SYSTEM_COUNT } from '../../data/constants'

const PRIMARY_NAV = [
  { to: '/', label: 'Command Center', icon: LayoutDashboard, end: true },
  { to: '/exceptions', label: 'Exceptions', icon: ShieldAlert },
  { to: '/investigate', label: 'Investigate', icon: Workflow },
  { to: '/resolve', label: 'Resolve', icon: Wrench },
  { to: '/connected-systems', label: 'Connected Systems', icon: Network },
  { to: '/insights', label: 'Insights', icon: LineChart },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { setOpen } = useAgent()

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-y-auto border-r border-navy-800 bg-navy-900 text-navy-100 lg:sticky lg:top-0 lg:h-dvh">
      <div className="border-b border-navy-800 px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-400">Coreveo</p>
              <p className="text-sm font-semibold tracking-tight text-white">TERA</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-lg p-1.5 text-navy-300 hover:bg-navy-800 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 hidden text-[10px] leading-4 text-navy-500 xl:block">
          Telecom Exception Resolution &amp; Automation
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-navy-800 font-medium text-white'
                    : 'text-navy-300 hover:bg-navy-800/70 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-navy-800 p-3">
        <button
          type="button"
          onClick={() => {
            onNavigate?.()
            setOpen(true)
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-navy-300 transition hover:bg-navy-800/70 hover:text-white"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-300" />
          <span>Ask TERA</span>
        </button>
        <NavLink
          to="/settings"
          onClick={() => onNavigate?.()}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-navy-800 font-medium text-white'
                : 'text-navy-300 hover:bg-navy-800/70 hover:text-white'
            }`
          }
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Settings</span>
        </NavLink>

        <div className="mt-2 flex items-center justify-between rounded-lg bg-navy-800 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            <Circle className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
            <span className="text-navy-200">TERA Online</span>
          </div>
          <span className="text-[11px] text-navy-400">{CONNECTED_SYSTEM_COUNT} systems</span>
        </div>
      </div>
    </aside>
  )
}
