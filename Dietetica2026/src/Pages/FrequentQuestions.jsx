import './FrequentQuestions.css'

function FrequentQuestions() {
  function enviarConsulta(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')
    const subject = encodeURIComponent('Consulta desde Dietética BeGreen')
    const body = encodeURIComponent(
      `Nombre y apellido: ${nombre}\nTeléfono: ${telefono}`,
    )

    window.location.href =
      `mailto:nik6.web@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <main className="faq-contact-page">
      <form className="faq-contact-form" onSubmit={enviarConsulta}>
        <h1 className="faq-contact-form__title">Consultanos</h1>
        <div className="mb-3">
          <label htmlFor="contact-name" className="form-label">
            Nombre y apellido
          </label>
          <input
            id="contact-name"
            name="nombre"
            className="form-control"
            type="text"
            autoComplete="name"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact-phone" className="form-label">
            Teléfono
          </label>
          <input
            id="contact-phone"
            name="telefono"
            className="form-control"
            type="tel"
            autoComplete="tel"
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Enviar
        </button>
      </form>
    </main>
  )
}

export default FrequentQuestions
