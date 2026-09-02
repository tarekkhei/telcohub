import type { SimilarIncident } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function SimilarIncidents({ incidents }: { incidents: SimilarIncident[] }) {
  return (
    <Card padding={false}>
      <div className="px-5 pt-5">
        <CardTitle title="Similar incidents" subtitle="Organizational knowledge reused instead of starting from a blank ticket." />
      </div>
      <div className="divide-y divide-navy-50 md:hidden">
        {incidents.map((item) => (
          <div key={item.id} className="space-y-1 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-navy-900">{item.id}</p>
              <span className="text-xs font-semibold text-ai">{item.confidence}%</span>
            </div>
            <p className="text-xs text-navy-500">{item.date}</p>
            <p className="text-sm text-navy-700">{item.cause}</p>
            <p className="text-xs text-navy-600">{item.resolution}</p>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-y border-navy-100 bg-navy-50 text-[11px] uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-4 py-2 font-medium">Incident</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Cause</th>
              <th className="px-4 py-2 font-medium">Resolution</th>
              <th className="px-4 py-2 font-medium">Confidence match</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((item) => (
              <tr key={item.id} className="border-b border-navy-50">
                <td className="px-4 py-3 font-medium text-navy-900">{item.id}</td>
                <td className="px-4 py-3 text-navy-600">{item.date}</td>
                <td className="px-4 py-3 text-navy-700">{item.cause}</td>
                <td className="px-4 py-3 text-navy-700">{item.resolution}</td>
                <td className="px-4 py-3 font-semibold text-ai">{item.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
