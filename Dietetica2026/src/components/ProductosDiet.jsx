
import React, { useState, useEffect } from 'react';
import products from './json.jsx';
import Card from './Card.jsx';

function ProductosDiet() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    setProductList(products);
  }, []);

  return (
    <div >
         <button type="button" class="btn btn-success">Finalizar Compra</button>

      <h1>Productos</h1>
      <div   className="d-flex flex-wrap justify-content-center" >
        {productList.map(product => (
          <div   key={product.id} className="m-2">
            <Card id={product.id} title={product.title} descripcion={product.descripcion} weigth={product.weigth} price={product.price} image={product.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosDiet;
