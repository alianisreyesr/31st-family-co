/**
 * Analitica opcional sobre Plausible: sin cookies, sin banner de consentimiento
 * y ~1 kB de script. Si `VITE_PLAUSIBLE_DOMAIN` esta vacio no se carga nada de
 * terceros y `track()` se vuelve un no-op, asi que el codigo de producto puede
 * instrumentar libremente sin condicionales.
 */
import { config } from './config.js'

const SCRIPT_ID = 'plausible-analytics'

export function initAnalytics() {
  if (typeof document === 'undefined') return
  if (!config.plausibleDomain) return
  if (document.getElementById(SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.defer = true
  script.dataset.domain = config.plausibleDomain
  script.src = `${config.plausibleHost}/js/script.tagged-events.js`
  document.head.appendChild(script)

  // Cola que Plausible drena al cargar: los eventos disparados antes de que el
  // script llegue no se pierden.
  window.plausible =
    window.plausible ||
    function queue(...args) {
      ;(window.plausible.q = window.plausible.q || []).push(args)
    }
}

/**
 * @param {string} name Nombre del evento, ej. 'Comprar: coleccion'.
 * @param {Record<string, string|number|boolean>} [props]
 */
export function track(name, props) {
  if (typeof window === 'undefined') return
  if (!config.plausibleDomain) return
  try {
    window.plausible?.(name, props ? { props } : undefined)
  } catch {
    // La analitica nunca debe romper una interaccion del usuario.
  }
}

export const events = {
  buyCollection: 'Comprar: coleccion',
  buyProduct: 'Comprar: producto',
  productDetail: 'Ver detalles de producto',
  newsletterSubmit: 'Family List: envio',
  newsletterSuccess: 'Family List: alta',
  instagramClick: 'Salida a Instagram',
  socialClick: 'Salida a red social',
  contactClick: 'Contacto',
}
