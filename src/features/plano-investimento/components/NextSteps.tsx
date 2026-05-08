import type { RiskProfile } from '../types'

interface Step {
  title: string
  desc: string
}

const UNIVERSAL_STEPS: Step[] = [
  {
    title: 'Estuda os módulos do curso O Grande Investimento',
    desc: 'O conhecimento é a base de qualquer bom investidor. Aplica o que aprendes no curso antes de tomares decisões com dinheiro real.'
  },
  {
    title: 'Paga-te primeiro todos os meses',
    desc: 'Logo que recebas o salário, transfere o valor do investimento para a tua corretora. O que não vês, não gastas.'
  },
  {
    title: 'Segue o plano e ajusta com a exposição aos mercados',
    desc: 'Um plano só funciona se for seguido. Com o tempo e mais experiência vais ganhando confiança para fazer ajustes informados.'
  }
]

const PROFILE_STEPS: Record<RiskProfile, [Step, Step]> = {
  conservative: [
    {
      title: 'Abre conta numa corretora de baixo custo',
      desc: 'Trade Republic ou DEGIRO são boas opções para Portugal — comissões reduzidas e interface simples para começar.'
    },
    {
      title: 'Não reagas a quedas de mercado',
      desc: 'O teu perfil já incorpora menor volatilidade. Em meses negativos, manter o plano é a decisão certa.'
    }
  ],
  moderate: [
    {
      title: 'Abre conta numa corretora de baixo custo',
      desc: 'Trade Republic ou DEGIRO são boas opções para Portugal — comissões reduzidas e boa variedade de ETFs.'
    },
    {
      title: 'Investe o mesmo valor todos os meses (DCA)',
      desc: 'Dollar-cost averaging — investe independentemente do estado do mercado. Elimina o risco de timing emocional.'
    }
  ],
  dynamic: [
    {
      title: 'Abre conta numa corretora com acesso a mercados internacionais',
      desc: 'Interactive Brokers ou DEGIRO oferecem acesso a bolsas globais com comissões competitivas para carteiras mais activas.'
    },
    {
      title: 'Investe o mesmo valor todos os meses (DCA)',
      desc: 'Dollar-cost averaging todos os meses independentemente do mercado — elimina o risco de timing emocional.'
    }
  ],
  aggressive: [
    {
      title: 'Abre conta numa corretora com acesso a mercados internacionais',
      desc: 'Interactive Brokers é a referência para carteiras activas — acesso global, comissões baixas e ferramentas avançadas.'
    },
    {
      title: 'Define limites e regista as tuas decisões',
      desc: 'Nunca mais de 15% em activos especulativos. Mantém um registo simples das tuas operações — ajuda a aprender e a evitar erros repetidos.'
    }
  ]
}

interface NextStepsProps {
  profile: RiskProfile
}

export function NextSteps({ profile }: NextStepsProps) {
  const steps: Step[] = [...UNIVERSAL_STEPS, ...PROFILE_STEPS[profile]]

  return (
    <section className="rounded-xl border border-[#badcd2] bg-white/90 px-5 py-5 dark:border-[#2b4e44] dark:bg-[#0f1715]/85">
      <h3 className="theme-heading mb-4 text-sm font-bold uppercase tracking-[0.07em]">
        Próximos passos
      </h3>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                         bg-[#014b35] text-[10px] font-bold text-white dark:bg-[#1ea37a]"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#014b35] dark:text-[#f3fff9]">{step.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#235a4a]/80 dark:text-[#a0d8c8]/80">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
