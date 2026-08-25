/**
 * Fuente única de metadatos por ruta. La consumen dos sitios:
 *   - `scripts/prerender.mjs`, que los escribe en el HTML estático (es lo que
 *     leen los rastreadores y los previews de WhatsApp/Instagram, que no
 *     ejecutan JavaScript).
 *   - `useDocumentMeta()`, que los actualiza al navegar en el cliente.
 */
import { config, brand } from './config.js'
import { products, findProduct, productPath } from '../data/products.js'
import { productImages, ANCHO_RESPALDO } from '../data/product-images.js'
import { faqs } from '../data/faq.js'

const PREFIJO_PRODUCTO = '/producto/'

/** Normaliza para comparar: sin barras finales, y `/` para la raíz. */
const limpiar = (pathname) => pathname.replace(/\/+$/, '') || '/'

/** El producto de una ruta `/producto/:id`, o null si la ruta no lo es. */
export function productFromPath(pathname) {
  const clean = limpiar(pathname)
  if (!clean.startsWith(PREFIJO_PRODUCTO)) return null
  return findProduct(clean.slice(PREFIJO_PRODUCTO.length))
}

/**
 * Google corta la descripción cerca de los 160 caracteres. Se recorta por
 * palabra entera: partir a mitad de palabra deja la SERP con un «absorben…»
 * que no dice nada.
 */
const LARGO_DESCRIPCION = 158

function recortar(texto, largo = LARGO_DESCRIPCION) {
  if (texto.length <= largo) return texto
  const corte = texto.slice(0, largo - 1)
  const espacio = corte.lastIndexOf(' ')
  return `${(espacio > 0 ? corte.slice(0, espacio) : corte).trimEnd()}…`
}

/*
 * La disponibilidad va delante, no al final: es lo único que sobrevive al
 * recorte, y quien busca una pieza agotada merece saberlo antes de hacer clic.
 * Lo contrario son visitas que rebotan al ver «Agotado».
 */
const PREFIJO_ESTADO = {
  upcoming: 'Próximo drop.',
  'sold-out': 'Agotado.',
  available: '',
}

/**
 * Tarjeta social de una pieza: su propia foto en lugar de la imagen genérica de
 * marca. Es la diferencia entre compartir «31st Family Co» por WhatsApp y
 * compartir la gorra concreta de la que se está hablando.
 */
function socialImage(product) {
  const base = product.photos?.[0]
  const medidas = base ? productImages[base] : null
  if (!medidas) return null

  return {
    url: `${base}-${ANCHO_RESPALDO}.jpg`,
    width: medidas.width,
    height: medidas.height,
    type: 'image/jpeg',
    alt: `${product.name} — ${product.colorway}`,
  }
}

/**
 * Tarjeta social de marca, la que se comparte de todo lo que no es una pieza
 * concreta. Debe coincidir con el `<meta property="og:image">` de `index.html`:
 * `scripts/prerender.mjs` compara ambos y avisa si se separan, que es como se
 * publicó una vez una URL de imagen que ya no existía.
 */
export const BRAND_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'Gorras de 31st Family Co con el logotipo de la marca',
}

const staticPages = [
  {
    path: '/',
    title: '31st Family Co | Más que una marca, somos familia',
    description:
      'Streetwear nacido en Puerto Rico desde 2024. Únete a la Family List para el acceso anticipado al próximo drop y explora el archivo de piezas agotadas.',
    image: BRAND_IMAGE,
    priority: '1.0',
  },
  {
    path: '/privacidad',
    title: 'Política de privacidad | 31st Family Co',
    description:
      'Qué datos recogemos en 31stfamilyco.com, para qué los usamos y cómo ejercer tus derechos.',
    image: BRAND_IMAGE,
    priority: '0.3',
  },
  {
    path: '/terminos',
    title: 'Términos y condiciones | 31st Family Co',
    description: 'Condiciones de compra, envíos, devoluciones y uso del sitio de 31st Family Co.',
    image: BRAND_IMAGE,
    priority: '0.3',
  },
]

