import type { ComponentType } from 'react'

export type PageProps = Record<string, unknown>

export interface PageContext {
  Page: ComponentType<PageProps>
  pageProps?: PageProps
  routeParams?: Record<string, string>
  urlOriginal?: string
  user?: unknown
}
