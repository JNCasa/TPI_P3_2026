import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/useTheme.js'
import './Header.css'

const navigationLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Productos', to: '/ListProducts' },
  { label: 'Usuarios', to: '/ListUsers' },
  { label: 'Nosotros', to: '/AboutUs' },
  { label: 'Preguntas frecuentes', to: '/FrequentQuestions' },
  { label: 'Iniciar sesión', to: '/LogIn' },
  { label: 'Crear cuenta', to: '/CreateAccount' },
  { label: 'Carrito', to: '/Cart' },
]

function Header() {
  const { mode, toggleMode } = useTheme()

  return (
    <header className="site-header">
      <nav className="site-navbar" aria-label="Navegación principal">
        <div className="navbar-main">
          <NavLink className="logo-placeholder" to="/" aria-label="Inicio">
            Agregar logo
          </NavLink>
          <label className="search-box">
            <span className="visually-hidden">Buscar</span>
            <input type="search" placeholder="Buscar" />
            <svg
              className="search-icon"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </label>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleMode}
            aria-label={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'luminoso'}`}
            title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'luminoso'}`}
          >
            {mode === 'light' ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.6 8.6 0 1 0 20.2 15.4Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            )}
            <span>{mode === 'light' ? 'Modo oscuro' : 'Modo luminoso'}</span>
          </button>
        </div>
        <div className="site-navigation">
          {navigationLinks.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Header