/**
 * Una página por pieza. Existen para que cada gorra tenga una URL que se pueda
 * compartir, indexar y enlazar desde fuera: la ficha en modal cubre la duda de
 * «qué es esto» pero no deja rastro, y hasta ahora el sitio entero se resumía
 * en tres URLs.
 */
export const productPages = products.map((product) => ({
  path: productPath(product),
  title: `${product.name} · ${product.colorway} | ${brand.name}`,
  description: recortar(`${PREFIJO_ESTADO[product.status]} ${product.summary}`.trim()),
  // Sin foto generada todavía se cae a la tarjeta de marca: mejor eso que un
  // preview roto en WhatsApp.
  image: socialImage(product) ?? BRAND_IMAGE,
  ogType: 'product',
  priority: product.status === 'upcoming' ? '0.8' : '0.6',
}))

export const pages = [...staticPages, ...productPages]

export function findPageMeta(pathname) {
  return pages.find((page) => page.path === limpiar(pathname)) ?? pages[0]
}

/**
 * Datos estructurados. `Organization` ayuda al panel de marca en Google;
 * `Product` habilita resultados enriquecidos con precio y disponibilidad;
 * `FAQPage` puede ganar el acordeón desplegable en la SERP.
 */

// Declarar `InStock` lo que está agotado hace que Google muestre un resultado
// enriquecido con precio y disponibilidad falsos, y termina en visitas que se
// van al ver «Agotado». Se dice la verdad.
const DISPONIBILIDAD = {
  available: 'https://schema.org/InStock',
  upcoming: 'https://schema.org/PreOrder',
  'sold-out': 'https://schema.org/SoldOut',
}

function productNode(product) {
  const url = `${config.siteUrl}${productPath(product)}`

  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    url,
    name: product.name,
    description: product.summary,
    color: product.colorway,
    category: product.category,
    sku: product.sku,
    // Google solo muestra resultados enriquecidos de producto si hay imagen.
    image: (product.photos ?? []).map((base) => `${config.siteUrl}${base}-${ANCHO_RESPALDO}.jpg`),
    brand: { '@id': `${config.siteUrl}/#organization` },
    offers: {
      '@type': 'Offer',
      // `price` es null en lo agotado; se publica el precio de referencia
      // porque schema.org exige un precio en la oferta, junto a la
      // disponibilidad real, que es la que informa de verdad.
      price: ((product.price ?? product.referencePrice) / 100).toFixed(2),
      priceCurrency: product.currency,
      availability: DISPONIBILIDAD[product.status],
      url,
    },
  }
}

/** Miga de pan de una ficha: Google la pinta en lugar de la URL cruda. */
function breadcrumbNode(product) {
  const seccion =
    product.status === 'upcoming'
      ? { name: 'El próximo capítulo', item: `${config.siteUrl}/#proximo-drop` }
      : { name: 'El archivo', item: `${config.siteUrl}/#archivo` }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${config.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: seccion.name, item: seccion.item },
      // El último escalón va sin `item`: es la página actual.
      { '@type': 'ListItem', position: 3, name: `${product.name} · ${product.colorway}` },
    ],
  }
}

export function buildJsonLd(pathname = '/') {
  const organization = {
    '@type': 'Organization',
    '@id': `${config.siteUrl}/#organization`,
    name: brand.name,
    url: config.siteUrl,
    slogan: brand.tagline,
    logo: `${config.siteUrl}/apple-touch-icon.png`,
    image: `${config.siteUrl}/og-image.jpg`,
    foundingDate: '2024',
    email: config.contactEmail,
    areaServed: 'PR',
    sameAs: [config.instagramUrl].filter(Boolean),
  }

  const product = productFromPath(pathname)
  if (product) {
    return {
      '@context': 'https://schema.org',
      '@graph': [organization, productNode(product), breadcrumbNode(product)],
    }
  }

  if (limpiar(pathname) !== '/') {
    return { '@context': 'https://schema.org', '@graph': [organization] }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${config.siteUrl}/#website`,
        url: config.siteUrl,
        name: brand.name,
        inLanguage: 'es',
        publisher: { '@id': `${config.siteUrl}/#organization` },
      },
      ...products.map(productNode),
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  }
}
