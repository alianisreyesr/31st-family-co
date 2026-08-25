import { describe, expect, it } from 'vitest'
import { pages, productPages, findPageMeta, buildJsonLd, BRAND_IMAGE } from './seo.js'
import { config } from './config.js'
import { products, findProduct, productPath } from '../data/products.js'

const nodes = (pathname, type) =>
  buildJsonLd(pathname)['@graph'].filter((node) => node['@type'] === type)

/**
 * `seo.js` es la única fuente de los metadatos que acaban en el HTML estático:
 * lo que aquí se rompa lo publica el prerender tal cual, y nadie lo ve hasta que
 * Google indexa el sitio mal. Los tests cubren lo que no se nota mirando la
 * página: descripciones que se cortan en la SERP, disponibilidad falsa en los
 * datos estructurados y piezas sin URL propia.
 */
describe('metadatos por ruta', () => {
  it('cada pieza del catálogo tiene su página', () => {
    expect(productPages).toHaveLength(products.length)
    for (const product of products) {
      expect(pages.map((page) => page.path)).toContain(productPath(product))
    }
  })

  it('no hay rutas ni títulos repetidos', () => {
    for (const campo of ['path', 'title']) {
      const valores = pages.map((page) => page[campo])
      expect(new Set(valores).size).toBe(valores.length)
    }
  })

  it('ninguna descripción se corta en la SERP', () => {
    for (const page of pages) {
      expect(page.description.length, page.path).toBeLessThanOrEqual(160)
      // Recortar por palabra entera: nada de «absorben…» a mitad de palabra.
      if (page.description.endsWith('…')) expect(page.description).not.toMatch(/\w…$/)
    }
  })

  it('la disponibilidad va delante, que es lo que sobrevive al recorte', () => {
    for (const product of products) {
      const meta = findPageMeta(productPath(product))
      if (product.status === 'sold-out') expect(meta.description).toMatch(/^Agotado\./)
      if (product.status === 'upcoming') expect(meta.description).toMatch(/^Próximo drop\./)
    }
  })

  it('cada pieza se comparte con su propia foto, no con la tarjeta de marca', () => {
    for (const product of products) {
      const { image } = findPageMeta(productPath(product))
      expect(image.url, product.id).toBe(`${product.photos[0]}-900.jpg`)
      expect(image.url).not.toBe(BRAND_IMAGE.url)
      // Las medidas viajan con la imagen: sin ellas el preview reserva un hueco
      // apaisado para una foto vertical.
      expect(image.width).toBeGreaterThan(0)
      expect(image.height).toBeGreaterThan(0)
      expect(image.alt).toContain(product.colorway)
    }
  })

  it('las rutas con barra final resuelven a la misma página', () => {
    expect(findPageMeta('/producto/cap-black/').path).toBe('/producto/cap-black')
    expect(findPageMeta('/terminos/').path).toBe('/terminos')
  })

  it('una ruta desconocida cae a la portada', () => {
    expect(findPageMeta('/no-existe').path).toBe('/')
  })
})

describe('datos estructurados', () => {
  it('la ficha declara una sola pieza, con su URL canónica', () => {
    const producto = nodes(productPath(findProduct('cap-terracotta')), 'Product')
    expect(producto).toHaveLength(1)
    expect(producto[0].url).toBe(`${config.siteUrl}/producto/cap-terracotta`)
    expect(producto[0].offers.url).toBe(producto[0].url)
    expect(producto[0].sku).toBe('31-CAP-TRC-001')
  })

  it('nunca declara disponible lo que está agotado', () => {
    for (const product of products) {
      const [node] = nodes(productPath(product), 'Product')
      expect(node.offers.availability, product.id).toBe(
        product.status === 'upcoming' ? 'https://schema.org/PreOrder' : 'https://schema.org/SoldOut'
      )
    }
  })

  it('la ficha lleva miga de pan de tres escalones', () => {
    const [miga] = nodes(productPath(findProduct('headband-black')), 'BreadcrumbList')
    expect(miga.itemListElement.map((paso) => paso.name)).toEqual([
      'Inicio',
      'El próximo capítulo',
      '31st HeadBand · Negro',
    ])
    // El último escalón es la página actual: sin `item`, o Google lo pinta como
    // un enlace a sí misma.
    expect(miga.itemListElement.at(-1).item).toBeUndefined()
  })

  it('el archivo apunta a su sección, no a la del próximo drop', () => {
    const [miga] = nodes(productPath(findProduct('socks-v1')), 'BreadcrumbList')
    expect(miga.itemListElement[1].item).toBe(`${config.siteUrl}/#archivo`)
  })

  it('la portada sigue declarando el catálogo entero y las preguntas', () => {
    expect(nodes('/', 'Product')).toHaveLength(products.length)
    expect(nodes('/', 'FAQPage')).toHaveLength(1)
    expect(nodes('/', 'WebSite')).toHaveLength(1)
  })

  it('las páginas legales solo declaran la organización', () => {
    for (const ruta of ['/privacidad', '/terminos']) {
      expect(buildJsonLd(ruta)['@graph'].map((node) => node['@type'])).toEqual(['Organization'])
    }
  })
})
