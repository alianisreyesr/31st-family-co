import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { products, upcomingProducts, archivedProducts } from './data/products.js'

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
  it('muestra el hero y las dos secciones de catálogo', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1, name: /somos familia/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /el próximo capítulo/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /lo que se fue/i })).toBeInTheDocument()
  })

  it('pone el próximo drop antes del archivo', () => {
    const { container } = renderApp()
    const secciones = [...container.querySelectorAll('section[id]')].map((s) => s.id)
    expect(secciones.indexOf('proximo-drop')).toBeLessThan(secciones.indexOf('archivo'))
  })

  it('dice la verdad sobre disponibilidad en cada tarjeta', () => {
    const { container } = renderApp()
    const insignias = [...container.querySelectorAll('.status-badge')].map((n) => n.textContent)
    expect(insignias.filter((t) => t === 'Agotado')).toHaveLength(archivedProducts.length)
    expect(insignias.filter((t) => t === 'Próximamente')).toHaveLength(upcomingProducts.length)
  })

  it('no ofrece comprar nada: no hay stock', () => {
    renderApp()
    expect(screen.queryByRole('link', { name: /^comprar/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^comprar/i })).not.toBeInTheDocument()
  })

  it('el precio del próximo drop se publica; el del archivo, no', () => {
    const { container } = renderApp()
    const precios = [...container.querySelectorAll('.product-price')].map((n) => n.textContent)
    expect(precios.filter((t) => t === 'Próximo drop')).toHaveLength(upcomingProducts.length)
    expect(precios.filter((t) => t === 'Agotado')).toHaveLength(archivedProducts.length)
  })

  it('sirve la fotografía en WebP con varios anchos', () => {
    const { container } = renderApp()
    const fuentes = container.querySelectorAll('.product-image source[type="image/webp"]')
    expect(fuentes.length).toBe(products.length)
    for (const fuente of fuentes) {
      expect(fuente.getAttribute('srcset')).toMatch(/480w.*900w.*1400w/)
    }
  })

  it('reserva el hueco de cada foto para no provocar saltos de layout', () => {
    const { container } = renderApp()
    for (const img of container.querySelectorAll('.product-image img')) {
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0)
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0)
    }
  })
})

describe('lista de espera', () => {
  it('«Quiero acceso» lleva el foco al email y nombra la pieza', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getAllByRole('button', { name: /quiero acceso de/i })[0])

    const input = screen.getByLabelText(/tu email/i)
    expect(input).toHaveFocus()
    expect(screen.getByText(/te avisaremos primero cuando/i)).toBeInTheDocument()
  })

  it('«Avísame del restock» funciona igual desde el archivo', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getAllByRole('button', { name: /avísame del restock de/i })[0])

    expect(screen.getByLabelText(/tu email/i)).toHaveFocus()
    expect(screen.getByText(/te avisaremos primero cuando/i)).toBeInTheDocument()
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
    expect(miniaturas).toHaveLength(3)
    expect(miniaturas[0]).toHaveAttribute('aria-current', 'true')

    await user.click(miniaturas[2])
    expect(miniaturas[2]).toHaveAttribute('aria-current', 'true')
    expect(miniaturas[0]).toHaveAttribute('aria-current', 'false')
  })

  it('muestra las tallas reales de la camisa', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /ver detalles de essential tees/i }))
    const dialog = screen.getByRole('dialog')

    for (const talla of ['XS', 'S', 'M', 'L', 'XL']) {
      expect(within(dialog).getByText(talla, { selector: 'li' })).toBeInTheDocument()
    }
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

describe('filtro del archivo', () => {
  it('filtra por colección', async () => {
    const user = userEvent.setup()
    renderApp()

    const dayOne = archivedProducts.filter((p) => p.collection === 'day-one').length
    await user.click(screen.getByRole('button', { name: /^day one/i }))

    expect(
      screen.getByText(new RegExp(`${dayOne} de ${archivedProducts.length} piezas`))
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^day one/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('filtra por categoría y vuelve con «Todos»', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /^medias/i }))
    expect(
      screen.getByText(new RegExp(`1 de ${archivedProducts.length} piezas`))
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^todos/i }))
    expect(screen.getByText(`${archivedProducts.length} piezas`)).toBeInTheDocument()
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
    await user.click(screen.getByRole('button', { name: /unirme/i }))

    expect(await screen.findByText(/todavía no está conectada/i)).toBeInTheDocument()
    expect(screen.queryByText(/estás dentro/i)).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('rechaza un email incompleto sin llamar a la red', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText(/tu email/i), 'ana@')
    await user.click(screen.getByRole('button', { name: /unirme/i }))

    expect(await screen.findByText(/parece incompleto/i)).toBeInTheDocument()
  })
})

describe('barra de anuncio', () => {
  it('se puede cerrar y no vuelve tras recargar', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp()
    const barra = () => document.querySelector('.announcement')

    expect(barra()).toHaveTextContent(/born in puerto rico/i)
    await user.click(screen.getByRole('button', { name: /cerrar el anuncio/i }))
    expect(barra()).toBeNull()

    unmount()
    renderApp()
    expect(barra()).toBeNull()
  })
})

describe('páginas legales', () => {
  it.each([
    ['/privacidad', /política de privacidad/i],
    ['/terminos', /términos y condiciones/i],
    ['/no-existe', /no existe/i],
  ])('renderiza %s', (ruta, titulo) => {
    renderApp(ruta)
    expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeInTheDocument()
  })
})
