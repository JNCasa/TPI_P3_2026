import { useNavigate } from 'react-router-dom'

function Cart({ products, setProducts }) {
  const navigate = useNavigate()
  const montoTotal = products.reduce(
    (total, product) => total + Number(product.monto),
    0,
  )

  function removeProduct(productId) {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    )
  }

  return (
    <section className="cart-page">
      <h1>
        <img
          src="/images/logo.png"
          alt=""
          width="40"
          height="40"
          className="me-2"
        />
        Carrito de compra  <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          className="bi bi-cart4 me-2"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
        </svg>
      </h1>
      {products.length > 0 && (
        <p>Revisá tu compra antes de continuar al ticket.</p>
      )}
      {products.length === 0 ? (
        <p>No hay productos seleccionados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Precio/unid.</th>
                <th scope="col">Subtotal</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const quantity = Number(product.cantidad)
                const subtotal = Number(product.monto)
                const unitPrice = quantity > 0 ? subtotal / quantity : 0

                return (
                  <tr key={product.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.title}</td>
                    <td>{quantity}</td>
                    <td>${unitPrice.toFixed(2)}</td>
                    <td>${subtotal.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        aria-label={`Quitar ${product.title} del carrito`}
                        title={`Quitar ${product.title} del carrito`}
                        onClick={() => removeProduct(product.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash3"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="table-success">
                <th scope="row" colSpan="4">Monto total</th>
                <td><strong>${montoTotal.toFixed(2)}</strong></td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {products.length > 0 && (
        <button
          type="button"
          className="btn btn-success"
          onClick={() => navigate('/Ticket')}
        >
          Continuar al ticket
        </button>
      )}
    </section>
  )
}

export default Cart
