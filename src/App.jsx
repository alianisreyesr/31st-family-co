import { useMemo, useState } from 'react'
import { categories, formatPrice, products } from './data/catalog.js'

const whatsappUrl = 'https://wa.me/17874648291'
const instagramUrl = 'https://www.instagram.com/31stfamilyco/?hl=en'

function ProductImage({ product }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (!product.image || imageFailed) {
    return (
      <div className="image-placeholder" aria-label={product.imageAlt} role="img">
        <span>31ST</span>
        <small>{product.category}</small>
      </div>
    )
  }

  return <img src={product.image} alt={product.imageAlt} loading="lazy" onError={() => setImageFailed(true)} />
}

function ProductCard({ product, onRestock }) {
  const isAvailable = product.status === 'available'

  return (
    <article className="product-card">
      <div className="product-media">
        <ProductImage product={product} />
        <span className={isAvailable ? 'status-badge available' : 'status-badge'}>
          {isAvailable ? 'Disponible' : 'Agotado'}
        </span>
      </div>
      <div className="product-info">
        <div>
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="product-color">{product.color}</p>
        </div>
        <strong>{formatPrice(product.price)}</strong>
      </div>
      {isAvailable ? (
        <button className="product-action" type="button" onClick={() => window.alert('El checkout se conectará con Stripe en la próxima fase.')}>Añadir al carrito <span>→</span></button>
      ) : (
        <button className="product-action" type="button" onClick={() => onRestock(product.name)}>Avísame del restock <span>→</span></button>
      )}
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')

  const featuredProducts = products.filter((product) => product.status === 'available')
  const archivedProducts = useMemo(
    () => products.filter((product) => product.status === 'sold-out' && (activeCategory === 'Todos' || product.category === activeCategory)),
    [activeCategory],
  )

  const submitEmail = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setNotice('Estás dentro. Te avisaremos primero sobre el próximo drop.')
    setEmail('')
  }

  const requestRestock = (productName) => {
    setNotice(`Te avisaremos cuando ${productName} vuelva a estar disponible.`)
    document.querySelector('#familia')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <div className="announcement">BORN IN PUERTO RICO · BUILT TO STAND OUT · EST. 2024</div>

      <header className="header">
        <a className="logo" href="#inicio" aria-label="31st Family Co, inicio">31ST<span>FAMILY CO.</span></a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Cerrar' : 'Menú'}</button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
          <a href="#shop" onClick={() => setMenuOpen(false)}>Comprar</a>
          <a href="#archivo" onClick={() => setMenuOpen(false)}>Archivo</a>
          <a href="#historia" onClick={() => setMenuOpen(false)}>Historia</a>
          <a href={instagramUrl} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Instagram</a>
          <a className="nav-cart" href="#shop" onClick={() => setMenuOpen(false)}>Bolsa (0)</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-grid" aria-hidden="true"><span>31</span></div>
          <div className="hero-content">
            <p className="eyebrow">31st Family Co. · Puerto Rico</p>
            <h1>Más que una marca.<br /><em>Somos familia.</em></h1>
            <p className="hero-copy">Streetwear nacido en Puerto Rico, creado desde nuestras raíces para quienes no vinieron a encajar.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#shop">Comprar HeadBands</a>
              <a className="text-link" href="#archivo">Explorar el archivo <span>→</span></a>
            </div>
          </div>
          <div className="hero-stamp"><span>EST.</span><strong>2024</strong><span>FAMILY CO.</span></div>
        </section>

        <section className="shop section" id="shop">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">Disponible ahora</p>
              <h2>Everyday essentials.</h2>
            </div>
            <p>Las piezas disponibles ahora. Diseñadas para acompañar cada día y representar la familia donde vayas.</p>
          </div>
          <div className="product-grid featured-grid">
            {featuredProducts.map((product) => <ProductCard product={product} key={product.id} onRestock={requestRestock} />)}
          </div>
          <p className="availability-note">Inventario limitado. El estado final de disponibilidad se confirmará al conectar el sistema de inventario.</p>
        </section>

        <section className="statement" id="historia">
          <div className="statement-mark" aria-hidden="true">31ST</div>
          <div className="statement-copy">
            <p className="eyebrow">Nuestra historia</p>
            <h2>De las raíces familiares a un futuro sólido.</h2>
            <p>31st Family Co es una marca nacida en Puerto Rico. Construimos piezas con gráficos atrevidos, creatividad cruda y la convicción de que la autoexpresión no necesita permiso.</p>
            <p>No solo hacemos streetwear. Construimos una familia para quienes llevan su identidad con orgullo y están creando su propio camino.</p>
            <a className="text-link light-link" href={instagramUrl} target="_blank" rel="noreferrer">Conoce la familia <span>→</span></a>
          </div>
        </section>

        <section className="archive section" id="archivo">
          <div className="section-heading archive-heading">
            <div>
              <p className="eyebrow dark">Archivo de drops</p>
              <h2>Lo que se fue, dejó marca.</h2>
            </div>
            <p>Estas piezas están agotadas. Únete a la lista para enterarte primero de restocks y próximos lanzamientos.</p>
          </div>
          <div className="category-filter" role="tablist" aria-label="Filtrar archivo por categoría">
            {categories.map((category) => (
              <button key={category} type="button" className={activeCategory === category ? 'filter active' : 'filter'} onClick={() => setActiveCategory(category)}>{category}</button>
            ))}
          </div>
          <div className="product-grid archive-grid">
            {archivedProducts.map((product) => <ProductCard product={product} key={product.id} onRestock={requestRestock} />)}
          </div>
        </section>

        <section className="inventory-promise">
          <p className="eyebrow">La promesa 31st</p>
          <div><span>01</span><p>Diseño con identidad</p></div>
          <div><span>02</span><p>Hecho para destacar</p></div>
          <div><span>03</span><p>Construido en familia</p></div>
        </section>

        <section className="signup" id="familia">
          <div>
            <p className="eyebrow">Acceso anticipado</p>
            <h2>El próximo drop<br />empieza aquí.</h2>
          </div>
          <div className="signup-content">
            <p>Únete a la Family List para recibir restocks, acceso temprano y noticias directamente de 31st Family Co.</p>
            <form onSubmit={submitEmail}>
              <label className="sr-only" htmlFor="email">Tu email</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Tu email" required />
              <button type="submit">Unirme</button>
            </form>
            {notice && <p className="success" role="status">{notice}</p>}
            <small>Sin spam. Solo drops, restocks y noticias de la familia.</small>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div><div className="footer-logo">31ST<span>FAMILY CO.</span></div><p>Born in Puerto Rico.<br />Built to stand out.</p></div>
          <div className="footer-links">
            <a href="#shop">Comprar</a>
            <a href="#archivo">Archivo</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@31stfamilyco" target="_blank" rel="noreferrer">TikTok</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="mailto:31stfamilyco@gmail.com">Email</a>
          </div>
        </div>
        <div className="footer-bottom"><small>© {new Date().getFullYear()} 31st Family Co. Todos los derechos reservados.</small><small>Puerto Rico · Estados Unidos</small></div>
      </footer>
    </div>
  )
}

export default App
