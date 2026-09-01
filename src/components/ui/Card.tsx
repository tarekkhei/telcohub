import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-navy-100 bg-white shadow-[0_1px_2px_rgba(15,28,46,0.04),0_8px_24px_rgba(15,28,46,0.04)] ${
        padding ? 'p-5' : ''
      } ${className}`}
    >
      {children}
    </section>
  )
}

export function CardTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold text-navy-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-navy-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
