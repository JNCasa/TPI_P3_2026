import { useState } from 'react'

function decodificarPayload(payload) {
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  return JSON.parse(atob(paddedBase64))
}

const Detokenizador = ({ setVisible_del_padre }) => {
  const [valor, setValor] = useState('')
  const payload = valor.split('.')[1]
  let datos = ''

  if (payload) {
    try {
      datos = decodificarPayload(payload)
      datos = JSON.stringify(datos, null, 2)
    } catch {
      datos = 'No se pudo decodificar el payload.'
    }
  }

  function actualizarToken(event) {
    const token = event.target.value.trim().replace(/^Bearer\s+/i, '')
    const payloadToken = token.split('.')[1]
    setValor(token)

    if (!payloadToken) {
      setVisible_del_padre('')
      return
    }

    try {
      const tokenDatos = decodificarPayload(payloadToken)
      setVisible_del_padre(tokenDatos.rol || '')
    } catch {
      setVisible_del_padre('')
    }
  }

  return (
    <section>
      <p>Pegá un token para mostrar el payload.</p>
      <label htmlFor="token-input">Token</label>
      <input
        id="token-input"
        type="password"
        value={valor}
        onChange={actualizarToken}
      />
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
        {datos}
      </pre>
  <p>sub = ID del usuario<br/>iat: fecha de emisión del token
<br/>exp: fecha de expiración del token</p>
    
    </section>
  )
}

export default Detokenizador
