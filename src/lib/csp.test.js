import { describe, expect, it } from 'vitest'
import { buildCsp } from './csp.js'

const directivas = (csp) =>
  Object.fromEntries(
    csp.split('; ').map((parte) => {
      const [nombre, ...valores] = parte.split(' ')
      return [nombre, valores]
    })
  )

const SIN_SERVICIOS = {
  plausibleDomain: '',
  plausibleHost: 'https://plausible.io',
  newsletterEndpoint: '',
}

/**
 * Una CSP demasiado abierta no protege; una demasiado cerrada rompe el sitio en
 * silencio —el navegador bloquea la petición en la consola, no en la pantalla—.
 * Por eso se deduce de la configuración, y por eso conviene probar los dos
 * extremos: sin servicios conectados y con ellos.
 */
describe('política de seguridad de contenidos', () => {
  it('sin servicios conectados no abre ningún host de terceros', () => {
    const csp = buildCsp(SIN_SERVICIOS)
    expect(csp).not.toMatch(/https?:\/\//)
    expect(directivas(csp)['connect-src']).toEqual(["'self'"])
    expect(directivas(csp)['script-src']).toEqual(["'self'"])
  })

  it('abre exactamente el proveedor de la lista, y solo para conectarse', () => {
    const csp = buildCsp({ ...SIN_SERVICIOS, newsletterEndpoint: 'https://formspree.io/f/abc123' })
    const d = directivas(csp)
    expect(d['connect-src']).toContain('https://formspree.io')
    // El origen, no la URL completa del formulario.
    expect(csp).not.toContain('/f/abc123')
    // Un endpoint de alta no es un sitio del que cargar scripts.
    expect(d['script-src']).toEqual(["'self'"])
  })

  it('abre la analítica para script y conexión, porque necesita las dos', () => {
    const csp = buildCsp({ ...SIN_SERVICIOS, plausibleDomain: '31stfamilyco.com' })
    const d = directivas(csp)
    expect(d['script-src']).toContain('https://plausible.io')
    expect(d['connect-src']).toContain('https://plausible.io')
  })

  it('no abre la analítica si no hay dominio: el script ni se carga', () => {
    const csp = buildCsp({ ...SIN_SERVICIOS, plausibleHost: 'https://plausible.io' })
    expect(csp).not.toContain('plausible.io')
  })

  it('respeta un host de analítica propio', () => {
    const csp = buildCsp({
      ...SIN_SERVICIOS,
      plausibleDomain: '31stfamilyco.com',
      plausibleHost: 'https://stats.31stfamilyco.com',
    })
    expect(csp).toContain('https://stats.31stfamilyco.com')
    expect(csp).not.toContain('plausible.io')
  })

  it('un endpoint mal escrito no cuela basura en la política', () => {
    const csp = buildCsp({ ...SIN_SERVICIOS, newsletterEndpoint: 'no-es-una-url' })
    expect(directivas(csp)['connect-src']).toEqual(["'self'"])
  })

  it('mantiene cerrado lo que nunca hace falta', () => {
    const d = directivas(buildCsp(SIN_SERVICIOS))
    expect(d['object-src']).toEqual(["'none'"])
    expect(d['frame-src']).toEqual(["'none'"])
    expect(d['base-uri']).toEqual(["'self'"])
    // Sin `unsafe-inline`: no hay estilos en línea en los componentes.
    expect(d['style-src']).toEqual(["'self'"])
  })
})
