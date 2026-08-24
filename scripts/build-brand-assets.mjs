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
const metadatos = {}

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
const logoOg = await sharp(`${SRC}/logo-b.png`)
  .resize({ width: 420 })
  .modulate({ brightness: 2.2 })
  .toBuffer()
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
// El logotipo viene claro sobre transparente: se aclara y se pone sobre el
// negro de marca para que se vea en la pestaña y en la pantalla de inicio.
const logoIcono = await sharp(`${SRC}/logo-b.png`)
  .resize({ width: 152, fit: 'inside' })
  .modulate({ brightness: 2.4 })
  .toBuffer()

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

// Logotipo suelto sobre crema, para usarlo dentro de la página si hace falta.
const marca = `${OUT}/wordmark.png`
await sharp(`${SRC}/logo-b.png`)
  .resize({ width: 600 })
  .flatten({ background: CREAM })
  .negate({ alpha: false })
  .png({ compressionLevel: 9 })
  .toFile(marca)
log(marca)

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
