import { useMemo, useState } from 'react'
import { buildInvestmentPlan } from '../lib/calculations'
import { INITIAL_WIZARD_STATE, RISK_QUESTIONS, WIZARD_TOTAL_STEPS } from '../lib/constants'
import { calculateRawRiskScore, hasAllRiskAnswers } from '../lib/risk-scoring'
import type { Objectives, UserData, WizardState } from '../types'
import { ProgressBar } from './ProgressBar'
import { ResultsPanel } from './ResultsPanel'
import { StepIntro } from './StepIntro'
import { StepObjectives } from './StepObjectives'
import { StepPersonalData } from './StepPersonalData'
import { StepRiskTolerance } from './StepRiskTolerance'

type PersonalDataErrors = Partial<Record<keyof UserData, string>>
type ObjectivesErrors = {
  goal?: string
  fireMonthlyTarget?: string
}

export function InvestmentWizard() {
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE)
  const [step, setStep] = useState(0)
  const [riskQuestionIndex, setRiskQuestionIndex] = useState(0)
  const [personalDataErrors, setPersonalDataErrors] = useState<PersonalDataErrors>({})
  const [objectivesErrors, setObjectivesErrors] = useState<ObjectivesErrors>({})
  const [riskError, setRiskError] = useState('')

  const rawScore = useMemo(
    () => calculateRawRiskScore(state.riskAssessment.answers),
    [state.riskAssessment.answers]
  )
  const investmentPlan = useMemo(
    () => buildInvestmentPlan(state.userData, state.objectives, rawScore),
    [state.objectives, state.userData, rawScore]
  )

  const isResultsStep = step === WIZARD_TOTAL_STEPS

  function validatePersonalData(value: UserData): boolean {
    const nextErrors: PersonalDataErrors = {}

    if ((value.name ?? '').length > 50) nextErrors.name = 'Nome máximo 50 caracteres.'
    if (value.age === null || value.age < 18) nextErrors.age = 'Idade mínima: 18 anos.'
    if (value.monthlyIncome === null || value.monthlyIncome < 0)
      nextErrors.monthlyIncome = 'Rendimento deve ser igual ou superior a 0.'
    if (value.monthlyInvestment === null || value.monthlyInvestment < 25)
      nextErrors.monthlyInvestment = 'Investimento mensal mínimo: 25 EUR.'
    if (value.currentCapital === null || value.currentCapital < 0)
      nextErrors.currentCapital = 'Capital atual deve ser igual ou superior a 0.'

    setPersonalDataErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function validateObjectives(value: Objectives): boolean {
    const nextErrors: ObjectivesErrors = {}

    if (!value.goal) nextErrors.goal = 'Escolhe um objetivo principal.'
    if (
      (value.goal === 'fire' || value.goal === 'passive_income') &&
      (value.fireMonthlyTarget === null || value.fireMonthlyTarget <= 0)
    ) {
      nextErrors.fireMonthlyTarget = 'Define a renda passiva mensal desejada (valor superior a 0).'
    }

    setObjectivesErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function validateRiskAnswers(answers: number[]): boolean {
    if (!hasAllRiskAnswers(answers)) {
      setRiskError('Responde às 5 perguntas antes de continuar.')
      return false
    }
    setRiskError('')
    return true
  }

  function handleNextStep() {
    if (step === 1 && !validatePersonalData(state.userData)) return
    if (step === 2 && !validateObjectives(state.objectives)) return

    if (step === 3) {
      if (!validateRiskAnswers(state.riskAssessment.answers)) return
      setState((current) => ({
        ...current,
        riskAssessment: {
          ...current.riskAssessment,
          rawScore: calculateRawRiskScore(current.riskAssessment.answers)
        }
      }))
    }

    setStep((current) => Math.min(WIZARD_TOTAL_STEPS, current + 1))
  }

  function handlePreviousStep() {
    setStep((current) => Math.max(0, current - 1))
  }

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-4 md:px-6 md:py-6">
      <section className="glass-card rounded-2xl p-5 md:p-8">
        {step > 0 && !isResultsStep && <ProgressBar currentStep={step} totalSteps={WIZARD_TOTAL_STEPS} />}

        {step === 0 && (
          <div className="step-enter" key="step-0">
            <StepIntro />
          </div>
        )}

        {step === 1 && (
          <div className="step-enter" key="step-1">
            <StepPersonalData
              value={state.userData}
              errors={personalDataErrors}
              onChange={(value) => {
                setState((current) => ({ ...current, userData: value }))
                if (Object.keys(personalDataErrors).length) validatePersonalData(value)
              }}
            />
          </div>
        )}

        {step === 2 && (
          <div className="step-enter" key="step-2">
            <StepObjectives
              value={state.objectives}
              errors={objectivesErrors}
              onChange={(value) => {
                setState((current) => ({ ...current, objectives: value }))
                if (Object.keys(objectivesErrors).length) validateObjectives(value)
              }}
            />
          </div>
        )}

        {step === 3 && (
          <div className="step-enter" key="step-3">
            <StepRiskTolerance
              answers={state.riskAssessment.answers}
              currentQuestionIndex={riskQuestionIndex}
              error={riskError}
              onQuestionChange={setRiskQuestionIndex}
              onAnswerChange={(questionIndex, points) => {
                setState((current) => {
                  const nextAnswers = [...current.riskAssessment.answers]
                  nextAnswers[questionIndex] = points
                  return {
                    ...current,
                    riskAssessment: {
                      ...current.riskAssessment,
                      answers: nextAnswers,
                      rawScore: calculateRawRiskScore(nextAnswers)
                    }
                  }
                })

                if (riskQuestionIndex < RISK_QUESTIONS.length - 1) {
                  setRiskQuestionIndex((current) => current + 1)
                }
                setRiskError('')
              }}
            />
          </div>
        )}

        {step === 4 && (
          <div className="step-enter" key="step-4">
            <ResultsPanel
              state={{ ...state, riskAssessment: { ...state.riskAssessment, rawScore } }}
              plan={investmentPlan}
              onReset={() => {
                setState(INITIAL_WIZARD_STATE)
                setStep(0)
                setRiskQuestionIndex(0)
                setPersonalDataErrors({})
                setObjectivesErrors({})
                setRiskError('')
              }}
            />
          </div>
        )}

        {!isResultsStep && (
          <footer className="mt-8 flex items-center justify-between gap-4">
            {step === 0 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="theme-btn-primary ml-auto rounded-lg px-8 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
              >
                Começar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="theme-btn-ghost rounded-lg px-5 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="theme-btn-primary rounded-lg px-6 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
                >
                  Seguinte
                </button>
              </>
            )}
          </footer>
        )}
      </section>
    </main>
  )
}
