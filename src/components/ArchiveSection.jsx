import { useMemo, useState } from 'react'
import { ProductCard } from './ProductCard.jsx'
import { CategoryFilter, filtrar } from './CategoryFilter.jsx'
import { archivedProducts } from '../data/products.js'

/**
 * El archivo: lo que ya se agotó. No se esconde, porque es la prueba de que la
 * marca entrega, y es lo que sostiene la lista de espera.
 */
export function ArchiveSection({ onWaitlist, onOpenDetails }) {
  const [filtro, setFiltro] = useState('todos')
  const visibles = useMemo(() => filtrar(archivedProducts, filtro), [filtro])

  return (
    <section className="section archive" id="archivo">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Archivo de drops</p>
          <h2>Lo que se fue, dejó marca.</h2>
        </div>
        <p>
          Estas piezas están agotadas. Únete a la lista para enterarte primero de restocks y
          próximos lanzamientos.
        </p>
      </div>

      <CategoryFilter
        products={archivedProducts}
        active={filtro}
        onChange={setFiltro}
        shown={visibles.length}
      />

      <div className="product-grid archive-grid">
        {visibles.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onWaitlist={onWaitlist}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </section>
  )
}
