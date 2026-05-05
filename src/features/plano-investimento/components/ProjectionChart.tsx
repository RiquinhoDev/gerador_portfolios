import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { formatEuro } from '../lib/format'
import type { Projection } from '../types'

interface ProjectionChartProps {
  projections: Projection[]
  fireNumber: number | null
}

export function ProjectionChart({ projections, fireNumber }: ProjectionChartProps) {
  const data = projections.map((point) => ({
    ...point,
    marker: [5, 10, 15, 20, 30].includes(point.year)
  }))

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 p-4 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <h3 className="theme-heading text-lg font-semibold">Projecao de crescimento</h3>
      <div className="mt-3 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 12, right: 12, top: 16, bottom: 8 }}>
            <defs>
              <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.65} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.25)" />
            <XAxis dataKey="year" tickFormatter={(year) => `${year}a`} />
            <YAxis tickFormatter={(value) => formatEuro(value)} width={95} />
            <Tooltip
              formatter={(value: number, name: string) => [formatEuro(value), name]}
              labelFormatter={(label) => `${label} anos`}
            />
            <Area
              type="monotone"
              dataKey="totalInvested"
              stackId="1"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.2}
              name="Capital investido"
            />
            <Area
              type="monotone"
              dataKey="returns"
              stackId="1"
              stroke="var(--chart-2)"
              fill="url(#returnsGradient)"
              name="Retorno"
            />
            {fireNumber ? (
              <ReferenceLine
                y={fireNumber}
                stroke="var(--chart-4)"
                strokeDasharray="6 6"
                label={{ value: 'Meta FIRE', position: 'insideTopRight' }}
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
