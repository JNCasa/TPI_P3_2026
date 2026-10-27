import { useState } from 'react'

function Card({ id, title, description, weight, price, image, setProducts }) {
  const [cantidad, setCantidad] = useState(0)

  const updateSelectedProduct = (nuevaCantidad) => {
    const precio = Number(String(price).replace(/[^0-9,.-]/g, '').replace(',', '.'))
    const productoSeleccionado = {
      id,
      title,
      description,
      weight,
      price,
      image,
      cantidad: nuevaCantidad,
      monto: nuevaCantidad * precio,
    }

    setProducts((b) => {
      const indice = b.findIndex((product) => product.id === id)

      if (nuevaCantidad === 0) {
        return b.filter((product) => product.id !== id)
      }

      if (indice === -1) {
        return [...b, productoSeleccionado]
      }

      return b.map((product, i) => (
        i === indice ? productoSeleccionado : product
      ))
    })
  }

  const sumar = () => {
    const nuevaCantidad = cantidad + 1
    setCantidad(nuevaCantidad)
    updateSelectedProduct(nuevaCantidad)
  }

  const restar = () => {
    const nuevaCantidad = Math.max(0, cantidad - 1)
    setCantidad(nuevaCantidad)
    updateSelectedProduct(nuevaCantidad)
  }

  return (
    <div className="card" style={{ width: '18rem' }}>
      <div style={{ overflow: 'hidden' }}>
        <img className="card-img-top" src={image} alt={title} />
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{weight}</p>
        <p className="card-text">{price}</p>
        <p className="card-text">{description}</p>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-success btn-lg shadow-sm"
            onClick={sumar}
            aria-label={`Aumentar cantidad de ${title}`}
          >
            +
          </button>

          <span aria-live="polite">Cantidad: {cantidad}</span>
          <button
            type="button"
            className="btn btn-success btn-lg shadow-sm"
            onClick={restar}
            aria-label={`Disminuir cantidad de ${title}`}
          >
            -
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
