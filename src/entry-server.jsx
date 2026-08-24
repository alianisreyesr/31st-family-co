import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

/**
 * Punto de entrada del prerender. `scripts/prerender.mjs` consume `render` y
 * `pages` desde el bundle que produce `vite build --ssr`.
 */
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
}

export { pages, findPageMeta, buildJsonLd } from './lib/seo.js'
export { config } from './lib/config.js'
