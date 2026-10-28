export const API_URL = 'http://localhost:3000/api/auth'

// Registra una cuenta cliente mediante el endpoint público del backend.
export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: name.trim(), email: email.trim(), password }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(' ')
      : typeof data.message === 'string'
        ? data.message
        : data.error || 'No se pudo crear la cuenta'
    throw new Error(message)
  }

  return data.usuario ?? data.user ?? data
}

// Envía las credenciales al backend y guarda el JWT en Local Storage.
export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'No se pudo iniciar sesión')
  if (!data.token) throw new Error('El servidor no devolvió un token')

  localStorage.setItem('token', data.token)
  return data.usuario ?? data.user ?? null
}

// Usa el token guardado para consultar al backend qué usuario está autenticado.
export async function obtenerUsuarioActual() {
  const token = localStorage.getItem('token')?.trim()
  if (!token) throw new Error('No hay sesión iniciada')

  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json()
  if (!response.ok) {
    localStorage.removeItem('token')
    throw new Error(data.message || 'Sesión inválida o expirada')
  }

  return data.usuario ?? data.user ?? data
}

// Quita el JWT al cerrar sesión.
export function cerrarSesion() {
  localStorage.removeItem('token')
}

// Normaliza las distintas formas posibles del rol que pueda devolver el backend.
export function obtenerRol(usuario) {
  const role = usuario?.rol ?? usuario?.role ?? usuario?.rolUsuario ?? ''
  const normalized = String(role).toLowerCase()
  if (normalized.includes('admin')) return 'Administrador'
  if (normalized.includes('vendedor') || normalized.includes('seller')) return 'Vendedor'
  if (normalized.includes('cliente') || normalized.includes('customer')) return 'Cliente'
  return ''
}
