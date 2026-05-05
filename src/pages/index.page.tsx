function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Gerador de Portfolios</h1>
        <p className="mt-3 text-slate-600">
          Base pronta. Wizard inicial de investimento ja esta disponivel.
        </p>
        <a
          href="/plano-investimento"
          className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Abrir Plano de Investimento
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
