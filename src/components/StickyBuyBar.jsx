import { useEffect, useState } from 'react'
import { OrderButton } from './OrderButton.jsx'
import { products } from '../data/products.js'
import { formatPrice } from '../lib/commerce.js'
import { events } from '../lib/analytics.js'

/**
 * Barra de compra fija en móvil. Aparece al dejar atrás el hero para que la
 * acción principal esté siempre a un pulgar de distancia: en un scroll largo,
 * el CTA de arriba deja de existir para quien va bajando.
 */
export function StickyBuyBar() {
  const [visible, setVisible] = useState(false)
  const featured = products.find((product) => product.status !== 'coming-soon') ?? products[0]

  useEffect(() => {
    const target = document.getElementById('drop')
    if (!target) return

    // IntersectionObserver en vez de un listener de scroll: no bloquea el hilo
    // principal en cada píxel.
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.boundingClientRect.top < 0),
      { threshold: 0 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={visible ? 'sticky-buy sticky-buy-visible' : 'sticky-buy'}
      aria-hidden={!visible}
    >
      <div className="sticky-buy-info">
        <strong>{featured.name}</strong>
        <span>{formatPrice(featured.price, featured.currency)}</span>
      </div>
      <OrderButton
        product={featured}
        className="button button-light"
        eventName={events.buyProduct}
      />
    </div>
  )
}
