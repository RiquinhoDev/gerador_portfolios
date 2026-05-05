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
      <header className="border-b border-[#45d5aa]/35 bg-black/35 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-4xl items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Plano de Investimento OGI</h1>
            <p className="mt-1 text-sm text-[#d8fff2]/95">
              Wizard de perfilagem de investidor, 100% client-side.
            </p>
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
