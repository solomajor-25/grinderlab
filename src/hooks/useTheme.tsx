import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getPreferences, savePreferences } from '@/lib/storage'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getPreferences().theme)

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    savePreferences({ theme: next })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: (t: Theme) => { setTheme(t); savePreferences({ theme: t }) } }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
