import { resolveOrderLink } from '../lib/commerce.js'
import { track } from '../lib/analytics.js'

/**
 * Botón de compra. Nunca es un `<button>` inerte: `resolveOrderLink` siempre
 * devuelve un destino real (checkout, WhatsApp o DM), así que quien llega desde
 * Instagram siempre tiene una vía para ordenar.
 */
export function OrderButton({
  product = null,
  className = 'button button-dark',
  eventName,
  children,
}) {
  const link = resolveOrderLink(product)

  return (
    <a
      className={className}
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={() =>
        track(eventName, {
          via: link.kind,
          producto: product?.name ?? 'colección',
        })
      }
    >
      {children ?? link.label}
    </a>
  )
}
