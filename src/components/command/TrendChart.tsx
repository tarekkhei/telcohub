import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TrendPoint } from '../../types'
import { Card, CardTitle } from '../ui/Card'

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card>
      <CardTitle
        title="7-day exception trend"
        subtitle="Resolved volume rises as the agent reuses known operational patterns."
      />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e4ebf2" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#4a6a94', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4a6a94', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" name="Total exceptions" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="diagnosed" name="AI diagnosed" stroke="#5b5ce0" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="resolved" name="Automatically resolved" stroke="#15803d" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
