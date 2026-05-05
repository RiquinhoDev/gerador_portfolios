import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { AssetAllocation } from '../types'

interface AllocationChartProps {
  allocation: AssetAllocation
}

const ALLOCATION_META = [
  {
    key: 'globalETFs' as const,
    label: 'ETFs Globais',
    color: 'var(--success)',
    examples: 'VWCE, IWDA'
  },
  {
    key: 'bonds' as const,
    label: 'Obrigacoes/Bonds',
    color: 'var(--chart-2)',
    examples: 'AGGH, EUNA'
  },
  {
    key: 'stocks' as const,
    label: 'Acoes Individuais',
    color: 'var(--chart-1)',
    examples: 'Selecao propria + comunidade OGI'
  },
  {
    key: 'gold' as const,
    label: 'Ouro',
    color: 'var(--chart-3)',
    examples: 'IGLN, GLD'
  },
  {
    key: 'reits' as const,
    label: 'REITs',
    color: 'var(--chart-5)',
    examples: 'IPRP, VNQ'
  },
  {
    key: 'highRisk' as const,
    label: 'Alto Risco',
    color: 'var(--chart-4)',
    examples: 'BTC, ETH (so percentual pequeno)'
  }
]

export function AllocationChart({ allocation }: AllocationChartProps) {
  const data = ALLOCATION_META.map((item) => ({
    name: item.label,
    value: allocation[item.key],
    color: item.color,
    examples: item.examples
  })).filter((entry) => entry.value > 0)

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 p-4 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <h3 className="theme-heading text-lg font-semibold">Alocacao de ativos</h3>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="h-72 w-full">
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
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {data.map((item) => (
            <details
              key={item.name}
              className="rounded-lg border border-[#badcd2] bg-[#e0f2ef]/65 p-3 dark:border-[#2b4e44] dark:bg-[#13211d]"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-[#014b35] dark:text-[#f3fff9]">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>
                <span>{item.value}%</span>
              </summary>
              <p className="mt-2 text-sm text-[#235a4a] dark:text-[#c7f8e9]">Exemplos: {item.examples}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
