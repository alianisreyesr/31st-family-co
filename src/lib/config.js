/**
 * Configuracion leida de variables de entorno (ver `.env.example`).
 *
 * Regla de oro: todo es opcional. Cada consumidor decide un fallback util para
 * que el sitio nunca quede con un boton muerto ni le diga a alguien que se
 * suscribio cuando no hay a donde enviar el email.
 */

const text = (value, fallback = '') => {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed || fallback
}

const env = import.meta.env ?? {}

// Datos de contacto y redes tomados del sitio y las políticas publicadas en
// 31stfamilyco.com (verificados el 24 de agosto de 2026). Son los valores por
// defecto para que el sitio nunca muestre un contacto inventado; cualquiera se
// puede sobrescribir por entorno.
const PUBLICADO = {
  // Su tienda ya tiene carrito y checkout funcionando, así que es mejor destino
  // por defecto que WhatsApp: sin esto, los botones de pieza iban al checkout
  // real pero el de la colección caía a WhatsApp, y el aviso bajo el botón
  // contradecía a los demás.
  tienda: 'https://31stfamilyco.com/tienda-31st-family-co',
  email: '31stfamilyco@gmail.com',
  telefono: '17874648291',
  instagram: 'https://www.instagram.com/31stfamilyco/',
  facebook: 'https://www.facebook.com/profile.php?id=61585579475282',
  tiktok: 'https://www.tiktok.com/@31stfamilyco',
}

const DOMINIO_PRODUCCION = '31stfamilyco.com'

const siteUrl = text(env.VITE_SITE_URL, `https://${DOMINIO_PRODUCCION}`).replace(/\/+$/, '')

/**
 * ¿Es este despliegue una vista previa?
 *
 * Importa porque una copia del sitio en `*.netlify.app` o `*.vercel.app` que
 * Google indexe compite como contenido duplicado contra el sitio real de la
 * marca. Cuando es vista previa se emite `noindex` y un robots.txt que lo
 * bloquea todo.
 *
 * `VITE_NOINDEX` manda si está puesto; si no, se deduce del dominio, que es
 * más difícil de olvidar que acordarse de una variable.
 */
const noindexExplicito = text(env.VITE_NOINDEX).toLowerCase()
const esVistaPrevia =
  noindexExplicito === 'true' || noindexExplicito === '1'
    ? true
    : noindexExplicito === 'false' || noindexExplicito === '0'
      ? false
      : !siteUrl.endsWith(`//${DOMINIO_PRODUCCION}`) && !siteUrl.endsWith(`.${DOMINIO_PRODUCCION}`)

export const config = {
  siteUrl,
  isPreview: esVistaPrevia,
  newsletterEndpoint: text(env.VITE_NEWSLETTER_ENDPOINT),
  checkoutUrl: text(env.VITE_CHECKOUT_URL, PUBLICADO.tienda),
  // El sitio actual ya atiende por una burbuja de WhatsApp, así que el número
  // publicado es un canal de pedido real, no un placeholder.
  whatsappNumber: text(env.VITE_WHATSAPP_NUMBER, PUBLICADO.telefono).replace(/\D/g, ''),
  instagramUrl: text(env.VITE_INSTAGRAM_URL, PUBLICADO.instagram),
  facebookUrl: text(env.VITE_FACEBOOK_URL, PUBLICADO.facebook),
  tiktokUrl: text(env.VITE_TIKTOK_URL, PUBLICADO.tiktok),
  // Ojo: es una cuenta de Gmail, no del dominio propio. Ver README.
  contactEmail: text(env.VITE_CONTACT_EMAIL, PUBLICADO.email),
  plausibleDomain: text(env.VITE_PLAUSIBLE_DOMAIN),
  plausibleHost: text(env.VITE_PLAUSIBLE_HOST, 'https://plausible.io').replace(/\/+$/, ''),
}

export const brand = {
  name: '31st Family Co',
  tagline: 'Más que una marca, somos familia.',
  location: 'Puerto Rico',
  foundedYear: 2024,
  instagramHandle: '@31stfamilyco',
}
