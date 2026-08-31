/**
 * Genera los assets de marca a partir de la fotografía y el logotipo reales,
 * descargados del sitio de la marca a `originals/site/`.
 *
 *   node scripts/build-brand-assets.mjs
 *
 * Sustituye al generador de placeholders geométricos que había antes
 * (`make-icons.mjs`, ya eliminado): ahora existe material real, así que la
 * tarjeta de Open Graph es una foto de producto y el icono es el logotipo.
 */
import sharp from 'sharp'
import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = resolve(ROOT, 'originals/site')
const OUT = resolve(ROOT, 'public/brand')
mkdirSync(OUT, { recursive: true })

const kb = (p) => Math.round(statSync(p).size / 1024)
const log = (p) => console.log(`  ${p.replace(ROOT + '/', '')} — ${kb(p)} kB`)

const CREAM = { r: 242, g: 238, b: 229 }
const INK = { r: 18, g: 18, b: 16 }
const metadatos = {}

/**
 * El logotipo de origen viene relleno de un gris muy claro —rgb(220, 219, 220)—
 * sobre transparente: sobre el crema del sitio queda a 1,2:1 de contraste, o
 * sea invisible. La silueta real está en el canal alfa, así que se usa ese como
 * máscara y se rellena de un color plano. Es exacto: ni se aclara «a ojo» con
 * `modulate` ni se inventa un trazado.
 */
async function silueta(entrada, color, ancho) {
  const base = sharp(entrada).ensureAlpha()
  const fuente = ancho ? base.resize({ width: ancho, fit: 'inside' }) : base
  const { data, info } = await fuente.raw().toBuffer({ resolveWithObject: true })

  const pixeles = Buffer.alloc(data.length)
  for (let i = 0; i < data.length; i += 4) {
    pixeles[i] = color.r
    pixeles[i + 1] = color.g
    pixeles[i + 2] = color.b
    pixeles[i + 3] = data[i + 3]
  }

  return sharp(pixeles, { raw: { width: info.width, height: info.height, channels: 4 } })
}

/**
 * Aísla el monograma «31ST» del escudo, descartando el texto en arco.
 *
 * A 40 px de alto en la cabecera, «EST. 2024» y «FAMILY CO.» miden cuatro
 * píxeles y solo ensucian; el monograma solo se lee bien. No se puede recortar
 * por filas porque las patas del monograma bajan hasta el arco inferior, así
 * que se etiquetan componentes conectados y se conservan los grandes: en el
 * escudo actual son 2 (21 098 y 12 957 px) frente a 17 letras de ~350 px. El
 * umbral es relativo al mayor, no un número fijo, para que siga valiendo si el
 * logotipo se sustituye por otra versión.
 */
async function monograma(entrada) {
  const { data, info } = await sharp(entrada)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  // Umbral bajo a propósito: incluye los bordes suavizados en su componente,
  // así se borra por componente sin dejar el halo de las letras descartadas ni
  // dentar el monograma.
  const tinta = (x, y) => data[(y * W + x) * 4 + 3] > 8

  const etiqueta = new Int32Array(W * H).fill(-1)
  const componentes = []

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!tinta(x, y) || etiqueta[y * W + x] >= 0) continue
      const c = { n: 0, x0: W, x1: 0, y0: H, y1: 0 }
      const pila = [[x, y]]
      etiqueta[y * W + x] = componentes.length
      while (pila.length) {
        const [px, py] = pila.pop()
        c.n++
        if (px < c.x0) c.x0 = px
        if (px > c.x1) c.x1 = px
        if (py < c.y0) c.y0 = py
        if (py > c.y1) c.y1 = py
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = px + dx
            const ny = py + dy
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
            if (!tinta(nx, ny) || etiqueta[ny * W + nx] >= 0) continue
            etiqueta[ny * W + nx] = componentes.length
            pila.push([nx, ny])
          }
        }
      }
      componentes.push(c)
    }
  }

  const mayor = Math.max(...componentes.map((c) => c.n))
  const nucleo = componentes.filter((c) => c.n >= mayor * 0.2)
  console.log(
    `  monograma: ${nucleo.length} de ${componentes.length} componentes conservados ` +
      `(${nucleo.map((c) => c.n).join(' + ')} px)`
  )

  const caja = nucleo.reduce(
    (a, c) => ({
      x0: Math.min(a.x0, c.x0),
      x1: Math.max(a.x1, c.x1),
      y0: Math.min(a.y0, c.y0),
      y1: Math.max(a.y1, c.y1),
    }),
    { x0: W, x1: 0, y0: H, y1: 0 }
  )

  // Se borra todo lo que no pertenezca a un componente conservado, en vez de
  // recortar sin más: el arco inferior invade la caja del monograma y volvería
  // a colarse dentro del recorte.
  const conservados = new Set()
  componentes.forEach((c, i) => {
    if (c.n >= mayor * 0.2) conservados.add(i)
  })
  const limpio = Buffer.from(data)
  for (let i = 0; i < W * H; i++) {
    if (!conservados.has(etiqueta[i])) limpio[i * 4 + 3] = 0
  }

  return sharp(limpio, { raw: { width: W, height: H, channels: 4 } })
    .extract({
      left: caja.x0,
      top: caja.y0,
      width: caja.x1 - caja.x0 + 1,
      height: caja.y1 - caja.y0 + 1,
    })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Emite webp en varios anchos + un jpeg de respaldo, y devuelve las medidas. */
