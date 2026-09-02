import { useState } from 'react'
import { SoftBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { TableSkeleton } from '../components/ui/Skeleton'
import { SERVICE_LABELS } from '../data/constants'
import { useAsyncData } from '../hooks/useAsyncData'
import { mockApi } from '../services/mockApi'

function isMismatch(billing: string, provisioning: string, network: string) {
  return !(billing === 'Active' && provisioning === 'Completed' && network === 'Active')
}

export function Services() {
  const [query, setQuery] = useState('')
  const result = useAsyncData(() => mockApi.listServices(query), [query])

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Service explorer"
        title="Services"
        subtitle="Customer and service state across billing, provisioning and network. Mismatches are the exception."
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search customer, MSISDN, SIM, account or plan"
        className="w-full max-w-xl rounded-lg border border-navy-200 bg-white px-3 py-2 text-base outline-none focus:border-accent focus:ring-2 focus:ring-blue-100 md:text-sm"
      />
      {result.loading || !result.data ? (
        <TableSkeleton rows={10} />
      ) : result.data.length === 0 ? (
        <EmptyState title="No services found" description="Try another customer or MSISDN in the synthetic catalog." />
      ) : (
        <Card padding={false}>
          <div className="divide-y divide-navy-50 md:hidden">
            {result.data.map((row) => {
              const mismatch = isMismatch(row.billingState, row.provisioningState, row.networkState)
              return (
                <div key={row.id} className={`space-y-2 px-4 py-3 ${mismatch ? 'bg-danger-soft/40' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{row.customerId}</p>
                      <p className="text-xs text-navy-500">{row.msisdn}</p>
                    </div>
                    {mismatch ? <SoftBadge tone="navy">State mismatch</SoftBadge> : <SoftBadge tone="success">Aligned</SoftBadge>}
                  </div>
                  <p className="text-xs text-navy-600">
                    {row.servicePlan} · {SERVICE_LABELS[row.service]}
                  </p>
                  <dl className="grid grid-cols-3 gap-2 text-[11px] text-navy-600">
                    <div>
                      <dt className="text-navy-400">Billing</dt>
                      <dd className="font-medium text-navy-800">{row.billingState}</dd>
                    </div>
                    <div>
                      <dt className="text-navy-400">Provisioning</dt>
                      <dd className="font-medium text-navy-800">{row.provisioningState}</dd>
                    </div>
                    <div>
                      <dt className="text-navy-400">Network</dt>
                      <dd className="font-medium text-navy-800">{row.networkState}</dd>
                    </div>
                  </dl>
                </div>
              )
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="border-b border-navy-100 bg-navy-50 text-[11px] uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Customer</th>
                  <th className="px-4 py-2.5 font-medium">MSISDN</th>
                  <th className="px-4 py-2.5 font-medium">SIM</th>
                  <th className="px-4 py-2.5 font-medium">Account</th>
                  <th className="px-4 py-2.5 font-medium">Service plan</th>
                  <th className="px-4 py-2.5 font-medium">Billing</th>
                  <th className="px-4 py-2.5 font-medium">Provisioning</th>
                  <th className="px-4 py-2.5 font-medium">Network</th>
                  <th className="px-4 py-2.5 font-medium">Active exceptions</th>
                  <th className="px-4 py-2.5 font-medium">Signal</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((row) => {
                  const mismatch = isMismatch(row.billingState, row.provisioningState, row.networkState)
                  return (
                    <tr key={row.id} className={`border-b border-navy-50 ${mismatch ? 'bg-danger-soft/40' : ''}`}>
                      <td className="px-4 py-3 font-medium text-navy-900">{row.customerId}</td>
                      <td className="px-4 py-3 text-navy-700">{row.msisdn}</td>
                      <td className="px-4 py-3 text-navy-600">{row.sim}</td>
                      <td className="px-4 py-3 text-navy-700">{row.account}</td>
                      <td className="px-4 py-3 text-navy-700">
                        {row.servicePlan}
                        <span className="ml-2 text-xs text-navy-400">{SERVICE_LABELS[row.service]}</span>
                      </td>
                      <td className="px-4 py-3">{row.billingState}</td>
                      <td className="px-4 py-3">{row.provisioningState}</td>
                      <td className="px-4 py-3">{row.networkState}</td>
                      <td className="px-4 py-3">{row.activeExceptions}</td>
                      <td className="px-4 py-3">
                        {mismatch ? <SoftBadge tone="navy">State mismatch</SoftBadge> : <SoftBadge tone="success">Aligned</SoftBadge>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
