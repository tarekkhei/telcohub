import type { ReactNode } from 'react'

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose?: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
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
