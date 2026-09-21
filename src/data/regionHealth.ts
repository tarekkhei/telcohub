import type { RegionHealth, RegionSystem } from '../types/ops'

function systems(
  items: Array<Omit<RegionSystem, 'id'> & { id?: string }>,
): RegionSystem[] {
  return items.map((item, index) => ({
    id: item.id ?? `sys-${index}`,
    name: item.name,
    role: item.role,
    status: item.status,
    exceptions: item.exceptions,
    detail: item.detail,
    offsetLat: item.offsetLat,
    offsetLng: item.offsetLng,
  }))
}

export const REGION_HEALTH_BASE: RegionHealth[] = [
  {
    id: 'ontario',
    name: 'Ontario',
    country: 'Canada',
    status: 'CRITICAL',
    latitude: 50.0,
    longitude: -85.0,
    activeExceptions: 42,
    criticalExceptions: 9,
    customersImpacted: 73,
    mrrAtRisk: 18450,
    topExceptionPattern: 'HSS Subscriber Creation Failure',
    aiConfidence: 96,
    likelyTrigger: 'Provisioning configuration change',
    recommendedAction: 'Validate HSS endpoint configuration and run controlled retry',
    affectedServices: ['Wireless Activation', 'Mobile', 'eSIM'],
    recentChanges: ['Provisioning service v2.8', 'HSS endpoint config update'],
    topRootCauses: ['Incorrect HSS subscriber creation endpoint', 'Provisioning timeout'],
    systems: systems([
      { name: 'Ordering API', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 2.2, offsetLng: -3.5, detail: 'Orders completing normally' },
      { name: 'MIND Billing', role: 'Billing / BSS', status: 'healthy', exceptions: 0, offsetLat: 1.4, offsetLng: 3.2, detail: 'Accounts ACTIVE' },
      { name: 'SIM Inventory', role: 'Inventory', status: 'healthy', exceptions: 1, offsetLat: -1.8, offsetLng: -2.8, detail: 'Assignments OK' },
      { name: 'Provisioning svc', role: 'Provisioning', status: 'faulty', exceptions: 38, offsetLat: -2.4, offsetLng: 2.6, detail: 'HTTP 404 on HSS create' },
      { name: 'Titan HSS', role: 'Network / HSS', status: 'faulty', exceptions: 36, offsetLat: 0.6, offsetLng: 4.8, detail: 'Subscriber NOT FOUND' },
      { name: 'Network Core', role: 'Network', status: 'degraded', exceptions: 9, offsetLat: -3.2, offsetLng: -0.4, detail: 'Activations blocked downstream' },
    ]),
  },
  {
    id: 'quebec',
    name: 'Quebec',
    country: 'Canada',
    status: 'DEGRADED',
    latitude: 52.0,
    longitude: -72.0,
    activeExceptions: 18,
    criticalExceptions: 3,
    customersImpacted: 21,
    mrrAtRisk: 4210,
    topExceptionPattern: 'DID Routing Delay',
    aiConfidence: 88,
    likelyTrigger: 'Routing publish lag after inventory assignment',
    recommendedAction: 'Re-publish DID routes for affected number blocks',
    affectedServices: ['DID Provisioning', 'VoIP'],
    recentChanges: ['Switch route table refresh'],
    topRootCauses: ['Missing inbound route', 'Number inventory mismatch'],
    systems: systems([
      { name: 'Ordering API', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.8, offsetLng: -2.4 },
      { name: 'Number Inventory', role: 'Inventory', status: 'healthy', exceptions: 2, offsetLat: 1.2, offsetLng: 2.8, detail: 'DIDs assigned' },
      { name: 'Softswitch QC', role: 'Routing', status: 'faulty', exceptions: 14, offsetLat: -2.0, offsetLng: 2.2, detail: 'Route publish incomplete' },
      { name: 'Billing QC', role: 'Billing / BSS', status: 'healthy', exceptions: 0, offsetLat: -1.6, offsetLng: -2.6 },
      { name: 'Inbound Test', role: 'Verification', status: 'degraded', exceptions: 3, offsetLat: 0.4, offsetLng: 4.0, detail: 'Tests failing for unrouted DIDs' },
    ]),
  },
  {
    id: 'alberta',
    name: 'Alberta',
    country: 'Canada',
    status: 'HEALTHY',
    latitude: 55.0,
    longitude: -115.0,
    activeExceptions: 3,
    criticalExceptions: 0,
    customersImpacted: 1,
    mrrAtRisk: 0,
    topExceptionPattern: 'Isolated SIM assignment delay',
    aiConfidence: 72,
    affectedServices: ['Wireless Activation'],
    topRootCauses: ['Transient inventory lock'],
    systems: systems([
      { name: 'Ordering API', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.6, offsetLng: -2.2 },
      { name: 'SIM Inventory', role: 'Inventory', status: 'degraded', exceptions: 2, offsetLat: -1.4, offsetLng: 2.4, detail: 'Transient lock' },
      { name: 'Provisioning AB', role: 'Provisioning', status: 'healthy', exceptions: 1, offsetLat: -2.0, offsetLng: -1.6 },
      { name: 'Titan HSS', role: 'Network / HSS', status: 'healthy', exceptions: 0, offsetLat: 1.0, offsetLng: 3.0 },
    ]),
  },
  {
    id: 'british-columbia',
    name: 'British Columbia',
    country: 'Canada',
    status: 'HEALTHY',
    latitude: 54.0,
    longitude: -125.0,
    activeExceptions: 2,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    topExceptionPattern: 'No systemic pattern',
    aiConfidence: 65,
    affectedServices: ['Wireless Activation'],
    systems: systems([
      { name: 'Ordering API', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.5, offsetLng: -2.0 },
      { name: 'Provisioning BC', role: 'Provisioning', status: 'healthy', exceptions: 1, offsetLat: -1.8, offsetLng: 2.2 },
      { name: 'Network Core', role: 'Network', status: 'healthy', exceptions: 1, offsetLat: 0.8, offsetLng: 3.2 },
    ]),
  },
  {
    id: 'us-northeast',
    name: 'Northeast',
    country: 'United States',
    status: 'HEALTHY',
    latitude: 42.0,
    longitude: -74.0,
    activeExceptions: 2,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    systems: systems([
      { name: 'Ordering NE', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.2, offsetLng: -1.8 },
      { name: 'Provisioning NE', role: 'Provisioning', status: 'healthy', exceptions: 1, offsetLat: -1.4, offsetLng: 1.6 },
      { name: 'HSS NE', role: 'Network / HSS', status: 'healthy', exceptions: 1, offsetLat: 0.6, offsetLng: 2.4 },
    ]),
  },
  {
    id: 'us-midwest',
    name: 'Midwest',
    country: 'United States',
    status: 'HEALTHY',
    latitude: 41.5,
    longitude: -93.0,
    activeExceptions: 1,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    systems: systems([
      { name: 'Ordering MW', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.0, offsetLng: -1.6 },
      { name: 'Billing MW', role: 'Billing / BSS', status: 'healthy', exceptions: 1, offsetLat: -1.2, offsetLng: 1.8 },
    ]),
  },
  {
    id: 'us-west',
    name: 'West',
    country: 'United States',
    status: 'DEGRADED',
    latitude: 37.5,
    longitude: -119.0,
    activeExceptions: 9,
    criticalExceptions: 1,
    customersImpacted: 8,
    mrrAtRisk: 2100,
    topExceptionPattern: 'eSIM QR Activation Failed',
    aiConfidence: 84,
    likelyTrigger: 'QR delivery latency spike',
    recommendedAction: 'Retry QR activation for impacted subscribers',
    affectedServices: ['eSIM Activation'],
    topRootCauses: ['QR assigned / not activated'],
    systems: systems([
      { name: 'Ordering West', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.6, offsetLng: -2.4 },
      { name: 'eSIM Platform', role: 'eSIM', status: 'faulty', exceptions: 7, offsetLat: -1.8, offsetLng: 2.0, detail: 'QR download failures' },
      { name: 'SM-DP+', role: 'eSIM', status: 'degraded', exceptions: 4, offsetLat: 0.8, offsetLng: 3.4, detail: 'Delivery latency' },
      { name: 'Billing West', role: 'Billing / BSS', status: 'healthy', exceptions: 0, offsetLat: -2.2, offsetLng: -1.8 },
      { name: 'Network West', role: 'Network', status: 'healthy', exceptions: 1, offsetLat: 2.0, offsetLng: 1.2 },
    ]),
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    country: 'United Kingdom',
    status: 'HEALTHY',
    latitude: 54.0,
    longitude: -2.0,
    activeExceptions: 1,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    systems: systems([
      { name: 'Ordering UK', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.0, offsetLng: -1.4 },
      { name: 'Provisioning UK', role: 'Provisioning', status: 'healthy', exceptions: 1, offsetLat: -1.2, offsetLng: 1.6 },
    ]),
  },
  {
    id: 'france',
    name: 'France',
    country: 'France',
    status: 'HEALTHY',
    latitude: 46.5,
    longitude: 2.5,
    activeExceptions: 0,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    systems: systems([
      { name: 'Ordering FR', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.0, offsetLng: -1.2 },
      { name: 'HSS FR', role: 'Network / HSS', status: 'healthy', exceptions: 0, offsetLat: -1.0, offsetLng: 1.4 },
    ]),
  },
  {
    id: 'germany',
    name: 'Germany',
    country: 'Germany',
    status: 'HEALTHY',
    latitude: 51.0,
    longitude: 10.0,
    activeExceptions: 0,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    systems: systems([
      { name: 'Ordering DE', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.0, offsetLng: -1.2 },
      { name: 'Provisioning DE', role: 'Provisioning', status: 'healthy', exceptions: 0, offsetLat: -1.0, offsetLng: 1.4 },
    ]),
  },
  {
    id: 'morocco',
    name: 'Morocco',
    country: 'Morocco',
    status: 'HEALTHY',
    latitude: 32.0,
    longitude: -6.0,
    activeExceptions: 0,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    systems: systems([
      { name: 'Ordering MA', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 1.0, offsetLng: -1.2 },
      { name: 'Network MA', role: 'Network', status: 'healthy', exceptions: 0, offsetLat: -1.0, offsetLng: 1.4 },
    ]),
  },
  {
    id: 'australia',
    name: 'Australia',
    country: 'Australia',
    status: 'HEALTHY',
    latitude: -25.0,
    longitude: 134.0,
    activeExceptions: 0,
    criticalExceptions: 0,
    customersImpacted: 0,
    mrrAtRisk: 0,
    systems: systems([
      { name: 'Ordering AU', role: 'Ordering', status: 'healthy', exceptions: 0, offsetLat: 2.0, offsetLng: -2.0 },
      { name: 'Provisioning AU', role: 'Provisioning', status: 'healthy', exceptions: 0, offsetLat: -2.0, offsetLng: 2.0 },
    ]),
  },
]

