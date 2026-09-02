import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ExceptionDetail } from '../../types'
import { SeverityBadge, SoftBadge, StatusBadge } from '../ui/Badge'

function formatDetected(iso: string) {
  return iso.replace('T', ' ').slice(0, 19)
}

export function ExceptionHeader({ detail }: { detail: ExceptionDetail }) {
  return (
    <div>
      <Link to="/exceptions" className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-navy-500 hover:text-navy-800">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to exceptions
      </Link>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-400">{detail.id}</p>
          <h1 className="mt-1 text-xl font-semibold text-navy-900 sm:text-2xl">{detail.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={detail.severity} />
          <StatusBadge status={detail.status} />
          <SoftBadge tone="ai">AI confidence {detail.aiConfidence}%</SoftBadge>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-navy-100 bg-white p-4 md:grid-cols-4 xl:grid-cols-7">
        <Meta label="Customer" value={detail.customerId} />
        <Meta label="MSISDN" value={detail.msisdn} />
        <Meta label="SIM" value={detail.sim} />
        <Meta label="Order" value={detail.orderId} />
        <Meta label="Detected" value={formatDetected(detail.detectedAt)} />
        <Meta label="Provider" value={detail.provider} />
        <Meta label="Region" value={detail.region} />
      </dl>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-navy-400">{label}</dt>
      <dd className="mt-1 break-all text-sm font-medium text-navy-800">{value}</dd>
    </div>
  )
}
