/**
 * GENERADO por `node scripts/optimize-images.mjs`. No editar a mano.
 *
 * `productImages` va indexado por ruta base (sin el sufijo de ancho) y guarda
 * las medidas del JPEG de respaldo de 900px, que es lo que
 * `ProductImage` pone en `width`/`height` para reservar el hueco antes de que
 * la foto cargue.
 *
 * El índice por ruta y no por producto permite que dos variantes de color
 * apunten a fotos distintas de la misma sesión: las cintas blancas y las negras
 * salen de la misma carpeta, en fotos diferentes.
 *
 * `photosByDir` lista las fotos de cada carpeta en orden, para armar galerías.
 */
export const ANCHOS = [480, 900, 1400]
export const ANCHO_RESPALDO = 900

export const productImages = {
  '/products/31st-brown-cap-31st-family-co/1': {
    width: 900,
    height: 1200,
  },
  '/products/31st-brown-cap-31st-family-co/2': {
    width: 900,
    height: 1200,
  },
  '/products/31st-brown-cap-31st-family-co/3': {
    width: 900,
    height: 1200,
  },
  '/products/31st-brown-cap-31st-family-co/4': {
    width: 900,
    height: 1200,
  },
  '/products/31st-cinta-deportiva/1': {
    width: 900,
    height: 1600,
  },
  '/products/31st-cinta-deportiva/2': {
    width: 900,
    height: 1200,
  },
  '/products/31st-socks-v1-31st-family-co/1': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamilyco-love-god/1': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamilyco-love-god/2': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamilyco-reverse/1': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamilyco-reverse/2': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamilyco-reverse/3': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamlyco-puerto-rico-cap/1': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamlyco-puerto-rico-cap/2': {
    width: 900,
    height: 1200,
  },
  '/products/31stfamlyco-puerto-rico-cap/3': {
    width: 900,
    height: 1200,
  },
  '/products/a-new-beginning/1': {
    width: 900,
    height: 1200,
  },
  '/products/a-new-beginning/2': {
    width: 900,
    height: 1200,
  },
  '/products/a-new-beginning/3': {
    width: 900,
    height: 1200,
  },
  '/products/camisa-bordada/1': {
    width: 900,
    height: 1200,
  },
}

export const photosByDir = {
  '31st-brown-cap-31st-family-co': [
    '/products/31st-brown-cap-31st-family-co/1',
    '/products/31st-brown-cap-31st-family-co/2',
    '/products/31st-brown-cap-31st-family-co/3',
    '/products/31st-brown-cap-31st-family-co/4',
  ],
  '31st-cinta-deportiva': ['/products/31st-cinta-deportiva/1', '/products/31st-cinta-deportiva/2'],
  '31st-socks-v1-31st-family-co': ['/products/31st-socks-v1-31st-family-co/1'],
  '31stfamilyco-love-god': [
    '/products/31stfamilyco-love-god/1',
    '/products/31stfamilyco-love-god/2',
  ],
  '31stfamilyco-reverse': [
    '/products/31stfamilyco-reverse/1',
    '/products/31stfamilyco-reverse/2',
    '/products/31stfamilyco-reverse/3',
  ],
  '31stfamlyco-puerto-rico-cap': [
    '/products/31stfamlyco-puerto-rico-cap/1',
    '/products/31stfamlyco-puerto-rico-cap/2',
    '/products/31stfamlyco-puerto-rico-cap/3',
  ],
  'a-new-beginning': [
    '/products/a-new-beginning/1',
    '/products/a-new-beginning/2',
    '/products/a-new-beginning/3',
  ],
  'camisa-bordada': ['/products/camisa-bordada/1'],
}
