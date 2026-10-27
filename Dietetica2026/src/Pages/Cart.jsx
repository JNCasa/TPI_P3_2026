import { useNavigate } from 'react-router-dom'

function Cart({ products }) {
  const navigate = useNavigate()

  return (
    <section className="cart-page">
      <h1>Carrito de compra</h1>
      <p>Revisá tu compra antes de continuar al ticket.</p>
      {products.length === 0 ? (
        <p>No hay productos seleccionados.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.title} — Cantidad: {product.cantidad} — Total: $
              {product.monto.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="btn btn-success"
        onClick={() => navigate('/Ticket')}
      >
        Continuar al ticket
      </button>
    </section>
  )
}

export default Cart
