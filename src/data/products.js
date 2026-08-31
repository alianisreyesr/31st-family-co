/**
 * Catálogo. Único sitio a editar para cambiar el drop.
 *
 * Reconciliación de dos fuentes:
 *
 *  - **El estado del negocio** viene de `src/data/catalog.js` (commits 0401a0e y
 *    82380d6): ids, SKU, stock, estado, colecciones y colorways. Es el
 *    inventario real, y manda. Casi todo está agotado; las dos cintas son el
 *    próximo drop.
 *  - **La fotografía y los precios de referencia** vienen del catálogo
 *    publicado en 31stfamilyco.com, extraído el 24 de agosto de 2026.
 *
 * `price` va en centavos para poder calcular subtotales y descuentos sin
 * parsear texto. `null` significa que no se publica precio porque la pieza está
 * agotada; `referencePrice` conserva lo que costó, que sirve para el JSON-LD y
 * para cuando vuelva a haber stock.
 *
 * `photos` apunta a rutas base concretas y no a una carpeta, porque dos
 * variantes de color pueden salir de fotos distintas de la misma sesión: las
 * cintas blancas y las negras están en la misma carpeta, en fotos diferentes.
 *
 * ⚠️ `cap-green` y `reverse-1-31` parecen ser LA MISMA gorra verde, listada dos
 * veces en colecciones distintas (Second Serie y Day One). Las fotos lo
 * confirman. Se conservan las dos entradas porque el inventario es vuestro y no
 * me corresponde borrar un registro, pero conviene decidir antes de enseñarlo:
 * ahora mismo la misma gorra aparece dos veces en el archivo.
 */

/** @typedef {'upcoming'|'sold-out'|'available'} ProductStatus */
/** @typedef {'gorras'|'camisas'|'medias'|'head-bands'} ProductCategory */
/** @typedef {'day-one'|'second-serie'|null} ProductCollection */

