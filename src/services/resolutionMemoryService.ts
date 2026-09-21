import { RESOLUTION_MEMORY } from '../data/resolutionMemory'
import type { ResolutionMemoryEntry } from '../types/ops'

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export const resolutionMemoryService = {
  async list(): Promise<ResolutionMemoryEntry[]> {
    await delay()
    return RESOLUTION_MEMORY
  },

  async get(id: string): Promise<ResolutionMemoryEntry | null> {
    await delay(160)
    return RESOLUTION_MEMORY.find((item) => item.id === id) ?? null
  },

  async matchForPattern(patternHint: string): Promise<ResolutionMemoryEntry | null> {
    await delay(140)
    const q = patternHint.toLowerCase()
    return (
      RESOLUTION_MEMORY.find(
        (item) => item.pattern.toLowerCase().includes(q) || q.includes('hss') && item.id === 'mem-hss-missing',
      ) ?? RESOLUTION_MEMORY[0]
    )
  },
}
