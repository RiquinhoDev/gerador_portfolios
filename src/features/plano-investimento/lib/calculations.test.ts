import { buildInvestmentPlan, calculateFireNumber, computeFutureValue } from './calculations'
import { INITIAL_CAPACITY_ASSESSMENT } from './constants'

const neutralCapacity = INITIAL_CAPACITY_ASSESSMENT

const baseUserData = {
  name: 'Teste',
  age: 35,
  monthlyIncome: 3000,
  monthlyInvestment: 500,
  currentCapital: 5000
}

const baseObjectives = {
  goal: 'fire' as const,
  horizonYears: 20,
  fireMonthlyTarget: 2500,
  passiveMonthlyTarget: null
}

describe('calculations — base', () => {
  it('computes future value with monthly contributions', () => {
    const value = computeFutureValue(1000, 200, 10, 0.06)
    expect(value).toBeGreaterThan(0)
    expect(value).toBeGreaterThan(1000 + 200 * 120)
  })

  it('calculates FIRE number using 4% rule by default', () => {
    expect(calculateFireNumber(2000)).toBe(600000)
  })

  it('builds plan with profile, allocation and projections', () => {
    const plan = buildInvestmentPlan(baseUserData, baseObjectives, 15, neutralCapacity)

    expect(plan.profile.adjustedProfile).toBeDefined()
    expect(plan.projections.length).toBeGreaterThan(0)
    // score 15 = dynamic, withdrawalRate 0.04 → fireNumber = 2500*12/0.04 = 750000
    expect(plan.fireNumber).toBe(750000)
  })
})

// ─── SMOKE TESTS — 10 pontos ───────────────────────────────────────────────

describe('Ponto 1 — passive_income calcula yearsToPassiveIncome', () => {
  it('calcula passiveIncomeNumber e yearsToPassiveIncome quando goal=passive_income', () => {
    const plan = buildInvestmentPlan(
      baseUserData,
      { ...baseObjectives, goal: 'passive_income', passiveMonthlyTarget: 500, fireMonthlyTarget: null },
      14,
      neutralCapacity
    )
    expect(plan.passiveIncomeNumber).not.toBeNull()
    expect(plan.passiveIncomeNumber).toBeGreaterThan(0)
    expect(plan.yearsToPassiveIncome).not.toBeNull()
    expect(plan.fireNumber).toBeNull()
    expect(plan.yearsToFire).toBeNull()
  })
})

describe('Ponto 2 — fire vs passive_income isolados', () => {
  it('goal=fire usa fireMonthlyTarget e ignora passiveMonthlyTarget', () => {
    const plan = buildInvestmentPlan(
      baseUserData,
      { ...baseObjectives, goal: 'fire', fireMonthlyTarget: 2000, passiveMonthlyTarget: null },
      14,
      neutralCapacity
    )
    expect(plan.fireNumber).not.toBeNull()
    expect(plan.passiveIncomeNumber).toBeNull()
    expect(plan.yearsToPassiveIncome).toBeNull()
  })

  it('goal=passive_income usa passiveMonthlyTarget e ignora fireMonthlyTarget', () => {
    const plan = buildInvestmentPlan(
      baseUserData,
      { ...baseObjectives, goal: 'passive_income', passiveMonthlyTarget: 500, fireMonthlyTarget: null },
      14,
      neutralCapacity
    )
    expect(plan.passiveIncomeNumber).not.toBeNull()
    expect(plan.fireNumber).toBeNull()
    expect(plan.yearsToFire).toBeNull()
  })
})

describe('Ponto 3 — regra FIRE só força Moderado com horizonte >= 10', () => {
  it('horizonte >= 10: perfil conservador é elevado para moderado', () => {
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'fire', horizonYears: 20 },
      6,
      neutralCapacity
    )
    expect(plan.profile.rawProfile).toBe('conservative')
    expect(plan.profile.adjustedProfile).toBe('moderate')
  })

  it('horizonte < 10: perfil conservador mantém-se, gera aviso', () => {
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'fire', horizonYears: 7 },
      6,
      neutralCapacity
    )
    expect(plan.profile.adjustedProfile).toBe('conservative')
    expect(plan.profile.warnings.length).toBeGreaterThan(0)
  })
})

