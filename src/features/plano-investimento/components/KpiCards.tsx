import { computeFutureValue } from '../lib/calculations'
import { formatEuro, formatPercent } from '../lib/format'
import type { InvestmentPlan, WizardState } from '../types'

interface KpiCardsProps {
  state: WizardState
  plan: InvestmentPlan
}

function getHorizonProjection(plan: InvestmentPlan, horizonYears: number) {
  return (
    plan.projections.find((p) => p.year === horizonYears) ??
    plan.projections[plan.projections.length - 1]
  )
}

export function KpiCards({ state, plan }: KpiCardsProps) {
  const { objectives, userData } = state
  const horizonProjection = getHorizonProjection(plan, objectives.horizonYears)
  const currentCapital = userData.currentCapital ?? 0
  const monthlyInvestment = userData.monthlyInvestment ?? 0
  const monthlyIncome = userData.monthlyIncome ?? 0

  const ratio =
    horizonProjection.totalInvested > 0
      ? horizonProjection.totalValue / horizonProjection.totalInvested
      : 0

  // P9 fix: "tivesses começado 5 anos mais cedo" — mesmos inputs, horizonte+5
  const earlyStartValue = computeFutureValue(
    currentCapital,
    monthlyInvestment,
    objectives.horizonYears + 5,
    plan.annualReturn
  )

  // P10 fix: cenário B — capital fica parado 1 ano, depois investe horizonYears-1
  const costOfWaiting =
    objectives.horizonYears > 1
      ? horizonProjection.totalValue -
        computeFutureValue(
          currentCapital,
          monthlyInvestment,
          objectives.horizonYears - 1,
          plan.annualReturn
        )
      : null

  const savingsRate =
    monthlyIncome > 0 ? (monthlyInvestment / monthlyIncome) * 100 : null

  // rendimento mensal no horizonte com taxa ajustada ao perfil (P6)
  const monthlyIncomeAtHorizon = (horizonProjection.totalValue * plan.withdrawalRate) / 12

  const isFireGoal = objectives.goal === 'fire'
  const isPassiveGoal = objectives.goal === 'passive_income'

  const items = [
    {
      label: `Capital em ${objectives.horizonYears} anos`,
      value: formatEuro(horizonProjection.totalValue),
      note: 'Total acumulado no final do horizonte (investido + juros compostos)'
    },
    {
      label: 'Ganhos dos juros compostos',
      value: formatEuro(horizonProjection.returns),
      note: `Do total, ${formatEuro(horizonProjection.totalInvested)} és tu a investir; o resto é o efeito dos juros`
    },
    ...(isFireGoal && plan.yearsToFire
      ? [
          {
            label: 'Anos até independência financeira',
            value: `${plan.yearsToFire} anos`,
            note: `Estimativa até atingires os ${plan.fireNumber ? formatEuro(plan.fireNumber) : '—'} necessários para a independência`
          }
        ]
      : []),
    ...(isPassiveGoal && plan.yearsToPassiveIncome
      ? [
          {
            label: 'Anos até atingires a meta',
            value: `${plan.yearsToPassiveIncome} anos`,
            note: `Estimativa até gerares os ${objectives.passiveMonthlyTarget ? formatEuro(objectives.passiveMonthlyTarget) : '—'}/mês que definiste`
          }
        ]
      : []),
    {
      label: isFireGoal ? 'Rendimento mensal na independência' : 'Rendimento extra mensal',
      value: formatEuro(monthlyIncomeAtHorizon),
      note: `Regra dos ${(plan.withdrawalRate * 100).toFixed(1)}%: retirada sustentável sem esgotar o capital`
    },
    {
      label: 'Multiplicador do investimento',
      value: `${ratio.toFixed(2)}x`,
      note: 'Por cada euro investido, recebes este múltiplo de volta no final'
    },
    {
      label: 'Se tivesses começado 5 anos mais cedo',
      value: formatEuro(earlyStartValue),
      note: `Resultado estimado com o mesmo plano mas iniciado 5 anos antes — a ${formatPercent(plan.annualReturn)} a.a. o tempo é o teu maior aliado`
    },
    ...(savingsRate !== null
      ? [
          {
            label: 'Taxa de poupança',
            value: `${savingsRate.toFixed(1)}%`,
            note:
              savingsRate >= 20
                ? 'Excelente — estás acima dos 20% recomendados pela maioria dos planos financeiros'
                : savingsRate >= 10
                  ? 'Bom ponto de partida — tenta aumentar gradualmente até atingir 20% do rendimento'
                  : 'Tenta aumentar progressivamente — mesmo pequenos aumentos têm grande impacto a longo prazo'
          }
        ]
      : []),
    ...(costOfWaiting !== null
      ? [
          {
            label: 'Custo de adiar 1 ano',
            value: formatEuro(costOfWaiting),
            note: 'Diferença entre começar hoje e começar daqui a 1 ano com o mesmo plano — cada mês conta'
          }
        ]
      : [])
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
            {item.note && (
              <p className="relative mt-2 text-xs leading-relaxed text-[#235a4a]/80 dark:text-[#a0d8c8]/80">
                {item.note}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
