import type { ReactNode } from 'react'

export function DemoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-navy-200 bg-navy-50 px-3 py-2 text-xs text-navy-600">
      <span className="mb-1 block font-semibold uppercase tracking-wide text-navy-400 sm:mb-0 sm:mr-2 sm:inline">
        Demo / illustrative
      </span>
      {children}
    </div>
  )
}
