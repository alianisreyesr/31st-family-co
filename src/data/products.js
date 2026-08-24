/**
 * Catálogo. Único sitio a editar para cambiar el drop.
 *
 * Réplica del catálogo publicado en 31stfamilyco.com (extraído el 24 de agosto
 * de 2026): nombres, precios, disponibilidad y fotografía son los reales, no
 * ejemplos. Las fotos viven en `public/products/<id>/` y se generan con
 * `node scripts/optimize-images.mjs` desde los originales de `originals/`.
 *
 * `price` va en centavos para poder calcular subtotales, descuentos y cambio de
 * moneda sin parsear strings. `tone` decide la paleta de fondo de la tarjeta
 * (antes venía del índice del array, así que un cuarto producto se quedaba sin
 * fondo).
 *
 * `checkoutUrl` apunta a la ficha real del producto en su tienda, que ya tiene
 * carrito y checkout funcionando: los botones de compra llevan a una compra de
 * verdad sin esperar a montar un checkout propio.
 *
 * `summary` traduce al español la descripción que la marca publica, porque este
 * sitio está en español. No se añaden materiales ni medidas que su ficha no
 * mencione.
 *
 * ⚠️ Sin confirmar: a qué colección (Día UNO / Serie DOS) pertenece cada pieza.
 * El listado por colección de su sitio se renderiza por API y no viene en el
 * HTML, así que `collection` queda en null en vez de adivinarlo.
 */

/** @typedef {'available'|'limited'|'coming-soon'} ProductStatus */
/** @typedef {'gorras'|'camisas'|'medias'|'head-bands'} ProductCategory */

const TIENDA = 'https://31stfamilyco.com'

export const products = [
  {
    id: 'a-new-beginning',
    name: '1/31 «A new beginning»',
    colorway: 'Negro / Blanco',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: null,
    price: 4000,
    currency: 'USD',
    badge: 'Drop 01',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'ink',
    summary:
      'La pieza que abrió la serie. Negra, con los logotipos bordados en blanco y el año de fundación. Cómoda y resistente para llevar todos los días.',
    details: [
      'Logotipos bordados en blanco',
      'Año de fundación bordado',
      'Diseñada para uso diario',
      'Cierre ajustable',
    ],
    fit: 'Talla única ajustable',
    checkoutUrl: `${TIENDA}/a-new-beginning`,
  },
  {
    id: '31stfamilyco-reverse',
    name: '1/31 Reverse',
    colorway: 'Verde profundo / Suede claro',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: null,
    price: 4000,
    currency: 'USD',
    badge: 'Serie 31',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'clay',
    summary:
      'Verde profundo con visera de suede claro. Lleva el logotipo bordado y la frase «a new beginning»: un recordatorio de empezar de nuevo.',
    details: [
      'Visera de suede claro',
      'Logotipo bordado',
      'Frase «a new beginning»',
      'Cierre ajustable',
    ],
    fit: 'Talla única ajustable',
    checkoutUrl: `${TIENDA}/31stfamilyco-reverse`,
  },
  {
    id: '31stfamlyco-puerto-rico-cap',
    name: '2/31 PR Edition',
    colorway: 'Azul / Rojo',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: null,
    price: 4000,
    currency: 'USD',
    badge: 'Puerto Rico',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'ink',
    summary:
      'Azul y rojo, con el detalle de la bandera y «Yo Soy De Aquí» bordado. Para llevar el orgullo de la isla puesto, estés en ella o lejos de casa.',
    details: [
      'Detalle de la bandera de Puerto Rico',
      '«Yo Soy De Aquí» bordado',
      'Estilo streetwear',
      'Cierre ajustable',
    ],
    fit: 'Talla única ajustable',
    checkoutUrl: `${TIENDA}/31stfamlyco-puerto-rico-cap`,
  },
  {
    id: '31st-brown-cap-31st-family-co',
    name: '3/31 Coffee Lover',
    colorway: 'Marrón café',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: null,
    price: 4000,
    currency: 'USD',
    badge: 'Serie 31',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'clay',
    summary:
      'Marrón con el lettering bordado en grande. Algodón transpirable y ajustable, pensada para el día a día.',
    details: ['Algodón transpirable', 'Lettering bordado a gran tamaño', 'Ajustable', 'Uso diario'],
    fit: 'Talla única ajustable',
    checkoutUrl: `${TIENDA}/31st-brown-cap-31st-family-co`,
  },
  {
    id: '31stfamilyco-love-god',
    name: '4/31 Love God',
    colorway: 'Tan claro / Rojo',
    category: /** @type {ProductCategory} */ ('gorras'),
    collection: null,
    price: 4000,
    currency: 'USD',
    badge: 'Serie 31',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'sand',
    summary:
      'Tan claro con visera roja, alas de ángel y parches de inspiración de fe. Energía streetwear con un mensaje: que tu camino y tu estilo apunten hacia arriba.',
    details: [
      'Visera roja a contraste',
      'Diseño con alas de ángel',
      'Parches de inspiración de fe',
      'Cierre ajustable',
    ],
    fit: 'Talla única ajustable',
    checkoutUrl: `${TIENDA}/31stfamilyco-love-god`,
  },
  {
    id: 'camisa-bordada',
    name: 'Essential Tees',
    colorway: 'Camisa bordada',
    category: /** @type {ProductCategory} */ ('camisas'),
    collection: null,
    price: 3500,
    currency: 'USD',
    badge: 'Esenciales',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'sand',
    // La ficha de su tienda no trae descripción para esta pieza. Se deja lo
    // mínimo verificable en vez de inventar tejido, gramaje o corte.
    summary: 'Camiseta con bordado de la marca. Consúltanos tallas disponibles antes de ordenar.',
    details: ['Bordado de la marca'],
    fit: null,
    checkoutUrl: `${TIENDA}/camisa-bordada`,
  },
  {
    id: '31st-socks-v1-31st-family-co',
    name: '31st Socks v1',
    colorway: 'Medias 31st',
    category: /** @type {ProductCategory} */ ('medias'),
    collection: null,
    price: 1500,
    currency: 'USD',
    badge: 'v1',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'ink',
    summary:
      'Una fusión de moda y raíces familiares. Desde 2024 llevamos contigo una historia que celebra la conexión y el estilo.',
    details: ['Diseño 31st Family Co', 'Primera versión de la serie'],
    fit: null,
    checkoutUrl: `${TIENDA}/31st-socks-v1-31st-family-co`,
  },
  {
    id: '31st-cinta-deportiva',
    name: '31st HeadBands',
    colorway: 'Cinta deportiva',
    category: /** @type {ProductCategory} */ ('head-bands'),
    collection: null,
    price: 1200,
    currency: 'USD',
    badge: 'Deportiva',
    status: /** @type {ProductStatus} */ ('available'),
    tone: 'clay',
    summary:
      'Para entrenar duro y con estilo. Su tejido absorbente mantiene el sudor lejos de tu rostro mientras juegas, corres o entrenas.',
    details: ['Tejido absorbente', 'Bordado frontal', 'Para entrenamiento y juego'],
    fit: null,
    checkoutUrl: `${TIENDA}/31st-cinta-deportiva`,
  },
]

export const statusLabels = {
  available: 'Disponible',
  limited: 'Últimas unidades',
  'coming-soon': 'Próximamente',
}

export const categoryLabels = {
  gorras: 'Gorras',
  camisas: 'Camisas',
  medias: 'Medias',
  'head-bands': 'Head Bands',
}

export function findProduct(id) {
  return products.find((product) => product.id === id) ?? null
}
