import { productImages, ANCHOS, ANCHO_RESPALDO } from '../data/product-images.js'

/**
 * Fotografía de producto con `srcset`.
 *
 * Las originales del catálogo son exportaciones de móvil de ~280 kB; aquí se
 * sirve WebP en el ancho que toque (20 kB en una tarjeta de móvil) con un JPEG
 * de respaldo para navegadores viejos. `width`/`height` vienen de las medidas
 * reales generadas por el script, así que el hueco queda reservado y la página
 * no salta al cargar la foto (CLS).
 */
export function ProductImage({ product, index = 0, priority = false, sizes }) {
  const fotos = productImages[product.id] ?? []
  const foto = fotos[index]

  if (!foto) {
    // Sin fotografía: se mantiene el placeholder geométrico como red de
    // seguridad para un producto nuevo que todavía no tiene fotos generadas.
    return (
      <div className={`product-image tone-${product.tone}`}>
        <span className="product-badge">{product.badge}</span>
        <div className="cap-mark" aria-hidden="true">
          31ST
        </div>
        <span className="sr-only">Pendiente la fotografía de {product.name}.</span>
      </div>
    )
  }

  const srcSet = ANCHOS.map((ancho) => `${foto.base}-${ancho}.webp ${ancho}w`).join(', ')

  return (
    <div className={`product-image tone-${product.tone}`}>
      <picture>
        <source type="image/webp" srcSet={srcSet} sizes={sizes} />
        <img
          src={`${foto.base}-${ANCHO_RESPALDO}.jpg`}
          alt={`${product.name} — ${product.colorway}`}
          width={foto.width}
          height={foto.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
      <span className="product-badge">{product.badge}</span>
    </div>
  )
}

/** Número de fotos disponibles para un producto, para pintar la galería. */
export function contarFotos(productId) {
  return (productImages[productId] ?? []).length
}
