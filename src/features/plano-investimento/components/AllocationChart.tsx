import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { AssetAllocation } from '../types'

interface AllocationChartProps {
  allocation: AssetAllocation
}

const ALLOCATION_META = [
  {
    key: 'globalETFs' as const,
    label: 'ETFs',
    color: 'var(--success)',
    examples: 'Mundiais, tecnológicos, de setores'
  },
  {
    key: 'bonds' as const,
    label: 'Obrigações',
    color: 'var(--chart-2)',
    examples: 'Curto e longo prazo'
  },
  {
    key: 'stocks' as const,
    label: 'Ações Individuais',
    color: 'var(--chart-1)',
    examples: 'Seleção da comunidade OGI'
  },
  {
    key: 'gold' as const,
    label: 'Ouro',
    color: 'var(--chart-3)',
    examples: 'Reserva de valor'
  },
  {
    key: 'reits' as const,
    label: 'REITs',
    color: 'var(--chart-5)',
    examples: 'Armazenamento, retalho'
  },
  {
    key: 'highRisk' as const,
    label: 'Alto Risco',
    color: 'var(--chart-4)',
    examples: 'Cripto e ativos especulativos'
  }
]

function PieTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="text-sm font-semibold text-[var(--foreground)]">{item.name}</p>
      <p className="tabular-nums mt-0.5 text-sm font-bold text-[var(--foreground)]">{item.value}%</p>
    </div>
  )
}

export function AllocationChart({ allocation }: AllocationChartProps) {
  const data = ALLOCATION_META.map((item) => ({
    name: item.label,
    value: allocation[item.key],
    color: item.color,
    examples: item.examples
  })).filter((entry) => entry.value > 0)

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 px-5 py-5 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <h3 className="theme-heading mb-4 text-sm font-bold uppercase tracking-[0.07em]">
        Alocação de ativos
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg border border-[#badcd2]/70
                         bg-[#e0f2ef]/50 px-3 py-2.5 transition-colors duration-150
                         hover:bg-[#e0f2ef] dark:border-[#2b4e44] dark:bg-[#13211d]/80
                         dark:hover:bg-[#1a2e28]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-[#014b35] dark:text-[#f3fff9]">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="tabular-nums text-sm font-bold text-[#014b35] dark:text-[#f3fff9]">
                  {item.value}%
                </span>
                <p className="mt-0.5 text-xs text-[#235a4a] dark:text-[#c7f8e9]">{item.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
