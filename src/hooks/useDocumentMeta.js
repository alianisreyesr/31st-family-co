import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { config } from '../lib/config.js'
import { findPageMeta, BRAND_IMAGE } from '../lib/seo.js'

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
    const imagen = meta.image ?? BRAND_IMAGE

    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('meta[property="og:type"]', 'content', meta.ogType ?? 'website')
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('link[rel="canonical"]', 'href', url)

    /*
     * La imagen también: al pasar de la portada a una ficha, quien comparte
     * desde el menú del navegador arrastraba el logotipo genérico en vez de la
     * pieza que tenía delante. Las medidas van con ella para que el preview no
     * reserve un hueco apaisado a una foto vertical.
     */
    setMeta('meta[property="og:image"]', 'content', `${config.siteUrl}${imagen.url}`)
    setMeta('meta[property="og:image:width"]', 'content', imagen.width)
    setMeta('meta[property="og:image:height"]', 'content', imagen.height)
    setMeta('meta[property="og:image:type"]', 'content', imagen.type)
    setMeta('meta[property="og:image:alt"]', 'content', imagen.alt)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
    setMeta('meta[name="twitter:image"]', 'content', `${config.siteUrl}${imagen.url}`)
  }, [pathname])
}
