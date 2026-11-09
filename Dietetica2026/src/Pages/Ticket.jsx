import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Ticket.css'

function Ticket({ products, setProducts }) {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [ticketFecha, setTicketFecha] = useState(null)
  const [ticketProducts] = useState(products)

  const montoTotal = ticketProducts.reduce(
    (total, product) => total + Number(product.monto),
    0,
  )

  function cancelarCompra() {
    setProducts([])
    navigate('/Store')
  }

  async function confirmarCompra() {
    setError('')

    const token = localStorage.getItem('token')?.trim()
    if (!token) {
      setError('Iniciá sesión antes de confirmar la compra.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/Tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          productos: ticketProducts.map((product) => ({
            id_producto: product.id,
            cantidad: product.cantidad,
          })),
          monto_total: montoTotal,
        }),
      })

      const responseBody = await response.text()
      if (!response.ok) {
        throw new Error(
          `No se pudo registrar el ticket (${response.status})${responseBody ? `: ${responseBody}` : '.'}`,
        )
      }

      let fechaRegistrada = ''
      if (responseBody) {
        try {
          const registeredTicket = JSON.parse(responseBody)
          fechaRegistrada = registeredTicket?.fecha ?? ''
        } catch {
          // Algunas respuestas exitosas del endpoint no contienen JSON.
        }
      }

      const parsedDate =
        typeof fechaRegistrada === 'string' ? new Date(fechaRegistrada) : null
      const confirmationDate =
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate
          : new Date()
      setTicketFecha({
        fecha: confirmationDate.toLocaleDateString('es-AR', {
          timeZone: 'America/Argentina/Cordoba',
        }),
        hora: confirmationDate.toLocaleTimeString('es-AR', {
          timeZone: 'America/Argentina/Cordoba',
        }),
      })
      setProducts([])
      setConfirmed(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="ticket-page">
      <Link to="/Store">Volver a Store</Link>
      <div className="ticket-page__layout">
        <div className="ticket-page__details">
          <h1>
            <img
              src="/images/ticket.png"
              alt="Logo"
              width="40"
              height="40"
              className="me-2"
            />{' '}
            Ticket de compra
          </h1>
          <div className="table-responsive">
            <table className="table table-success table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Precio/unid.</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ticketProducts.map((product) => {
                  const quantity = Number(product.cantidad)
                  const subtotal = Number(product.monto)
                  const unitPrice = quantity > 0 ? subtotal / quantity : 0

                  return (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{quantity}</td>
                      <td>${unitPrice.toFixed(2)}</td>
                      <td>${subtotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan="3">Monto total</th>
                  <td><strong>${montoTotal.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          {ticketFecha && (
            <p>
              Fecha: {ticketFecha.fecha}
              {' — Hora: '}
              {ticketFecha.hora}
            </p>
          )}
          {error && <p role="alert">{error}</p>}
          {confirmed ? (
            <p className="ticket-page__confirmed" role="status">
              Compra Confirmada{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="currentColor"
                className="bi bi-check2"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
              </svg>
            </p>
          ) : (
            <div className="ticket-page__actions">
              <button
                type="button"
                className="btn btn-success"
                onClick={confirmarCompra}
                disabled={submitting || ticketProducts.length === 0}
              >
                {submitting ? 'Confirmando...' : 'Confirmar compra'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelarCompra}
              >
                Cancelar compra
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Ticket
