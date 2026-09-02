import type { ReactNode } from 'react'

export function Modal({
  open,
  title,
  children,
  onClose,
  size = 'md',
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose?: () => void
  size?: 'md' | 'lg' | 'xl'
}) {
  if (!open) return null
  const widths = {
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-950/40 p-0 sm:items-center sm:p-4">
      <div className={`w-full ${widths[size]} max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6`}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
          {onClose ? (
            <button onClick={onClose} className="text-sm text-navy-500 hover:text-navy-800">
              Close
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
