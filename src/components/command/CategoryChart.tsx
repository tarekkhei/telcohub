import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryCount } from '../../types'
import { Card, CardTitle } from '../ui/Card'

const COLORS = ['#2563eb', '#5b5ce0', '#0f766e', '#b45309', '#b91c1c', '#334e72', '#7c3aed', '#64748b']

export function CategoryChart({ data }: { data: CategoryCount[] }) {
  return (
    <Card>
      <CardTitle title="Exceptions by category" subtitle="Where failed business transactions concentrate." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr] md:grid-cols-[200px_1fr]">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={2}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-1.5">
          {data.map((item, index) => (
            <li key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-navy-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[index] }} />
                {item.name}
              </span>
              <span className="font-semibold text-navy-900">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
