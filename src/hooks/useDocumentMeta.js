import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { config } from '../lib/config.js'
import { findPageMeta } from '../lib/seo.js'

function setMeta(selector, attribute, value) {
  const node = document.head.querySelector(selector)
  if (node) node.setAttribute(attribute, value)
}

/**
 * Mantiene el título y las metas alineados con la ruta al navegar en cliente.
 * El HTML prerenderizado ya trae los valores correctos en la primera carga;
 * esto cubre las transiciones posteriores (y a los lectores de pantalla, que
 * anuncian el título de la página al cambiar).
 */
export function useDocumentMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = findPageMeta(pathname)
    const url = `${config.siteUrl}${meta.path === '/' ? '/' : meta.path}`

    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('link[rel="canonical"]', 'href', url)
  }, [pathname])
}
