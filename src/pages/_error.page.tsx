function ErrorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-red-900">Erro na pagina</h1>
        <p className="mt-3 text-red-700">Ocorreu um erro inesperado. Tenta recarregar.</p>
      </section>
    </main>
  )
}

export default {
  Page: ErrorPage,
  documentProps: {
    title: 'Erro | Gerador de Portfolios'
  }
}
