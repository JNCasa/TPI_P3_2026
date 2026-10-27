import { useNavigate } from 'react-router-dom'
import ProductosDiet from '../components/Storecomp/ProductosDiet.jsx'

function Store({ catalogProducts, setProducts, visible_del_padre }) {
  const navigate = useNavigate()
  const visible = visible_del_padre === 'Cliente'

  return (
    <section className="store-page">
      {visible && (
        <>
          <ProductosDiet
            products={catalogProducts}
            setProducts={setProducts}
          />
          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate('/Cart')}
          >
            Ver compra
          </button>
        </>
      )}
    </section>
  )
}

export default Store
