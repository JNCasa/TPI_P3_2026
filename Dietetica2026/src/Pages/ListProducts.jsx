import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/ListProducts.css'
import { normalizeProductImage, resolveProductImage } from '../utils/productImage.js'

const PRODUCTS_ENDPOINT = '/api/Productos'

const EMPTY_FORM = {
  title: '',
  price: '',
  weight: '',
  stock: '',
  description: '',
  image: '',
}

function mapProduct(product) {
  const image = product.imagen ?? ''

  return {
    id: product.id_producto,
    title: product.nombre_producto ?? product.titulo ?? '',
    price: product.precio ?? '',
    weight: product.peso ?? '',
    stock: product.stock ?? '',
    description: product.descripcion ?? '',
    image: resolveProductImage(image),
    imageValue: normalizeProductImage(image),
  }
}

async function readResponse(response) {
  const responseText = await response.text()
  if (!responseText) return null

  try {
    return JSON.parse(responseText)
  } catch {
    return responseText
  }
}

function getErrorMessage(data, fallback) {
  if (typeof data === 'string') return data
  if (Array.isArray(data?.message)) return data.message.join(' ')
  return data?.message ?? data?.error ?? fallback
}

async function fetchProducts(signal, token) {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    signal,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(data, 'No se pudieron cargar los productos'))
  }
  if (!Array.isArray(data)) {
    throw new Error('La respuesta del backend no contiene una lista de productos válida')
  }

  return data.map(mapProduct)
}

function ListProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingProductId, setEditingProductId] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')?.trim()))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(() => (
    localStorage.getItem('token')?.trim() ? '' : 'Iniciá sesión para ver los productos.'
  ))

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('token')?.trim()

    if (!token) {
      return () => controller.abort()
    }

    fetchProducts(controller.signal, token)
      .then(setProducts)
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') setError(loadError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingProductId(null)
    setError('')
  }

  function editProduct(product) {
    setForm({
      title: product.title,
      price: product.price,
      weight: product.weight,
      stock: product.stock,
      description: product.description,
      image: product.imageValue,
    })
    setEditingProductId(product.id)
    setError('')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function submitProduct(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    const token = localStorage.getItem('token')?.trim()
    if (!token) {
      setError('Iniciá sesión para modificar productos.')
      setSaving(false)
      return
    }

    const productData = {
      titulo: form.title.trim(),
      nombre_producto: form.title.trim(),
      precio: Number(form.price),
      peso: form.weight.trim(),
      imagen: normalizeProductImage(form.image),
      stock: Number(form.stock),
    }

    try {
      const response = await fetch(
        editingProductId === null
          ? PRODUCTS_ENDPOINT
          : `${PRODUCTS_ENDPOINT}/${editingProductId}`,
        {
          method: editingProductId === null ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        },
      )
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'No se pudo guardar el producto'))
      }

      setProducts(await fetchProducts(undefined, token))
      resetForm()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`¿Querés eliminar "${product.title}"?`)) return

    setError('')
    setSaving(true)
    const token = localStorage.getItem('token')?.trim()
    if (!token) {
      setError('Iniciá sesión para eliminar productos.')
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`${PRODUCTS_ENDPOINT}/${product.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'No se pudo eliminar el producto'))
      }

      setProducts(await fetchProducts(undefined, token))
      if (editingProductId === product.id) resetForm()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="products-admin" aria-labelledby="products-admin-title">
      <Link className="products-admin__back-link" to="/">
        ← Volver al inicio
      </Link>
      <header className="products-admin__header">
        <div>
          <p className="products-admin__eyebrow">Administración</p>
          <h1 id="products-admin-title"> <img
    src="/images/logo.png"
    alt="Logo"
    width="40"
    height="40"
    className="me-2"
  />Gestión de productos</h1>
          <p>Creá productos y mantené actualizado el catálogo.</p>
        </div>
        <span className="products-admin__count">{products.length} productos</span>
      </header>

      <section className="products-admin__card" aria-labelledby="product-form-title">
        <div className="products-admin__section-heading">
          <div>
            <h2 id="product-form-title">
              {editingProductId === null ? 'Datos del producto' : 'Modificar producto'}
            </h2>
            <p>
              {editingProductId === null
                ? 'Completá la información para agregar un producto al catálogo.'
                : 'Actualizá la información del producto seleccionado.'}
            </p>
          </div>
        </div>

        <form className="products-form" onSubmit={submitProduct}>
          <div className="products-form__fields">
            <label>
              Nombre del producto
              <input
                name="title"
                type="text"
                placeholder="Ej.: Almendras naturales"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Precio
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Peso o presentación
              <input
                name="weight"
                type="text"
                placeholder="Ej.: 500 g"
                value={form.weight}
                onChange={handleChange}
              />
            </label>

            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>

            <label className="products-form__field--wide">
              Descripción
              <textarea
                name="description"
                rows="3"
                placeholder="Escribí una breve descripción del producto"
                value={form.description}
                onChange={handleChange}
              />
              <small>El backend actual no guarda descripciones.</small>
            </label>

            <label className="products-form__field--wide">
              Imagen
              <input
                name="image"
                type="text"
                placeholder="Ej.: imagen.jpg o https://ejemplo.com/imagen.jpg"
                value={form.image}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="products-form__actions">
            <button
              className="products-button products-button--primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Guardando...'
                : editingProductId === null
                  ? 'Agregar producto'
                  : 'Guardar cambios'}
            </button>
            <button
              className="products-button products-button--secondary"
              type="button"
              onClick={resetForm}
              disabled={saving}
            >
              {editingProductId === null ? 'Limpiar' : 'Cancelar edición'}
            </button>
          </div>
        </form>
      </section>

      <section className="products-admin__card" aria-labelledby="products-list-title">
        <div className="products-admin__section-heading">
          <div>
            <h2 id="products-list-title">Productos cargados</h2>
            <p>Revisá el catálogo y sus acciones disponibles.</p>
          </div>
        </div>

        {error && <p role="alert">{error}</p>}
        {loading ? (
          <p role="status">Cargando productos...</p>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <caption className="visually-hidden">Listado de productos</caption>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Presentación</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="products-table__product">
                        {product.image && <img src={product.image} alt="" />}
                        <div>
                          <strong>{product.title}</strong>
                          <span>{product.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="products-table__price">{product.price}</td>
                    <td>{product.weight}</td>
                    <td>
                      <div className="products-table__actions">
                        <button
                          className="products-button products-button--edit"
                          class="btn btn-primary"
                          type="button"
                          aria-label={`Editar ${product.title}`}
                          onClick={() => editProduct(product)}
                          disabled={saving}
                        >
                          Editar
                        </button>
                        <button
                          className="products-button products-button--delete"
                          type="button"class="btn btn-danger"
                          aria-label={`Eliminar ${product.title}`}
                          onClick={() => deleteProduct(product)}
                          disabled={saving}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan="4">No hay productos para mostrar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}

export default ListProducts
