import './AboutUs.css'

function AboutUs() {
  return (
    <>
      <div className="about-page__hero">
        <img src="/images/tienda.jpg" alt="tienda" />
        <h1 className="about-page__hero-title">🌿 Nuestra casa</h1>
        <a className="about-page__who-link" href="#about-page-title">
          ¿Quiénes somos?
        </a>
      </div>
      <h1 id="about-page-title" className="about-page__title">
        🌿 "Somos lo que comemos..."{' '}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="0.7em"
          height="0.7em"
          fill="currentColor"
          className="bi bi-person-arms-up"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
          <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z" />
        </svg>
      </h1>
      <div
        id="carouselExampleInterval"
        className="carousel slide about-carousel"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="1000">
            <img src="/images/tienda.jpg" className="d-block w-100" alt="tienda" />
          </div>
          <div className="carousel-item" data-bs-interval="1000">
            <img src="/images/wel2.avif" className="d-block w-100" alt="wellness" />
          </div>
          <div className="carousel-item" data-bs-interval="1000">
            <img src="/images/wel3.jpg" className="d-block w-100" alt="wellness" />
          </div>
        </div>
        <h6 className="about-carousel__caption">
          En Beegreen creemos que una alimentación saludable es la base para una
          vida plena y equilibrada. Somos una dietética nacida de la pasión por
          el bienestar y el cuidado de las personas, comprometidos con ofrecer
          productos naturales, nutritivos y de calidad. Nuestra misión es
          acompañarte en cada paso hacia hábitos más saludables, brindándote
          opciones que cuiden tu cuerpo y contribuyan a tu bienestar diario. Nos
          guiamos por valores como la calidad, la confianza, la cercanía y el
          compromiso con una vida más consciente y natural.
        </h6>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev"
          aria-label="Paisaje anterior"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="next"
          aria-label="Paisaje siguiente"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

export default AboutUs
