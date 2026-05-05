import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border border-[#45d5aa]/40 bg-[#014b35]/45 px-3 py-2 text-sm text-[#d8fff2]"
        aria-label="Alternar tema"
      >
        Tema
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="inline-flex items-center gap-2 rounded-lg border border-[#45d5aa]/45 bg-[#014b35]/45 px-3 py-2 text-sm text-[#f3fff9] transition hover:bg-[#014b35]/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45d5aa]"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? 'Claro' : 'Escuro'}
    </button>
  )
}
