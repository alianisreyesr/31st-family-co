import { useRef } from 'react'
import { ProductGallery } from './ProductGallery.jsx'
import { OrderButton } from './OrderButton.jsx'
import { formatPrice } from '../lib/commerce.js'
import { statusLabels, categoryLabels, collectionLabels } from '../data/products.js'
import { useDialog } from '../hooks/useDialog.js'
import { events } from '../lib/analytics.js'

/**
 * Ficha de producto en modal. Paso intermedio hasta que existan páginas de
 * producto con URL propia: cubre la duda de «qué es exactamente esto» sin montar
 * routing por SKU.
 */
export function ProductModal({ product, onClose, onWaitlist }) {
  const panelRef = useRef(null)
  useDialog({ isOpen: Boolean(product), panelRef, onClose })

  if (!product) return null

  const titleId = `modal-titulo-${product.id}`
  const upcoming = product.status === 'upcoming'
  const available = product.status === 'available'

  return (
    <div className="modal-overlay">
      {/*
        El fondo es un <button> real en lugar de un div con onClick: así cerrar
        al pinchar fuera también funciona con teclado y lo anuncia el lector de
        pantalla, sin inventar handlers de teclado a mano.
      */}
      <button className="modal-backdrop" type="button" onClick={onClose}>
        <span className="sr-only">Cerrar la ficha de producto</span>
      </button>

      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <button className="modal-close" type="button" onClick={onClose}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Cerrar la ficha de producto</span>
        </button>

        <div className="modal-media">
          <ProductGallery product={product} />
        </div>

        <div className="modal-body">
          <p className="eyebrow dark">
            {statusLabels[product.status]} · {categoryLabels[product.category]}
            {product.collection && ` · ${collectionLabels[product.collection]}`}
          </p>
          <h2 id={titleId}>{product.name}</h2>
          <p className="modal-colorway">{product.colorway}</p>
          <p className="modal-price">
            {upcoming ? 'Precio en el lanzamiento' : formatPrice(product.price, product.currency)}
          </p>
          <p className="modal-summary">{product.summary}</p>

          <h3>Detalles</h3>
          <ul className="modal-details">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>

          {product.sizes && (
            <>
              <h3>Tallas</h3>
              <ul className="modal-sizes">
                {product.sizes.map((talla) => (
                  <li key={talla}>{talla}</li>
                ))}
              </ul>
            </>
          )}

          {product.fit && !product.sizes && (
            <>
              <h3>Ajuste</h3>
              <p className="modal-fit">{product.fit}</p>
            </>
          )}

          <div className="modal-actions">
            {available ? (
              <OrderButton
                product={product}
                className="button button-dark"
                eventName={events.buyProduct}
              />
            ) : (
              <button
                className="button button-dark"
                type="button"
                onClick={() => {
                  onClose()
                  onWaitlist(product)
                }}
              >
                {upcoming ? 'Quiero acceso' : 'Avísame del restock'}
              </button>
            )}
            <a className="text-link" href="#preguntas" onClick={onClose}>
              Envíos y devoluciones <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
