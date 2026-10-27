import products from '../data/products.js'
import '../assets/css/ListProducts.css'

function ListProducts() {


  
  return (
    <section className="products-admin" aria-labelledby="products-admin-title">
      <header className="products-admin__header">
        <div>
          <p className="products-admin__eyebrow">Administración</p>
          <h1 id="products-admin-title">Gestión de productos</h1>
          <p>Creá productos y mantené actualizado el catálogo.</p>
        </div>
        <span className="products-admin__count">{products.length} productos</span>
      </header>

      <section className="products-admin__card" aria-labelledby="product-form-title">
        <div className="products-admin__section-heading">
          <div>
            <h2 id="product-form-title">Datos del producto</h2>
            <p>Completá la información para agregar un producto al catálogo.</p>
          </div>
        </div>

        <form className="products-form">
          <div className="products-form__fields">
            <label>
              Nombre del producto
              <input name="title" type="text" placeholder="Ej.: Almendras naturales" required />
            </label>

            <label>
              Precio
              <input name="price" type="number" min="0" step="0.01" placeholder="0,00" required />
            </label>

            <label>
              Peso o presentación
              <input name="weight" type="text" placeholder="Ej.: 500 g" />
            </label>

            <label>
              Stock
              <input name="stock" type="number" min="0" step="1" placeholder="0" />
            </label>

            <label className="products-form__field--wide">
              Descripción
              <textarea
                name="description"
                rows="3"
                placeholder="Escribí una breve descripción del producto"
              />
            </label>

            <label className="products-form__field--wide">
              URL de la imagen
              <input name="image" type="url" placeholder="https://ejemplo.com/imagen.jpg" />
            </label>
          </div>

          <div className="products-form__actions">
            <button className="products-button products-button--primary" type="button">
              Agregar producto
            </button>
            <button className="products-button products-button--secondary" type="reset">
              Limpiar
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
                      <img src={product.image} alt="" />
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
                        type="button"
                        aria-label={`Editar ${product.title}`}
                      >
                        Editar
                      </button>
                      <button
                        className="products-button products-button--delete"
                        type="button"
                        aria-label={`Eliminar ${product.title}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default ListProducts
