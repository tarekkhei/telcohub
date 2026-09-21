import { OPERATIONAL_BLUEPRINTS } from '../data/operationalBlueprints'
import type { OperationalBlueprint } from '../types/ops'

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export const operationalBlueprintService = {
  async list(): Promise<OperationalBlueprint[]> {
    await delay()
    return OPERATIONAL_BLUEPRINTS
  },

  async get(id: string): Promise<OperationalBlueprint | null> {
    await delay(180)
    return OPERATIONAL_BLUEPRINTS.find((item) => item.id === id) ?? null
  },
}
