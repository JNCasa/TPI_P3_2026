import { useContext } from 'react'
import ThemeContext from './theme.js'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}
