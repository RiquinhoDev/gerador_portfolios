import type { CapacityAssessment, InvestmentGoal, ProfileResult, RiskProfile } from '../types'
import { getProfileFromScore, moveProfile } from './profiles'

export function calculateRawRiskScore(answers: number[]): number {
  return answers.reduce((sum, current) => sum + current, 0)
}

export function hasAllRiskAnswers(answers: number[]): boolean {
  return answers.every((answer) => answer >= 1 && answer <= 4)
}

export function hasAllCapacityAnswers(capacity: CapacityAssessment): boolean {
  return (
    capacity.emergencyFund !== null &&
    capacity.debtLevel !== null &&
    capacity.incomeStability !== null
  )
}

interface ProfileAdjustmentInput {
  score: number
  age: number
  horizonYears: number
  goal: InvestmentGoal
  capacity: CapacityAssessment
}

export function computeAdjustedProfile(input: ProfileAdjustmentInput): ProfileResult {
  const rawProfile = getProfileFromScore(input.score)
  const adjustments: string[] = []
  const warnings: string[] = []
  let adjustedProfile: RiskProfile = rawProfile

  if (input.age > 55) {
    adjustedProfile = moveProfile(adjustedProfile, -1)
    adjustments.push('Idade acima de 55: perfil reduzido 1 nível.')
  }

  if (input.horizonYears < 5) {
    adjustedProfile = moveProfile(adjustedProfile, -1)
    adjustments.push('Horizonte abaixo de 5 anos: perfil reduzido 1 nível.')
  }

  if (
    input.capacity.emergencyFund === 'none' ||
    input.capacity.emergencyFund === 'lt3'
  ) {
    adjustedProfile = moveProfile(adjustedProfile, -1)
    adjustments.push('Fundo de emergência insuficiente: perfil reduzido 1 nível.')
    warnings.push(
      'Recomendamos constituir um fundo de emergência de 3-6 meses de despesas antes de aumentar a exposição ao risco.'
    )
  }

  if (input.capacity.debtLevel === 'high') {
    warnings.push(
      'Tens dívida de curto prazo elevada. Considera liquidá-la antes de aumentar investimentos — os juros do crédito pessoal superam geralmente o retorno esperado.'
    )
  }

  if (input.capacity.incomeStability === 'unstable') {
    adjustedProfile = moveProfile(adjustedProfile, -1)
    adjustments.push('Rendimento instável: perfil reduzido 1 nível.')
    warnings.push(
      'Com rendimento instável é importante manter maior liquidez. Considera um fundo de emergência mais robusto antes de investir a longo prazo.'
    )
  }

  // FIRE rule: só força Moderado se o horizonte for longo o suficiente
  if (input.goal === 'fire' && input.horizonYears >= 10 && adjustedProfile === 'conservative') {
    adjustedProfile = 'moderate'
    adjustments.push('Objetivo FIRE com horizonte longo: perfil mínimo ajustado para Moderado.')
  } else if (
    input.goal === 'fire' &&
    input.horizonYears < 10 &&
    (adjustedProfile === 'conservative' || adjustedProfile === 'moderate')
  ) {
    warnings.push(
      'Objetivo FIRE com horizonte curto e perfil conservador — o retorno esperado pode não ser suficiente para atingir a independência financeira neste prazo. Considera rever o horizonte ou o valor mensal pretendido.'
    )
  }

  return {
    rawProfile,
    adjustedProfile,
    adjustments,
    warnings
  }
}
