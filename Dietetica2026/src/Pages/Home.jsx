import { Link } from 'react-router-dom'

function Home({ userRole }) {
  if (userRole === 'Vendedor') {
    return (
      <section className="store-page">
        <h1>Inicio de vendedor</h1>
        <p>Desde acá podés administrar el catálogo de productos.</p>
        <Link className="btn btn-success" to="/ListProducts">
          Ir a productos
        </Link>
      </section>
    )
  }

  return null
}

export default Home
