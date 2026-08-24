import { useEffect } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Comportamiento de diálogo modal accesible: cierra con Escape, atrapa el
 * tabulador dentro del panel, bloquea el scroll del fondo y devuelve el foco al
 * elemento que lo abrió. Sin esto, quien navega con teclado o lector de
 * pantalla se queda tabulando por detrás de la modal sin saber dónde está.
 *
 * @param {{isOpen: boolean, panelRef: React.RefObject<HTMLElement>, onClose: () => void}} params
 */
export function useDialog({ isOpen, panelRef, onClose }) {
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement
    const { overflow, paddingRight } = document.body.style

    // Compensar la barra de scroll evita que el fondo salte al bloquearlo.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    const panel = panelRef.current
    const focusables = () => Array.from(panel?.querySelectorAll(FOCUSABLE) ?? [])
    focusables()[0]?.focus() ?? panel?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [isOpen, onClose, panelRef])
}
