import { buildInvestmentPlan, calculateFireNumber, computeFutureValue } from './calculations'

describe('calculations', () => {
  it('computes future value with monthly contributions', () => {
    const value = computeFutureValue(1000, 200, 10, 0.06)
    expect(value).toBeGreaterThan(0)
    expect(value).toBeGreaterThan(1000 + 200 * 120)
  })

  it('calculates FIRE number using 4 percent rule', () => {
    expect(calculateFireNumber(2000)).toBe(600000)
  })

  it('builds plan with profile, allocation and projections', () => {
    const plan = buildInvestmentPlan(
      {
        name: 'Teste',
        age: 35,
        monthlyIncome: 3000,
        monthlyInvestment: 500,
        currentCapital: 5000
      },
      {
        goal: 'fire',
        horizonYears: 20,
        fireMonthlyTarget: 2500
      },
      15
    )

    expect(plan.profile.adjustedProfile).toBeDefined()
    expect(plan.projections.length).toBeGreaterThan(0)
    expect(plan.fireNumber).toBe(750000)
  })
})
