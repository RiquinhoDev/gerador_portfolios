import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr/server'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const root = __dirname

startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(
      sirv('dist/client', {
        maxAge: 31536000,
        immutable: true
      })
    )
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res) => {
    const pageContextInit = { urlOriginal: req.originalUrl }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) {
      res.status(404).send('Page not found')
      return
    }

    const { statusCode, headers = [] } = httpResponse
    headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(statusCode)
    httpResponse.pipe(res)
  })

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`)
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`)
  })
}
