import { useMemo, useState } from 'react'
import ThemeContext from './theme.js'

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light')
  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((currentMode) => (
        currentMode === 'light' ? 'dark' : 'light'
      )),
    }),
    [mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