async function responsive(nombre, entrada, anchos, opciones = {}) {
  const respaldoAncho = anchos[anchos.length - 2] ?? anchos[0]
  for (const width of anchos) {
    const salida = `${OUT}/${nombre}-${width}.webp`
    await sharp(entrada)
      .resize({ width, ...opciones })
      .webp({ quality: 76 })
      .toFile(salida)
    log(salida)
  }
  const respaldo = `${OUT}/${nombre}-${respaldoAncho}.jpg`
  const info = await sharp(entrada)
    .resize({ width: respaldoAncho, ...opciones })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(respaldo)
  log(respaldo)
  metadatos[nombre] = {
    base: `/brand/${nombre}`,
    anchos,
    respaldo: respaldoAncho,
    width: info.width,
    height: info.height,
  }
}

console.log('Fotografía de secciones:')
// Gorras colgadas de la verja contra el cielo: es la que mejor funciona a sangre
// detrás del titular, y el cielo deja sitio para el texto.
await responsive('hero', `${SRC}/lifestyle-1.jpeg`, [768, 1280, 1920])
// Gorras sobre la mesa al aire libre, para el bloque de historia.
await responsive('statement', `${SRC}/lifestyle-3.jpeg`, [640, 1024, 1440])

console.log('\nTarjeta de Open Graph (1200x630):')
// Recorte apaisado de la foto del hero, oscurecido para que el logotipo lea
// encima. Antes era un placeholder con tipografía de mapa de bits.
const fondo = await sharp(`${SRC}/lifestyle-1.jpeg`)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.62 })
  .toBuffer()
const logoOg = await (await silueta(`${SRC}/logo-b.png`, CREAM, 420)).png().toBuffer()
// JPEG y no PNG: es una fotografía, y en PNG la misma tarjeta pesaba 722 kB
// frente a poco más de 100 kB aquí. WhatsApp y Facebook descartan las imágenes
// demasiado pesadas y entonces el enlace vuelve a compartirse sin preview.
const og = `${ROOT}/public/og-image.jpg`
await sharp(fondo)
  .composite([{ input: logoOg, gravity: 'centre' }])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(og)
log(og)

console.log('\nIconos:')
// El escudo en crema sobre el negro de marca: se ve en la pestaña y en la
// pantalla de inicio. Va el escudo entero, no el monograma: a 64 px el arco ya
// no se lee como texto pero da la silueta redonda que distingue el icono.
// A resolución completa: antes se generaba a 152 px y luego se ampliaba a 420
// para el icono de 512, que salía borroso en la pantalla de inicio de Android.
// Cada tamaño se reduce desde aquí.
const logoIcono = await (await silueta(`${SRC}/logo-b.png`, CREAM)).png().toBuffer()

for (const size of [180, 192, 512]) {
  const salida = size === 180 ? `${ROOT}/public/apple-touch-icon.png` : `${OUT}/icon-${size}.png`
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 18, g: 18, b: 16, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(logoIcono)
          .resize({ width: Math.round(size * 0.82), fit: 'inside' })
          .toBuffer(),
        gravity: 'centre',
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(salida)
  log(salida)
}

const favicon = `${ROOT}/public/favicon.png`
await sharp({
  create: { width: 64, height: 64, channels: 4, background: { r: 18, g: 18, b: 16, alpha: 1 } },
})
  .composite([
    {
      input: await sharp(logoIcono).resize({ width: 54, fit: 'inside' }).toBuffer(),
      gravity: 'centre',
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(favicon)
log(favicon)

console.log('\nLogotipo para la interfaz:')

/*
 * Cuatro archivos y no uno: el monograma para la cabecera y el pie, donde el
 * arco no se leería, y el escudo entero para donde haya sitio. De cada uno, la
 * versión tinta (sobre crema) y la crema (sobre el negro del pie). Se emiten a
 * 3x el tamaño de uso para que se vean nítidos en pantallas de alta densidad.
 */
const monogramaPng = await monograma(`${SRC}/logo-b.png`)

for (const [nombre, entrada, ancho] of [
  ['logo-wordmark', monogramaPng, 480],
  ['logo-badge', `${SRC}/logo-b.png`, 480],
]) {
  for (const [sufijo, color] of [
    ['', INK],
    ['-light', CREAM],
  ]) {
    const salida = `${OUT}/${nombre}${sufijo}.png`
    const info = await (
      await silueta(entrada, color, ancho)
    )
      .png({ compressionLevel: 9 })
      .toFile(salida)
    log(salida)
    if (!sufijo)
      metadatos[nombre] = { src: `/brand/${nombre}`, width: info.width, height: info.height }
  }
}

writeFileSync(
  resolve(ROOT, 'src/data/brand-images.js'),
  `/**
 * GENERADO por \`node scripts/build-brand-assets.mjs\`. No editar a mano.
 * Medidas reales de la fotografía de marca, para reservar el hueco en el layout.
 */
export const brandImages = ${JSON.stringify(metadatos, null, 2)}
`
)
console.log('\nsrc/data/brand-images.js escrito')
