import type { InvestigationRecord } from '../types'
import { ALL_EXCEPTIONS } from './generateExceptions'

export const INVESTIGATIONS: InvestigationRecord[] = ALL_EXCEPTIONS.filter(
  (item) => item.status !== 'new',
)
  .slice(0, 48)
  .map((item, index) => ({
    id: `INV-${item.id.slice(-4)}`,
    exceptionId: item.id,
    title: item.title,
    startedAt: item.detectedAt,
    durationSeconds: 18 + ((index * 7) % 40),
    systemsTouched: 5 + (index % 4),
    status: item.status,
    confidence: item.aiConfidence,
    provider: item.provider,
  }))
