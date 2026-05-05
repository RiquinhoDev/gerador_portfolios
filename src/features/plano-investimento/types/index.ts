export interface UserData {
  name?: string
  age: number | null
  monthlyIncome: number | null
  monthlyInvestment: number | null
  currentCapital: number | null
}

export type InvestmentGoal = 'accumulation' | 'passive_income' | 'fire'

export interface Objectives {
  goal: InvestmentGoal | null
  horizonYears: number
  fireMonthlyTarget: number | null
}

export type RiskProfile = 'conservative' | 'moderate' | 'dynamic' | 'aggressive'

export interface RiskQuestion {
  id: string
  prompt: string
  options: Array<{
    label: string
    points: 1 | 2 | 3 | 4
  }>
}

export interface RiskAssessment {
  answers: number[]
  rawScore: number
}

export interface AssetAllocation {
  globalETFs: number
  bonds: number
  stocks: number
  gold: number
  reits: number
  highRisk: number
}

export interface Projection {
  year: number
  totalInvested: number
  totalValue: number
  returns: number
}

export interface ProfileResult {
  rawProfile: RiskProfile
  adjustedProfile: RiskProfile
  adjustments: string[]
}

export interface InvestmentPlan {
  profile: ProfileResult
  allocation: AssetAllocation
  annualReturn: number
  projections: Projection[]
  fireNumber: number | null
  yearsToFire: number | null
}

export interface WizardState {
  userData: UserData
  objectives: Objectives
  riskAssessment: RiskAssessment
}
