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
  const isFireGoal = state.objectives.goal === 'fire'

  const items = [
    {
      label: `Capital em ${state.objectives.horizonYears} anos`,
      value: formatEuro(horizonProjection.totalValue)
    },
    {
      label: 'Retorno total estimado',
      value: formatEuro(horizonProjection.returns)
    },
    ...(isFireGoal && plan.yearsToFire
      ? [{ label: 'Anos até FIRE', value: `${plan.yearsToFire}` }]
      : []),
    {
      label: 'Renda passiva mensal estimada',
      value: formatEuro(passiveIncomeEstimate)
    },
    {
      label: 'Ratio total acumulado / investido',
      value: `${ratio.toFixed(2)}x`
    },
    {
      label: 'Se começasses 5 anos antes',
      value: `${formatEuro(earlyStartValue)} (${formatPercent(plan.annualReturn)} a.a.)`
    }
  ]

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 px-5 py-5 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <h3 className="theme-heading mb-5 text-sm font-bold uppercase tracking-[0.07em]">
        Indicadores-chave
      </h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <article
            key={item.label}
            className="group relative overflow-hidden rounded-xl border border-[#badcd2]/80
                       bg-gradient-to-br from-[#e0f2ef]/70 to-[#e0f2ef]/40 p-4
                       transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(1,75,53,0.12)]
                       dark:border-[#2b4e44] dark:from-[#13211d] dark:to-[#0f1715]"
          >
            <span
              className="absolute right-3 top-2 select-none text-5xl font-black
                         leading-none text-[#014b35]/5 dark:text-[#00ffb3]/5"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="relative text-xs font-semibold uppercase tracking-[0.07em] text-[#235a4a] dark:text-[#c7f8e9]">
              {item.label}
            </p>
            <p className="tabular-nums relative mt-3 text-2xl font-extrabold leading-none tracking-[-0.02em] text-[#014b35] dark:text-[#f3fff9]">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
