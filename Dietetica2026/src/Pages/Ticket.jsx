import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Ticket({ products, setProducts }) {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [ticketFecha, setTicketFecha] = useState('')

  const montoTotal = products.reduce(
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
      setError(
        'Iniciá sesión antes de confirmar la compra.',
      )
      return
    }

    setSubmitting(true)

    const ticket = {
      productos: products.map((product) => ({
        id_producto: product.id,
        cantidad: product.cantidad,
      })),
      monto_total: montoTotal,
    }

    try {
      const response = await fetch('/api/Tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(ticket),
      })

      const responseBody = await response.text()
      if (!response.ok) {
        throw new Error(
          `No se pudo registrar el ticket (${response.status})${responseBody ? `: ${responseBody}` : '.'}`,
        )
      }

      if (responseBody) {
        try {
          const registeredTicket = JSON.parse(responseBody)
          setTicketFecha(registeredTicket.fecha ?? '')
        } catch {
          setTicketFecha('')
        }
      }
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
      <h1>Ticket de compra</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} — Cantidad: {product.cantidad} — Monto: $
            {Number(product.monto).toFixed(2)}
          </li>
        ))}
      </ul>
      <p>Monto total: ${montoTotal.toFixed(2)}</p>
      {confirmed && <p role="status">Compra confirmada.</p>}
      {ticketFecha && !Number.isNaN(new Date(ticketFecha).getTime()) && (
        <p>
          Fecha: {new Date(ticketFecha).toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Cordoba',
          })}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {!confirmed && (
        <div className="ticket-page__actions">
          <button
            type="button"
            className="btn btn-success"
            onClick={confirmarCompra}
            disabled={submitting || products.length === 0}
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
    </section>
  )
}

export default Ticket
