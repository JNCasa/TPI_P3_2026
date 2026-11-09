import { useEffect, useRef, useState } from 'react'
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
  const navigationRef = useRef(null)
  const searchInputRef = useRef(null)
  const [navigationOpen, setNavigationOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
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

  useEffect(() => {
    const navigation = navigationRef.current
    if (!navigation) return undefined

    const handleShown = () => setNavigationOpen(true)
    const handleHidden = () => setNavigationOpen(false)
    navigation.addEventListener('shown.bs.collapse', handleShown)
    navigation.addEventListener('hidden.bs.collapse', handleHidden)

    return () => {
      navigation.removeEventListener('shown.bs.collapse', handleShown)
      navigation.removeEventListener('hidden.bs.collapse', handleHidden)
    }
  }, [])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  function cerrarSesion() {
    eliminarSesion()
    setVisible_del_padre('')
    navigate('/LogIn')
  }

  if (isManagementPage) return null

  return (
    <header className="site-header">
      <nav className="site-navbar" aria-label="Navegación principal">
        <div className="navbar-main">
          <NavLink className="header-home" to="/" aria-label="Inicio, Dietética BeGreen">
            <img src="/images/casita-isotipo.png" alt="" />
          </NavLink>
          <div className="header-branding">
            <span className="header-branding__name">Dietética BeGreen</span>
            <span className="header-branding__tagline">Tu salud, nuestra prioridad</span>
          </div>
          <div className={`search-box${searchOpen ? ' search-box--open' : ''}`}>
            {searchOpen && (
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar"
                aria-label="Buscar productos"
              />
            )}
            <button
              type="button"
              className="search-toggle"
              aria-label={searchOpen ? 'Ocultar búsqueda' : 'Mostrar búsqueda'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((isOpen) => !isOpen)}
            >
              <svg
                className="search-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
            </button>
          </div>
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
          </button>
          <button
            className="navigation-toggle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#primary-navigation"
            aria-label={navigationOpen ? 'Ocultar menú de navegación' : 'Mostrar menú de navegación'}
            aria-expanded={navigationOpen}
            aria-controls="primary-navigation"
          >
            <svg
              className="navigation-toggle__icon"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="m5 9 7 7 7-7" />
            </svg>
          </button>
        </div>
        <div ref={navigationRef} className="collapse show" id="primary-navigation">
          <div className="site-navigation">
            {visibleNavigationLinks.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
            {userRole && (
              <button
                type="button"
                className="btn btn-secondary logout-button"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
