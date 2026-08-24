/**
 * Prerender estático.
 *
 * El problema que resuelve: una SPA sirve un `<div id="root">` vacío, y los
 * previews de WhatsApp, Instagram o Slack no ejecutan JavaScript — leen el HTML
 * crudo y se van. Aquí se renderiza cada ruta a HTML real, con su título, sus
 * metas Open Graph y sus datos estructurados ya dentro del archivo. El cliente
 * luego hidrata ese HTML en lugar de reconstruirlo.
 *
 * Se ejecuta como último paso de `npm run build:ssg`, después del build de
 * cliente (dist/) y del de servidor (dist-server/).
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const SERVER_ENTRY = resolve(ROOT, 'dist-server/entry-server.js')

const { render, pages, buildJsonLd, config } = await import(pathToFileURL(SERVER_ENTRY).href)

const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')

// El nombre del archivo de la tarjeta social se toma de la plantilla en vez de
// repetirlo aquí: cuando cambió de .png a .jpg, la copia de este script se
// quedó atrás y el prerender publicó una URL que ya no existía.
const OG_IMAGE =
  template.match(/property="og:image" content="[^"]*\/([^/"]+)"/)?.[1] ?? 'og-image.jpg'

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Reemplaza el `content` de una meta identificada por su atributo. */
function setMeta(html, matcher, value) {
  const pattern = new RegExp(`(<meta\\s+${matcher}\\s+content=")[^"]*(")`, 'i')
  if (!pattern.test(html)) {
    console.warn(`  ! no se encontró la meta ${matcher}; se deja el HTML sin tocar`)
    return html
  }
  return html.replace(pattern, `$1${escapeAttr(value)}$2`)
}

function buildPage(meta) {
  const url = `${config.siteUrl}${meta.path === '/' ? '/' : meta.path}`
  const appHtml = render(meta.path)

  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(meta.title)}</title>`)
  html = setMeta(html, 'name="description"', meta.description)
  html = setMeta(html, 'name="robots"', config.isPreview ? 'noindex, nofollow' : 'index, follow')
  html = setMeta(html, 'property="og:title"', meta.title)
  html = setMeta(html, 'property="og:description"', meta.description)
  html = setMeta(html, 'property="og:url"', url)
  html = setMeta(html, 'property="og:image"', `${config.siteUrl}/${OG_IMAGE}`)
  html = setMeta(html, 'name="twitter:title"', meta.title)
  html = setMeta(html, 'name="twitter:description"', meta.description)
  html = setMeta(html, 'name="twitter:image"', `${config.siteUrl}/${OG_IMAGE}`)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${escapeAttr(url)}$2`)
  html = html.replace(
    /(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/i,
    // `</` escapado: un `</script>` dentro del JSON cerraría la etiqueta antes
    // de tiempo y rompería el documento.
    `$1${JSON.stringify(buildJsonLd(meta.path)).replace(/</g, '\\u003c')}$2`
  )
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  return html
}

function writePage(relativePath, html) {
  const target = resolve(DIST, relativePath)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, html)
  console.log(`  ${relativePath}  (${(Buffer.byteLength(html) / 1024).toFixed(1)} kB)`)
}

console.log('Prerenderizando rutas:')

for (const meta of pages) {
  const html = buildPage(meta)
  writePage(meta.path === '/' ? 'index.html' : `${meta.path.slice(1)}/index.html`, html)
}

// 404 para hosts estáticos (Netlify, Cloudflare Pages, GitHub Pages). Se
// renderiza la ruta comodín, que resuelve al componente NotFound.
writePage(
  '404.html',
  buildPage({
    path: '/404',
    title: 'Página no encontrada | 31st Family Co',
    description: 'La página que buscabas no existe o cambió de dirección.',
  })
)

// --- sitemap.xml y robots.txt ------------------------------------------------

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => {
    const loc = `${config.siteUrl}${page.path === '/' ? '/' : page.path}`
    const priority = page.path === '/' ? '1.0' : '0.4'
    return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')}
</urlset>
`

writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap)
writeFileSync(
  resolve(DIST, 'robots.txt'),
  config.isPreview
    ? `# Vista previa: no indexar.\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`
)
console.log('  sitemap.xml\n  robots.txt')

// El bundle de servidor es un artefacto intermedio: no debe acabar publicado.
rmSync(resolve(ROOT, 'dist-server'), { recursive: true, force: true })

console.log(`\nListo. Sitio estático en dist/ apuntando a ${config.siteUrl}`)
console.log(
  config.isPreview
    ? 'Modo VISTA PREVIA: noindex + robots.txt bloqueado. No competirá con el sitio real.'
    : 'Modo PRODUCCIÓN: indexable. Comprueba que esta URL es la definitiva.'
)
