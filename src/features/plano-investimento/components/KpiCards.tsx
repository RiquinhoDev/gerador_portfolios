import { computeFutureValue } from '../lib/calculations'
import { formatEuro, formatPercent } from '../lib/format'
import type { InvestmentPlan, WizardState } from '../types'

interface KpiCardsProps {
  state: WizardState
  plan: InvestmentPlan
}

function getHorizonProjection(plan: InvestmentPlan, horizonYears: number) {
  return (
    plan.projections.find((projection) => projection.year === horizonYears) ??
    plan.projections[plan.projections.length - 1]
  )
}

export function KpiCards({ state, plan }: KpiCardsProps) {
  const horizonProjection = getHorizonProjection(plan, state.objectives.horizonYears)
  const ratio =
    horizonProjection.totalInvested > 0
      ? horizonProjection.totalValue / horizonProjection.totalInvested
      : 0

  const earlyStartValue = computeFutureValue(
    state.userData.currentCapital ?? 0,
    state.userData.monthlyInvestment ?? 0,
    state.objectives.horizonYears + 5,
    plan.annualReturn
  )

  const passiveIncomeEstimate = (horizonProjection.totalValue * 0.04) / 12

  const items = [
    {
      label: `Capital em ${state.objectives.horizonYears} anos`,
      value: formatEuro(horizonProjection.totalValue)
    },
    {
      label: 'Retorno total estimado',
      value: formatEuro(horizonProjection.returns)
    },
    {
      label: 'Anos ate FIRE',
      value: plan.yearsToFire ? `${plan.yearsToFire}` : '-'
    },
    {
      label: 'Renda passiva mensal estimada',
      value: formatEuro(passiveIncomeEstimate)
    },
    {
      label: 'Ratio total acumulado / investido',
      value: `${ratio.toFixed(2)}x`
    },
    {
      label: 'Se comecasses 5 anos antes',
      value: `${formatEuro(earlyStartValue)} (${formatPercent(plan.annualReturn)} a.a.)`
    }
  ]

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 p-4 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <h3 className="theme-heading text-lg font-semibold">Resumo e KPIs</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className="rounded-xl border border-[#badcd2] bg-[#e0f2ef]/60 p-4 dark:border-[#2b4e44] dark:bg-[#13211d]"
          >
            <p className="text-xs uppercase tracking-wide text-[#235a4a] dark:text-[#c7f8e9]">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-[#014b35] dark:text-[#f3fff9]">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
