function HomePage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-16"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <section className="glass-card w-full max-w-2xl rounded-2xl px-8 py-10 md:px-12 md:py-14">
        <p className="theme-muted mb-3 text-xs font-semibold uppercase tracking-[0.08em]">
          Planeamento financeiro pessoal
        </p>

        <h1 className="theme-heading text-3xl font-bold leading-tight tracking-[-0.02em] md:text-4xl">
          Gerador de Portfolios
        </h1>

        <p className="theme-muted mt-4 max-w-md text-base leading-relaxed">
          Descobre o teu perfil de investidor e recebe um plano de alocação personalizado —
          completamente no browser, sem enviar dados.
        </p>

        <div className="mt-8 h-px w-16 bg-[#45d5aa]/50" />

        <a
          href="/plano-investimento"
          className="theme-btn-primary mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
        >
          Criar o meu plano
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>
    </main>
  )
}

export default {
  Page: HomePage,
  documentProps: {
    title: 'Gerador de Portfolios'
  }
}
