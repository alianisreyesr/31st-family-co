import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { products, findProduct, productPath } from '../data/products.js'

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

/**
 * Las páginas de producto existen para que una pieza tenga una dirección propia
 * que compartir e indexar. Lo que se cuida aquí es que ninguna pieza del
 * catálogo se quede sin página, que un id inventado dé 404 de verdad (y no una
 * ficha vacía que Google indexaría como contenido pobre) y que la ficha siga
 * diciendo la verdad sobre disponibilidad y tallas.
 */
describe('página de producto', () => {
  it('cada pieza del catálogo tiene la suya', () => {
    for (const product of products) {
      const { unmount } = renderApp(productPath(product))
      expect(screen.getByRole('heading', { level: 1, name: product.name })).toBeInTheDocument()
      expect(
        screen.getByText(product.colorway, { selector: '.product-page-colorway' })
      ).toBeVisible()
      unmount()
    }
  })

  it('un id que no existe es un 404, no una ficha vacía', () => {
    renderApp('/producto/gorra-inventada')
    expect(screen.getByRole('heading', { level: 1, name: /no existe/i })).toBeInTheDocument()
  })

  it('no ofrece comprar lo que está agotado', () => {
    renderApp(productPath(findProduct('cap-terracotta')))
    expect(screen.queryByRole('link', { name: /^comprar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /avísame del restock/i })).toBeInTheDocument()
  })

  it('el próximo drop pide acceso en vez de restock', () => {
    renderApp(productPath(findProduct('headband-black')))
    expect(screen.getByRole('button', { name: /quiero acceso/i })).toBeInTheDocument()
    expect(screen.getByText(/precio en el lanzamiento/i)).toBeInTheDocument()
  })

  it('publica las tallas reales de la camisa y ninguna en una gorra', () => {
    const { unmount } = renderApp(productPath(findProduct('essential-tees')))
    for (const talla of ['XS', 'S', 'M', 'L', 'XL']) {
      expect(screen.getByText(talla, { selector: 'li' })).toBeInTheDocument()
    }
    unmount()

    renderApp(productPath(findProduct('love-god-4-31')))
    expect(screen.queryByText('XL', { selector: 'li' })).not.toBeInTheDocument()
    expect(screen.getByText(/talla única ajustable/i)).toBeInTheDocument()
  })

  it('el botón de la lista lleva el foco al email y nombra la pieza', async () => {
    const user = userEvent.setup()
    renderApp(productPath(findProduct('headband-white')))

    await user.click(screen.getByRole('button', { name: /quiero acceso/i }))

    expect(screen.getByLabelText(/tu email/i)).toHaveFocus()
    expect(screen.getByText(/te avisaremos primero cuando/i)).toBeInTheDocument()
  })

  it('ofrece salidas: miga de pan y otras piezas, sin enlazarse a sí misma', () => {
    const product = findProduct('cap-black')
    renderApp(productPath(product))

    const migas = within(screen.getByRole('navigation', { name: /ruta de navegación/i }))
    expect(migas.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')

    const relacionadas = within(screen.getByRole('region', { name: /otras piezas/i }))
    const enlaces = relacionadas.getAllByRole('link')
    expect(enlaces.length).toBeGreaterThan(1)
    for (const enlace of enlaces) {
      expect(enlace.getAttribute('href')).not.toBe(productPath(product))
    }
  })
})

describe('camino desde la portada', () => {
  it('el título de cada tarjeta enlaza a su ficha, con el colorway en el nombre', () => {
    renderApp()

    for (const product of products) {
      const enlace = screen.getByRole('link', {
        name: `${product.name} — ${product.colorway}`,
      })
      expect(enlace).toHaveAttribute('href', productPath(product))
    }
  })

  it('la modal ofrece la página permanente de la pieza', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /ver detalles de 2\/31 pr edition/i }))
    const dialog = screen.getByRole('dialog')

    expect(
      within(dialog).getByRole('link', { name: /ver la página de la pieza/i })
    ).toHaveAttribute('href', productPath(findProduct('pr-edition-2-31')))
  })
})
