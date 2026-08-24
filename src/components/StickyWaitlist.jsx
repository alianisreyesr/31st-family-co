import { useEffect, useState } from 'react'
import { upcomingProducts } from '../data/products.js'
import { track, events } from '../lib/analytics.js'

/**
 * Barra fija en móvil. Aparece al dejar atrás el hero para que la acción
 * principal esté siempre a un pulgar de distancia: en un scroll largo, el CTA de
 * arriba deja de existir para quien va bajando.
 *
 * La acción es entrar en la lista, no comprar: no hay nada en stock.
 */
export function StickyWaitlist() {
  const [visible, setVisible] = useState(false)
  const proxima = upcomingProducts[0]

  useEffect(() => {
    const target = document.getElementById('proximo-drop')
    if (!target) return

    // IntersectionObserver en vez de un listener de scroll: no bloquea el hilo
    // principal en cada píxel.
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.boundingClientRect.top < 0),
      { threshold: 0 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={visible ? 'sticky-buy sticky-buy-visible' : 'sticky-buy'}
      aria-hidden={!visible}
    >
      <div className="sticky-buy-info">
        <strong>{proxima ? proxima.name : 'Próximo drop'}</strong>
        <span>Acceso anticipado</span>
      </div>
      <a
        className="button button-light"
        href="#familia"
        tabIndex={visible ? undefined : -1}
        onClick={() => track(events.waitlistIntent, { origen: 'barra-fija' })}
      >
        Únete
      </a>
    </div>
  )
}
