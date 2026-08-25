import { Link } from 'react-router-dom'
import { ProductImage } from './ProductImage.jsx'
import { OrderButton } from './OrderButton.jsx'
import { formatPrice } from '../lib/commerce.js'
import { statusLabels, categoryLabels, collectionLabels, productPath } from '../data/products.js'
import { track, events } from '../lib/analytics.js'

/**
 * Tarjeta de producto.
 *
 * Con el inventario agotado, la acción no es comprar sino entrar en la lista.
 * El botón de compra solo aparece si una pieza vuelve a estar `available`, y
 * entonces `OrderButton` resuelve un destino de compra real.
 */
export function ProductCard({ product, onWaitlist, onOpenDetails, priority = false }) {
  const upcoming = product.status === 'upcoming'
  const available = product.status === 'available'

  return (
    <article className="product-card" id={product.id}>
      <div className="product-media">
        <ProductImage
          product={product}
          priority={priority}
          sizes="(max-width: 860px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className={upcoming ? 'status-badge status-badge-upcoming' : 'status-badge'}>
          {statusLabels[product.status]}
        </span>
      </div>

      <div className="product-info">
        <div>
          <p className="product-category">
            {categoryLabels[product.category]}
            {product.collection && ` · ${collectionLabels[product.collection]}`}
          </p>
          {/*
            El título es un enlace real a la ficha, no un `onClick`: es el único
            camino que un rastreador puede seguir hasta las páginas de producto,
            y deja abrir la pieza en otra pestaña o copiar su dirección.

            El colorway va en `aria-label` porque dos variantes comparten nombre
            y si no habría dos enlaces «31st HeadBand» indistinguibles en la
            lista de enlaces de un lector de pantalla. En un <span> oculto no
            vale: al partir el texto en varios nodos el nombre sale pegado
            («31st HeadBand— Negro»), igual que le pasaba al botón de abajo.
          */}
          <h3>
            <Link
              className="product-title-link"
              to={productPath(product)}
              aria-label={`${product.name} — ${product.colorway}`}
            >
              {product.name}
            </Link>
          </h3>
          <p className="product-color">{product.colorway}</p>
        </div>
        <strong className="product-price">
          {upcoming ? 'Próximo drop' : formatPrice(product.price, product.currency)}
        </strong>
      </div>

      <div className="product-actions">
        {available ? (
          <OrderButton
            product={product}
            className="button button-dark"
            eventName={events.buyProduct}
          />
        ) : (
          <button
            className="product-action"
            type="button"
            /*
              El nombre va en `aria-label` y no en un <span> oculto: al partir el
              texto en varios nodos, JSX colapsa el salto de línea y el nombre
              accesible salía pegado («Ver detallesde 2/31 PR Edition»).
            */
            aria-label={`${upcoming ? 'Quiero acceso' : 'Avísame del restock'} de ${product.name}`}
            onClick={() => {
              track(events.waitlistIntent, { producto: product.name, estado: product.status })
              onWaitlist(product)
            }}
          >
            {upcoming ? 'Quiero acceso' : 'Avísame del restock'} <span aria-hidden="true">→</span>
          </button>
        )}

        <button
          className="product-details"
          type="button"
          aria-label={`Ver detalles de ${product.name}`}
          onClick={() => {
            track(events.productDetail, { producto: product.name })
            onOpenDetails(product)
          }}
        >
          Ver detalles
        </button>
      </div>
    </article>
  )
}
