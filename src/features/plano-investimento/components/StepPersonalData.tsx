import type { UserData } from '../types'

type PersonalDataErrors = Partial<Record<keyof UserData, string>>

interface StepPersonalDataProps {
  value: UserData
  errors: PersonalDataErrors
  onChange: (value: UserData) => void
}

function parseNullableNumber(value: string): number | null {
  if (value.trim() === '') return null
  return Number(value)
}

function NumberInput({
  id,
  label,
  helperText,
  value,
  onChange,
  error,
  min
}: {
  id: string
  label: string
  helperText: string
  value: number | null
  onChange: (next: number | null) => void
  error?: string
  min?: number
}) {
  const helperId = `${id}-helper`
  const errorId = `${id}-error`

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="theme-heading block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        value={value ?? ''}
        onChange={(event) => onChange(parseNullableNumber(event.target.value))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${helperId} ${errorId}` : helperId}
        className="theme-input w-full rounded-lg px-4 py-2.5 outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
      />
      <p id={helperId} className="theme-muted mt-1.5 text-xs leading-relaxed">
        {helperText}
      </p>
      {error && (
        <p id={errorId} role="alert" className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export function StepPersonalData({ value, errors, onChange }: StepPersonalDataProps) {
  return (
    <div>
      <h2 className="theme-heading text-2xl font-bold leading-tight tracking-[-0.02em]">
        Dados pessoais
      </h2>
      <p className="theme-muted mt-2 text-sm leading-relaxed">
        Preenche os dados para montar o plano base.
      </p>

      <div className="mt-6 space-y-5">
        <div className="space-y-1">
          <label htmlFor="name" className="theme-heading block text-sm font-semibold">
            Nome (opcional)
          </label>
          <input
            id="name"
            type="text"
            maxLength={50}
            value={value.name ?? ''}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-helper name-error' : 'name-helper'}
            className="theme-input w-full rounded-lg px-4 py-2.5 outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
          />
          <p id="name-helper" className="theme-muted mt-1.5 text-xs leading-relaxed">
            Máximo 50 caracteres.
          </p>
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <NumberInput
          id="age"
          label="Idade"
          helperText="Entre 18 a 80 anos."
          value={value.age}
          onChange={(next) => onChange({ ...value, age: next })}
          error={errors.age}
          min={18}
        />

        <NumberInput
          id="monthly-income"
          label="Rendimento líquido mensal (EUR)"
          helperText="Valor mensal líquido."
          value={value.monthlyIncome}
          onChange={(next) => onChange({ ...value, monthlyIncome: next })}
          error={errors.monthlyIncome}
          min={0}
        />

        <NumberInput
          id="monthly-investment"
          label="Quanto consegues investir por mês (EUR)"
          helperText="Mínimo recomendado: 25 EUR."
          value={value.monthlyInvestment}
          onChange={(next) => onChange({ ...value, monthlyInvestment: next })}
          error={errors.monthlyInvestment}
          min={25}
        />

        <NumberInput
          id="current-capital"
          label="Já tens capital investido? (EUR)"
          helperText="Podes manter 0 se ainda não investiste."
          value={value.currentCapital}
          onChange={(next) => onChange({ ...value, currentCapital: next })}
          error={errors.currentCapital}
          min={0}
        />
      </div>
    </div>
  )
}
