import { useEffect, useState } from 'react'

const STORAGE_KEY = '31st:announcement-dismissed'

/**
 * Barra de anuncio descartable. La decisión se guarda en localStorage para no
 * volver a robar espacio vertical a quien ya la leyó.
 *
 * Se renderiza siempre visible en el primer paint y se oculta en un efecto: si
 * leyéramos localStorage durante el render, el HTML prerenderizado y el del
 * cliente no coincidirían y React descartaría la hidratación.
 */
export function AnnouncementBar({ children }) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      // Leer localStorage durante el render rompería la hidratación (el HTML
      // del servidor no puede conocer esta preferencia), así que este efecto es
      // el único momento seguro para consultarla.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (window.localStorage.getItem(STORAGE_KEY) === '1') setDismissed(true)
    } catch {
      // Navegación privada o cookies bloqueadas: se queda visible, sin más.
    }
  }, [])

  const dismiss = () => {
    setDismissed(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Ignorar: perder la preferencia es preferible a romper el clic.
    }
  }

  if (dismissed) return null

  return (
    <div className="announcement">
      <p>{children}</p>
      <button type="button" onClick={dismiss} aria-label="Cerrar el anuncio">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
