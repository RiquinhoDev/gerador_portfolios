import { calculateFireNumber } from '../lib/calculations'
import { formatEuro } from '../lib/format'
import { GOAL_OPTIONS } from '../lib/constants'
import type { Objectives } from '../types'

type ObjectivesErrors = {
  goal?: string
  fireMonthlyTarget?: string
  passiveMonthlyTarget?: string
}

interface StepObjectivesProps {
  value: Objectives
  errors: ObjectivesErrors
  onChange: (value: Objectives) => void
}

function getHorizonLabel(horizonYears: number): string {
  if (horizonYears < 5) return 'Curto prazo'
  if (horizonYears <= 15) return 'Médio prazo'
  return 'Longo prazo'
}

function parseNullableNumber(value: string): number | null {
  if (value.trim() === '') return null
  return Number(value)
}

export function StepObjectives({ value, errors, onChange }: StepObjectivesProps) {
  return (
    <div>
      <h2 className="theme-heading text-2xl font-bold leading-tight tracking-[-0.02em]">
        Objetivos
      </h2>
      <p className="theme-muted mt-2 text-sm leading-relaxed">
        Escolhe o teu objetivo principal e horizonte temporal do plano.
      </p>

      <div className="mt-6 space-y-6">
        <fieldset>
          <legend className="theme-heading mb-3 text-sm font-semibold">
            Objetivo principal
          </legend>
          <div role="radiogroup" className="grid gap-3 md:grid-cols-3">
            {GOAL_OPTIONS.map((goal) => {
              const isActive = value.goal === goal.value
              return (
                <button
                  key={goal.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() =>
                    onChange({
                      ...value,
                      goal: goal.value,
                      fireMonthlyTarget: goal.value !== 'fire' ? null : value.fireMonthlyTarget,
                      passiveMonthlyTarget:
                        goal.value !== 'passive_income' ? null : value.passiveMonthlyTarget
                    })
                  }
                  className={`relative rounded-xl border p-5 text-left transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]
                    ${
                      isActive
                        ? 'border-[#00ffb3] bg-[#00ffb3] text-[#05281d] shadow-[0_4px_14px_rgba(0,255,179,0.25)]'
                        : `border-[#badcd2] bg-white/90 text-[#014b35]
                           hover:border-[#45d5aa] hover:shadow-[0_2px_8px_rgba(1,75,53,0.1)]
                           dark:border-[#2b4e44] dark:bg-[#0f1715]/80 dark:text-[#f3fff9]
                           dark:hover:border-[#45d5aa]`
                    }`}
                >
                  <p className="text-sm font-bold">{goal.title}</p>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      isActive ? 'text-[#0b3a2b]' : 'text-[#235a4a] dark:text-[#c7f8e9]'
                    }`}
                  >
                    {goal.description}
                  </p>
                  {isActive && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#014b35]" />
                  )}
                </button>
              )
            })}
          </div>
          {errors.goal && (
            <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {errors.goal}
            </p>
          )}
        </fieldset>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label htmlFor="horizon" className="theme-heading text-sm font-semibold">
              Horizonte temporal
            </label>
            <span className="tabular-nums text-sm font-bold text-[#014b35] dark:text-[#00ffb3]">
              {value.horizonYears} anos
              <span className="theme-muted ml-1.5 text-xs font-normal">
                ({getHorizonLabel(value.horizonYears)})
              </span>
            </span>
          </div>
          <input
            id="horizon"
            type="range"
            min={1}
            max={40}
            value={value.horizonYears}
            onChange={(event) => onChange({ ...value, horizonYears: Number(event.target.value) })}
            className="w-full accent-[#014b35] dark:accent-[#00ffb3]"
          />
          <div className="theme-muted flex justify-between text-xs">
            <span>1 ano</span>
            <span>40 anos</span>
          </div>
        </div>

        {/* FIRE target */}
        {value.goal === 'fire' && (
          <div className="space-y-2 rounded-xl border border-[#badcd2] bg-[#e0f2ef]/70 p-5 dark:border-[#2b4e44] dark:bg-[#13211d]">
            <label htmlFor="fire-target" className="theme-heading block text-sm font-semibold">
              Rendimento mensal que precisas na independência financeira (EUR)
            </label>
            <input
              id="fire-target"
              type="number"
              min={0}
              value={value.fireMonthlyTarget ?? ''}
              onChange={(event) =>
                onChange({ ...value, fireMonthlyTarget: parseNullableNumber(event.target.value) })
              }
              aria-invalid={Boolean(errors.fireMonthlyTarget)}
              aria-describedby={errors.fireMonthlyTarget ? 'fire-target-error' : 'fire-target-hint'}
              className="theme-input w-full rounded-lg px-4 py-2.5 outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
            />
            {value.fireMonthlyTarget && value.fireMonthlyTarget > 0 ? (
              <p id="fire-target-hint" className="text-xs text-[#235a4a] dark:text-[#a0d8c8]">
                Meta FIRE: precisas de acumular{' '}
                <strong className="text-[#014b35] dark:text-[#00ffb3]">
                  {formatEuro(calculateFireNumber(value.fireMonthlyTarget))}
                </strong>{' '}
                (estimativa — ajustada ao teu perfil nos resultados)
              </p>
            ) : (
              <p id="fire-target-hint" className="text-xs text-[#235a4a]/70 dark:text-[#a0d8c8]/70">
                Indica o rendimento mensal que precisas para deixar de trabalhar por necessidade.
              </p>
            )}
            {errors.fireMonthlyTarget && (
              <p id="fire-target-error" role="alert" className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {errors.fireMonthlyTarget}
              </p>
            )}
          </div>
        )}

        {/* Passive income target */}
        {value.goal === 'passive_income' && (
          <div className="space-y-2 rounded-xl border border-[#badcd2] bg-[#e0f2ef]/70 p-5 dark:border-[#2b4e44] dark:bg-[#13211d]">
            <label htmlFor="passive-target" className="theme-heading block text-sm font-semibold">
              Quanto queres receber por mês em rendimento extra (EUR)
            </label>
            <input
              id="passive-target"
              type="number"
              min={0}
              value={value.passiveMonthlyTarget ?? ''}
              onChange={(event) =>
                onChange({
                  ...value,
                  passiveMonthlyTarget: parseNullableNumber(event.target.value)
                })
              }
              aria-invalid={Boolean(errors.passiveMonthlyTarget)}
              aria-describedby={
                errors.passiveMonthlyTarget ? 'passive-target-error' : 'passive-target-hint'
              }
              className="theme-input w-full rounded-lg px-4 py-2.5 outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
            />
            {value.passiveMonthlyTarget && value.passiveMonthlyTarget > 0 ? (
              <p id="passive-target-hint" className="text-xs text-[#235a4a] dark:text-[#a0d8c8]">
                Capital necessário:{' '}
                <strong className="text-[#014b35] dark:text-[#00ffb3]">
                  {formatEuro(calculateFireNumber(value.passiveMonthlyTarget))}
                </strong>{' '}
                — mostraremos quando o atinges nas projeções.
              </p>
            ) : (
              <p id="passive-target-hint" className="text-xs text-[#235a4a]/70 dark:text-[#a0d8c8]/70">
                Ex: 250€, 500€ ou 1.000€/mês. Usamos este valor para calcular quando atinges a meta.
              </p>
            )}
            {errors.passiveMonthlyTarget && (
              <p id="passive-target-error" role="alert" className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {errors.passiveMonthlyTarget}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