export function applyOntarioRecovery(regions: RegionHealth[], verifiedHeroCount: number): RegionHealth[] {
  return regions.map((region) => {
    if (region.id !== 'ontario') return region
    if (verifiedHeroCount >= 3) {
      return {
        ...region,
        status: 'HEALTHY',
        activeExceptions: 4,
        criticalExceptions: 0,
        customersImpacted: 2,
        mrrAtRisk: 0,
        topExceptionPattern: 'Residual cleanup in progress',
        systems: region.systems?.map((system) =>
          system.name === 'Provisioning svc' || system.name === 'Titan HSS' || system.name === 'Network Core'
            ? { ...system, status: 'healthy' as const, exceptions: system.name === 'Provisioning svc' ? 2 : 1, detail: 'Recovered' }
            : system,
        ),
      }
    }
    if (verifiedHeroCount >= 1) {
      return {
        ...region,
        status: 'DEGRADED',
        activeExceptions: 18,
        criticalExceptions: 2,
        customersImpacted: 21,
        mrrAtRisk: 6200,
        topExceptionPattern: 'Wireless Activation / HSS Provisioning (recovering)',
        systems: region.systems?.map((system) => {
          if (system.name === 'Provisioning svc') {
            return { ...system, status: 'degraded' as const, exceptions: 12, detail: 'Endpoint corrected · residual retries' }
          }
          if (system.name === 'Titan HSS') {
            return { ...system, status: 'degraded' as const, exceptions: 8, detail: 'Subscribers recovering' }
          }
          if (system.name === 'Network Core') {
            return { ...system, status: 'healthy' as const, exceptions: 2, detail: 'Activations resuming' }
          }
          return system
        }),
      }
    }
    return region
  })
}
