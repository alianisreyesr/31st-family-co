import { describe, expect, it, vi, afterEach } from 'vitest'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { act } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render as renderToHtml } from './entry-server.jsx'
import App from './App.jsx'
import { productPath } from './data/products.js'

/**
 * Red de seguridad del prerender: comprueba que el HTML que genera el servidor
 * y el primer render del cliente coinciden. Un desajuste hace que React tire el
 * HTML prerenderizado y lo reconstruya, perdiendo la ventaja de velocidad — y
 * React solo lo avisa por consola, así que sin este test pasaría inadvertido.
 */
afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('hidratación', () => {
  it.each([
    '/',
    '/privacidad',
    '/terminos',
    // Una ficha con galería de varias fotos y otra con una sola: el estado de la
    // miniatura activa es lo primero que se desincroniza entre servidor y
    // cliente si alguien lo inicializa a partir de algo que no existe en SSR.
    productPath('cap-terracotta'),
    productPath('essential-tees'),
  ])('hidrata %s sin desajustes', async (route) => {
    const errors = []
    vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args.join(' ')))
    vi.spyOn(console, 'warn').mockImplementation((...args) => errors.push(args.join(' ')))

    const container = document.createElement('div')
    container.innerHTML = renderToHtml(route)
    document.body.appendChild(container)

    window.history.pushState({}, '', route)

    await act(async () => {
      hydrateRoot(
        container,
        <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StrictMode>
      )
    })

    const mismatches = errors.filter((message) => /hydrat|did not match|mismatch/i.test(message))
    expect(mismatches).toEqual([])
    // Prueba de vida del prerender: que el HTML trae contenido y no un
    // `<div id="root">` vacío. Se mira el pie, que sale en todas las rutas.
    // Antes se buscaba «31ST», que era el logotipo compuesto con tipografía; hoy
    // el logotipo es una imagen y ese texto ya no existe en la página.
    expect(container.textContent).toContain('31st Family Co')
  })
})
