import { existsSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const DIST = fileURLToPath(new URL('./dist', import.meta.url))

/**
 * `vite preview` sirve la carpeta como una SPA: toda ruta sin extensión cae en
 * `index.html`. Eso hacía que `/producto/cap-green` devolviera la portada y que
 * `/no-existe` respondiera 200, así que la comprobación previa a publicar no
 * comprobaba nada.
 *
 * Los hosts reales resuelven el índice del directorio y usan `404.html`
 * —Netlify de serie, Vercel con `cleanUrls`—. Esto hace lo mismo en local.
 * Solo toca el servidor de vista previa: `npm run dev` sigue con su fallback de
 * SPA, que es lo que le permite servir rutas que en desarrollo no existen como
 * archivo.
 */
function previewComoEnProduccion() {
  return {
    name: 'preview-estatico',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '/'
        const ruta = url.split('?')[0]
        if (extname(ruta)) return next()

        const limpia = ruta.endsWith('/') ? ruta.slice(0, -1) : ruta
        if (existsSync(join(DIST, limpia, 'index.html'))) {
          req.url = `${limpia}/index.html${url.slice(ruta.length)}`
          return next()
        }

        const noEncontrada = join(DIST, '404.html')
        if (!existsSync(noEncontrada)) return next()

        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(noEncontrada))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), previewComoEnProduccion()],
  build: {
    // El sitio es pequeno: un solo chunk evita cascadas de red innecesarias.
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
})
