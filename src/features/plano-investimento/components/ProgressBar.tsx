interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100))

  return (
    <div className="mb-6">
      <div className="theme-muted mb-2 flex items-center justify-between text-sm">
        <span>
          Passo {currentStep} de {totalSteps}
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#badcd2]/70 dark:bg-[#2b4e44]">
        <div
          className="h-2 rounded-full bg-[#014b35] transition-all duration-300 dark:bg-[#00ffb3]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
