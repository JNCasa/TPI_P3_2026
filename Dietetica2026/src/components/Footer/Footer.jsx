import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__contact">
        <p><strong>Dirección:</strong> Consultanos por teléfono</p>
        <p>
          <strong>Teléfono:</strong>{' '}
          <a href="tel:+5493413376341">+54 9 341 337-6341</a>
        </p>
      </div>
      <p className="site-footer__copyright">
        <img
    src="/images/logosolo.png"
    alt="Logo"
    width="40"
    height="40"
    className="me-2"
  /> © 2026 Dietética BeGreen S.A.  Todos los derechos reservados.
      </p>
    </footer>
  )
}

export default Footer
