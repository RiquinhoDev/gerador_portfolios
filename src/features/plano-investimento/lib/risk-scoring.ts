import type { InvestmentGoal, ProfileResult, RiskProfile } from '../types'
import { getProfileFromScore, moveProfile } from './profiles'

export function calculateRawRiskScore(answers: number[]): number {
  return answers.reduce((sum, current) => sum + current, 0)
}

export function hasAllRiskAnswers(answers: number[]): boolean {
  return answers.every((answer) => answer >= 1 && answer <= 4)
}

interface ProfileAdjustmentInput {
  score: number
  age: number
  horizonYears: number
  goal: InvestmentGoal
}

export function computeAdjustedProfile(input: ProfileAdjustmentInput): ProfileResult {
  const rawProfile = getProfileFromScore(input.score)
  const adjustments: string[] = []
  let adjustedProfile: RiskProfile = rawProfile

  if (input.age > 55) {
    adjustedProfile = moveProfile(adjustedProfile, -1)
    adjustments.push('Idade acima de 55: perfil reduzido 1 nível.')
  }

  if (input.horizonYears < 5) {
    adjustedProfile = moveProfile(adjustedProfile, -1)
    adjustments.push('Horizonte abaixo de 5 anos: perfil reduzido 1 nível.')
  }

  if (input.goal === 'fire' && adjustedProfile === 'conservative') {
    adjustedProfile = 'moderate'
    adjustments.push('Objetivo FIRE: perfil mínimo ajustado para Moderado.')
  }

  return {
    rawProfile,
    adjustedProfile,
    adjustments
  }
}
