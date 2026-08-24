import { productImages, ANCHOS, ANCHO_RESPALDO } from '../data/product-images.js'

/**
 * Fotografía de producto con `srcset`.
 *
 * Las originales son exportaciones de móvil de ~280 kB; aquí se sirve WebP en el
 * ancho que toque (20 kB en una tarjeta de móvil) con un JPEG de respaldo.
 * `width`/`height` salen de las medidas reales generadas por el script, así que
 * el hueco queda reservado y la página no salta al cargar la foto (CLS).
 */
export function ProductImage({ product, index = 0, priority = false, sizes }) {
  const base = product.photos?.[index]
  const medidas = base ? productImages[base] : null

  if (!medidas) {
    // Red de seguridad para una pieza nueva sin fotos generadas todavía.
    return (
      <div className={`product-image tone-${product.tone}`}>
        <div className="cap-mark" aria-hidden="true">
          31ST
        </div>
        <span className="sr-only">Pendiente la fotografía de {product.name}.</span>
      </div>
    )
  }

  return (
    <div className={`product-image tone-${product.tone}`}>
      <picture>
        <source
          type="image/webp"
          srcSet={ANCHOS.map((ancho) => `${base}-${ancho}.webp ${ancho}w`).join(', ')}
          sizes={sizes}
        />
        <img
          src={`${base}-${ANCHO_RESPALDO}.jpg`}
          alt={`${product.name} — ${product.colorway}`}
          width={medidas.width}
          height={medidas.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
    </div>
  )
}
