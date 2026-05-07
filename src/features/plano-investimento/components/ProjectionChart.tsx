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

function ChartTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: number }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 shadow-lg backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-semibold text-[var(--foreground)]">{label} anos</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[var(--foreground)]">{entry.name}</span>
          </span>
          <span className="tabular-nums font-semibold text-[var(--foreground)]">{formatEuro(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function ProjectionChart({ projections, fireNumber }: ProjectionChartProps) {
  const data = projections.map((point) => ({
    ...point,
    marker: [5, 10, 15, 20, 30].includes(point.year)
  }))

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 px-5 py-5 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="theme-heading text-sm font-bold uppercase tracking-[0.07em]">
          Projeção de crescimento
        </h3>
        <div className="flex items-center gap-4 text-xs text-[#235a4a] dark:text-[#a0d8c8]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--chart-1)', opacity: 0.7 }} />
            O que investes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--chart-2)' }} />
            Ganhos dos juros compostos
          </span>
        </div>
      </div>
      <p className="theme-muted mb-3 text-xs">O total da barra = capital investido + retorno acumulado.</p>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 8, right: 16, top: 16, bottom: 0 }}>
            <defs>
              <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.65} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(year) => `${year}a`}
              tick={{ fontSize: 11, fontFamily: 'Montserrat', fill: 'var(--foreground)', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatEuro(value)}
              width={90}
              tick={{ fontSize: 11, fontFamily: 'Montserrat', fill: 'var(--foreground)', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltipContent />} />
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
                strokeDasharray="5 4"
                strokeWidth={1.5}
                label={{
                  value: 'Meta FIRE',
                  position: 'insideTopRight',
                  fill: 'var(--chart-4)',
                  fontSize: 11,
                  fontFamily: 'Montserrat',
                  fontWeight: 600
                }}
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
