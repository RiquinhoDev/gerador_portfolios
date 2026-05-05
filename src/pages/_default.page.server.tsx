import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import { PageShell } from '../renderer/PageShell'
import type { PageContext } from '../types/pageContext'

export const passToClient = ['routeParams', 'pageProps', 'user']

export async function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell>
      <Page {...(pageProps || {})} />
    </PageShell>
  )

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Gerador de Portfolios</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return { documentHtml }
}
