function Counter({ cantidad, setCantidad }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <button
        type="button"
        className="btn btn-success btn-lg shadow-sm"
        onClick={() => setCantidad((actual) => Math.max(0, actual - 1))}
        aria-label="Disminuir cantidad"
      >
        -
      </button>
      
      <button
        type="button"
        className="btn btn-success btn-lg shadow-sm"
        onClick={() => setCantidad((actual) => actual + 1)}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
      <span aria-live="polite" aria-label={`Cantidad: ${cantidad}`}>
        {cantidad}
      </span>
      
    </div>
  )
}

export default Counter