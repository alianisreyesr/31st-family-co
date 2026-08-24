import '@testing-library/jest-dom/vitest'

// jsdom no implementa IntersectionObserver, que usa StickyBuyBar. Un doble
// inerte basta: lo que se prueba es el resto del árbol, no el observador.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

globalThis.IntersectionObserver = IntersectionObserverStub

// scrollTo existe en jsdom pero solo para avisar de que no está implementado, y
// <ScrollToTop /> lo llama en cada navegación: se sustituye por un no-op para
// que la salida de los tests no se llene de ese aviso.
globalThis.scrollTo = () => {}