export const products = [
  // --- Próximo drop ---------------------------------------------------------
  {
    id: 'headband-black',
    sku: '31-HB-BLK-001',
    name: '31st HeadBand',
    colorway: 'Negro',
    category: /** @type {ProductCategory} */ ('head-bands'),
    collection: /** @type {ProductCollection} */ (null),
    status: /** @type {ProductStatus} */ ('upcoming'),
    stock: 0,
    price: 1200,
    referencePrice: 1200,
    currency: 'USD',
    tone: 'ink',
    summary:
      'Cinta 31st para uso diario, con el sello EST. 2024 bordado al frente. Tejido absorbente para entrenar sin que el sudor moleste.',
    details: ['Bordado frontal EST. 2024', 'Tejido absorbente', 'Para entrenamiento y uso diario'],
    sizes: null,
    fit: null,
    photos: ['/products/31st-cinta-deportiva/1'],
  },
  {
    id: 'headband-white',
    sku: '31-HB-WHT-001',
    name: '31st HeadBand',
    colorway: 'Blanco',
    category: /** @type {ProductCategory} */ ('head-bands'),
    collection: /** @type {ProductCollection} */ (null),
    status: /** @type {ProductStatus} */ ('upcoming'),
    stock: 0,
    price: 1200,
    referencePrice: 1200,
    currency: 'USD',
    tone: 'sand',
    summary:
      'La misma cinta en blanco con el bordado en negro. Tejido absorbente, sello EST. 2024 al frente.',
    details: ['Bordado frontal en negro', 'Tejido absorbente', 'Para entrenamiento y uso diario'],
    sizes: null,
    fit: null,
    photos: ['/products/31st-cinta-deportiva/2'],
  },

  // --- Archivo: Signature Cap ----------------------------------------------
  {
    id: 'cap-black',
    sku: '31-CAP-BLK-001',
    name: '31st Signature Cap',
    colorway: 'Negro / Blanco',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: /** @type {ProductCollection} */ (null),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 4000,
    currency: 'USD',
    tone: 'ink',
    summary: 'Gorra Signature con bordado frontal EST. 2024 · 31ST FAMILY CO.',
    details: ['Bordado frontal EST. 2024', 'Visera de suede', 'Cierre ajustable'],
    sizes: null,
    fit: 'Talla única ajustable',
    photos: [
      '/products/a-new-beginning/1',
      '/products/a-new-beginning/2',
      '/products/a-new-beginning/3',
    ],
  },
  {
    id: 'cap-green',
    sku: '31-CAP-GRN-001',
    name: '31st Signature Cap',
    colorway: 'Verde / Blanco',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: /** @type {ProductCollection} */ ('second-serie'),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 4000,
    currency: 'USD',
    tone: 'clay',
    summary: 'Colorway verde de la Signature Cap, con visera de contraste en suede claro.',
    details: ['Visera de suede claro', 'Logotipo bordado', 'Cierre ajustable'],
    sizes: null,
    fit: 'Talla única ajustable',
    photos: ['/products/31stfamilyco-reverse/1', '/products/31stfamilyco-reverse/2'],
  },
  {
    id: 'cap-terracotta',
    sku: '31-CAP-TRC-001',
    name: '31st Signature Cap',
    colorway: 'Terracota / Negro',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: /** @type {ProductCollection} */ ('day-one'),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 4000,
    currency: 'USD',
    tone: 'clay',
    summary:
      'Colorway terracota de la Signature Cap, con visera negra. Del archivo Day One. Algodón transpirable y lettering bordado en grande.',
    details: ['Visera negra a contraste', 'Lettering bordado', 'Algodón transpirable', 'Ajustable'],
    sizes: null,
    fit: 'Talla única ajustable',
    photos: [
      '/products/31st-brown-cap-31st-family-co/1',
      '/products/31st-brown-cap-31st-family-co/2',
      '/products/31st-brown-cap-31st-family-co/3',
      '/products/31st-brown-cap-31st-family-co/4',
    ],
  },

  // --- Archivo: Day One -----------------------------------------------------
  {
    id: 'reverse-1-31',
    sku: '31-CAP-RVS-001',
    name: '1/31 Reverse',
    colorway: 'Verde profundo / Suede claro',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: /** @type {ProductCollection} */ ('day-one'),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 4000,
    currency: 'USD',
    tone: 'clay',
    summary:
      'Verde profundo con visera de suede claro. Lleva el logotipo bordado y la frase «a new beginning».',
    details: ['Visera de suede claro', 'Frase «a new beginning»', 'Cierre ajustable'],
    sizes: null,
    fit: 'Talla única ajustable',
    photos: ['/products/31stfamilyco-reverse/3'],
  },
  {
    id: 'pr-edition-2-31',
    sku: '31-CAP-PR-001',
    name: '2/31 PR Edition',
    colorway: 'Azul / Rojo',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: /** @type {ProductCollection} */ ('day-one'),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 4000,
    currency: 'USD',
    tone: 'ink',
    summary:
      'Azul y rojo, con el detalle de la bandera y «Yo Soy De Aquí» bordado. Del archivo Day One, inspirada en Puerto Rico.',
    details: [
      'Detalle de la bandera de Puerto Rico',
      '«Yo Soy De Aquí» bordado',
      'Cierre ajustable',
    ],
    sizes: null,
    fit: 'Talla única ajustable',
    photos: [
      '/products/31stfamlyco-puerto-rico-cap/1',
      '/products/31stfamlyco-puerto-rico-cap/2',
      '/products/31stfamlyco-puerto-rico-cap/3',
    ],
  },
  {
    id: 'love-god-4-31',
    sku: '31-CAP-LGD-001',
    name: '4/31 Love God',
    colorway: 'Tan claro / Rojo',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: /** @type {ProductCollection} */ ('day-one'),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 4000,
    currency: 'USD',
    tone: 'sand',
    summary:
      'Tan claro con visera roja, alas de ángel y parches de inspiración de fe. Del archivo Day One.',
    details: ['Visera roja a contraste', 'Diseño con alas de ángel', 'Parches de fe'],
    sizes: null,
    fit: 'Talla única ajustable',
    photos: ['/products/31stfamilyco-love-god/1', '/products/31stfamilyco-love-god/2'],
  },

  // --- Archivo: otras categorías -------------------------------------------
  {
    id: 'essential-tees',
    sku: '31-TEE-ESS-001',
    name: 'Essential Tees',
    colorway: 'Blanco / Negro',
    category: /** @type {ProductCategory} */ ('camisas'),
    collection: /** @type {ProductCollection} */ (null),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 3500,
    currency: 'USD',
    tone: 'sand',
    summary: 'Drop anterior de Essential Tees, con el bordado de la marca. Iban de XS a XL.',
    details: ['Bordado de la marca', 'Disponibles en blanco y negro', 'Tallas XS a XL'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Tallas XS a XL',
    photos: ['/products/camisa-bordada/1'],
  },
  {
    id: 'socks-v1',
    sku: '31-SCK-V1-001',
    name: '31st Socks v1',
    colorway: 'Negro / Crema',
    category: /** @type {ProductCategory} */ ('medias'),
    collection: /** @type {ProductCollection} */ (null),
    status: /** @type {ProductStatus} */ ('sold-out'),
    stock: 0,
    price: null,
    referencePrice: 1500,
    currency: 'USD',
    tone: 'ink',
    summary:
      'Primera edición de 31st Socks, en pack de dos pares. Una fusión de moda y raíces familiares.',
    details: ['Pack de 2 pares', 'Bordado EST. 2024', 'Primera versión de la serie'],
    sizes: null,
    fit: null,
    photos: ['/products/31st-socks-v1-31st-family-co/1'],
  },
]

export const statusLabels = {
  upcoming: 'Próximamente',
  'sold-out': 'Agotado',
  available: 'Disponible',
}

export const categoryLabels = {
  gorras: 'Gorras',
  camisas: 'Camisas',
  medias: 'Medias',
  'head-bands': 'Head Bands',
}

export const collectionLabels = {
  'day-one': 'Day One',
  'second-serie': 'Second Serie',
}

export const upcomingProducts = products.filter((product) => product.status === 'upcoming')
export const archivedProducts = products.filter((product) => product.status === 'sold-out')

export function findProduct(id) {
  return products.find((product) => product.id === id) ?? null
}

/**
 * URL canónica de la ficha de una pieza. Los ids ya son kebab-case, únicos y
 * estables, así que sirven de slug sin una segunda columna que mantener
 * sincronizada. Cambiar un id rompe el enlace publicado: es un renombrado, no
 * una edición cosmética.
 *
 * @param {object|string} product Producto o su id.
 */
export function productPath(product) {
  return `/producto/${typeof product === 'string' ? product : product.id}`
}
