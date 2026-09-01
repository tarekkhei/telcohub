import {
  Activity,
  Building2,
  Calculator,
  Cloud,
  CreditCard,
  Database,
  FileCode,
  FolderSync,
  Globe,
  Hash,
  Headset,
  Layers,
  MessageSquare,
  Phone,
  Plug,
  Radio,
  ScrollText,
  Ticket,
  Webhook,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { ConnectorIconId } from '../../types/connectors'

const ICONS: Record<ConnectorIconId, LucideIcon> = {
  building: Building2,
  headset: Headset,
  ticket: Ticket,
  'credit-card': CreditCard,
  radio: Radio,
  phone: Phone,
  hash: Hash,
  calculator: Calculator,
  messages: MessageSquare,
  database: Database,
  activity: Activity,
  cloud: Cloud,
  plug: Plug,
  webhook: Webhook,
  'file-code': FileCode,
  'folder-sync': FolderSync,
  scroll: ScrollText,
  layers: Layers,
  globe: Globe,
  workflow: Workflow,
}

export function ConnectorIcon({
  name,
  className = 'h-5 w-5',
}: {
  name: ConnectorIconId
  className?: string
}) {
  const Icon = ICONS[name] ?? Plug
  return <Icon className={className} />
}
