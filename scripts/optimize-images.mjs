/**
 * Optimiza las fotos de producto.
 *
 * Las originales del catálogo son exportaciones de móvil de 1536x2048 y ~280 kB
 * cada una: 5,4 MB para 19 fotos. Servir eso tal cual castiga sobre todo a quien
 * entra desde datos móviles, que es de donde llega el tráfico de Instagram.
 *
 * De cada original se generan tres anchos en WebP (para `srcset`) y un JPEG de
 * respaldo. Los originales quedan versionados en `originals/`, fuera de
 * `public/`, como fuente de verdad para poder regenerar sin volver a bajarlos.
 *
 * Además escribe `src/data/product-images.js` con las medidas reales de cada
 * archivo generado, que es lo que permite reservar el hueco en el layout y no
 * provocar saltos (CLS) mientras la foto carga.
 *
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp'
import { readdirSync, statSync, mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = resolve(ROOT, 'public/products')
const ORIGINALS = resolve(ROOT, 'originals/products')

// Anchos elegidos por el tamaño real de presentación: tarjeta en rejilla de 3,
// tarjeta a pantalla completa en móvil, y panel de la ficha en pantallas densas.
const WIDTHS = [480, 900, 1400]
const FALLBACK_WIDTH = 900

const kb = (path) => Math.round(statSync(path).size / 1024)

let originalKb = 0
let optimizadoKb = 0
let generados = 0
const metadatos = {}

// Primera pasada: mover a originals/ cualquier original que aún esté en public/.
// Así el script es idempotente: se puede volver a ejecutar para cambiar calidades
// o anchos sin tener que descargar nada otra vez.
for (const slug of readdirSync(PUBLIC_DIR).filter((d) =>
  statSync(`${PUBLIC_DIR}/${d}`).isDirectory()
)) {
  mkdirSync(`${ORIGINALS}/${slug}`, { recursive: true })
  for (const archivo of readdirSync(`${PUBLIC_DIR}/${slug}`).filter((f) => /^\d+\.jpg$/.test(f))) {
    renameSync(`${PUBLIC_DIR}/${slug}/${archivo}`, `${ORIGINALS}/${slug}/${archivo}`)
  }
}

const slugs = readdirSync(ORIGINALS).filter((d) => statSync(`${ORIGINALS}/${d}`).isDirectory())

for (const slug of slugs) {
  mkdirSync(`${PUBLIC_DIR}/${slug}`, { recursive: true })
  metadatos[slug] = []

  const originales = readdirSync(`${ORIGINALS}/${slug}`)
    .filter((f) => /^\d+\.jpg$/.test(f))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

  for (const archivo of originales) {
    const rutaOriginal = `${ORIGINALS}/${slug}/${archivo}`
    originalKb += kb(rutaOriginal)

    const base = archivo.replace(/\.jpg$/, '')

    for (const width of WIDTHS) {
      const salida = `${PUBLIC_DIR}/${slug}/${base}-${width}.webp`
      await sharp(rutaOriginal)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(salida)
      optimizadoKb += kb(salida)
      generados++
    }

    const respaldo = `${PUBLIC_DIR}/${slug}/${base}-${FALLBACK_WIDTH}.jpg`
    const info = await sharp(rutaOriginal)
      .resize({ width: FALLBACK_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(respaldo)
    optimizadoKb += kb(respaldo)
    generados++

    metadatos[slug].push({
      base: `/products/${slug}/${base}`,
      width: info.width,
      height: info.height,
    })

    console.log(
      `${slug}/${base}: ${kb(rutaOriginal)} kB -> ${WIDTHS.map((w) => `${w}w`).join(', ')} + jpg`
    )
  }
}

const modulo = `/**
 * GENERADO por \`node scripts/optimize-images.mjs\`. No editar a mano.
 *
 * Cada entrada trae la ruta base (sin sufijo de ancho) y las medidas del JPEG de
 * respaldo de ${FALLBACK_WIDTH}px, que \`ProductImage\` usa como \`width\`/\`height\` para
 * reservar el hueco antes de que la foto cargue.
 */
export const ANCHOS = ${JSON.stringify(WIDTHS)}
export const ANCHO_RESPALDO = ${FALLBACK_WIDTH}

export const productImages = ${JSON.stringify(metadatos, null, 2)}
`

writeFileSync(resolve(ROOT, 'src/data/product-images.js'), modulo)

console.log(`\n${generados} archivos generados`)
console.log(
  `Originales: ${(originalKb / 1024).toFixed(1)} MB (movidos a originals/, fuera de public/)`
)
console.log(
  `Publicados: ${(optimizadoKb / 1024).toFixed(1)} MB en total, pero cada visita solo baja un ancho`
)
