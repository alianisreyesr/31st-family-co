import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const html = readFileSync(resolve(ROOT, 'index.html'), 'utf8')
const css = readFileSync(resolve(ROOT, 'src/styles/fonts.css'), 'utf8')

const preloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*href="([^"]+)"/g)].map((m) => m[1])
const declaradas = [...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1])

/**
 * Las fuentes están auto-hospedadas y su nombre lleva la versión de Google
 * (`manrope-v20-700-latin.woff2`), que es lo que permite cachearlas un año.
 * El precio es que al actualizarlas cambian de nombre: si alguien ejecuta
 * `npm run fonts` y no toca `index.html`, los `preload` quedan apuntando a
 * archivos que ya no existen. El navegador no se queja —solo descarta la
 * precarga— y el sitio se vuelve más lento sin que nadie se entere.
 */
describe('fuentes auto-hospedadas', () => {
  it('todas las que declara el CSS existen en public/', () => {
    expect(declaradas.length).toBeGreaterThan(0)
    for (const url of declaradas) {
      expect(existsSync(resolve(ROOT, 'public', url.replace(/^\//, ''))), url).toBe(true)
    }
  })

  it('cada preload de index.html apunta a una fuente declarada', () => {
    const fuentes = preloads.filter((href) => href.endsWith('.woff2'))
    expect(fuentes.length).toBeGreaterThan(0)
    for (const href of fuentes) {
      expect(declaradas, `${href} no está en fonts.css`).toContain(href)
    }
  })

  it('no se pide nada a Google: ni hoja de estilos ni archivos', () => {
    for (const fuente of [html, css]) {
      expect(fuente).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/)
    }
  })

  it('el preload de fuentes lleva crossorigin, o se descargan dos veces', () => {
    const etiquetas = [...html.matchAll(/<link[^>]*rel="preload"[^>]*>/g)].map((m) => m[0])
    for (const etiqueta of etiquetas.filter((t) => t.includes('.woff2'))) {
      expect(etiqueta, etiqueta).toMatch(/crossorigin/)
    }
  })

  it('todas se pintan con swap, para no dejar el titular en blanco', () => {
    const caras = css.match(/@font-face/g) ?? []
    const swaps = css.match(/font-display:\s*swap/g) ?? []
    expect(swaps).toHaveLength(caras.length)
  })
})
