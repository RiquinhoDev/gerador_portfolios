import { calculateRawRiskScore, computeAdjustedProfile, hasAllCapacityAnswers, hasAllRiskAnswers } from './risk-scoring'
import { INITIAL_CAPACITY_ASSESSMENT } from './constants'

const neutral = INITIAL_CAPACITY_ASSESSMENT

describe('risk scoring — base', () => {
  it('calculates raw score', () => {
    expect(calculateRawRiskScore([1, 2, 3, 4, 4])).toBe(14)
  })

  it('checks if all answers are valid', () => {
    expect(hasAllRiskAnswers([1, 2, 3, 4, 4])).toBe(true)
    expect(hasAllRiskAnswers([1, 2, 0, 4, 4])).toBe(false)
  })

  it('reduces profile when age and horizon demand lower risk', () => {
    const profile = computeAdjustedProfile({
      score: 19,
      age: 58,
      horizonYears: 3,
      goal: 'accumulation',
      capacity: neutral
    })

    expect(profile.rawProfile).toBe('aggressive')
    expect(profile.adjustedProfile).toBe('moderate')
    expect(profile.adjustments).toHaveLength(2)
  })

  it('enforces minimum moderate profile for FIRE with long horizon', () => {
    const profile = computeAdjustedProfile({
      score: 6,
      age: 30,
      horizonYears: 20,
      goal: 'fire',
      capacity: neutral
    })

    expect(profile.rawProfile).toBe('conservative')
    expect(profile.adjustedProfile).toBe('moderate')
  })
})

describe('Ponto 3 — regra FIRE por horizonte', () => {
  it('FIRE + horizonte curto: não força Moderado, gera aviso', () => {
    const profile = computeAdjustedProfile({
      score: 6,
      age: 30,
      horizonYears: 7,
      goal: 'fire',
      capacity: neutral
    })
    expect(profile.adjustedProfile).toBe('conservative')
    expect(profile.warnings.some((w) => w.includes('horizonte curto'))).toBe(true)
  })

  it('FIRE + horizonte = 10 (limite): força Moderado', () => {
    const profile = computeAdjustedProfile({
      score: 6,
      age: 30,
      horizonYears: 10,
      goal: 'fire',
      capacity: neutral
    })
    expect(profile.adjustedProfile).toBe('moderate')
  })
})

describe('Ponto 4 — capacidade de risco', () => {
  it('emergencyFund=none reduz 1 nível e gera aviso', () => {
    const profile = computeAdjustedProfile({
      score: 14,
      age: 30,
      horizonYears: 20,
      goal: 'accumulation',
      capacity: { ...neutral, emergencyFund: 'none' }
    })
    expect(profile.rawProfile).toBe('dynamic')
    expect(profile.adjustedProfile).toBe('moderate')
    expect(profile.warnings.length).toBeGreaterThan(0)
  })

  it('emergencyFund=lt3 reduz 1 nível', () => {
    const profile = computeAdjustedProfile({
      score: 14,
      age: 30,
      horizonYears: 20,
      goal: 'accumulation',
      capacity: { ...neutral, emergencyFund: 'lt3' }
    })
    expect(profile.adjustedProfile).toBe('moderate')
  })

  it('emergencyFund=3to6 não reduz perfil', () => {
    const profile = computeAdjustedProfile({
      score: 14,
      age: 30,
      horizonYears: 20,
      goal: 'accumulation',
      capacity: { ...neutral, emergencyFund: '3to6' }
    })
    expect(profile.adjustedProfile).toBe('dynamic')
  })

  it('debtLevel=high gera aviso mas não reduz perfil', () => {
    const profile = computeAdjustedProfile({
      score: 14,
      age: 30,
      horizonYears: 20,
      goal: 'accumulation',
      capacity: { ...neutral, debtLevel: 'high' }
    })
    expect(profile.adjustedProfile).toBe('dynamic')
    expect(profile.warnings.some((w) => w.includes('dívida'))).toBe(true)
  })

  it('incomeStability=unstable reduz 1 nível', () => {
    const profile = computeAdjustedProfile({
      score: 14,
      age: 30,
      horizonYears: 20,
      goal: 'accumulation',
      capacity: { ...neutral, incomeStability: 'unstable' }
    })
    expect(profile.adjustedProfile).toBe('moderate')
  })

  it('capacidade muito fraca pode reduzir 2 níveis (fundo + rendimento)', () => {
    const profile = computeAdjustedProfile({
      score: 20,
      age: 30,
      horizonYears: 20,
      goal: 'accumulation',
      capacity: { emergencyFund: 'none', debtLevel: 'high', incomeStability: 'unstable' }
    })
    // aggressive → dynamic (fundo) → moderate (rendimento)
    expect(profile.rawProfile).toBe('aggressive')
    expect(profile.adjustedProfile).toBe('moderate')
    expect(profile.adjustments.length).toBe(2)
  })
})

describe('hasAllCapacityAnswers', () => {
  it('retorna false se algum campo for null', () => {
    expect(hasAllCapacityAnswers(neutral)).toBe(false)
    expect(hasAllCapacityAnswers({ emergencyFund: '3to6', debtLevel: null, incomeStability: 'stable' })).toBe(false)
  })

  it('retorna true quando todos os campos preenchidos', () => {
    expect(
      hasAllCapacityAnswers({ emergencyFund: '3to6', debtLevel: 'low', incomeStability: 'stable' })
    ).toBe(true)
  })
})
