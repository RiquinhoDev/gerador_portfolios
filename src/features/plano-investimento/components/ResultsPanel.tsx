import { AllocationChart } from './AllocationChart'
import { KpiCards } from './KpiCards'
import { NextSteps } from './NextSteps'
import { ProfileComparison } from './ProfileComparison'
import { ProjectionChart } from './ProjectionChart'
import { formatEuro, formatPercent } from '../lib/format'
import { PROFILE_DESCRIPTIONS, PROFILE_LABELS } from '../lib/profiles'
import type { InvestmentPlan, WizardState } from '../types'

interface ResultsPanelProps {
  state: WizardState
  plan: InvestmentPlan
  onReset: () => void
}

const GOAL_LABELS: Record<string, string> = {
  accumulation: 'Acumulação de capital',
  passive_income: 'Rendimento passivo',
  fire: 'Liberdade financeira (FIRE)'
}

export function ResultsPanel({ state, plan, onReset }: ResultsPanelProps) {
  const { userData, objectives } = state
  const profileLabel = PROFILE_LABELS[plan.profile.adjustedProfile]
  const profileDescription = PROFILE_DESCRIPTIONS[plan.profile.adjustedProfile]
  const isFireGoal = objectives.goal === 'fire'

  const summaryRows: [string, string][] = [
    ['Nome', userData.name || 'Sem nome'],
    ['Idade', String(userData.age ?? '-')],
    ['Rendimento mensal líquido', userData.monthlyIncome != null ? formatEuro(userData.monthlyIncome) : '-'],
    ['Capital já investido', userData.currentCapital != null ? formatEuro(userData.currentCapital) : formatEuro(0)],
    ['Objetivo', objectives.goal ? (GOAL_LABELS[objectives.goal] ?? objectives.goal) : '-'],
    ['Horizonte Temporal', `${objectives.horizonYears} anos`],
    ['Investimento mensal', userData.monthlyInvestment != null ? formatEuro(userData.monthlyInvestment) : '-'],
    ['Retorno anual efetivo', formatPercent(plan.annualReturn)],
    ...(isFireGoal
      ? [
          ['Meta FIRE', plan.fireNumber ? formatEuro(plan.fireNumber) : '-'] as [string, string],
          ['Anos estimados até FIRE', String(plan.yearsToFire ?? '-')] as [string, string]
        ]
      : [])
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="theme-heading text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">
          Resultado do teu plano
        </h2>
        <p className="theme-muted mt-2 text-sm leading-relaxed">
          Perfil, alocação e projeções calculadas com base nas tuas respostas.
        </p>
      </div>

      <div className="rounded-xl border border-[#badcd2]/60 bg-[#e0f2ef]/40 px-4 py-3 dark:border-[#2b4e44]/60 dark:bg-[#13211d]/60">
        <p className="text-xs leading-relaxed text-[#235a4a] dark:text-[#a0d8c8]">
          <strong className="theme-heading">Nota legal:</strong> Esta ferramenta é educativa e não
          constitui aconselhamento financeiro. Consulta um profissional qualificado antes de investir.
        </p>
      </div>

      {plan.profile.warnings.length > 0 && (
        <section className="rounded-xl border border-amber-300/60 bg-amber-50/80 px-5 py-4 dark:border-amber-700/50 dark:bg-amber-900/20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.07em] text-amber-700 dark:text-amber-400">
            Atenção — pontos a considerar
          </p>
          <ul className="space-y-2">
            {plan.profile.warnings.map((warning) => (
              <li key={warning} className="flex items-start gap-2 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                <span className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true">⚠</span>
                {warning}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-[#1ea37a]/60 bg-gradient-to-br from-[#014b35] via-[#0a6645] to-[#179c74] p-6 text-white shadow-[0_8px_24px_rgba(1,75,53,0.3)]">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#d8fff2]/80">
          Perfil final
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-[-0.02em]">{profileLabel}</p>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#effff8]/90">
          {profileDescription}
        </p>
        {plan.profile.adjustments.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-[#effff8]/80">
            {plan.profile.adjustments.map((adjustment) => (
              <li key={adjustment} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#00ffb3]">·</span>
                {adjustment}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-[#badcd2] bg-white/90 px-5 py-5 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
        <h3 className="theme-heading mb-4 text-sm font-bold uppercase tracking-[0.07em]">
          Resumo
        </h3>
        <div className="grid gap-x-6 gap-y-0 md:grid-cols-2">
          {summaryRows.map(([label, val]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-2 border-b border-[#badcd2]/50 py-2.5 last:border-0 dark:border-[#2b4e44]/50"
            >
              <span className="text-xs font-medium text-[#235a4a] dark:text-[#a0d8c8]">{label}</span>
              <span className="tabular-nums text-sm font-semibold text-[#014b35] dark:text-[#f3fff9]">
                {val}
              </span>
            </div>
          ))}
        </div>
      </section>

      <AllocationChart allocation={plan.allocation} />
      <ProjectionChart plan={plan} />
      <KpiCards state={state} plan={plan} />
      <NextSteps profile={plan.profile.adjustedProfile} />
      <ProfileComparison
        currentProfile={plan.profile.adjustedProfile}
        userData={userData}
        objectives={objectives}
      />

      <button
        type="button"
        onClick={onReset}
        className="theme-btn-primary mt-2 w-full rounded-xl px-6 py-3 text-sm
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa] sm:w-auto"
      >
        Refazer plano
      </button>
    </div>
  )
}
