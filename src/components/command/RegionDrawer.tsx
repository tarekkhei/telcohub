import { Link } from 'react-router-dom'
import type { RegionHealth } from '../../types/ops'
import { Button } from '../ui/Button'
import { STATUS_META, StatusDot } from './regionStatus'

export function RegionDrawer({
  region,
  onClose,
}: {
  region: RegionHealth | null
  onClose: () => void
}) {
  if (!region) return null

  const meta = STATUS_META[region.status]
  const investigateHref =
    region.id === 'ontario' ? '/exceptions/EXC-2026-0146' : `/exceptions?region=${encodeURIComponent(region.name)}`

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-navy-950/30"
        aria-label="Close region drawer"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-navy-100 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-navy-100 px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-400">Region</p>
            <h2 className="mt-1 text-xl font-semibold text-navy-900">{region.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <StatusDot status={region.status} pulse={region.status === 'CRITICAL'} />
              <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-navy-500 hover:bg-navy-50 hover:text-navy-800"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <dl className="grid grid-cols-2 gap-3">
            <Metric label="Active Exceptions" value={String(region.activeExceptions)} />
            <Metric label="Customers Impacted" value={String(region.customersImpacted)} />
            <Metric label="Revenue at Risk" value={`$${region.mrrAtRisk.toLocaleString()}`} />
            <Metric label="Critical" value={String(region.criticalExceptions)} />
          </dl>

          {region.topExceptionPattern ? (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Top Exception Pattern</p>
              <p className="mt-1 text-sm font-medium text-navy-900">{region.topExceptionPattern}</p>
            </section>
          ) : null}

          {region.likelyTrigger ? (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Likely Cause</p>
              <p className="mt-1 text-sm text-navy-700">{region.likelyTrigger}</p>
            </section>
          ) : null}

          {region.aiConfidence ? (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">AI Confidence</p>
              <p className="mt-1 text-sm font-semibold text-ai">{region.aiConfidence}%</p>
            </section>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-navy-100 px-5 py-4">
          <Link to={investigateHref} onClick={onClose}>
            <Button variant="ai">Investigate</Button>
          </Link>
          <Link to={`/exceptions?region=${encodeURIComponent(region.name)}`} onClick={onClose}>
            <Button variant="secondary">View Exceptions</Button>
          </Link>
        </div>
      </aside>
    </>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-navy-100 bg-navy-50/60 px-3 py-2.5">
      <dt className="text-[11px] text-navy-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-navy-900">{value}</dd>
    </div>
  )
}
