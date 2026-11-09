import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/ListUsers.css'

const USERS_ENDPOINT = '/api/Usuarios'

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'Cliente',
  status: 'Activo',
}

function mapUser(user) {
  return {
    id: user.id_usuario,
    name: user.nombre ?? '',
    email: user.email ?? '',
    role: user.rol ?? '',
    status: user.estado ?? '',
  }
}

async function readResponse(response) {
  const responseText = await response.text()
  if (!responseText) return null

  try {
    return JSON.parse(responseText)
  } catch {
    return responseText
  }
}

function getErrorMessage(data, fallback) {
  if (typeof data === 'string') return data
  if (Array.isArray(data?.message)) return data.message.join(' ')
  return data?.message ?? data?.error ?? fallback
}

async function fetchUsers(token, signal) {
  const response = await fetch(USERS_ENDPOINT, {
    signal,
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(data, 'No se pudieron cargar los usuarios'))
  }
  if (!Array.isArray(data)) {
    throw new Error('La respuesta del backend no contiene una lista de usuarios válida')
  }

  return data.map(mapUser)
}

function ListUsers() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ ...emptyUser })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')?.trim()))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(() => (
    localStorage.getItem('token')?.trim() ? '' : 'Iniciá sesión para administrar usuarios.'
  ))

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('token')?.trim()

    if (!token) {
      return () => controller.abort()
    }

    fetchUsers(token, controller.signal)
      .then(setUsers)
      .catch((error) => {
        if (error.name !== 'AbortError') setMessage(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function resetForm() {
    setEditingId(null)
    setForm({ ...emptyUser })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const token = localStorage.getItem('token')?.trim()
    if (!token) {
      setMessage('Iniciá sesión para administrar usuarios.')
      return
    }

    setSaving(true)
    const isEditing = editingId !== null
    const request = isEditing
      ? {
        url: `${USERS_ENDPOINT}/${editingId}`,
        method: 'PATCH',
        body: { rol: form.role, estado: form.status },
      }
      : {
        url: USERS_ENDPOINT,
        method: 'POST',
        body: {
          nombre: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          rol: form.role,
        },
      }

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request.body),
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'No se pudo guardar el usuario'))
      }

      setUsers(await fetchUsers(token))
      resetForm()
      setMessage(isEditing ? 'Usuario actualizado.' : 'Usuario agregado.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  function startEditing(user) {
    setEditingId(user.id)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    })
    setMessage('')
  }

  async function deleteUser(userId) {
    if (!window.confirm('¿Querés eliminar este usuario?')) return

    setMessage('')
    const token = localStorage.getItem('token')?.trim()
    if (!token) {
      setMessage('Iniciá sesión para administrar usuarios.')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'No se pudo eliminar el usuario'))
      }

      setUsers(await fetchUsers(token))
      if (editingId === userId) resetForm()
      setMessage('Usuario eliminado.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="users-page" aria-labelledby="users-title">
      <Link className="users-back-link" to="/">
        ← Volver al inicio
      </Link>
      <h1 id="users-title">
        <img
          src="/images/logosolo.png"
          alt=""
          className="users-title-icon"
        />
        Control de usuarios
      </h1>
      <p>Creá cuentas y administrá sus roles y estados.</p>

      <form className="users-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
            readOnly={editingId !== null}
          />
        </label>

        <label>
          Correo electrónico
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            readOnly={editingId !== null}
          />
        </label>

        <label>
          Contraseña
          {editingId !== null
            ? <small>El backend no permite modificar la contraseña desde esta pantalla.</small>
            : <small>Usá al menos 8 caracteres, una mayúscula, una minúscula y un número.</small>}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required={editingId === null}
            minLength="8"
            disabled={editingId !== null}
          />
        </label>

        <label>
          Rol
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="Cliente">Cliente</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Administrador">Administrador</option>
          </select>
        </label>

        <label>
          Estado
          {editingId === null && <small>Las cuentas nuevas se crean activas.</small>}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={editingId === null}
          >
            <option value="Activo">Activo</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </label>

        <div className="users-form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : editingId === null ? 'Agregar usuario' : 'Guardar cambios'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={resetForm} disabled={saving}>Cancelar</button>
          )}
        </div>
      </form>

      {message && <p className="users-message" role="status">{message}</p>}

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Cargando usuarios...</td>
              </tr>
            ) : (
              <>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => startEditing(user)}
                        disabled={saving}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        disabled={saving}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5">Todavía no hay usuarios guardados.</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ListUsers
