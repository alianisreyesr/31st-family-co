import { categoryLabels } from '../data/products.js'

/**
 * Filtro por categoría de la rejilla.
 *
 * Botones con `aria-pressed` en lugar del patrón de pestañas: no hay paneles
 * distintos, es la misma rejilla filtrada. El recuento de resultados va en una
 * región viva para que un lector de pantalla anuncie el cambio, que si no
 * ocurre en silencio.
 */
export function CategoryFilter({ counts, active, onChange, total, shown }) {
  const opciones = [
    { id: 'todo', label: 'Todo', count: total },
    ...Object.entries(categoryLabels)
      .map(([id, label]) => ({ id, label, count: counts[id] ?? 0 }))
      .filter((opcion) => opcion.count > 0),
  ]

  return (
    <div className="category-filter">
      <div role="group" aria-label="Filtrar por categoría">
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
        {shown === total
          ? `${total} piezas`
          : `${shown} de ${total} piezas · ${categoryLabels[active]}`}
      </p>
    </div>
  )
}
