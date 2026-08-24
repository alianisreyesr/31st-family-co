import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const productoBase = {
  id: 'roots-cap',
  name: 'Roots Cap',
  colorway: 'Negro / Crema',
  price: 3800,
  currency: 'USD',
  checkoutUrl: '',
}

/** Recarga commerce.js con una configuración concreta de entorno. */
async function loadCommerce(overrides = {}) {
  vi.resetModules()
  vi.doMock('./config.js', () => ({
    config: {
      siteUrl: 'https://31stfamilyco.com',
      newsletterEndpoint: '',
      checkoutUrl: '',
      whatsappNumber: '',
      instagramUrl: 'https://www.instagram.com/31stfamilyco/',
      contactEmail: 'hello@31stfamilyco.com',
      plausibleDomain: '',
      plausibleHost: 'https://plausible.io',
      ...overrides,
    },
    brand: { name: '31st Family Co' },
  }))
  return import('./commerce.js')
}

afterEach(() => {
  vi.doUnmock('./config.js')
  vi.resetModules()
})

describe('formatPrice', () => {
  beforeEach(() => vi.resetModules())

  it('convierte centavos en un precio legible sin decimales sobrantes', async () => {
    const { formatPrice } = await loadCommerce()
    expect(formatPrice(3800, 'USD')).toMatch(/38/)
    expect(formatPrice(3800, 'USD')).not.toMatch(/38[.,]00/)
  })

  it('conserva los centavos cuando el precio no es redondo', async () => {
    const { formatPrice } = await loadCommerce()
    expect(formatPrice(3899, 'USD')).toMatch(/38[.,]99/)
  })

  it('devuelve cadena vacía si el precio no es un número', async () => {
    const { formatPrice } = await loadCommerce()
    expect(formatPrice(undefined)).toBe('')
    expect(formatPrice('38')).toBe('')
  })
})

describe('resolveOrderLink', () => {
  it('prefiere el checkout propio del producto', async () => {
    const { resolveOrderLink } = await loadCommerce({ checkoutUrl: 'https://tienda.test' })
    const link = resolveOrderLink({ ...productoBase, checkoutUrl: 'https://tienda.test/roots' })
    expect(link).toMatchObject({ href: 'https://tienda.test/roots', kind: 'checkout' })
  })

  it('cae al checkout general si el producto no tiene el suyo', async () => {
    const { resolveOrderLink } = await loadCommerce({ checkoutUrl: 'https://tienda.test' })
    expect(resolveOrderLink(productoBase)).toMatchObject({
      href: 'https://tienda.test',
      kind: 'checkout',
    })
  })

  it('usa WhatsApp con el mensaje pre-escrito cuando no hay checkout', async () => {
    const { resolveOrderLink } = await loadCommerce({ whatsappNumber: '17875551234' })
    const link = resolveOrderLink(productoBase)
    expect(link.kind).toBe('whatsapp')
    expect(link.href).toContain('https://wa.me/17875551234')
    expect(decodeURIComponent(link.href)).toContain('Roots Cap')
  })

  it('nunca devuelve un destino vacío: el último recurso es Instagram', async () => {
    const { resolveOrderLink } = await loadCommerce()
    const link = resolveOrderLink(productoBase)
    expect(link.kind).toBe('instagram')
    expect(link.href).toBe('https://www.instagram.com/31stfamilyco/')
  })

  it('también resuelve el enlace de la colección completa', async () => {
    const { resolveOrderLink } = await loadCommerce({ whatsappNumber: '17875551234' })
    expect(decodeURIComponent(resolveOrderLink().href)).toContain('la colección')
  })
})
