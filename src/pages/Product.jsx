import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductGallery } from '../components/ProductGallery.jsx'
import { ProductImage } from '../components/ProductImage.jsx'
import { OrderButton } from '../components/OrderButton.jsx'
import { Signup } from '../components/Signup.jsx'
import { NotFound } from './NotFound.jsx'
import {
  products,
  findProduct,
  productPath,
  statusLabels,
  categoryLabels,
  collectionLabels,
} from '../data/products.js'
import { formatPrice } from '../lib/commerce.js'
import { focusWaitlist } from '../lib/waitlist.js'
import { track, events } from '../lib/analytics.js'

/**
 * Piezas relacionadas. Primero las de la misma categoría, luego el resto: sirve
 * a quien llega desde Google a una gorra concreta y no sabe que hay ocho más.
 * El orden es el del catálogo, sin azar, para que el HTML del prerender y el
 * del cliente coincidan.
 */
function relatedProducts(product, limit = 3) {
  const otras = products.filter((otra) => otra.id !== product.id)
  return [
    ...otras.filter((otra) => otra.category === product.category),
    ...otras.filter((otra) => otra.category !== product.category),
  ].slice(0, limit)
}

/**
 * Ficha de producto con URL propia.
 *
 * Existe por dos razones que la modal de la portada no cubre: una pieza
 * compartida por WhatsApp o encontrada en Google necesita una dirección a la
 * que llegar, y el sitio entero se resumía en tres URLs indexables. La modal se
 * queda como vista rápida desde la portada; esta es la página permanente.
 */
export function Product() {
  const { id } = useParams()
  const emailRef = useRef(null)
  const product = findProduct(id)

  // Un id que no existe no es una ficha vacía: es un 404, y así lo tiene que
  // ver Google además de la persona.
  if (!product) return <NotFound />

  const upcoming = product.status === 'upcoming'
  const available = product.status === 'available'
  const seccion = upcoming
    ? { to: '/#proximo-drop', label: 'El próximo capítulo' }
    : { to: '/#archivo', label: 'El archivo' }

  const joinWaitlist = () => {
    track(events.waitlistIntent, { producto: product.name, estado: product.status })
    focusWaitlist(emailRef)
  }

  return (
    <>
      <article className="product-page">
        <nav className="breadcrumb" aria-label="Ruta de navegación">
          <ol>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to={seccion.to}>{seccion.label}</Link>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="product-page-grid">
          <div className="product-page-media">
            <ProductGallery product={product} />
          </div>

          <div className="product-page-body">
            <p className="eyebrow dark">
              {statusLabels[product.status]} · {categoryLabels[product.category]}
              {product.collection && ` · ${collectionLabels[product.collection]}`}
            </p>
            <h1>{product.name}</h1>
            <p className="product-page-colorway">{product.colorway}</p>
            <p className="product-page-price">
              {upcoming ? 'Precio en el lanzamiento' : formatPrice(product.price, product.currency)}
            </p>
            <p className="product-page-summary">{product.summary}</p>

            <h2>Detalles</h2>
            <ul className="modal-details">
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>

            {product.sizes && (
              <>
                <h2>Tallas</h2>
                <ul className="modal-sizes">
                  {product.sizes.map((talla) => (
                    <li key={talla}>{talla}</li>
                  ))}
                </ul>
              </>
            )}

            {product.fit && !product.sizes && (
              <>
                <h2>Ajuste</h2>
                <p className="modal-fit">{product.fit}</p>
              </>
            )}

            <div className="product-page-actions">
              {available ? (
                <OrderButton
                  product={product}
                  className="button button-dark"
                  eventName={events.buyProduct}
                />
              ) : (
                <button className="button button-dark" type="button" onClick={joinWaitlist}>
                  {upcoming ? 'Quiero acceso' : 'Avísame del restock'}
                </button>
              )}
              {/* A la portada, no a un ancla local: las preguntas viven allí. */}
              <Link className="text-link" to="/#preguntas">
                Envíos y devoluciones <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Signup interest={product} inputRef={emailRef} />

      <section className="section related" aria-labelledby="related-titulo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sigue explorando</p>
            <h2 id="related-titulo">Otras piezas</h2>
          </div>
          <Link className="text-link" to={seccion.to}>
            Ver {seccion.label.toLowerCase()} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="related-grid">
          {relatedProducts(product).map((otra) => (
            <li key={otra.id}>
              <Link className="related-card" to={productPath(otra)}>
                <ProductImage product={otra} sizes="(max-width: 860px) 100vw, 33vw" />
                <p className="product-category">
                  {statusLabels[otra.status]} · {categoryLabels[otra.category]}
                </p>
                <strong>{otra.name}</strong>
                <span className="product-color">{otra.colorway}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
