import type { ReactNode } from 'react'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import '../index.css'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return <ThemeProvider>{children}</ThemeProvider>
}
