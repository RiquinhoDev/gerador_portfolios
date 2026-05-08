import type { AssetAllocation, RiskProfile } from '../types'

export const RISK_PROFILE_ORDER: RiskProfile[] = ['conservative', 'moderate', 'dynamic', 'aggressive']

export const PROFILE_LABELS: Record<RiskProfile, string> = {
  conservative: 'Conservador',
  moderate: 'Moderado',
  dynamic: 'Dinâmico',
  aggressive: 'Agressivo'
}

export const PROFILE_DESCRIPTIONS: Record<RiskProfile, string> = {
  conservative: 'Prioridade em preservar capital com crescimento moderado.',
  moderate: 'Equilíbrio entre crescimento e segurança.',
  dynamic: 'Aceita volatilidade para retornos superiores.',
  aggressive: 'Foco em maximizar retorno com risco elevado.'
}

export const PROFILE_ANNUAL_RETURNS: Record<RiskProfile, number> = {
  conservative: 0.04,
  moderate: 0.06,
  dynamic: 0.08,
  aggressive: 0.1
}

export const PROFILE_WITHDRAWAL_RATES: Record<RiskProfile, number> = {
  conservative: 0.03,
  moderate: 0.035,
  dynamic: 0.04,
  aggressive: 0.045
}

export const PROFILE_ALLOCATIONS: Record<RiskProfile, AssetAllocation> = {
  conservative: {
    globalETFs: 50,
    bonds: 30,
    stocks: 5,
    gold: 10,
    reits: 5,
    highRisk: 0
  },
  moderate: {
    globalETFs: 55,
    bonds: 15,
    stocks: 15,
    gold: 8,
    reits: 5,
    highRisk: 2
  },
  dynamic: {
    globalETFs: 50,
    bonds: 5,
    stocks: 25,
    gold: 5,
    reits: 5,
    highRisk: 10
  },
  aggressive: {
    globalETFs: 40,
    bonds: 0,
    stocks: 35,
    gold: 5,
    reits: 5,
    highRisk: 15
  }
}

export function getProfileFromScore(score: number): RiskProfile {
  if (score <= 8) return 'conservative'
  if (score <= 12) return 'moderate'
  if (score <= 16) return 'dynamic'
  return 'aggressive'
}

export function moveProfile(profile: RiskProfile, delta: number): RiskProfile {
  const index = RISK_PROFILE_ORDER.indexOf(profile)
  const next = Math.max(0, Math.min(RISK_PROFILE_ORDER.length - 1, index + delta))
  return RISK_PROFILE_ORDER[next]
}

export function getAllocation(profile: RiskProfile): AssetAllocation {
  return PROFILE_ALLOCATIONS[profile]
}
