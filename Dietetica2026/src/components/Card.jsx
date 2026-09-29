import React from "react";
import Counter from "./Counter";



const Card = (props) => {
  return (
    <div className="card" style={{width: "18rem"}}>
     <div style={{ overflow: "hidden"/*para que la img se quede dentro*/}}>
      <img  className='card-img-top'   src={props.image} alt={props.title}/>
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
    
        <p className="card-text">{props.weight}</p>
        <p className="card-text">{props.price}</p>
        <p className="card-text">{props.descripcion}</p>
        {/*<a href="#" className="btn btn-primary">Ir a algún lugar</a>*/}
        <Counter/>
      </div>
    </div>
  );
}

export default Card;
