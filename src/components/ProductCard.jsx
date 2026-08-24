import { ProductImage } from './ProductImage.jsx'
import { OrderButton } from './OrderButton.jsx'
import { formatPrice } from '../lib/commerce.js'
import { statusLabels, categoryLabels } from '../data/products.js'
import { track, events } from '../lib/analytics.js'

export function ProductCard({ product, onOpenDetails, priority = false }) {
  const comingSoon = product.status === 'coming-soon'

  return (
    <article className="product-card" id={product.id}>
      <ProductImage
        product={product}
        priority={priority}
        sizes="(max-width: 860px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="product-info">
        <div>
          <p className="product-category">{categoryLabels[product.category]}</p>
          <h3>{product.name}</h3>
          <p>{product.colorway}</p>
        </div>
        <div className="product-price">
          <strong>{formatPrice(product.price, product.currency)}</strong>
          <span className={`product-status status-${product.status}`}>
            {statusLabels[product.status]}
          </span>
        </div>
      </div>

      <div className="product-actions">
        {comingSoon ? (
          <a
            className="button button-outline"
            href="#familia"
            onClick={() =>
              track(events.productDetail, { producto: product.name, accion: 'avisame' })
            }
          >
            Avísame del drop
          </a>
        ) : (
          <OrderButton
            product={product}
            className="button button-dark"
            eventName={events.buyProduct}
          />
        )}

        <button
          className="product-button"
          type="button"
          onClick={() => {
            track(events.productDetail, { producto: product.name })
            onOpenDetails(product)
          }}
        >
          Ver detalles <span aria-hidden="true">→</span>
          <span className="sr-only"> de {product.name}</span>
        </button>
      </div>
    </article>
  )
}
