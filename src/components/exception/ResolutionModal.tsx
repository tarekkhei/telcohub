import { Check, LoaderCircle } from 'lucide-react'
import { Modal } from '../ui/Modal'

export function ResolutionModal({
  open,
  steps,
  currentIndex,
  complete,
  onClose,
}: {
  open: boolean
  steps: string[]
  currentIndex: number
  complete: boolean
  onClose?: () => void
}) {
  return (
    <Modal open={open} title={complete ? 'Exception Resolved' : 'Executing recommended resolution'} onClose={onClose}>
      <ul className="space-y-2.5">
        {steps.map((step, index) => {
          const done = index < currentIndex || (complete && index <= currentIndex)
          const active = !complete && index === currentIndex
          return (
            <li key={step} className="flex items-center gap-2 text-sm text-navy-800">
              {done ? (
                <Check className="h-4 w-4 text-success" />
              ) : active ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-ai" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-navy-200" />
              )}
              <span className={done ? 'text-navy-800' : 'text-navy-500'}>{step}</span>
            </li>
          )
        })}
      </ul>
      {complete ? (
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-success-soft p-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-xs text-success">Resolution time</p>
            <p className="font-semibold text-navy-900">1m 12s</p>
          </div>
          <div>
            <p className="text-xs text-success">Customer service</p>
            <p className="font-semibold text-navy-900">ACTIVE</p>
          </div>
          <div>
            <p className="text-xs text-success">AI verification</p>
            <p className="font-semibold text-navy-900">PASSED</p>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