describe('Ponto 4 — capacidade de risco ajusta perfil', () => {
  it('fundo de emergência insuficiente reduz perfil 1 nível', () => {
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'accumulation', horizonYears: 20 },
      14, // dynamic
      { ...neutralCapacity, emergencyFund: 'none' }
    )
    expect(plan.profile.rawProfile).toBe('dynamic')
    expect(plan.profile.adjustedProfile).toBe('moderate')
    expect(plan.profile.adjustments.some((a) => a.includes('emergência'))).toBe(true)
  })

  it('dívida elevada gera aviso mas não altera perfil', () => {
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'accumulation', horizonYears: 20 },
      14,
      { ...neutralCapacity, debtLevel: 'high' }
    )
    expect(plan.profile.adjustedProfile).toBe('dynamic')
    expect(plan.profile.warnings.some((w) => w.includes('dívida'))).toBe(true)
  })

  it('rendimento instável reduz perfil 1 nível', () => {
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'accumulation', horizonYears: 20 },
      14,
      { ...neutralCapacity, incomeStability: 'unstable' }
    )
    expect(plan.profile.rawProfile).toBe('dynamic')
    expect(plan.profile.adjustedProfile).toBe('moderate')
  })
})

describe('Ponto 5 — 3 cenários de projeção', () => {
  it('scenarios tem prudente < base < otimista em cada ponto', () => {
    const plan = buildInvestmentPlan(baseUserData, baseObjectives, 14, neutralCapacity)
    for (const s of plan.scenarios) {
      expect(s.prudent).toBeLessThan(s.base)
      expect(s.base).toBeLessThan(s.optimistic)
    }
  })

  it('scenarios não está vazio', () => {
    const plan = buildInvestmentPlan(baseUserData, baseObjectives, 14, neutralCapacity)
    expect(plan.scenarios.length).toBeGreaterThan(0)
  })
})

describe('Ponto 6 — withdrawalRate por perfil', () => {
  it('conservador tem withdrawalRate 0.03', () => {
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'accumulation' },
      6,
      neutralCapacity
    )
    expect(plan.profile.adjustedProfile).toBe('conservative')
    expect(plan.withdrawalRate).toBe(0.03)
  })

  it('agressivo tem withdrawalRate 0.045', () => {
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'accumulation', horizonYears: 20 },
      20,
      neutralCapacity
    )
    expect(plan.profile.adjustedProfile).toBe('aggressive')
    expect(plan.withdrawalRate).toBe(0.045)
  })

  it('fireNumber usa withdrawalRate do perfil (não 4% fixo)', () => {
    // conservador + FIRE + horizonte longo → Moderado (0.035)
    const plan = buildInvestmentPlan(
      { ...baseUserData, age: 30 },
      { ...baseObjectives, goal: 'fire', horizonYears: 20, fireMonthlyTarget: 1000 },
      6,
      neutralCapacity
    )
    const expectedFireNumber = Math.round((1000 * 12) / plan.withdrawalRate * 100) / 100
    expect(plan.fireNumber).toBe(expectedFireNumber)
  })
})

describe('Ponto 7 — checkpoints separados por horizonte', () => {
  it('projections só contém anos <= horizonYears', () => {
    const plan = buildInvestmentPlan(
      baseUserData,
      { ...baseObjectives, horizonYears: 12 },
      14,
      neutralCapacity
    )
    for (const p of plan.projections) {
      expect(p.year).toBeLessThanOrEqual(12)
    }
  })

  it('extendedProjections só contém anos > horizonYears', () => {
    const plan = buildInvestmentPlan(
      baseUserData,
      { ...baseObjectives, horizonYears: 12 },
      14,
      neutralCapacity
    )
    for (const p of plan.extendedProjections) {
      expect(p.year).toBeGreaterThan(12)
    }
  })

  it('horizonte 30: extendedProjections vazio (não há checkpoints além de 30)', () => {
    const plan = buildInvestmentPlan(
      baseUserData,
      { ...baseObjectives, horizonYears: 30 },
      14,
      neutralCapacity
    )
    expect(plan.extendedProjections.length).toBe(0)
  })
})

describe('Ponto 9 — earlyStart é FV com horizonte+5', () => {
  it('FV(horizonte+5) > FV(horizonte)', () => {
    const plan = buildInvestmentPlan(baseUserData, baseObjectives, 14, neutralCapacity)
    const horizonProjection = plan.projections.find((p) => p.year === 20)!
    const earlyStartFV = computeFutureValue(
      baseUserData.currentCapital!,
      baseUserData.monthlyInvestment!,
      20 + 5,
      plan.annualReturn
    )
    expect(earlyStartFV).toBeGreaterThan(horizonProjection.totalValue)
  })
})

describe('Ponto 10 — custo de adiar 1 ano', () => {
  it('FV(horizonte) > FV(horizonte-1) com capital parado', () => {
    const plan = buildInvestmentPlan(baseUserData, baseObjectives, 14, neutralCapacity)
    const horizonFV = plan.projections.find((p) => p.year === 20)!.totalValue
    const delayedFV = computeFutureValue(
      baseUserData.currentCapital!,
      baseUserData.monthlyInvestment!,
      19,
      plan.annualReturn
    )
    const cost = horizonFV - delayedFV
    expect(cost).toBeGreaterThan(0)
  })
})
