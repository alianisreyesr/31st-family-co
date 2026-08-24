import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { products } from './data/products.js'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('portada', () => {
  it('muestra el hero y el drop', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1, name: /somos familia/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /hecho para representar/i })).toBeInTheDocument()
  })

  it('no deja ningún botón de compra sin destino', () => {
    renderApp()
    const comprar = screen.getAllByRole('link', { name: /ordenar|comprar/i })
    expect(comprar.length).toBeGreaterThan(0)
    for (const link of comprar) {
      expect(link.getAttribute('href')).toBeTruthy()
      expect(link.getAttribute('href')).not.toBe('#')
    }
  })

  it('muestra el precio formateado, no una cadena suelta', () => {
    renderApp()
    // El catálogo real: gorras a $40, camiseta $35, medias $15, cinta $12.
    expect(screen.getAllByText(/\$40/).length).toBeGreaterThan(0)
    expect(screen.getByText(/\$12/)).toBeInTheDocument()
  })

  it('lista las cuatro categorías del catálogo real', () => {
    renderApp()
    for (const etiqueta of ['Gorras', 'Camisas', 'Medias', 'Head Bands']) {
      expect(screen.getAllByText(etiqueta).length).toBeGreaterThan(0)
    }
  })

  it('sirve la fotografía de producto en WebP con varios anchos', () => {
    const { container } = renderApp()
    const fuentes = container.querySelectorAll('.product-image source[type="image/webp"]')
    // Una por pieza del catálogo: ninguna tarjeta se queda sin foto real.
    expect(fuentes.length).toBe(products.length)
    for (const fuente of fuentes) {
      expect(fuente.getAttribute('srcset')).toMatch(/480w.*900w.*1400w/)
    }
  })

  it('reserva el hueco de cada foto para no provocar saltos de layout', () => {
    const { container } = renderApp()
    const imagenes = container.querySelectorAll('.product-image img')
    expect(imagenes.length).toBeGreaterThan(0)
    for (const img of imagenes) {
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0)
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0)
    }
  })

  it('carga la foto del hero con prioridad y las demás en diferido', () => {
    const { container } = renderApp()
    expect(container.querySelector('.hero-media img')).toHaveAttribute('fetchpriority', 'high')
    const diferidas = container.querySelectorAll('.product-image img[loading="lazy"]')
    expect(diferidas.length).toBeGreaterThan(0)
  })
})

describe('ficha de producto', () => {
  it('se abre, muestra los detalles y cierra con Escape devolviendo el foco', async () => {
    const user = userEvent.setup()
    renderApp()

    const trigger = screen.getByRole('button', { name: /ver detalles de 2\/31 pr edition/i })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: '2/31 PR Edition' })).toBeInTheDocument()
    expect(within(dialog).getAllByText(/yo soy de aquí/i).length).toBeGreaterThan(0)

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('deja cambiar de foto en la galería', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /ver detalles de 2\/31 pr edition/i }))
    const dialog = screen.getByRole('dialog')

    const miniaturas = within(dialog).getAllByRole('button', { name: /foto \d+ de \d+/i })
    expect(miniaturas.length).toBe(3)
    expect(miniaturas[0]).toHaveAttribute('aria-current', 'true')

    await user.click(miniaturas[2])
    expect(miniaturas[2]).toHaveAttribute('aria-current', 'true')
    expect(miniaturas[0]).toHaveAttribute('aria-current', 'false')
  })
})

describe('filtro por categoría', () => {
  it('reduce la rejilla a la categoría elegida y lo anuncia', async () => {
    const user = userEvent.setup()
    renderApp()

    const gorras = products.filter((p) => p.category === 'gorras').length
    expect(screen.getAllByRole('button', { name: /ver detalles de/i })).toHaveLength(
      products.length
    )

    await user.click(screen.getByRole('button', { name: /^gorras/i }))

    expect(screen.getAllByRole('button', { name: /ver detalles de/i })).toHaveLength(gorras)
    expect(screen.getByRole('button', { name: /^gorras/i })).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByText(new RegExp(`${gorras} de ${products.length} piezas`))
    ).toBeInTheDocument()
  })

  it('vuelve al catálogo completo con «Todo»', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /^medias/i }))
    expect(screen.getAllByRole('button', { name: /ver detalles de/i })).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /^todo/i }))
    expect(screen.getAllByRole('button', { name: /ver detalles de/i })).toHaveLength(
      products.length
    )
  })
})

describe('tallas', () => {
  it('muestra las tallas reales de la camisa en su ficha', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /ver detalles de essential tees/i }))
    const dialog = screen.getByRole('dialog')

    for (const talla of ['XS', 'S', 'M', 'L', 'XL']) {
      expect(within(dialog).getByText(talla, { selector: 'li' })).toBeInTheDocument()
    }
    expect(within(dialog).getByText(/ventas son finales/i)).toBeInTheDocument()
  })

  it('no inventa tallas en una gorra', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /ver detalles de 4\/31 love god/i }))
    const dialog = screen.getByRole('dialog')

    expect(within(dialog).queryByText('XL', { selector: 'li' })).not.toBeInTheDocument()
    expect(within(dialog).getByText(/talla única ajustable/i)).toBeInTheDocument()
  })
})

describe('menú móvil', () => {
  it('refleja su estado en aria-expanded y cierra con Escape', async () => {
    const user = userEvent.setup()
    renderApp()

    const button = screen.getByRole('button', { name: 'Menú' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Menú' })).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Family List', () => {
  it('avisa en vez de fingir el alta cuando no hay proveedor conectado', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    renderApp()

    await user.type(screen.getByLabelText(/tu email/i), 'ana@ejemplo.com')
    await user.click(screen.getByRole('button', { name: /quiero acceso/i }))

    expect(await screen.findByText(/todavía no está conectada/i)).toBeInTheDocument()
    expect(screen.queryByText(/estás dentro/i)).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('rechaza un email incompleto sin llamar a la red', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText(/tu email/i), 'ana@')
    await user.click(screen.getByRole('button', { name: /quiero acceso/i }))

    expect(await screen.findByText(/parece incompleto/i)).toBeInTheDocument()
  })
})

describe('barra de anuncio', () => {
  it('se puede cerrar y no vuelve tras recargar', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp()

    const bannerText = /drop 01 disponible/i

    expect(screen.getByText(bannerText)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /cerrar el anuncio/i }))
    expect(screen.queryByText(bannerText)).not.toBeInTheDocument()

    unmount()
    renderApp()
    expect(screen.queryByText(bannerText)).not.toBeInTheDocument()
  })
})

describe('páginas legales', () => {
  it('renderiza la política de privacidad en su ruta', () => {
    renderApp('/privacidad')
    expect(
      screen.getByRole('heading', { level: 1, name: /política de privacidad/i })
    ).toBeInTheDocument()
  })

  it('renderiza los términos en su ruta', () => {
    renderApp('/terminos')
    expect(
      screen.getByRole('heading', { level: 1, name: /términos y condiciones/i })
    ).toBeInTheDocument()
  })

  it('devuelve un 404 útil en una ruta desconocida', () => {
    renderApp('/no-existe')
    expect(screen.getByRole('heading', { level: 1, name: /no existe/i })).toBeInTheDocument()
  })
})
