import { useState } from 'react'
import { computeFutureValue } from '../lib/calculations'
import { formatEuro, formatPercent } from '../lib/format'
import {
  PROFILE_ALLOCATIONS,
  PROFILE_ANNUAL_RETURNS,
  PROFILE_DESCRIPTIONS,
  PROFILE_LABELS
} from '../lib/profiles'
import type { AssetAllocation, RiskProfile, UserData, Objectives } from '../types'

interface ProfileComparisonProps {
  currentProfile: RiskProfile
  userData: UserData
  objectives: Objectives
}

const PROFILES: RiskProfile[] = ['conservative', 'moderate', 'dynamic', 'aggressive']

const ALLOCATION_SEGMENTS: Array<{
  key: keyof AssetAllocation
  label: string
  color: string
}> = [
  { key: 'globalETFs', label: 'ETFs', color: 'var(--success)' },
  { key: 'bonds', label: 'Obrigações', color: 'var(--chart-2)' },
  { key: 'stocks', label: 'Ações', color: 'var(--chart-1)' },
  { key: 'gold', label: 'Ouro', color: 'var(--chart-3)' },
  { key: 'reits', label: 'REITs', color: 'var(--chart-5)' },
  { key: 'highRisk', label: 'Alto Risco', color: 'var(--chart-4)' }
]

function getEffectiveRate(profile: RiskProfile): number {
  const gross = PROFILE_ANNUAL_RETURNS[profile]
  return Math.max(gross * (1 - 0.28) - 0.02, 0)
}

function AllocationBar({ allocation }: { allocation: AssetAllocation }) {
  const segments = ALLOCATION_SEGMENTS.filter((s) => allocation[s.key] > 0)
  return (
    <div className="space-y-2">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {segments.map((s) => (
          <div
            key={s.key}
            style={{ width: `${allocation[s.key]}%`, backgroundColor: s.color }}
            title={`${s.label}: ${allocation[s.key]}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-1 text-xs text-[#235a4a] dark:text-[#a0d8c8]">
            <span
              className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label} {allocation[s.key]}%
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProfileComparison({ currentProfile, userData, objectives }: ProfileComparisonProps) {
  const [open, setOpen] = useState(false)
  const currentCapital = userData.currentCapital ?? 0
  const monthlyInvestment = userData.monthlyInvestment ?? 0
  const horizonYears = objectives.horizonYears

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 px-5 py-5 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa] rounded"
      >
        <h3 className="theme-heading text-sm font-bold uppercase tracking-[0.07em]">
          Outros perfis possíveis
        </h3>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`flex-shrink-0 text-[#014b35] transition-transform duration-300 dark:text-[#00ffb3] ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <p className="theme-muted mt-2 mb-5 text-xs leading-relaxed">
            Com respostas diferentes às perguntas de risco, o teu perfil seria outro. Aqui vês como cada perfil altera a alocação e o capital projetado para {horizonYears} anos.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {PROFILES.map((profile) => {
              const isCurrent = profile === currentProfile
              const rate = getEffectiveRate(profile)
              const allocation = PROFILE_ALLOCATIONS[profile]
              const projected = computeFutureValue(currentCapital, monthlyInvestment, horizonYears, rate)
              const totalInvested = currentCapital + monthlyInvestment * horizonYears * 12
              const returns = projected - totalInvested

              return (
                <div
                  key={profile}
              className={`relative rounded-xl border p-4 transition-shadow
                ${
                  isCurrent
                    ? 'border-[#00ffb3] bg-gradient-to-br from-[#014b35] to-[#0a6645] text-white shadow-[0_4px_16px_rgba(0,255,179,0.2)]'
                    : 'border-[#badcd2]/80 bg-[#e0f2ef]/40 dark:border-[#2b4e44] dark:bg-[#13211d]'
                }`}
            >
              {isCurrent && (
                <span className="absolute right-3 top-3 rounded-full bg-[#00ffb3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#014b35]">
                  O teu perfil
                </span>
              )}

              <p
                className={`text-base font-extrabold tracking-[-0.01em] ${
                  isCurrent ? 'text-white' : 'text-[#014b35] dark:text-[#f3fff9]'
                }`}
              >
                {PROFILE_LABELS[profile]}
              </p>
              <p
                className={`mt-0.5 text-xs leading-relaxed ${
                  isCurrent ? 'text-[#d8fff2]/80' : 'text-[#235a4a] dark:text-[#a0d8c8]'
                }`}
              >
                {PROFILE_DESCRIPTIONS[profile]}
              </p>

              <div
                className={`mt-3 flex items-baseline gap-3 text-xs ${
                  isCurrent ? 'text-[#d8fff2]/70' : 'text-[#235a4a] dark:text-[#a0d8c8]'
                }`}
              >
                <span>
                  Retorno efetivo:{' '}
                  <strong className={isCurrent ? 'text-[#00ffb3]' : 'text-[#014b35] dark:text-[#f3fff9]'}>
                    {formatPercent(rate)} a.a.
                  </strong>
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.07em] ${
                    isCurrent ? 'text-[#d8fff2]/70' : 'text-[#235a4a] dark:text-[#a0d8c8]'
                  }`}
                >
                  Alocação
                </p>
                <div className={isCurrent ? '[&_span]:text-[#d8fff2]/80' : ''}>
                  <AllocationBar allocation={allocation} />
                </div>
              </div>

              <div
                className={`mt-4 flex items-end justify-between rounded-lg px-3 py-2.5 ${
                  isCurrent
                    ? 'bg-white/10'
                    : 'bg-[#014b35]/5 dark:bg-[#00ffb3]/5'
                }`}
              >
                <div>
                  <p
                    className={`text-xs ${
                      isCurrent ? 'text-[#d8fff2]/70' : 'text-[#235a4a] dark:text-[#a0d8c8]'
                    }`}
                  >
                    Capital em {horizonYears} anos
                  </p>
                  <p
                    className={`tabular-nums text-lg font-extrabold tracking-[-0.02em] ${
                      isCurrent ? 'text-[#00ffb3]' : 'text-[#014b35] dark:text-[#f3fff9]'
                    }`}
                  >
                    {formatEuro(projected)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs ${
                      isCurrent ? 'text-[#d8fff2]/70' : 'text-[#235a4a] dark:text-[#a0d8c8]'
                    }`}
                  >
                    Ganho dos juros
                  </p>
                  <p
                    className={`tabular-nums text-sm font-bold ${
                      isCurrent ? 'text-[#d8fff2]' : 'text-[#014b35] dark:text-[#c7f8e9]'
                    }`}
                  >
                    +{formatEuro(Math.max(0, returns))}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        </div>
        </>
      )}
    </section>
  )
}
