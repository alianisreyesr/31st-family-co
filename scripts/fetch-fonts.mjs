/**
 * Descarga las fuentes a `public/fonts/` y genera `src/styles/fonts.css`.
 *
 *   node scripts/fetch-fonts.mjs
 *
 * Por qué auto-hospedarlas y no enlazar a Google:
 *
 *  - **Velocidad.** El `<link>` a fonts.googleapis.com obliga a dos conexiones
 *    nuevas (DNS + TLS a googleapis y a gstatic) antes de poder pedir el primer
 *    archivo. Servidas desde el propio dominio, viajan por la conexión que ya
 *    está abierta.
 *  - **Privacidad.** Cada visita enviaba la IP y el user-agent a Google sin que
 *    nadie lo consintiera. En la UE eso ha costado sentencias; aquí, como
 *    mínimo, obliga a mencionarlo en la política de privacidad.
 *  - **CSP.** Con las fuentes en casa, `font-src 'self'` basta y la política de
 *    seguridad deja de tener un agujero de dominios de terceros.
 *
 * Solo se guardan los subconjuntos `latin` y `latin-ext`: el sitio está en
 * español y los de cirílico, griego y vietnamita nunca se pedirían.
 */
import { mkdirSync, writeFileSync, rmSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/fonts')

const CONSULTA =
  'family=DM+Mono:wght@400;500' +
  '&family=Manrope:wght@400;700;800' +
  '&family=Playfair+Display:ital,wght@0,500;1,500' +
  '&display=swap'

const SUBCONJUNTOS = new Set(['latin', 'latin-ext'])

// Sin un user-agent de navegador moderno, Google devuelve la hoja con formatos
// antiguos (ttf) en lugar de woff2, que pesa la mitad.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const dato = (cuerpo, propiedad) =>
  cuerpo
    .match(new RegExp(`${propiedad}:\\s*([^;]+);`))?.[1]
    .trim()
    .replace(/^'|'$/g, '')

/*
 * La versión de la fuente entra en el nombre (`manrope-v25-700-latin.woff2`).
 * Así los archivos se pueden cachear un año como inmutables: si Google publica
 * una revisión, `npm run fonts` la trae con otro nombre y el navegador la pide
 * de nuevo en vez de quedarse con la vieja hasta que caduque.
 */
const archivo = (familia, version, peso, estilo, subconjunto) =>
  `${familia.toLowerCase().replace(/\s+/g, '-')}-${version}-${peso}` +
  `${estilo === 'italic' ? '-italic' : ''}-${subconjunto}.woff2`

const respuesta = await fetch(`https://fonts.googleapis.com/css2?${CONSULTA}`, {
  headers: { 'User-Agent': UA },
})
if (!respuesta.ok) throw new Error(`Google Fonts respondió ${respuesta.status}`)
const hoja = await respuesta.text()

// Cada regla viene precedida de un comentario con el nombre del subconjunto.
const reglas = [...hoja.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)]
if (reglas.length === 0) throw new Error('No se reconoció ninguna @font-face en la respuesta')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const bloques = []
let descargados = 0
let total = 0

for (const [, subconjunto, cuerpo] of reglas) {
  if (!SUBCONJUNTOS.has(subconjunto)) continue

  const familia = dato(cuerpo, 'font-family')
  const estilo = dato(cuerpo, 'font-style')
  const peso = dato(cuerpo, 'font-weight')
  const rango = dato(cuerpo, 'unicode-range')
  const origen = cuerpo.match(/url\(([^)]+)\)/)?.[1]
  if (!origen) continue

  const version = origen.match(/\/s\/[^/]+\/(v\d+)\//)?.[1] ?? 'v0'
  const nombre = archivo(familia, version, peso, estilo, subconjunto)
  const binario = await fetch(origen)
  if (!binario.ok) throw new Error(`${nombre}: ${binario.status}`)
  const destino = `${OUT}/${nombre}`
  writeFileSync(destino, Buffer.from(await binario.arrayBuffer()))

  const kb = statSync(destino).size / 1024
  total += kb
  descargados++
  console.log(`  ${nombre} — ${kb.toFixed(1)} kB`)

  bloques.push(
    `@font-face {\n` +
      `  font-family: '${familia}';\n` +
      `  font-style: ${estilo};\n` +
      `  font-weight: ${peso};\n` +
      // `swap` y no `block`: antes de que llegue la fuente se pinta con la de
      // respaldo en vez de dejar el titular en blanco.
      `  font-display: swap;\n` +
      `  src: url('/fonts/${nombre}') format('woff2');\n` +
      `  unicode-range: ${rango};\n` +
      `}`
  )
}

writeFileSync(
  resolve(ROOT, 'src/styles/fonts.css'),
  `/*\n * GENERADO por \`npm run fonts\`. No editar a mano.\n * Fuentes auto-hospedadas: ver scripts/fetch-fonts.mjs para el porqué.\n */\n\n${bloques.join('\n\n')}\n`
)

console.log(`\n${descargados} archivos, ${total.toFixed(0)} kB en total`)
console.log('src/styles/fonts.css escrito')
