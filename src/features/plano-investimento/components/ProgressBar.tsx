interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const STEP_LABELS = ['Dados', 'Objetivos', 'Risco']

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100))

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = currentStep > stepNumber
          const isActive = currentStep === stepNumber
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold
                  transition-all duration-300
                  ${
                    isCompleted
                      ? 'border-[#014b35] bg-[#014b35] text-white dark:border-[#00ffb3] dark:bg-[#00ffb3] dark:text-[#0f1715]'
                      : isActive
                        ? 'border-[#45d5aa] bg-[#45d5aa]/15 text-[#014b35] dark:text-[#f3fff9]'
                        : 'border-[#badcd2] bg-transparent text-[#badcd2] dark:border-[#2b4e44] dark:text-[#2b4e44]'
                  }`}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#014b35] dark:text-[#f3fff9]' : 'theme-muted'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#badcd2]/70 dark:bg-[#2b4e44]">
        <div
          className="h-full rounded-full bg-[#014b35] transition-all duration-500 ease-out dark:bg-[#00ffb3]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
