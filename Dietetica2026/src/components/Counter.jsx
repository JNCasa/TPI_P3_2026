import React, { useState } from 'react';

const Counter = () => {
            const [contador, setContador]=useState(0);
            function SumarUno(){ setContador(contador+1)};
           
                function RestarUno(){
                  if (contador>0){
                      setContador(contador-1)};
              }
              return (
                
                
                <div>
                <hr/>
                <h3>Cantidad: {contador}</h3>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-success btn-lg shadow-sm" onClick={SumarUno}>+</button>
                  <button type="button" className="btn btn-success btn-lg shadow-sm" onClick={RestarUno}>-</button>
                </div>
                <hr/>
              </div>
              
              
            );
}

export default Counter