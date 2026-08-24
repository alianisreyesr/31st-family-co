import { useState } from 'react'
import { ProductImage } from './ProductImage.jsx'

/**
 * Galería de la ficha: foto grande más miniaturas.
 *
 * Las miniaturas son botones con `aria-current`, así que quien usa teclado o
 * lector de pantalla sabe cuál está viendo. Con una sola foto no se pintan.
 */
export function ProductGallery({ product }) {
  const [activa, setActiva] = useState(0)
  const total = product.photos?.length ?? 0

  return (
    <div className="gallery">
      <ProductImage
        product={product}
        index={activa}
        priority
        sizes="(max-width: 1000px) 100vw, 50vw"
      />

      {total > 1 && (
        <ul className="gallery-thumbs">
          {product.photos.map((foto, i) => (
            <li key={foto}>
              <button
                type="button"
                className={i === activa ? 'gallery-thumb gallery-thumb-active' : 'gallery-thumb'}
                aria-current={i === activa}
                onClick={() => setActiva(i)}
              >
                <ProductImage product={product} index={i} sizes="88px" />
                <span className="sr-only">
                  Foto {i + 1} de {total} de {product.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
