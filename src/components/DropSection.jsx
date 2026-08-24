import { useCallback, useState } from 'react'
import { ProductCard } from './ProductCard.jsx'
import { ProductModal } from './ProductModal.jsx'
import { OrderButton } from './OrderButton.jsx'
import { products } from '../data/products.js'
import { resolveOrderLink } from '../lib/commerce.js'
import { events } from '../lib/analytics.js'

export function DropSection() {
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  const { kind } = resolveOrderLink()
  const orderHint = {
    checkout: null,
    whatsapp: 'Los pedidos se cierran por WhatsApp, uno a uno.',
    instagram: 'Los pedidos se cierran por DM de Instagram, uno a uno.',
  }[kind]

  return (
    <section className="section drop-section" id="drop">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Drop 01</p>
          <h2>Hecho para representar.</h2>
        </div>
        <p>
          Diseños con intención, materiales seleccionados y una identidad que se lleva todos los
          días.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index === 0}
            onOpenDetails={setSelected}
          />
        ))}
      </div>

      <div className="center-action">
        <OrderButton className="button button-dark" eventName={events.buyCollection} />
        {orderHint && <p className="order-hint">{orderHint}</p>}
      </div>

      <ProductModal product={selected} onClose={close} />
    </section>
  )
}
