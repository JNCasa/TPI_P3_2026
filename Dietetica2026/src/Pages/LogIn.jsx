import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Detokenizador from '../components/Detokenizador'
import { login, obtenerUsuarioActual, obtenerRol } from '../services/auth.js'
import './LogIn.css'

function LogIn({ setVisible_del_padre }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')

  async function iniciarSesion(event) {
    event.preventDefault()
    setError('')

    try {
      await login(email.trim(), password)

      // El endpoint /me valida el token y devuelve el usuario real del servidor.
      const usuarioActual = await obtenerUsuarioActual()
      const role = obtenerRol(usuarioActual)
      if (!role) throw new Error('El usuario no tiene un rol reconocido')

      setVisible_del_padre(role)
      navigate(role === 'Cliente' ? '/Store' : role === 'Administrador' ? '/ListUsers' : role === 'Vendedor' ? '/ListProducts' : '/LogIn', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
      localStorage.removeItem('token')
      setVisible_del_padre('')
    }
  }

  return (
    <section className="login-page">
      <h1>Iniciar sesión</h1>
      <form className="login-form" onSubmit={iniciarSesion}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <label htmlFor="login-password">Contraseña</label>
        <div className="password-field">
          <input
            id="login-password"
            type={mostrarPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setMostrarPassword((visible) => !visible)}
            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {mostrarPassword ? '🙈' : '👁'}
          </button>
        </div>
        <button type="submit">Ingresar</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <p>¿No tenés usuario? <Link to="/CreateAccount">Crear cuenta</Link></p>
      <Detokenizador setVisible_del_padre={setVisible_del_padre} />
    </section>
  )
}

export default LogIn
