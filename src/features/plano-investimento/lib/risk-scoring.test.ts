import { calculateRawRiskScore, computeAdjustedProfile, hasAllRiskAnswers } from './risk-scoring'

describe('risk scoring', () => {
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
      goal: 'accumulation'
    })

    expect(profile.rawProfile).toBe('aggressive')
    expect(profile.adjustedProfile).toBe('moderate')
    expect(profile.adjustments).toHaveLength(2)
  })

  it('enforces minimum moderate profile for FIRE', () => {
    const profile = computeAdjustedProfile({
      score: 6,
      age: 30,
      horizonYears: 20,
      goal: 'fire'
    })

    expect(profile.rawProfile).toBe('conservative')
    expect(profile.adjustedProfile).toBe('moderate')
  })
})
