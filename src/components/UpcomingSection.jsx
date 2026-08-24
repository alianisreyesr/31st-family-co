import { ProductCard } from './ProductCard.jsx'
import { upcomingProducts } from '../data/products.js'
import { track, events } from '../lib/analytics.js'

/**
 * El próximo drop. Va primero porque es lo único que se puede conseguir: el
 * resto del catálogo está agotado, y la conversión es entrar en la lista.
 */
export function UpcomingSection({ onWaitlist, onOpenDetails }) {
  if (upcomingProducts.length === 0) return null

  return (
    <section className="section upcoming" id="proximo-drop">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Próximamente</p>
          <h2>El próximo capítulo.</h2>
        </div>
        <p>
          Estas piezas formarán parte del próximo lanzamiento. Únete a la lista para recibir acceso
          temprano antes de que se anuncie al público.
        </p>
      </div>

      <div className="product-grid featured-grid">
        {upcomingProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index === 0}
            onWaitlist={onWaitlist}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>

      <div className="center-action">
        <a
          className="button button-dark"
          href="#familia"
          onClick={() => track(events.waitlistIntent, { origen: 'proximo-drop' })}
        >
          Quiero acceso anticipado
        </a>
      </div>
    </section>
  )
}
