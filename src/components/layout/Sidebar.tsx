import {
  BookOpen,
  Bot,
  Circle,
  FileBarChart,
  GitBranch,
  LayoutDashboard,
  Lightbulb,
  Network,
  Plug,
  Settings,
  ShieldAlert,
  Workflow,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { CONNECTED_SYSTEM_COUNT } from '../../data/constants'

const NAV = [
  { to: '/', label: 'Command Center', icon: LayoutDashboard, end: true },
  { to: '/exceptions', label: 'Exceptions', icon: ShieldAlert },
  { to: '/investigations', label: 'Investigations', icon: Workflow },
  { to: '/services', label: 'Services', icon: Network },
  { to: '/root-causes', label: 'Root Causes', icon: GitBranch },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/insights', label: 'AI Insights', icon: Lightbulb },
  { to: '/knowledge', label: 'Knowledge', icon: BookOpen },
  { to: '/marketplace', label: 'Marketplace', icon: Plug },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-y-auto border-r border-navy-800 bg-navy-900 text-navy-100 lg:sticky lg:top-0 lg:h-dvh">
      <div className="border-b border-navy-800 px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">TelcoHub</p>
              <p className="text-[11px] text-navy-300">powered by Coreveo AI</p>
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
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-navy-800 font-medium text-white'
                    : 'text-navy-300 hover:bg-navy-800/70 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-navy-800 p-4">
        <div className="flex items-center justify-between rounded-lg bg-navy-800 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            <Circle className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
            <span className="text-navy-200">AI Agent Status</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">Online</span>
        </div>
        <div className="flex items-center justify-between px-1 text-xs text-navy-300">
          <span>Connected Systems</span>
          <span className="font-semibold text-white">{CONNECTED_SYSTEM_COUNT}</span>
        </div>
      </div>
    </aside>
  )
}
