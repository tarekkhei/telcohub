import { applyOntarioRecovery, REGION_HEALTH_BASE } from '../data/regionHealth'
import type { RegionHealth } from '../types/ops'

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

export const regionHealthService = {
  async list(verifiedHeroCount = 0): Promise<RegionHealth[]> {
    await delay()
    return applyOntarioRecovery(REGION_HEALTH_BASE, verifiedHeroCount)
  },

  async get(id: string, verifiedHeroCount = 0): Promise<RegionHealth | null> {
    await delay(160)
    const regions = applyOntarioRecovery(REGION_HEALTH_BASE, verifiedHeroCount)
    return regions.find((item) => item.id === id) ?? null
  },
}
