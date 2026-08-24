/**
 * Fuente única de metadatos por ruta. La consumen dos sitios:
 *   - `scripts/prerender.mjs`, que los escribe en el HTML estático (es lo que
 *     leen los rastreadores y los previews de WhatsApp/Instagram, que no
 *     ejecutan JavaScript).
 *   - `useDocumentMeta()`, que los actualiza al navegar en el cliente.
 */
import { config, brand } from './config.js'
import { products } from '../data/products.js'
import { productImages, ANCHO_RESPALDO } from '../data/product-images.js'
import { faqs } from '../data/faq.js'

export const pages = [
  {
    path: '/',
    title: '31st Family Co | Más que una marca, somos familia',
    description:
      'Gorras, camisas, medias y head bands diseñados en Puerto Rico desde 2024. Serie 31 disponible: cinco gorras bordadas desde $40.',
  },
  {
    path: '/privacidad',
    title: 'Política de privacidad | 31st Family Co',
    description:
      'Qué datos recogemos en 31stfamilyco.com, para qué los usamos y cómo ejercer tus derechos.',
  },
  {
    path: '/terminos',
    title: 'Términos y condiciones | 31st Family Co',
    description: 'Condiciones de compra, envíos, devoluciones y uso del sitio de 31st Family Co.',
  },
]

export function findPageMeta(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return pages.find((page) => page.path === clean) ?? pages[0]
}

/**
 * Datos estructurados. `Organization` ayuda al panel de marca en Google;
 * `Product` habilita resultados enriquecidos con precio y disponibilidad;
 * `FAQPage` puede ganar el acordeón desplegable en la SERP.
 */
export function buildJsonLd(pathname = '/') {
  const availability = {
    available: 'https://schema.org/InStock',
    limited: 'https://schema.org/LimitedAvailability',
    'coming-soon': 'https://schema.org/PreOrder',
  }

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

  if (pathname !== '/') {
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
      ...products.map((product) => ({
        '@type': 'Product',
        name: product.name,
        description: product.summary,
        color: product.colorway,
        category: product.category,
        // Google solo muestra resultados enriquecidos de producto si hay imagen.
        image: (productImages[product.id] ?? []).map(
          (foto) => `${config.siteUrl}${foto.base}-${ANCHO_RESPALDO}.jpg`
        ),
        brand: { '@id': `${config.siteUrl}/#organization` },
        offers: {
          '@type': 'Offer',
          price: (product.price / 100).toFixed(2),
          priceCurrency: product.currency,
          availability: availability[product.status],
          // La ficha real con carrito vive en su tienda, así que el `Offer`
          // apunta allí y no a un ancla de esta portada.
          url: product.checkoutUrl || `${config.siteUrl}/#${product.id}`,
        },
      })),
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
