import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo.jsx'
import { config } from '../lib/config.js'
import { track, events } from '../lib/analytics.js'

const NAV_ITEMS = [
  { href: '/#proximo-drop', label: 'Próximo drop' },
  { href: '/#archivo', label: 'Archivo' },
  { href: '/#historia', label: 'Historia' },
  { href: '/#preguntas', label: 'Preguntas' },
  { href: '/#familia', label: 'Únete' },
]

/**
 * Cabecera fija. Los enlaces de sección usan rutas absolutas con hash
 * (`/#drop`) para funcionar igual desde la portada — donde el navegador hace el
 * salto nativo sin recargar — y desde las páginas legales.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const buttonRef = useRef(null)

  const close = () => setMenuOpen(false)

  // Escape cierra el menú móvil y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      buttonRef.current?.focus()
    }

    const onPointerDown = (event) => {
      if (navRef.current?.contains(event.target)) return
      if (buttonRef.current?.contains(event.target)) return
      setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <header className="header">
      <Logo />

      <button
        ref={buttonRef}
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="nav-principal"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? 'Cerrar' : 'Menú'}
      </button>

      <nav
        ref={navRef}
        id="nav-principal"
        className={menuOpen ? 'nav nav-open' : 'nav'}
        aria-label="Navegación principal"
      >
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} onClick={close}>
            {item.label}
          </a>
        ))}
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => {
            track(events.instagramClick, { origen: 'cabecera' })
            close()
          }}
        >
          Instagram
        </a>
      </nav>
    </header>
  )
}
