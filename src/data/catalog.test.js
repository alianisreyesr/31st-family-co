import { describe, expect, it } from 'vitest'
import { products, categoryLabels, statusLabels, findProduct } from './products.js'
import { productImages } from './product-images.js'

/**
 * El catálogo es una réplica del publicado en 31stfamilyco.com. Estos tests
 * cuidan la integridad de los datos: que cada pieza tenga foto, precio en
 * centavos, categoría válida y un destino de compra real.
 */
describe('catálogo', () => {
  it('replica las 8 piezas publicadas', () => {
    expect(products).toHaveLength(8)
  })

  it('cada pieza tiene id único', () => {
    const ids = products.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('los precios van en centavos, no en texto', () => {
    for (const product of products) {
      expect(typeof product.price).toBe('number')
      expect(Number.isInteger(product.price)).toBe(true)
      expect(product.price).toBeGreaterThan(0)
    }
  })

  it('mantiene los precios reales de la tienda', () => {
    const porId = Object.fromEntries(products.map((p) => [p.id, p.price]))
    expect(porId['a-new-beginning']).toBe(4000)
    expect(porId['camisa-bordada']).toBe(3500)
    expect(porId['31st-socks-v1-31st-family-co']).toBe(1500)
    expect(porId['31st-cinta-deportiva']).toBe(1200)
  })

  it('cada pieza tiene al menos una foto generada', () => {
    for (const product of products) {
      expect(productImages[product.id]?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('cada pieza lleva a una compra real, no a un botón muerto', () => {
    for (const product of products) {
      expect(product.checkoutUrl).toMatch(/^https:\/\/31stfamilyco\.com\/.+/)
    }
  })

  it('usa categorías y estados conocidos', () => {
    for (const product of products) {
      expect(categoryLabels).toHaveProperty(product.category)
      expect(statusLabels).toHaveProperty(product.status)
    }
  })

  it('no inventa medidas donde la ficha original no las da', () => {
    // Las gorras son talla única ajustable; medias, camisas y cintas no
    // declaran ajuste en la tienda, así que `fit` debe ser null.
    for (const product of products) {
      if (product.category === 'gorras') expect(product.fit).toBeTruthy()
      else expect(product.fit).toBeNull()
    }
  })

  it('findProduct localiza por id y devuelve null si no existe', () => {
    expect(findProduct('a-new-beginning')?.name).toBe('1/31 «A new beginning»')
    expect(findProduct('no-existe')).toBeNull()
  })
})
