import { GOAL_OPTIONS } from '../lib/constants'
import type { Objectives } from '../types'

type ObjectivesErrors = {
  goal?: string
  fireMonthlyTarget?: string
}

interface StepObjectivesProps {
  value: Objectives
  errors: ObjectivesErrors
  onChange: (value: Objectives) => void
}

function getHorizonLabel(horizonYears: number): string {
  if (horizonYears < 5) return 'Curto prazo'
  if (horizonYears <= 15) return 'Medio prazo'
  return 'Longo prazo'
}

function parseNullableNumber(value: string): number | null {
  if (value.trim() === '') return null
  return Number(value)
}

export function StepObjectives({ value, errors, onChange }: StepObjectivesProps) {
  return (
    <div className="space-y-4">
      <h2 className="theme-heading text-xl font-semibold">Step 2: Objetivos</h2>
      <p className="theme-muted text-sm">
        Escolhe teu objetivo principal e horizonte temporal do plano.
      </p>

      <fieldset>
        <legend className="theme-heading mb-2 text-sm font-medium">
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
              onClick={() => onChange({ ...value, goal: goal.value })}
              className={`rounded-lg border p-4 text-left transition ${
                isActive
                  ? 'border-[#00ffb3] bg-[#00ffb3] text-[#05281d]'
                  : 'border-[#badcd2] bg-white/90 text-[#014b35] hover:border-[#45d5aa] dark:border-[#2b4e44] dark:bg-[#0f1715]/80 dark:text-[#f3fff9]'
              }`}
            >
              <p className="font-semibold">{goal.title}</p>
              <p
                className={`mt-2 text-sm ${
                  isActive ? 'text-[#0b3a2b]' : 'text-[#235a4a] dark:text-[#c7f8e9]'
                }`}
              >
                {goal.description}
              </p>
            </button>
          )
        })}
        </div>
      </fieldset>
      {errors.goal && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{errors.goal}</p>}

      <div className="space-y-2">
        <label htmlFor="horizon" className="theme-heading block text-sm font-medium">
          Horizonte temporal: {value.horizonYears} anos ({getHorizonLabel(value.horizonYears)})
        </label>
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
          <span>1</span>
          <span>40</span>
        </div>
      </div>

      {value.goal === 'fire' && (
        <div className="space-y-1 rounded-lg border border-[#badcd2] bg-[#e0f2ef]/70 p-4 dark:border-[#2b4e44] dark:bg-[#13211d]">
          <label htmlFor="fire-target" className="theme-heading block text-sm font-medium">
            Quanto queres receber por mes em renda passiva (EUR)
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
            aria-describedby={errors.fireMonthlyTarget ? 'fire-target-error' : undefined}
            className="theme-input w-full rounded-lg px-3 py-2 outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
          />
          {errors.fireMonthlyTarget && (
            <p id="fire-target-error" role="alert" className="text-sm text-red-700 dark:text-red-300">
              {errors.fireMonthlyTarget}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
