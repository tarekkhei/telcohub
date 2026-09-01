import { Link } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BLAST_RADIUS_REGIONS } from '../../data/kpis'
import { Button } from '../ui/Button'
import { Card, CardTitle } from '../ui/Card'

export function BlastRadius({ relatedCount }: { relatedCount: number }) {
  return (
    <Card>
      <CardTitle
        title="Related impact identified"
        subtitle="Coreveo identifies systemic issues — not a single ticket."
      />
      <p className="text-sm text-navy-700">
        Coreveo AI found <span className="font-semibold">{relatedCount} failed activations</span> using the same
        provisioning endpoint, in a 6-hour window, across 4 service plans and 3 geographic regions.
      </p>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={BLAST_RADIUS_REGIONS} layout="vertical" margin={{ left: 16 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#1a2b45', fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Link to="/exceptions?related=provisioning">
        <Button variant="secondary" className="mt-2">
          View all related exceptions
        </Button>
      </Link>
    </Card>
  )
}
