import { ThemeToggle } from '~/components/ThemeToggle'
import { InvestmentWizard } from '~/features/plano-investimento/components/InvestmentWizard'

function PlanoInvestimentoPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/assets/backg1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <a href="#main-content" className="skip-link">
        Saltar para conteudo principal
      </a>
      <header className="border-b border-[#45d5aa]/25 bg-black/30 px-4 py-5 backdrop-blur-sm md:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-[-0.02em] text-white md:text-2xl">
              Plano de Investimento OGI
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <InvestmentWizard />
    </div>
  )
}

export default {
  Page: PlanoInvestimentoPage,
  documentProps: {
    title: 'Plano de Investimento OGI'
  }
}
