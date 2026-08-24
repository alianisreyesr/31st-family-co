import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SkipLink } from './components/SkipLink.jsx'
import { AnnouncementBar } from './components/AnnouncementBar.jsx'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Home } from './pages/Home.jsx'
import { Privacy } from './pages/Privacy.jsx'
import { Terms } from './pages/Terms.jsx'
import { NotFound } from './pages/NotFound.jsx'
import { useDocumentMeta } from './hooks/useDocumentMeta.js'
import { initAnalytics } from './lib/analytics.js'

/*
 * El texto anterior de la barra prometía «ENVÍO GRATIS EN ÓRDENES DE $75+».
 * Ese umbral no aparece en ninguna de las políticas publicadas en
 * 31stfamilyco.com, y desde que el FAQ dice la verdad («el costo se calcula en
 * el checkout») las dos afirmaciones se contradecían.
 *
 * Si el envío gratis desde $75 es real, devuelve el texto aquí Y añádelo al FAQ
 * y a los términos a la vez. Si no lo es, este texto ya es el correcto.
 */
const ANUNCIO = 'DROP 01 DISPONIBLE · ÚNETE A LA FAMILIA'

/** Al cambiar de ruta el navegador conserva el scroll; aquí se vuelve arriba. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
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
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
