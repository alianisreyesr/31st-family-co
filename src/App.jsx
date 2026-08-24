import { useState } from 'react'

const products = [
  { name: 'Roots Cap', color: 'Negro / Crema', price: '$38', badge: 'Drop 01' },
  { name: 'Family Script', color: 'Oliva / Blanco', price: '$38', badge: 'Edición limitada' },
  { name: '31st Classic', color: 'Carbón / Arena', price: '$38', badge: 'Próximamente' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitEmail = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div>
      <div className="announcement">ENVÍO GRATIS EN ÓRDENES DE $75+ · ÚNETE A LA FAMILIA</div>

      <header className="header">
        <a className="logo" href="#inicio" aria-label="31st Family Co, inicio">31ST<span>FAMILY CO</span></a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Cerrar' : 'Menú'}
        </button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
          <a href="#drop" onClick={() => setMenuOpen(false)}>El drop</a>
          <a href="#historia" onClick={() => setMenuOpen(false)}>Nuestra historia</a>
          <a href="#familia" onClick={() => setMenuOpen(false)}>Únete</a>
          <a href="https://www.instagram.com/31stfamilyco/?hl=en" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Instagram</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <p className="eyebrow">31st Family Co · Puerto Rico</p>
            <h1>Más que una marca.<br /><em>Somos familia.</em></h1>
            <p className="hero-copy">Gorras premium creadas desde nuestras raíces para quienes llevan su historia con orgullo.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#drop">Ver el drop actual</a>
              <a className="text-link" href="#historia">Conoce nuestra historia <span>→</span></a>
            </div>
          </div>
          <a className="scroll-cue" href="#drop">Explorar <span>↓</span></a>
        </section>

        <section className="section drop-section" id="drop">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">Drop 01</p>
              <h2>Hecho para representar.</h2>
            </div>
            <p>Diseños con intención, materiales seleccionados y una identidad que se lleva todos los días.</p>
          </div>
          <div className="product-grid">
            {products.map((product, index) => (
              <article className={`product-card tone-${index + 1}`} key={product.name}>
                <div className="product-image" role="img" aria-label={`${product.name}, espacio para fotografía del producto`}>
                  <span>{product.badge}</span>
                  <div className="cap-mark">31ST</div>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.color}</p>
                  </div>
                  <strong>{product.price}</strong>
                </div>
                <button className="product-button" type="button">Ver detalles <span>→</span></button>
              </article>
            ))}
          </div>
          <div className="center-action"><button className="button button-dark" type="button">Comprar la colección</button></div>
        </section>

        <section className="statement" id="historia">
          <div className="statement-photo" aria-hidden="true"><span>31</span></div>
          <div className="statement-copy">
            <p className="eyebrow">Nuestra historia</p>
            <h2>Todo comienza con la familia.</h2>
            <p>31st Family Co nació de una idea simple: lo que construimos juntos tiene más fuerza. Cada pieza es un recordatorio de las raíces que nos forman y de la visión que nos mueve.</p>
            <p>No buscamos seguir tendencias. Creamos piezas para las personas que entienden que estilo, esfuerzo y pertenencia pueden ir de la mano.</p>
            <a className="text-link light-link" href="#familia">Conoce a la familia <span>→</span></a>
          </div>
        </section>

        <section className="values section">
          <p className="eyebrow dark">Lo que representamos</p>
          <div className="values-grid">
            <div><span>01</span><h3>Familia</h3><p>Construimos desde la conexión, el respeto y las raíces compartidas.</p></div>
            <div><span>02</span><h3>Autenticidad</h3><p>Sin filtros. Una identidad real que se lleva con orgullo.</p></div>
            <div><span>03</span><h3>Calidad</h3><p>Detalles pensados para acompañarte en cada día.</p></div>
            <div><span>04</span><h3>Comunidad</h3><p>Una marca crece cuando su gente también crece.</p></div>
          </div>
        </section>

        <section className="signup" id="familia">
          <div>
            <p className="eyebrow">Acceso anticipado</p>
            <h2>El próximo drop<br />está cerca.</h2>
          </div>
          <div className="signup-content">
            <p>Únete a la Family List para recibir acceso temprano, restocks y lanzamientos exclusivos.</p>
            <form onSubmit={submitEmail}>
              <label className="sr-only" htmlFor="email">Tu email</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Tu email" required />
              <button type="submit">Quiero acceso</button>
            </form>
            {submitted && <p className="success" role="status">Estás dentro. Bienvenido a la familia.</p>}
            <small>Sin spam. Solo drops, restocks y noticias de la familia.</small>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-logo">31ST<span>FAMILY CO</span></div>
        <p>Más que una marca, somos familia.</p>
        <div className="footer-links">
          <a href="#drop">Colección</a>
          <a href="#historia">Historia</a>
          <a href="https://www.instagram.com/31stfamilyco/?hl=en" target="_blank" rel="noreferrer">Instagram</a>
          <a href="mailto:hello@31stfamilyco.com">Contacto</a>
        </div>
        <small>© {new Date().getFullYear()} 31st Family Co. Todos los derechos reservados.</small>
      </footer>
    </div>
  )
}

export default App
