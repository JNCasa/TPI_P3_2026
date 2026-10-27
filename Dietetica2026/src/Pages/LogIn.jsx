import Detokenizador from '../components/Detokenizador'
import './LogIn.css'

function LogIn({ setVisible_del_padre }) {
  return (
    <section className="login-page">
      <h1>Acceso de cliente</h1>
      <div className="login-form">
        <p className="login-form__instructions">
          Iniciá sesión como cliente en Postman. Luego, en DevTools → Application,
          agregá una fila con Key <code>token</code> y Value con el token generado
          en Local Storage o Session Storage para http://localhost:5173. La API
          identifica al usuario a partir del token; no hace falta guardar el ID.
        </p>
      </div>
    ---este compontes es una prueba nomas para ver como funciona el token
    se llama detokenozidor, pegas el token lo decodifca y te muestra el payload 

      <Detokenizador setVisible_del_padre={setVisible_del_padre} />

    </section>
  )
}

export default LogIn
