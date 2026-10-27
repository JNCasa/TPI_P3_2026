
import Card from './Card.jsx';

function ProductosDiet({ products, setProducts }) {
  return (
    <div>
      <h1>Productos</h1>
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosDiet;
