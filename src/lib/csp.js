import { config } from './config.js'

/**
 * Política de seguridad de contenidos.
 *
 * Se deduce de la configuración en vez de escribirse a mano en un archivo de
 * cabeceras: si no hay Plausible ni proveedor de lista, no se abre ningún host
 * de terceros; si los hay, se abre exactamente ese y nada más. Escrita a mano,
 * la política se quedaría desfasada el día que se conecte Formspree, y el
 * formulario dejaría de funcionar sin que nadie se entere: el navegador bloquea
 * la petición en la consola, no en la pantalla.
 *
 * `style-src` va sin `unsafe-inline` porque no hay ni un `style=` en los
 * componentes y Vite emite el CSS como hoja aparte.
 *
 * `frame-ancestors` no aparece: no se admite en un <meta>, que es donde viaja
 * esta política. De eso se encarga `X-Frame-Options: DENY`, que sí va en las
 * cabeceras de `public/_headers` y `vercel.json`.
 *
 * @param {typeof config} [ajustes]
 */
export function buildCsp(ajustes = config) {
  const origen = (url) => {
    try {
      return new URL(url).origin
    } catch {
      return null
    }
  }

  // Sin dominio de Plausible no se carga el script, así que su host no pinta.
  const analitica = ajustes.plausibleDomain ? origen(ajustes.plausibleHost) : null
  const lista = origen(ajustes.newsletterEndpoint)

  const directivas = {
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    // El alta se envía por fetch; esto es el respaldo si falla el JavaScript.
    'form-action': ["'self'"],
    'object-src': ["'none'"],
    'frame-src': ["'none'"],
    // `data:` porque Vite incrusta así los assets de menos de 4 kB que se
    // importen desde el código. Hoy no hay ninguno, pero quitarlo dejaría el
    // sitio a un icono pequeño de distancia de romperse.
    'img-src': ["'self'", 'data:'],
    'font-src': ["'self'"],
    'style-src': ["'self'"],
    'script-src': ["'self'", analitica],
    'connect-src': ["'self'", analitica, lista],
  }

  return Object.entries(directivas)
    .map(([nombre, valores]) => `${nombre} ${[...new Set(valores.filter(Boolean))].join(' ')}`)
    .join('; ')
}
