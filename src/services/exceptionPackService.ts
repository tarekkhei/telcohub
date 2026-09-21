import { EXCEPTION_PACKS } from '../data/exceptionPacks'
import type { ExceptionPack } from '../types/ops'

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export const exceptionPackService = {
  async list(): Promise<ExceptionPack[]> {
    await delay()
    return EXCEPTION_PACKS
  },

  async get(id: string): Promise<ExceptionPack | null> {
    await delay(180)
    return EXCEPTION_PACKS.find((item) => item.id === id) ?? null
  },
}
