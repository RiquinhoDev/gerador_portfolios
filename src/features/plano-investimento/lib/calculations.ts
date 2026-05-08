import type {
  CapacityAssessment,
  InvestmentPlan,
  Objectives,
  Projection,
  RiskProfile,
  ScenarioProjection,
  UserData
} from '../types'
import { getAllocation, PROFILE_ANNUAL_RETURNS, PROFILE_WITHDRAWAL_RATES } from './profiles'
import { computeAdjustedProfile } from './risk-scoring'

const SCENARIO_DELTA = 0.02

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

function getWithinHorizonCheckpoints(horizonYears: number): number[] {
  const fixed = [5, 10, 15, 20, 30].filter((y) => y < horizonYears)
  return Array.from(new Set([...fixed, horizonYears])).sort((a, b) => a - b)
}

function getBeyondHorizonCheckpoints(horizonYears: number): number[] {
  return [5, 10, 15, 20, 30].filter((y) => y > horizonYears)
}

function getEffectiveAnnualRate(profile: RiskProfile): number {
  return PROFILE_ANNUAL_RETURNS[profile]
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
  const growthContributions =
    monthlyInvestment * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate)
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

function buildScenarios(
  currentCapital: number,
  monthlyInvestment: number,
  checkpoints: number[],
  baseRate: number
): ScenarioProjection[] {
  const prudentRate = Math.max(baseRate - SCENARIO_DELTA, 0)
  const optimisticRate = baseRate + SCENARIO_DELTA

  return checkpoints.map((year) => ({
    year,
    totalInvested: roundCurrency(currentCapital + monthlyInvestment * year * 12),
    prudent: computeFutureValue(currentCapital, monthlyInvestment, year, prudentRate),
    base: computeFutureValue(currentCapital, monthlyInvestment, year, baseRate),
    optimistic: computeFutureValue(currentCapital, monthlyInvestment, year, optimisticRate)
  }))
}

export function calculateTargetCapital(
  monthlyTarget: number,
  withdrawalRate: number
): number {
  return roundCurrency((monthlyTarget * 12) / withdrawalRate)
}

// backwards-compat alias
export function calculateFireNumber(
  targetMonthlyIncome: number,
  withdrawalRate = 0.04
): number {
  return calculateTargetCapital(targetMonthlyIncome, withdrawalRate)
}

export function estimateYearsToTarget(
  currentCapital: number,
  monthlyInvestment: number,
  annualRate: number,
  targetCapital: number
): number | null {
  if (targetCapital <= 0) return null
  for (let year = 1; year <= 80; year += 1) {
    if (computeFutureValue(currentCapital, monthlyInvestment, year, annualRate) >= targetCapital) {
      return year
    }
  }
  return null
}

// backwards-compat alias
export function estimateYearsToFire(
  currentCapital: number,
  monthlyInvestment: number,
  annualRate: number,
  fireNumber: number
): number | null {
  return estimateYearsToTarget(currentCapital, monthlyInvestment, annualRate, fireNumber)
}

export function buildInvestmentPlan(
  userData: UserData,
  objectives: Objectives,
  score: number,
  capacity: CapacityAssessment
): InvestmentPlan {
  const profile = computeAdjustedProfile({
    score,
    age: userData.age ?? 18,
    horizonYears: objectives.horizonYears,
    goal: objectives.goal ?? 'accumulation',
    capacity
  })

  const annualReturn = getEffectiveAnnualRate(profile.adjustedProfile)
  const withdrawalRate = PROFILE_WITHDRAWAL_RATES[profile.adjustedProfile]
  const allocation = getAllocation(profile.adjustedProfile)
  const currentCapital = userData.currentCapital ?? 0
  const monthlyInvestment = userData.monthlyInvestment ?? 0

  const withinCheckpoints = getWithinHorizonCheckpoints(objectives.horizonYears)
  const beyondCheckpoints = getBeyondHorizonCheckpoints(objectives.horizonYears)
  const allCheckpoints = Array.from(
    new Set([...withinCheckpoints, ...beyondCheckpoints])
  ).sort((a, b) => a - b)

  const projections = withinCheckpoints.map((year) =>
    buildProjection(currentCapital, monthlyInvestment, year, annualReturn)
  )
  const extendedProjections = beyondCheckpoints.map((year) =>
    buildProjection(currentCapital, monthlyInvestment, year, annualReturn)
  )
  const scenarios = buildScenarios(currentCapital, monthlyInvestment, allCheckpoints, annualReturn)

  const fireNumber =
    objectives.goal === 'fire' && objectives.fireMonthlyTarget
      ? calculateTargetCapital(objectives.fireMonthlyTarget, withdrawalRate)
      : null

  const yearsToFire =
    fireNumber !== null
      ? estimateYearsToTarget(currentCapital, monthlyInvestment, annualReturn, fireNumber)
      : null

  const passiveIncomeNumber =
    objectives.goal === 'passive_income' && objectives.passiveMonthlyTarget
      ? calculateTargetCapital(objectives.passiveMonthlyTarget, withdrawalRate)
      : null

  const yearsToPassiveIncome =
    passiveIncomeNumber !== null
      ? estimateYearsToTarget(currentCapital, monthlyInvestment, annualReturn, passiveIncomeNumber)
      : null

  return {
    profile,
    allocation,
    annualReturn,
    withdrawalRate,
    projections,
    extendedProjections,
    scenarios,
    fireNumber,
    yearsToFire,
    passiveIncomeNumber,
    yearsToPassiveIncome
  }
}
