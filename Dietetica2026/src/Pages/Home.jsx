import { Link } from 'react-router-dom'

function Home({ userRole }) {
  if (userRole === 'Vendedor') {
    return (
      <section className="store-page">
        <h1>Inicio</h1>
        <p>Desde acá podés administrar el catálogo de productos.</p>
        <Link className="btn btn-success" to="/ListProducts">
          Ir a productos
        </Link>
      </section>
    )
  }

  if (userRole === 'Administrador') {
    return (
      <section className="store-page">
        <h1>Inicio</h1>
        <p>Desde acá podés administrar los usuarios.</p>
        <Link className="btn btn-success" to="/ListUsers">
          Ir a usuarios
        </Link>
      </section>
    )
  }

  if (userRole === 'Cliente') {
    return (
      <section className="store-page">
        <h1>Inicio</h1>
        <p>Bienvenido/a. Podés visitar la tienda y realizar tus compras.</p>
        <Link className="btn btn-success" to="/Store">
          Ir a la tienda
        </Link>
      </section>
    )
  }

  return (
    <section className="store-page">
      <h1>Inicio</h1>
      <p>Bienvenido/a a Dietética 2026.</p>
      <Link className="btn btn-success" to="/LogIn">
        Iniciar sesión
      </Link>
    </section>
  )
}

export default Home
