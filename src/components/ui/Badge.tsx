import type { ReactNode } from 'react'
import type { ExceptionStatus, Severity } from '../../types'
import { STATUS_LABELS } from '../../data/constants'

const severityClass: Record<Severity, string> = {
  critical: 'bg-danger-soft text-danger',
  high: 'bg-orange-50 text-orange-700',
  medium: 'bg-warning-soft text-warning',
  low: 'bg-slate-100 text-slate-600',
}

const statusClass: Record<ExceptionStatus, string> = {
  new: 'bg-slate-100 text-slate-700',
  investigating: 'bg-sky-50 text-sky-700',
  diagnosed: 'bg-ai-soft text-ai',
  awaiting_approval: 'bg-amber-50 text-amber-700',
  resolving: 'bg-indigo-50 text-indigo-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  verified: 'bg-success-soft text-success',
  escalated: 'bg-danger-soft text-danger',
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${severityClass[severity]}`}>
      {severity}
    </span>
  )
}

export function StatusBadge({ status }: { status: ExceptionStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function SoftBadge({
  children,
  tone = 'navy',
}: {
  children: ReactNode
  tone?: 'navy' | 'ai' | 'success' | 'warning' | 'accent' | 'slate'
}) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    ai: 'bg-ai-soft text-ai',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    accent: 'bg-accent-soft text-accent',
    slate: 'bg-slate-100 text-slate-600',
  }
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}
