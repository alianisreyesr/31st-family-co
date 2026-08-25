import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SkipLink } from './components/SkipLink.jsx'
import { AnnouncementBar } from './components/AnnouncementBar.jsx'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Home } from './pages/Home.jsx'
import { Product } from './pages/Product.jsx'
import { Privacy } from './pages/Privacy.jsx'
import { Terms } from './pages/Terms.jsx'
import { NotFound } from './pages/NotFound.jsx'
import { useDocumentMeta } from './hooks/useDocumentMeta.js'
import { initAnalytics } from './lib/analytics.js'

/*
 * El texto original prometía «ENVÍO GRATIS EN ÓRDENES DE $75+». Ese umbral no
 * existe: no aparece en ninguna política publicada y la marca lo confirmó. No lo
 * devuelvas aquí sin añadirlo también al FAQ y a los términos.
 */
const ANUNCIO = 'BORN IN PUERTO RICO · BUILT TO STAND OUT · EST. 2024'

/** Al cambiar de ruta el navegador conserva el scroll; aquí se vuelve arriba. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      /*
       * Con enlaces entre rutas (`/#archivo` desde una ficha de producto) el
       * navegador no salta al ancla: React Router cambia la URL sin recargar y
       * el destino ni siquiera está montado cuando cambia el `location`. Se
       * lleva el scroll a mano después del render.
       */
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  useDocumentMeta()

  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <AnnouncementBar>{ANUNCIO}</AnnouncementBar>
      <Header />

      <main id="contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<Product />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
