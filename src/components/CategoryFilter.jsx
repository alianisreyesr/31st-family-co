import { categoryLabels, collectionLabels } from '../data/products.js'

/**
 * Filtro del archivo.
 *
 * Botones con `aria-pressed`, no `role="tablist"`: no hay paneles distintos, es
 * la misma rejilla filtrada, y anunciarlo como pestañas engaña al lector de
 * pantalla sobre la navegación disponible. El recuento va en una región viva
 * para que el cambio no ocurra en silencio.
 *
 * Mezcla categorías y colecciones en una sola fila porque así estaba en el
 * catálogo original, donde «Day One» y «Second Serie» convivían con «Gorras» y
 * «Socks» en la misma lista.
 */
export function CategoryFilter({ products, active, onChange, shown }) {
  const cuenta = (predicado) => products.filter(predicado).length

  const opciones = [
    { id: 'todos', label: 'Todos', count: products.length },
    ...Object.entries(collectionLabels).map(([id, label]) => ({
      id: `coleccion:${id}`,
      label,
      count: cuenta((p) => p.collection === id),
    })),
    ...Object.entries(categoryLabels).map(([id, label]) => ({
      id: `categoria:${id}`,
      label,
      count: cuenta((p) => p.category === id),
    })),
  ].filter((opcion) => opcion.count > 0)

  const etiquetaActiva = opciones.find((o) => o.id === active)?.label

  return (
    <div className="category-filter">
      <div role="group" aria-label="Filtrar el archivo">
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            className={opcion.id === active ? 'filter-chip filter-chip-active' : 'filter-chip'}
            aria-pressed={opcion.id === active}
            onClick={() => onChange(opcion.id)}
          >
            {opcion.label} <span aria-hidden="true">{opcion.count}</span>
            <span className="sr-only">, {opcion.count} piezas</span>
          </button>
        ))}
      </div>

      <p className="filter-status" role="status" aria-live="polite">
        {active === 'todos'
          ? `${products.length} piezas`
          : `${shown} de ${products.length} piezas · ${etiquetaActiva}`}
      </p>
    </div>
  )
}

/** Aplica el id del filtro a la lista. Se exporta para poder testearlo aparte. */
export function filtrar(products, active) {
  if (active === 'todos') return products
  const [tipo, valor] = active.split(':')
  if (tipo === 'coleccion') return products.filter((p) => p.collection === valor)
  if (tipo === 'categoria') return products.filter((p) => p.category === valor)
  return products
}
