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
  const progress = `${currentQuestionIndex + 1}/${RISK_QUESTIONS.length}`

  return (
    <div className="space-y-4">
      <h2 className="theme-heading text-xl font-semibold">Step 3: Tolerancia ao risco</h2>
      <p className="theme-muted text-sm">Responde as 5 perguntas para calcular teu perfil.</p>

      <div className="rounded-lg border border-[#badcd2] bg-[#e0f2ef]/70 p-3 dark:border-[#2b4e44] dark:bg-[#13211d]">
        <div className="mb-2 flex items-center justify-between text-sm text-[#235a4a] dark:text-[#c7f8e9]">
          <span>Pergunta {progress}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / RISK_QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#badcd2]/70 dark:bg-[#2b4e44]">
          <div
            className="h-2 rounded-full bg-[#014b35] transition-all duration-300 dark:bg-[#00ffb3]"
            style={{ width: `${((currentQuestionIndex + 1) / RISK_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <section className="rounded-xl border border-[#badcd2] bg-white/90 p-4 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
        <fieldset>
          <legend className="theme-heading font-medium">{currentQuestion.prompt}</legend>
          <div role="radiogroup" className="mt-4 space-y-2">
          {currentQuestion.options.map((option) => {
            const selected = selectedValue === option.points
            return (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onAnswerChange(currentQuestionIndex, option.points)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                  selected
                    ? 'border-[#00ffb3] bg-[#00ffb3] text-[#05281d]'
                    : 'border-[#badcd2] bg-white text-[#014b35] hover:border-[#45d5aa] dark:border-[#2b4e44] dark:bg-[#13211d] dark:text-[#f3fff9]'
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
          className="theme-btn-ghost rounded-lg px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pergunta anterior
        </button>
        <button
          type="button"
          onClick={() =>
            onQuestionChange(Math.min(RISK_QUESTIONS.length - 1, currentQuestionIndex + 1))
          }
          disabled={currentQuestionIndex === RISK_QUESTIONS.length - 1}
          className="theme-btn-ghost rounded-lg px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Proxima pergunta
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
