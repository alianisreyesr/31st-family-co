import { describe, expect, it, vi, afterEach } from 'vitest'

async function loadNewsletter(endpoint = '') {
  vi.resetModules()
  vi.doMock('./config.js', () => ({
    config: { newsletterEndpoint: endpoint },
    brand: { name: '31st Family Co' },
  }))
  return import('./newsletter.js')
}

afterEach(() => {
  vi.doUnmock('./config.js')
  vi.resetModules()
  vi.unstubAllGlobals()
})

describe('isValidEmail', () => {
  it('acepta direcciones normales', async () => {
    const { isValidEmail } = await loadNewsletter()
    expect(isValidEmail('ana@ejemplo.com')).toBe(true)
    expect(isValidEmail('  ana@ejemplo.com  ')).toBe(true)
  })

  it('rechaza lo que claramente está incompleto', async () => {
    const { isValidEmail } = await loadNewsletter()
    expect(isValidEmail('ana@')).toBe(false)
    expect(isValidEmail('ana@ejemplo')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('subscribe', () => {
  it('no finge el alta cuando no hay endpoint configurado', async () => {
    const { subscribe } = await loadNewsletter('')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await subscribe('ana@ejemplo.com')

    expect(result.status).toBe('unconfigured')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('valida antes de gastar una petición', async () => {
    const { subscribe } = await loadNewsletter('https://formspree.test/f/abc')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await subscribe('ana@')

    expect(result.status).toBe('invalid')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('envía el email normalizado al endpoint', async () => {
    const { subscribe } = await loadNewsletter('https://formspree.test/f/abc')
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchSpy)

    const result = await subscribe('  ANA@Ejemplo.COM  ', { source: 'landing' })

    expect(result.status).toBe('ok')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://formspree.test/f/abc')
    expect(JSON.parse(options.body)).toEqual({ email: 'ana@ejemplo.com', source: 'landing' })
  })

  it('informa del fallo si el proveedor responde con error', async () => {
    const { subscribe } = await loadNewsletter('https://formspree.test/f/abc')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const result = await subscribe('ana@ejemplo.com')

    expect(result.status).toBe('error')
  })

  it('informa del fallo si la red se cae', async () => {
    const { subscribe } = await loadNewsletter('https://formspree.test/f/abc')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    const result = await subscribe('ana@ejemplo.com')

    expect(result.status).toBe('error')
  })
})
