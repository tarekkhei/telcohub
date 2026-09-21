import { mockApi } from './mockApi'

export const commandCenterService = {
  getSnapshot(verifiedHeroCount = 0) {
    return mockApi.commandCenter(verifiedHeroCount)
  },
}
