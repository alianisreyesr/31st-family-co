/**
 * Resuelve a donde manda cada boton de compra.
 *
 * Cadena de fallbacks, de mejor a peor pero nunca vacia:
 *   1. checkout propio del producto (Shopify / Stripe por SKU)
 *   2. checkout general de la tienda
 *   3. pedido por WhatsApp con el mensaje pre-escrito
 *   4. DM de Instagram
 *
 * El objetivo es que jamas exista un boton que no lleve a ningun sitio: una
 * persona que llega del link de la bio siempre tiene una via para comprar.
 */
import { config, brand } from './config.js'

export function formatPrice(cents, currency = 'USD') {
  // `null` es un estado real del catálogo: la pieza está agotada y no se publica
  // precio. Devolver cadena vacía dejaba un hueco sin explicación en la tarjeta.
  if (cents === null) return 'Agotado'
  if (typeof cents !== 'number' || Number.isNaN(cents)) return ''
  return new Intl.NumberFormat('es-PR', {
    style: 'currency',
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

const whatsappLink = (message) =>
  `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`

/**
 * @param {object|null} product Producto concreto, o null para la coleccion.
 * @returns {{href: string, kind: 'checkout'|'whatsapp'|'instagram', label: string, external: boolean}}
 */
export function resolveOrderLink(product = null) {
  const productLabel = product ? `${product.name} (${product.colorway})` : 'la colección'

  if (product?.checkoutUrl) {
    return { href: product.checkoutUrl, kind: 'checkout', label: 'Comprar ahora', external: true }
  }
  if (config.checkoutUrl) {
    return {
      href: config.checkoutUrl,
      kind: 'checkout',
      label: product ? 'Comprar ahora' : 'Comprar la colección',
      external: true,
    }
  }
  if (config.whatsappNumber) {
    return {
      href: whatsappLink(`Hola ${brand.name}, quiero ordenar ${productLabel}.`),
      kind: 'whatsapp',
      label: 'Ordenar por WhatsApp',
      external: true,
    }
  }
  return {
    href: config.instagramUrl,
    kind: 'instagram',
    label: 'Ordenar por DM',
    external: true,
  }
}

/** Aviso para el equipo cuando todavia no hay checkout real conectado. */
export function isCheckoutConfigured() {
  return Boolean(config.checkoutUrl)
}
