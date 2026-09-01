import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { ALL_EXCEPTIONS } from '../data/generateExceptions'
import { applyStatus } from '../services/mockApi'
import type { ExceptionRecord, ExceptionStatus, Filters } from '../types'

interface AppState {
  exceptions: ExceptionRecord[]
  filters: Filters
  setFilters: (next: Partial<Filters>) => void
  resetFilters: () => void
  updateExceptionStatus: (id: string, status: ExceptionStatus) => void
  resolutionOutcome: Record<string, 'idle' | 'running' | 'verified'>
  setResolutionOutcome: (id: string, value: 'idle' | 'running' | 'verified') => void
}

const DEFAULT_FILTERS: Filters = {
  timeRange: '24h',
  provider: 'all',
  serviceType: 'all',
  severity: 'all',
  exceptionType: 'all',
  status: 'all',
  region: 'all',
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>(() =>
    ALL_EXCEPTIONS.map((item) => ({ ...item })),
  )
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS)
  const [resolutionOutcome, setOutcome] = useState<Record<string, 'idle' | 'running' | 'verified'>>({})

  const setFilters = useCallback((next: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }))
  }, [])

  const resetFilters = useCallback(() => setFiltersState(DEFAULT_FILTERS), [])

  const updateExceptionStatus = useCallback((id: string, status: ExceptionStatus) => {
    setExceptions((prev) => applyStatus(prev, id, status))
  }, [])

  const setResolutionOutcome = useCallback((id: string, value: 'idle' | 'running' | 'verified') => {
    setOutcome((prev) => ({ ...prev, [id]: value }))
  }, [])

  const value = useMemo(
    () => ({
      exceptions,
      filters,
      setFilters,
      resetFilters,
      updateExceptionStatus,
      resolutionOutcome,
      setResolutionOutcome,
    }),
    [exceptions, filters, resetFilters, resolutionOutcome, setFilters, setResolutionOutcome, updateExceptionStatus],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

