import { useState } from 'react'
import seedUsers from '../data/users.json'
import '../assets/css/ListUsers.css'

const STORAGE_KEY = 'dietetica-users'

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'Cliente',
  status: 'Activo',
}

function readUsers() {
  const savedUsers = localStorage.getItem(STORAGE_KEY)
  if (savedUsers === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers))
    return seedUsers
  }

  const users = JSON.parse(savedUsers)
  if (!Array.isArray(users)) {
    throw new Error('Los datos guardados de usuarios no tienen un formato válido.')
  }

  return users
}

function ListUsers() {
  const [initialState] = useState(() => {
    try {
      return { users: readUsers(), error: '' }
    } catch (error) {
      return { users: [], error: `No se pudieron cargar los usuarios: ${error.message}` }
    }
  })
  const [users, setUsers] = useState(initialState.users)
  const [form, setForm] = useState({ ...emptyUser })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState(initialState.error)

  function persistUsers(nextUsers) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers))
      setUsers(nextUsers)
      return true
    } catch (error) {
      setMessage(`No se pudieron guardar los usuarios: ${error.message}`)
      return false
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  function resetForm() {
    setEditingId(null)
    setForm({ ...emptyUser })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const email = form.email.trim().toLowerCase()
    const duplicateEmail = users.some(
      (user) => user.email?.toLowerCase() === email && user.id !== editingId,
    )

    if (duplicateEmail) {
      setMessage('Ya existe un usuario con ese correo.')
      return
    }

    if (editingId === null && !form.password.trim()) {
      setMessage('La contraseña es obligatoria para crear un usuario.')
      return
    }

    const nextUsers = editingId === null
      ? [...users, { ...form, id: crypto.randomUUID(), email }]
      : users.map((user) => (
        user.id === editingId
          ? { ...user, ...form, email, password: form.password || user.password }
          : user
      ))

    if (persistUsers(nextUsers)) {
      setMessage(editingId === null ? 'Usuario agregado.' : 'Usuario actualizado.')
      resetForm()
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

  function deleteUser(userId) {
    if (!window.confirm('¿Querés eliminar este usuario?')) return

    if (persistUsers(users.filter((user) => user.id !== userId))) {
      if (editingId === userId) resetForm()
      setMessage('Usuario eliminado.')
    }
  }

  return (
    <section className="users-page" aria-labelledby="users-title">
      <h1 id="users-title">Control de usuarios</h1>
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
          />
        </label>

        <label>
          Contraseña
          {editingId !== null && <small>Dejala vacía para mantener la actual.</small>}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required={editingId === null}
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
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Activo">Activo</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </label>

        <div className="users-form-actions">
          <button type="submit">
            {editingId === null ? 'Agregar usuario' : 'Guardar cambios'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={resetForm}>Cancelar</button>
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button type="button" onClick={() => startEditing(user)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => deleteUser(user.id)}>
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
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ListUsers
