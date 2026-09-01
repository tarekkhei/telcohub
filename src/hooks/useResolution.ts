import { useState } from 'react'
import { useAppState } from '../context/AppStateContext'
import { HERO_RESOLUTION_STEPS } from '../data/featuredDetails'

export function useResolution(exceptionId: string) {
  const { updateExceptionStatus, resolutionOutcome, setResolutionOutcome } = useAppState()
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [complete, setComplete] = useState(resolutionOutcome[exceptionId] === 'verified')
  const [toast, setToast] = useState<string | null>(null)

  const alreadyVerified = resolutionOutcome[exceptionId] === 'verified'

  const run = () => {
    if (alreadyVerified) return
    setOpen(true)
    setComplete(false)
    setStepIndex(0)
    setResolutionOutcome(exceptionId, 'running')
    updateExceptionStatus(exceptionId, 'resolving')

    HERO_RESOLUTION_STEPS.forEach((_, index) => {
      window.setTimeout(() => {
        setStepIndex(index + 1)
        if (index === HERO_RESOLUTION_STEPS.length - 1) {
          setComplete(true)
          updateExceptionStatus(exceptionId, 'verified')
          setResolutionOutcome(exceptionId, 'verified')
        }
      }, (index + 1) * 700)
    })
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  return {
    open,
    stepIndex,
    complete: complete || alreadyVerified,
    alreadyVerified,
    steps: HERO_RESOLUTION_STEPS,
    run,
    notify,
    toast,
    close: () => setOpen(false),
  }
}
