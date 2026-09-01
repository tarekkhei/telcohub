import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SAVED_CONVERSATIONS } from '../data/agentCatalog'
import { generateAgentReply, toAssistantMessage } from '../services/agentEngine'
import type { AgentConversation, AgentMode, ChatMessage, PageAgentContext } from '../types'

interface AgentState {
  open: boolean
  setOpen: (open: boolean) => void
  mode: AgentMode
  setMode: (mode: AgentMode) => void
  conversations: AgentConversation[]
  activeId: string
  messages: ChatMessage[]
  storyStep: string
  typing: boolean
  processLabel: string | null
  send: (text: string, pageContext: PageAgentContext) => void
  newConversation: () => void
  loadConversation: (id: string) => void
  proactive: ProactiveNote | null
  dismissProactive: () => void
  openWithPrompt: (text: string, pageContext: PageAgentContext) => void
}

export interface ProactiveNote {
  id: string
  title: string
  body: string
  metric: string
  primary: { label: string; intent: string }
  secondary: { label: string }
}

const FIRST_PROACTIVE: ProactiveNote = {
  id: 'pattern-404',
  title: 'Coreveo detected a new pattern',
  body: 'Provisioning HTTP 404 failures have increased 312% in the last 6 hours. 37 exceptions share the same endpoint. Potential systemic incident detected.',
  metric: '+312% in 6 hours',
  primary: { label: 'Investigate', intent: 'Why are wireless activations failing today?' },
  secondary: { label: 'Dismiss' },
}

const SECOND_PROACTIVE: ProactiveNote = {
  id: 'automation',
  title: 'Automation Opportunity',
  body: 'The same SIM reprovisioning procedure was manually approved 63 times this month. Would you like Coreveo to propose an automation policy?',
  metric: '21 hours/month potential',
  primary: { label: 'Review Opportunity', intent: 'Which issues could be automated safely?' },
  secondary: { label: 'Later' },
}

const AgentContext = createContext<AgentState | null>(null)

function emptyConversation(): AgentConversation {
  return {
    id: `conv-${Date.now()}`,
    title: 'New investigation',
    updatedAt: 'Just now',
    messages: [],
    storyStep: 'idle',
  }
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AgentMode>('ask')
  const [conversations, setConversations] = useState<AgentConversation[]>(() => [
    {
      id: 'conv-live',
      title: 'New investigation',
      updatedAt: 'Just now',
      messages: [],
      storyStep: 'idle',
    },
    ...SAVED_CONVERSATIONS,
  ])
  const [activeId, setActiveId] = useState('conv-live')
  const [typing, setTyping] = useState(false)
  const [processLabel, setProcessLabel] = useState<string | null>(null)
  const [proactive, setProactive] = useState<ProactiveNote | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => setProactive(FIRST_PROACTIVE), 4000)
    return () => window.clearTimeout(timer)
  }, [])

  const active = conversations.find((item) => item.id === activeId) ?? conversations[0]
  const messages = active?.messages ?? []
  const storyStep = active?.storyStep ?? 'idle'

  const persist = useCallback((id: string, updater: (conv: AgentConversation) => AgentConversation) => {
    setConversations((prev) => prev.map((item) => (item.id === id ? updater(item) : item)))
  }, [])

  const send = useCallback(
    (text: string, pageContext: PageAgentContext) => {
      const trimmed = text.trim()
      if (!trimmed || typing) return
      const convId = activeId
      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        blocks: [{ type: 'text', text: trimmed }],
        createdAt: new Date().toISOString(),
      }
      persist(convId, (conv) => ({
        ...conv,
        title: conv.messages.length === 0 ? trimmed.slice(0, 48) : conv.title,
        updatedAt: 'Just now',
        messages: [...conv.messages, userMessage],
      }))

      const generated = generateAgentReply(trimmed, pageContext, mode, storyStep)
      setTyping(true)
      const steps = generated.processSteps ?? []

      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []

      const finish = () => {
        setProcessLabel(null)
        setTyping(false)
        persist(convId, (conv) => ({
          ...conv,
          storyStep: generated.nextStoryStep ?? conv.storyStep,
          messages: [...conv.messages, toAssistantMessage(generated, `a-${Date.now()}`)],
        }))
      }

      if (steps.length === 0) {
        timers.current.push(window.setTimeout(finish, 420))
        return
      }

      steps.forEach((step, index) => {
        timers.current.push(
          window.setTimeout(() => setProcessLabel(step), index * 520),
        )
      })
      timers.current.push(window.setTimeout(finish, steps.length * 520 + 280))
    },
    [activeId, mode, persist, storyStep, typing],
  )

  const newConversation = useCallback(() => {
    const created = emptyConversation()
    setConversations((prev) => [created, ...prev])
    setActiveId(created.id)
    setProcessLabel(null)
    setTyping(false)
  }, [])

  const loadConversation = useCallback((id: string) => {
    setActiveId(id)
    setProcessLabel(null)
    setTyping(false)
  }, [])

  const openWithPrompt = useCallback(
    (text: string, pageContext: PageAgentContext) => {
      setOpen(true)
      window.setTimeout(() => send(text, pageContext), 80)
    },
    [send],
  )

  const value = useMemo(
    () => ({
      open,
      setOpen,
      mode,
      setMode,
      conversations,
      activeId,
      messages,
      storyStep,
      typing,
      processLabel,
      send,
      newConversation,
      loadConversation,
      proactive,
      dismissProactive: () => {
        setProactive((current) => {
          if (current?.id === 'pattern-404') {
            window.setTimeout(() => setProactive(SECOND_PROACTIVE), 10000)
          }
          return null
        })
      },
      openWithPrompt,
    }),
    [
      activeId,
      conversations,
      loadConversation,
      messages,
      mode,
      newConversation,
      open,
      openWithPrompt,
      processLabel,
      proactive,
      send,
      storyStep,
      typing,
    ],
  )

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
}

export function useAgent() {
  const ctx = useContext(AgentContext)
  if (!ctx) throw new Error('useAgent must be used within AgentProvider')
  return ctx
}
