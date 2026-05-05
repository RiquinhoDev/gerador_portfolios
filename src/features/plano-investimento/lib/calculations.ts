import type { InvestmentPlan, Objectives, Projection, RiskProfile, UserData } from '../types'
import { getAllocation, PROFILE_ANNUAL_RETURNS } from './profiles'
import { computeAdjustedProfile } from './risk-scoring'

const DEFAULT_INFLATION_RATE = 0.02
const DEFAULT_CAPITAL_GAINS_TAX_RATE = 0.28

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

function getCheckpoints(horizonYears: number): number[] {
  const fixed = [5, 10, 15, 20, 30]
  const merged = [...fixed, horizonYears].filter((year) => year >= 1)
  return Array.from(new Set(merged)).sort((a, b) => a - b)
}

function getEffectiveAnnualRate(profile: RiskProfile): number {
  const gross = PROFILE_ANNUAL_RETURNS[profile]
  const afterTax = gross * (1 - DEFAULT_CAPITAL_GAINS_TAX_RATE)
  return Math.max(afterTax - DEFAULT_INFLATION_RATE, 0)
}

export function computeFutureValue(
  currentCapital: number,
  monthlyInvestment: number,
  years: number,
  annualRate: number
): number {
  const totalMonths = years * 12
  const monthlyRate = annualRate / 12

  if (monthlyRate === 0) {
    return roundCurrency(currentCapital + monthlyInvestment * totalMonths)
  }

  const growthPrincipal = currentCapital * (1 + monthlyRate) ** totalMonths
  const growthContributions = monthlyInvestment * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate)
  return roundCurrency(growthPrincipal + growthContributions)
}

function buildProjection(
  currentCapital: number,
  monthlyInvestment: number,
  year: number,
  annualRate: number
): Projection {
  const totalInvested = roundCurrency(currentCapital + monthlyInvestment * year * 12)
  const totalValue = computeFutureValue(currentCapital, monthlyInvestment, year, annualRate)
  return {
    year,
    totalInvested,
    totalValue,
    returns: roundCurrency(totalValue - totalInvested)
  }
}

export function calculateFireNumber(targetMonthlyIncome: number): number {
  return roundCurrency((targetMonthlyIncome * 12) / 0.04)
}

export function estimateYearsToFire(
  currentCapital: number,
  monthlyInvestment: number,
  annualRate: number,
  fireNumber: number
): number | null {
  if (fireNumber <= 0) return null

  for (let year = 1; year <= 80; year += 1) {
    const value = computeFutureValue(currentCapital, monthlyInvestment, year, annualRate)
    if (value >= fireNumber) return year
  }

  return null
}

export function buildInvestmentPlan(
  userData: UserData,
  objectives: Objectives,
  score: number
): InvestmentPlan {
  const profile = computeAdjustedProfile({
    score,
    age: userData.age ?? 18,
    horizonYears: objectives.horizonYears,
    goal: objectives.goal ?? 'accumulation'
  })

  const annualReturn = getEffectiveAnnualRate(profile.adjustedProfile)
  const allocation = getAllocation(profile.adjustedProfile)
  const currentCapital = userData.currentCapital ?? 0
  const monthlyInvestment = userData.monthlyInvestment ?? 0
  const checkpoints = getCheckpoints(objectives.horizonYears)
  const projections = checkpoints.map((year) =>
    buildProjection(currentCapital, monthlyInvestment, year, annualReturn)
  )

  const fireNumber =
    objectives.goal === 'fire' && objectives.fireMonthlyTarget
      ? calculateFireNumber(objectives.fireMonthlyTarget)
      : null

  const yearsToFire =
    fireNumber !== null
      ? estimateYearsToFire(currentCapital, monthlyInvestment, annualReturn, fireNumber)
      : null

  return {
    profile,
    allocation,
    annualReturn,
    projections,
    fireNumber,
    yearsToFire
  }
}
