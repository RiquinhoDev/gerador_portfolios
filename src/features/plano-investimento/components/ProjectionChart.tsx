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
import type { InvestmentPlan } from '../types'

interface ProjectionChartProps {
  plan: InvestmentPlan
}

function ChartTooltipContent({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: number
}) {
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
          <span className="tabular-nums font-semibold text-[var(--foreground)]">
            {formatEuro(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ProjectionChart({ plan }: ProjectionChartProps) {
  const { scenarios, projections, extendedProjections, fireNumber, withdrawalRate } = plan

  const withinYears = new Set(projections.map((p) => p.year))

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 px-5 py-5 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="theme-heading text-sm font-bold uppercase tracking-[0.07em]">
          Projeção de crescimento
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#235a4a] dark:text-[#a0d8c8]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#e87b3a] opacity-60" />
            Cenário prudente
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: 'var(--chart-2)' }} />
            Cenário base
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#1ea37a]" />
            Cenário otimista
          </span>
        </div>
      </div>
      <p className="theme-muted mb-3 text-xs">
        Prudente/otimista = taxa base ±2%. Valores líquidos de inflação e impostos estimados.
      </p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={scenarios} margin={{ left: 8, right: 16, top: 16, bottom: 0 }}>
            <defs>
              <linearGradient id="prudentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e87b3a" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#e87b3a" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="optimisticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1ea37a" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#1ea37a" stopOpacity={0.08} />
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
              dataKey="prudent"
              stroke="#e87b3a"
              strokeWidth={1.5}
              fill="url(#prudentGrad)"
              name="Prudente"
            />
            <Area
              type="monotone"
              dataKey="base"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#baseGrad)"
              name="Base"
            />
            <Area
              type="monotone"
              dataKey="optimistic"
              stroke="#1ea37a"
              strokeWidth={1.5}
              fill="url(#optimisticGrad)"
              name="Otimista"
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

      {/* Tabela: dentro do horizonte */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[320px] text-xs">
          <thead>
            <tr className="border-b border-[#badcd2]/60 dark:border-[#2b4e44]/60">
              <th className="pb-2 text-left font-semibold text-[#235a4a] dark:text-[#a0d8c8]">
                Ano
              </th>
              <th className="pb-2 text-right font-semibold text-[#235a4a] dark:text-[#a0d8c8]">
                Capital (base)
              </th>
              <th className="pb-2 text-right font-semibold text-[#235a4a] dark:text-[#a0d8c8]">
                Rendimento mensal
              </th>
            </tr>
          </thead>
          <tbody>
            {projections.map((p) => (
              <tr
                key={p.year}
                className="border-b border-[#badcd2]/30 last:border-0 dark:border-[#2b4e44]/30"
              >
                <td className="py-2 text-[#014b35] dark:text-[#f3fff9]">{p.year} anos</td>
                <td className="tabular-nums py-2 text-right font-medium text-[#014b35] dark:text-[#f3fff9]">
                  {formatEuro(p.totalValue)}
                </td>
                <td className="tabular-nums py-2 text-right font-semibold text-[#1ea37a]">
                  {formatEuro((p.totalValue * withdrawalRate) / 12)}/mês
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[11px] text-[#235a4a]/60 dark:text-[#a0d8c8]/50">
          Rendimento mensal calculado pela taxa de levantamento do teu perfil ({(withdrawalRate * 100).toFixed(1)}%) — retirada sustentável sem esgotar o capital.
        </p>
      </div>

      {/* Tabela: além do horizonte */}
      {extendedProjections.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <p className="mb-2 text-xs font-semibold text-[#235a4a] dark:text-[#a0d8c8]">
            E se continuasses a investir após o horizonte?
          </p>
          <table className="w-full min-w-[320px] text-xs">
            <thead>
              <tr className="border-b border-[#badcd2]/40 dark:border-[#2b4e44]/40">
                <th className="pb-2 text-left font-medium text-[#235a4a]/70 dark:text-[#a0d8c8]/70">
                  Ano
                </th>
                <th className="pb-2 text-right font-medium text-[#235a4a]/70 dark:text-[#a0d8c8]/70">
                  Capital (base)
                </th>
                <th className="pb-2 text-right font-medium text-[#235a4a]/70 dark:text-[#a0d8c8]/70">
                  Rendimento mensal
                </th>
              </tr>
            </thead>
            <tbody>
              {extendedProjections.map((p) => (
                <tr
                  key={p.year}
                  className="border-b border-[#badcd2]/20 last:border-0 dark:border-[#2b4e44]/20"
                >
                  <td className="py-2 text-[#235a4a]/70 dark:text-[#a0d8c8]/70">
                    {p.year} anos
                  </td>
                  <td className="tabular-nums py-2 text-right font-medium text-[#235a4a]/70 dark:text-[#a0d8c8]/70">
                    {formatEuro(p.totalValue)}
                  </td>
                  <td className="tabular-nums py-2 text-right font-semibold text-[#1ea37a]/70">
                    {formatEuro((p.totalValue * withdrawalRate) / 12)}/mês
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
