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
      <label htmlFor={id} className="theme-heading block text-sm font-medium">
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
        className="theme-input w-full rounded-lg px-3 py-2 outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
      />
      <p id={helperId} className="theme-muted text-xs">
        {helperText}
      </p>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}

export function StepPersonalData({ value, errors, onChange }: StepPersonalDataProps) {
  return (
    <div className="space-y-4">
      <h2 className="theme-heading text-xl font-semibold">Step 1: Dados pessoais</h2>
      <p className="theme-muted text-sm">
        Preenche os dados para montar o plano base. Nada e enviado para backend.
      </p>

      <div className="space-y-1">
        <label htmlFor="name" className="theme-heading block text-sm font-medium">
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
          className="theme-input w-full rounded-lg px-3 py-2 outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
        />
        <p id="name-helper" className="theme-muted text-xs">
          Maximo 50 caracteres.
        </p>
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-red-700 dark:text-red-300">
            {errors.name}
          </p>
        )}
      </div>

      <NumberInput
        id="age"
        label="Idade"
        helperText="Entre 18 e 80."
        value={value.age}
        onChange={(next) => onChange({ ...value, age: next })}
        error={errors.age}
        min={18}
      />

      <NumberInput
        id="monthly-income"
        label="Rendimento liquido mensal (EUR)"
        helperText="Valor mensal liquido."
        value={value.monthlyIncome}
        onChange={(next) => onChange({ ...value, monthlyIncome: next })}
        error={errors.monthlyIncome}
        min={0}
      />

      <NumberInput
        id="monthly-investment"
        label="Quanto consegues investir por mes (EUR)"
        helperText="Minimo recomendado: 25 EUR."
        value={value.monthlyInvestment}
        onChange={(next) => onChange({ ...value, monthlyInvestment: next })}
        error={errors.monthlyInvestment}
        min={25}
      />

      <NumberInput
        id="current-capital"
        label="Ja tens capital investido? (EUR)"
        helperText="Podes manter 0 se ainda nao investiste."
        value={value.currentCapital}
        onChange={(next) => onChange({ ...value, currentCapital: next })}
        error={errors.currentCapital}
        min={0}
      />
    </div>
  )
}
