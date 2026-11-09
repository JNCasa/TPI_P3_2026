
import Card from './Card.jsx';

function ProductosDiet({ products, setProducts }) {
  return (
    <div>
      <h1> <img
     src="/images/logo.png"
    alt="Logo"
    width="40"
    height="40"
    className="me-2"
  />Productos</h1>
      <div className="d-flex flex-wrap justify-content-center">
        {products.map((product) => (
          <div key={product.id} className="m-2">
            <Card
              setProducts={setProducts}
              id={product.id}
              title={product.title}
              description={product.description}
              weight={product.weight}
              price={product.price}
              image={product.image}
              stock={product.stock}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosDiet;
