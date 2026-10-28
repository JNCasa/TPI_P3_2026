import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/auth.js'
import './LogIn.css'

const CreateAccount = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function crearCuenta(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password !== passwordConfirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula y un número.')
      return
    }

    try {
      await register(name, email, password)
      setSuccess('Cuenta creada correctamente.')
      navigate('/LogIn', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="login-page">
      <h1>Crear cuenta</h1>
      <form className="login-form" onSubmit={crearCuenta}>
        <label htmlFor="register-name">Nombre</label>
        <input
          id="register-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          maxLength={100}
          required
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="register-password">Contraseña</label>
        <small>Al menos 8 caracteres, con minúscula, mayúscula y número.</small>
        <div className="password-field">
          <input
            id="register-password"
            type={mostrarPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
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

        <label htmlFor="register-password-confirm">Repetir contraseña</label>
        <input
          id="register-password-confirm"
          type={mostrarPassword ? 'text' : 'password'}
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          autoComplete="new-password"
          required
        />

        <button type="submit">Crear cuenta</button>
        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}
      </form>
      <p>¿Ya tenés usuario? <Link to="/LogIn">Iniciar sesión</Link></p>
    </section>
  )
}

export default CreateAccount

