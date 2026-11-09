import { useState } from 'react'

function Card({ id, title, description, weight, price, image, stock, setProducts }) {
  const [cantidad, setCantidad] = useState(0)
  const stockDisponible = Number.isFinite(Number(stock)) ? Math.max(0, Number(stock)) : 0
// Number(stock): convierte el stock a número.
// Number.isFinite(...): verifica que sea un número válido, no NaN ni infinito.
// Math.max(0, ...): evita que el stock quede por debajo de cero.
// Si no es un número válido, usa 0.
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

    setProducts((productos) => {
      const indice = productos.findIndex((product) => product.id === id)

      if (nuevaCantidad === 0) {
        return productos.filter((product) => product.id !== id)
      }

      if (indice === -1) {
        return [...productos, productoSeleccionado]
      }

      return productos.map((product, i) => (
        i === indice ? productoSeleccionado : product
      ))
    })
  }

  const sumar = () => {
    if (cantidad >= stockDisponible) return

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
    <div className="card" style={{ width: '18rem', zoom: 0.6 }}>
      <div style={{ overflow: 'hidden' }}>
        <img className="card-img-top" src={image} alt={title} />
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{"Peso neto: "+weight}</p>
        <p className="card-text">{"Precio $"+price}</p>
        <p className="card-text">{"Stock disponible : "+stock}</p>
    

        {stockDisponible > 0 ? (
          <div className="d-flex align-items-center gap-2">
            <span aria-live="polite">Cantidad: {cantidad}</span>
            <button
              type="button"
              className="btn btn-success btn-lg shadow-sm"
              onClick={restar}
              disabled={cantidad === 0}
              aria-label={`Disminuir cantidad de ${title}`}
            >
              -
            </button>
            <button
              type="button"
              className="btn btn-success btn-lg shadow-sm"
              onClick={sumar}
              disabled={cantidad >= stockDisponible}
              aria-label={`Aumentar cantidad de ${title}`}
            >
              +
            </button>
          </div>
        ) : (
          <p>🛒❌ Agotado </p>
        )}
      </div>
    </div>
  )
}

export default Card
