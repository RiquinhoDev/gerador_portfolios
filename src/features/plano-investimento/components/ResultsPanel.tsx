import { AllocationChart } from './AllocationChart'
import { KpiCards } from './KpiCards'
import { ProjectionChart } from './ProjectionChart'
import { formatEuro, formatPercent } from '../lib/format'
import { PROFILE_DESCRIPTIONS, PROFILE_LABELS } from '../lib/profiles'
import type { InvestmentPlan, WizardState } from '../types'

interface ResultsPanelProps {
  state: WizardState
  plan: InvestmentPlan
  onReset: () => void
}

export function ResultsPanel({ state, plan, onReset }: ResultsPanelProps) {
  const { userData, objectives, riskAssessment } = state
  const profileLabel = PROFILE_LABELS[plan.profile.adjustedProfile]
  const profileDescription = PROFILE_DESCRIPTIONS[plan.profile.adjustedProfile]

  return (
    <div className="space-y-4">
      <h2 className="theme-heading text-2xl font-semibold">Resultado do teu plano</h2>
      <p className="theme-muted text-sm">Perfil, alocacao e projecoes ja calculadas.</p>

      <section className="rounded-xl border border-[#1ea37a] bg-gradient-to-r from-[#014b35] to-[#179c74] p-4 text-white">
        <p className="text-xs uppercase tracking-wide text-[#d8fff2]">Perfil final</p>
        <p className="mt-1 text-2xl font-bold">{profileLabel}</p>
        <p className="mt-2 text-sm text-[#effff8]">{profileDescription}</p>
        <p className="mt-3 text-sm text-[#d8fff2]">
          Score base: {riskAssessment.rawScore}/20 | Perfil base:{' '}
          {PROFILE_LABELS[plan.profile.rawProfile]}
        </p>
        {plan.profile.adjustments.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#effff8]">
            {plan.profile.adjustments.map((adjustment) => (
              <li key={adjustment}>{adjustment}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3 rounded-xl border border-[#badcd2] bg-white/90 p-4 md:grid-cols-2 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Nome:</strong> {userData.name || 'Sem nome'}
        </p>
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Idade:</strong> {userData.age ?? '-'}
        </p>
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Objetivo:</strong> {objectives.goal ?? '-'}
        </p>
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Horizonte:</strong> {objectives.horizonYears} anos
        </p>
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Investimento mensal:</strong> {userData.monthlyInvestment ?? '-'} EUR
        </p>
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Retorno anual efetivo:</strong> {formatPercent(plan.annualReturn)}
        </p>
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Meta FIRE:</strong> {plan.fireNumber ? formatEuro(plan.fireNumber) : '-'}
        </p>
        <p className="text-sm text-[#014b35] dark:text-[#f3fff9]">
          <strong>Anos estimados ate FIRE:</strong> {plan.yearsToFire ?? '-'}
        </p>
      </section>

      <AllocationChart allocation={plan.allocation} />
      <ProjectionChart projections={plan.projections} fireNumber={plan.fireNumber} />
      <KpiCards state={state} plan={plan} />

      <section className="rounded-xl border border-[#badcd2] bg-[#e0f2ef]/70 p-4 dark:border-[#2b4e44] dark:bg-[#13211d]">
        <p className="text-sm text-[#014b35] dark:text-[#d8fff2]">
          Nota legal: ferramenta educativa. Nao constitui aconselhamento financeiro.
        </p>
      </section>

      <button
        type="button"
        onClick={onReset}
        className="theme-btn-primary rounded-lg px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
      >
        Refazer plano
      </button>
    </div>
  )
}
