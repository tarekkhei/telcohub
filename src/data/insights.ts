import type { InsightCard } from '../types'
import { HERO_EXCEPTION_ID } from './constants'

export const INSIGHTS: InsightCard[] = [
  {
    id: 'ins-emerging',
    type: 'emerging',
    title: 'Emerging Incident Pattern',
    body: 'Provisioning HTTP 404 errors increased 312% in the last 6 hours. 38 customer activations are potentially affected by the same endpoint.',
    metric: '+312% in 6 hours',
    cta: 'Investigate',
    href: `/exceptions/${HERO_EXCEPTION_ID}`,
  },
  {
    id: 'ins-manual',
    type: 'manual',
    title: 'Repeated Manual Resolution',
    body: '17 engineers manually performed the same SIM reprovisioning process 63 times this month. Coreveo recommends a supervised automation policy.',
    metric: '21 hours/month potential savings',
    cta: 'Review pattern',
    href: '/knowledge',
  },
  {
    id: 'ins-revenue',
    type: 'revenue',
    title: 'Revenue Risk',
    body: '14 services appear active in the network but inactive in billing. Estimated potential leakage is $4,380/month.',
    metric: '$4,380 / month',
    cta: 'Investigate',
    href: '/services',
  },
  {
    id: 'ins-preventable',
    type: 'preventable',
    title: 'Preventable Exceptions',
    body: '31% of provisioning failures this month were caused by only 3 recurring configuration issues.',
    metric: '92 exceptions/month potential reduction',
    cta: 'View root causes',
    href: '/root-causes',
  },
]
