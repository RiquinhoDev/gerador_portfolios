export function StepIntro() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="theme-heading text-2xl font-bold leading-tight tracking-[-0.02em]">
          O que é o Plano de Investimento OGI?
        </h2>
        <p className="theme-muted mt-3 text-sm leading-relaxed">
          Esta ferramenta cria um plano de investimento personalizado com base no teu perfil financeiro e objetivos. Tudo calculado localmente — sem registo, sem dados enviados.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ),
            title: 'Perfil de risco',
            description: 'Calculamos o teu perfil com base em 5 perguntas sobre comportamento e experiência.'
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 15l4-5 3 3 3-4 4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
            title: 'Projeção de crescimento',
            description: 'Vês quanto o teu capital pode crescer ao longo dos anos com juros compostos.'
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 9h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ),
            title: 'Alocação de ativos',
            description: 'Recebes uma sugestão de carteira adequada ao teu perfil e horizonte temporal.'
          }
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-[#badcd2] bg-white/90 p-4 dark:border-[#2b4e44] dark:bg-[#0f1715]/85"
          >
            <div className="mb-2 text-[#014b35] dark:text-[#00ffb3]">{item.icon}</div>
            <p className="theme-heading text-sm font-semibold">{item.title}</p>
            <p className="theme-muted mt-1 text-xs leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#badcd2]/60 bg-[#e0f2ef]/50 px-4 py-3 dark:border-[#2b4e44] dark:bg-[#13211d]">
        <p className="theme-muted text-xs leading-relaxed">
          <span className="font-semibold text-[#014b35] dark:text-[#00ffb3]">3 passos simples:</span>
          {' '}Dados pessoais → Objetivos → Tolerância ao risco. O plano é gerado instantaneamente no final.
        </p>
      </div>
    </div>
  )
}
