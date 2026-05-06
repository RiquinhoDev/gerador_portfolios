import { RISK_QUESTIONS } from '../lib/constants'

interface StepRiskToleranceProps {
  answers: number[]
  currentQuestionIndex: number
  error?: string
  onAnswerChange: (questionIndex: number, points: number) => void
  onQuestionChange: (questionIndex: number) => void
}

export function StepRiskTolerance({
  answers,
  currentQuestionIndex,
  error,
  onAnswerChange,
  onQuestionChange
}: StepRiskToleranceProps) {
  const currentQuestion = RISK_QUESTIONS[currentQuestionIndex]
  const selectedValue = answers[currentQuestionIndex]

  return (
    <div>
      <h2 className="theme-heading text-2xl font-bold leading-tight tracking-[-0.02em]">
        Tolerância ao risco
      </h2>
      <p className="theme-muted mt-2 text-sm leading-relaxed">
        Responde às 5 perguntas para calcular o teu perfil.
      </p>

      <div className="mt-6 space-y-5">
        <div className="rounded-xl border border-[#badcd2]/80 bg-[#e0f2ef]/50 px-4 py-3 dark:border-[#2b4e44] dark:bg-[#13211d]">
          <div className="flex items-center justify-between text-xs">
            <span className="theme-muted font-medium">
              Pergunta {currentQuestionIndex + 1}/{RISK_QUESTIONS.length}
            </span>
            <span className="font-semibold text-[#014b35] dark:text-[#00ffb3]">
              {Math.round(((currentQuestionIndex + 1) / RISK_QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#badcd2]/70 dark:bg-[#2b4e44]">
            <div
              className="h-full rounded-full bg-[#014b35] transition-all duration-500 ease-out dark:bg-[#00ffb3]"
              style={{ width: `${((currentQuestionIndex + 1) / RISK_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <section className="rounded-xl border border-[#badcd2] bg-white/90 p-6 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
          <fieldset>
            <legend className="theme-heading text-base font-semibold leading-snug">
              {currentQuestion.prompt}
            </legend>
            <div role="radiogroup" className="mt-5 space-y-2.5">
              {currentQuestion.options.map((option) => {
                const selected = selectedValue === option.points
                return (
                  <button
                    key={option.label}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onAnswerChange(currentQuestionIndex, option.points)}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]
                      ${
                        selected
                          ? 'border-[#00ffb3] bg-[#00ffb3] font-semibold text-[#05281d] shadow-[0_2px_8px_rgba(0,255,179,0.2)]'
                          : `border-[#badcd2] bg-white text-[#014b35]
                             hover:border-[#45d5aa] hover:bg-[#e0f2ef]/50
                             dark:border-[#2b4e44] dark:bg-[#13211d] dark:text-[#f3fff9]
                             dark:hover:border-[#45d5aa]`
                      }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </section>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onQuestionChange(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="theme-btn-ghost rounded-lg px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Pergunta anterior
          </button>
          <button
            type="button"
            onClick={() =>
              onQuestionChange(Math.min(RISK_QUESTIONS.length - 1, currentQuestionIndex + 1))
            }
            disabled={currentQuestionIndex === RISK_QUESTIONS.length - 1}
            className="theme-btn-ghost rounded-lg px-4 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima pergunta
          </button>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
