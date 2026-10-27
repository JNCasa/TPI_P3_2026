# Guía para integrar el control de usuarios del administrador

Instrucciones para conectar el inicio de sesión, el estado de sesión en React y la ruta de administración de usuarios. Los datos se guardan temporalmente en `localStorage`, igual que en el prototipo del proyecto 2024.

> En el proyecto nuevo, `ListUsers.jsx` ya contiene el formulario CRUD y `ListUsers.css` sus estilos. Esta guía completa la autenticación y protección del acceso, y agrega las protecciones para no alterar o eliminar la propia cuenta administradora.

## 1. Datos de ejemplo

El archivo `src/data/users.json` debe contener estos usuarios. La contraseña de demostración para todos es `Demo1234!`.

```json
[
  {
    "id": 1,
    "name": "Lucía Gómez",
    "email": "lucia@example.com",
    "password": "Demo1234!",
    "role": "Administrador",
    "status": "Activo"
  },
  {
    "id": 2,
    "name": "Martín Ruiz",
    "email": "martin@example.com",
    "password": "Demo1234!",
    "role": "Vendedor",
    "status": "Activo"
  },
  {
    "id": 3,
    "name": "Sofía López",
    "email": "sofia@example.com",
    "password": "Demo1234!",
    "role": "Cliente",
    "status": "Pendiente"
  }
]
```

`ListUsers.jsx` carga este JSON únicamente cuando `localStorage` todavía no tiene la clave `dietetica-users`. Si ya hay datos guardados, modificar el JSON no los reemplaza. Para reiniciar los datos locales, ejecutar en la consola del navegador `localStorage.removeItem('dietetica-users')` y volver a cargar `/ListUsers`.

## 2. Crear el acceso a usuarios y la sesión

Crear `src/Db/users.js`. Esta carpeta puede que todavía no exista.

```js
import seedUsers from '../data/users.json'

const USERS_KEY = 'dietetica-users'
const CURRENT_USER_KEY = 'dietetica-current-user'

export function getUsers() {
  const storedUsers = localStorage.getItem(USERS_KEY)

  if (storedUsers === null) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers))
    return seedUsers
  }

  const users = JSON.parse(storedUsers)

  if (!Array.isArray(users)) {
    throw new Error('La lista guardada de usuarios no es válida.')
  }

  return users
}

export function authenticateUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = getUsers().find(
    (candidate) =>
      candidate.email.toLowerCase() === normalizedEmail &&
      candidate.password === password &&
      candidate.status !== 'Inactivo',
  )

  if (!user) return null

  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

export function getCurrentUser() {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY)
  return storedUser ? JSON.parse(storedUser) : null
}

export function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}
```

`getUsers` inicializa el almacén local con los usuarios demo. `authenticateUser` compara correo y contraseña, impide iniciar sesión si la cuenta está inactiva y devuelve el usuario sin contraseña. Las otras funciones guardan, leen y cierran la sesión.

## 3. Crear el contexto de autenticación

Crear `src/context/authContext.js`:

```js
import { createContext } from 'react'

const AuthContext = createContext(null)

export default AuthContext
```

Crear `src/context/useAuth.js`:

```js
import { useContext } from 'react'
import AuthContext from './authContext.js'

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}
```

Crear `src/context/AuthProvider.jsx`:

```jsx
import { useState } from 'react'
import {
  authenticateUser,
  clearCurrentUser,
  getCurrentUser,
  saveCurrentUser,
} from '../Db/users.js'
import AuthContext from './authContext.js'

function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)

  function login(email, password) {
    const authenticatedUser = authenticateUser(email, password)

    if (!authenticatedUser) return null

    saveCurrentUser(authenticatedUser)
    setUser(authenticatedUser)
    return authenticatedUser
  }

  function logout() {
    clearCurrentUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
```

`AuthProvider` mantiene la sesión disponible para el encabezado, el login y las rutas. También hace que persista al recargar la página.

## 4. Envolver la aplicación con AuthProvider

En `src/App.jsx`, agregar este import:

```jsx
import AuthProvider from './context/AuthProvider.jsx'
```

Envolver el layout con el proveedor. Mantener `ThemeProvider`, `BrowserRouter`, el encabezado, las rutas, el pie y el botón de WhatsApp:

```jsx
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
```

`AppLayout` puede seguir como está; el proveedor rodea todas las páginas para que `useAuth()` esté disponible en ellas.

## 5. Proteger `/ListUsers`

En `src/PagesRoutes.jsx`, importar `useAuth`:

```jsx
import { useAuth } from './context/useAuth.js'
```

Agregar el guard antes de `PagesRoutes`:

```jsx
function AdminRoute() {
  const { user } = useAuth()

  if (user?.role !== 'Administrador') {
    return <Navigate to={user ? '/' : '/LogIn'} replace />
  }

  return <ListUsers />
}
```

