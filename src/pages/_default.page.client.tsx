import { hydrateRoot } from 'react-dom/client'
import { PageShell } from '../renderer/PageShell'
import type { PageContext } from '../types/pageContext'

export const passToClient = ['pageProps', 'routeParams', 'user']

export function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext
  const container = document.getElementById('app')
  if (!container) throw new Error('Elemento #app nao encontrado')

  hydrateRoot(
    container,
    <PageShell>
      <Page {...(pageProps || {})} />
    </PageShell>
  )
}
