import { describe, expect, it } from 'vitest'
import {
  products,
  upcomingProducts,
  archivedProducts,
  categoryLabels,
  collectionLabels,
  statusLabels,
  findProduct,
} from './products.js'
import { productImages } from './product-images.js'

/**
 * El catálogo reconcilia el inventario real (estados, SKU, colecciones) con la
 * fotografía del catálogo publicado. Estos tests cuidan que no se cuele una
 * afirmación falsa sobre disponibilidad, que es el error caro: anunciar como
 * disponible algo agotado genera pedidos que no se pueden cumplir.
 */
describe('catálogo', () => {
  it('tiene las 10 piezas del inventario', () => {
    expect(products).toHaveLength(10)
  })

  it('separa el próximo drop del archivo', () => {
    expect(upcomingProducts).toHaveLength(2)
    expect(archivedProducts).toHaveLength(8)
    expect(upcomingProducts.length + archivedProducts.length).toBe(products.length)
  })

  it('nada se anuncia como disponible: no hay stock', () => {
    for (const product of products) {
      expect(product.stock).toBe(0)
      expect(product.status).not.toBe('available')
    }
  })

  it('lo agotado no publica precio, pero conserva el de referencia', () => {
    for (const product of archivedProducts) {
      expect(product.price).toBeNull()
      expect(product.referencePrice).toBeGreaterThan(0)
    }
  })

  it('el próximo drop sí publica precio, en centavos', () => {
    for (const product of upcomingProducts) {
      expect(Number.isInteger(product.price)).toBe(true)
      expect(product.price).toBeGreaterThan(0)
    }
  })

  it('cada pieza tiene id y SKU únicos', () => {
    for (const campo of ['id', 'sku']) {
      const valores = products.map((p) => p[campo])
      expect(new Set(valores).size).toBe(valores.length)
    }
  })

  it('cada pieza tiene al menos una foto y todas resuelven', () => {
    for (const product of products) {
      expect(product.photos.length).toBeGreaterThan(0)
      for (const foto of product.photos) {
        expect(productImages[foto], `${product.id} → ${foto}`).toBeDefined()
      }
    }
  })

  it('las dos cintas usan fotos distintas de la misma sesión', () => {
    const negra = findProduct('headband-black')
    const blanca = findProduct('headband-white')
    expect(negra.photos).not.toEqual(blanca.photos)
  })

  it('usa categorías, colecciones y estados conocidos', () => {
    for (const product of products) {
      expect(categoryLabels).toHaveProperty(product.category)
      expect(statusLabels).toHaveProperty(product.status)
      if (product.collection !== null) {
        expect(collectionLabels).toHaveProperty(product.collection)
      }
    }
  })

  it('conserva las dos colecciones del inventario', () => {
    const colecciones = new Set(products.map((p) => p.collection).filter(Boolean))
    expect(colecciones).toEqual(new Set(['day-one', 'second-serie']))
  })

  it('no inventa tallas donde no hay dato confirmado', () => {
    for (const product of products) {
      if (product.category === 'gorras') {
        expect(product.fit).toBeTruthy()
        expect(product.sizes).toBeNull()
      }
      if (product.category === 'medias' || product.category === 'head-bands') {
        expect(product.sizes).toBeNull()
      }
      if (product.sizes !== null) expect(Array.isArray(product.sizes)).toBe(true)
    }
  })

  it('publica las tallas reales de las camisas', () => {
    expect(findProduct('essential-tees').sizes).toEqual(['XS', 'S', 'M', 'L', 'XL'])
  })

  it('findProduct localiza por id y devuelve null si no existe', () => {
    expect(findProduct('cap-terracotta')?.colorway).toBe('Terracota / Negro')
    expect(findProduct('no-existe')).toBeNull()
  })
})