En la lista de rutas, reemplazar:

```jsx
<Route path="/ListUsers" element={<ListUsers />} />
```

por:

```jsx
<Route path="/ListUsers" element={<AdminRoute />} />
```

Un usuario sin sesión vuelve a `/LogIn`. Un usuario conectado que no sea administrador vuelve al inicio. La ruta protegida también bloquea el acceso directo escribiendo `/ListUsers` en el navegador.

## 6. Conectar `src/Pages/LogIn.jsx`

Reemplazar el componente vacío por este formulario:

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function LogIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const user = login(email, password)

      if (!user) {
        setError('Correo o contraseña incorrectos, o cuenta inactiva.')
        return
      }

      navigate(user.role === 'Administrador' ? '/ListUsers' : '/')
    } catch (loginError) {
      setError(`No se pudo iniciar sesión: ${loginError.message}`)
    }
  }

  return (
    <section>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Correo electrónico
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p role="alert">{error}</p>}

        <button type="submit">Iniciar sesión</button>
      </form>
    </section>
  )
}

export default LogIn
```

El administrador demo puede ingresar con `lucia@example.com` y `Demo1234!`.

## 7. Mostrar Usuarios solo al Administrador y agregar cierre de sesión

En `src/components/Header/Header.jsx`, agregar el import:

```jsx
import { useAuth } from '../../context/useAuth.js'
```

Dentro de `Header`, obtener la sesión:

```jsx
const { user, logout } = useAuth()
```

Quitar `{ label: 'Usuarios', to: '/ListUsers' }` de `navigationLinks`; de lo contrario aparecería para todos.

Después del mapeo de enlaces del navbar, renderizar el enlace solo para el administrador:

```jsx
{user?.role === 'Administrador' && (
  <NavLink to="/ListUsers">Usuarios</NavLink>
)}
```

En el mismo navbar, agregar el cierre de sesión junto a los controles del encabezado:

```jsx
{user && (
  <button type="button" onClick={logout}>
    Cerrar sesión
  </button>
)}
```

Así el enlace no se muestra para clientes ni vendedores, mientras que la protección real de la página sigue estando en `AdminRoute`.

## 8. Evitar cambiar o eliminar la propia cuenta

El `ListUsers.jsx` actual ya gestiona creación, edición y eliminación. Para aplicar la misma regla del proyecto 2024, en ese componente importar y leer la sesión:

```jsx
import { useAuth } from '../context/useAuth.js'
```

Dentro de `ListUsers`:

```jsx
const { user: currentUser } = useAuth()
```

En `handleSubmit`, antes de construir `nextUsers`, impedir modificar el rol o el estado de la cuenta conectada:

```jsx
if (editingId === currentUser?.id) {
  const currentAccount = users.find((user) => user.id === editingId)

  if (
    currentAccount &&
    (form.role !== currentAccount.role || form.status !== currentAccount.status)
  ) {
    setMessage('No podés cambiar tu propio rol ni tu estado.')
    return
  }
}
```

Reemplazar `deleteUser` por:

```jsx
function deleteUser(userId) {
  if (currentUser?.id === userId) {
    setMessage('No podés eliminar tu propio usuario mientras tenés sesión iniciada.')
    return
  }

  if (!window.confirm('¿Querés eliminar este usuario?')) return

  if (persistUsers(users.filter((user) => user.id !== userId))) {
    if (editingId === userId) resetForm()
    setMessage('Usuario eliminado.')
  }
}
```

## 9. Orden para integrar y probar

1. Crear `src/Db/users.js`.
2. Crear `src/context/authContext.js`, `src/context/useAuth.js` y `src/context/AuthProvider.jsx`.
3. Envolver la aplicación con `AuthProvider`.
4. Agregar `AdminRoute` y proteger la ruta en `PagesRoutes.jsx`.
5. Reemplazar el componente de `LogIn.jsx`.
6. Mostrar el enlace Usuarios y el botón cerrar sesión desde `Header.jsx`.
7. Agregar las protecciones de la cuenta propia en `ListUsers.jsx`.
8. Ejecutar `npm run build` y `npm run lint`.
9. Abrir `/ListUsers` sin sesión: debe redirigir a `/LogIn`.
10. Iniciar sesión como administrador: debe poder ver Usuarios, entrar a la ruta y gestionar las otras cuentas.
11. Iniciar sesión como vendedor o cliente: no deben ver Usuarios y el acceso directo a `/ListUsers` debe redirigirlos.

## 10. Limitación de seguridad

Este flujo es solo un prototipo local. `localStorage` puede modificarse desde las herramientas del navegador y las contraseñas demo están guardadas en texto plano. La protección por roles en React mejora la experiencia, pero no reemplaza la autenticación ni la autorización del servidor. En producción, el backend debe validar credenciales, almacenar contraseñas con hash y autorizar cada operación administrativa.
