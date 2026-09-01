import type { RootCauseStat } from '../types'

export const ROOT_CAUSE_STATS: RootCauseStat[] = [
  { name: 'Provisioning configuration', exceptions: 126, engineeringHours: 84, customers: 198, revenueImpact: 18640 },
  { name: 'API timeout', exceptions: 84, engineeringHours: 61, customers: 142, revenueImpact: 9740 },
  { name: 'Inventory mismatch', exceptions: 61, engineeringHours: 39, customers: 88, revenueImpact: 6120 },
  { name: 'Billing/network synchronization', exceptions: 47, engineeringHours: 44, customers: 71, revenueImpact: 8340 },
  { name: 'LNP response failure', exceptions: 39, engineeringHours: 52, customers: 41, revenueImpact: 2870 },
  { name: 'Routing missing', exceptions: 31, engineeringHours: 28, customers: 214, revenueImpact: 11950 },
  { name: 'Invalid subscriber data', exceptions: 26, engineeringHours: 18, customers: 29, revenueImpact: 1610 },
  { name: 'Unknown', exceptions: 14, engineeringHours: 21, customers: 16, revenueImpact: 740 },
]
