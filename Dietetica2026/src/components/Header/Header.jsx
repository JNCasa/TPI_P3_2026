import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/useTheme.js'
import { cerrarSesion as eliminarSesion } from '../../services/auth.js'
import './Header.css'

const navigationLinks = [
  { label: 'Tienda', to: '/Store' },
  { label: 'Productos', to: '/ListProducts' },
  { label: 'Usuarios', to: '/ListUsers' },
  { label: 'Nosotros', to: '/AboutUs' },
  { label: 'Preguntas frecuentes', to: '/FrequentQuestions' },
  { label: 'Iniciar sesión', to: '/LogIn' },
]

function Header({ userRole, setVisible_del_padre }) {
  const { mode, toggleMode } = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isManagementPage = ['/ListProducts', '/ListUsers'].includes(
    pathname.replace(/\/$/, ''),
  )
  const visibleNavigationLinks = navigationLinks.filter(({ to }) => {
    if (to === '/Store') return userRole === 'Cliente'
    if (to === '/ListProducts') return userRole === 'Vendedor'
    if (to === '/ListUsers') return userRole === 'Administrador'
    if (to === '/LogIn') return !userRole
    return true
  })

  function cerrarSesion() {
    eliminarSesion()
    setVisible_del_padre('')
    navigate('/LogIn')
  }

  return (
    <header className={`site-header${isManagementPage ? ' site-header--management' : ''}`}>
      {isManagementPage ? (
        <nav className="site-navbar site-navbar--management" aria-label="Navegación de administración">
          <NavLink className="logo-placeholder" to="/" aria-label="Volver al inicio">
            Agregar logo
          </NavLink>
          <NavLink className="management-back-link" to="/">
            Volver al inicio
          </NavLink>
        </nav>
      ) : (
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
          {visibleNavigationLinks.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
          {userRole && (
            <button type="button" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          )}
        </div>
      </nav>
      )}
    </header>
  )
}

export default Header
