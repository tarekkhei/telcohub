import { AgentFab } from './AgentFab'
import { AgentPanel } from './AgentPanel'
import { AgentProactiveToast } from './AgentProactiveToast'

export function AgentShell() {
  return (
    <>
      <AgentPanel />
      <AgentFab />
      <AgentProactiveToast />
    </>
  )
}
