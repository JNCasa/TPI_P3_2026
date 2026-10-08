import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { useTheme } from './context/useTheme.js'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import PagesRoutes from './PagesRoutes.jsx'

function AppLayout() {
  const { mode } = useTheme()

  return (
    <div className="app-shell" data-theme={mode}>
      <Header />
      <PagesRoutes />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
