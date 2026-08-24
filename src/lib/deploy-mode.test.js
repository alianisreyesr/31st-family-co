import { describe, expect, it, vi, afterEach } from 'vitest'

/**
 * El modo de despliegue decide si el sitio se deja indexar.
 *
 * Importa de verdad: una vista previa en `*.netlify.app` que Google indexe
 * compite como contenido duplicado contra el sitio real de la marca, y el
 * canonical apuntaría al dominio equivocado. Se deduce del dominio en vez de
 * depender de que alguien recuerde poner una variable.
 */
async function cargarConfig(env) {
  vi.resetModules()
  vi.stubEnv('VITE_SITE_URL', env.siteUrl ?? '')
  vi.stubEnv('VITE_NOINDEX', env.noindex ?? '')
  const { config } = await import('./config.js')
  return config
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('modo de despliegue', () => {
  it('el dominio de producción es indexable', async () => {
    const config = await cargarConfig({ siteUrl: 'https://31stfamilyco.com' })
    expect(config.isPreview).toBe(false)
  })

  it('un subdominio del dominio de producción también', async () => {
    const config = await cargarConfig({ siteUrl: 'https://www.31stfamilyco.com' })
    expect(config.isPreview).toBe(false)
  })

  it('sin variable ninguna, asume producción', async () => {
    const config = await cargarConfig({})
    expect(config.isPreview).toBe(false)
    expect(config.siteUrl).toBe('https://31stfamilyco.com')
  })

  it('una URL de Netlify se marca como vista previa', async () => {
    const config = await cargarConfig({ siteUrl: 'https://31st-nuevo.netlify.app' })
    expect(config.isPreview).toBe(true)
  })

  it('una URL de Vercel también', async () => {
    const config = await cargarConfig({ siteUrl: 'https://31st.vercel.app' })
    expect(config.isPreview).toBe(true)
  })

  it('no se deja engañar por un dominio que solo contenga el nombre', async () => {
    const config = await cargarConfig({ siteUrl: 'https://31stfamilyco.com.copia.net' })
    expect(config.isPreview).toBe(true)
  })

  it('VITE_NOINDEX manda sobre la deducción, en los dos sentidos', async () => {
    expect(
      (await cargarConfig({ siteUrl: 'https://31stfamilyco.com', noindex: 'true' })).isPreview
    ).toBe(true)
    expect(
      (await cargarConfig({ siteUrl: 'https://preview.netlify.app', noindex: 'false' })).isPreview
    ).toBe(false)
  })
})
