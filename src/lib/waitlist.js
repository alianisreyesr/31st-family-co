/**
 * El salto a la Family List, compartido por la portada y las fichas de
 * producto.
 *
 * Mover el foco no es un adorno: sin ello, quien navega con teclado se queda
 * donde estaba y el desplazamiento no le sirve de nada. Y `preventScroll` evita
 * que el navegador anule la animación suave saltando de golpe al campo.
 */
export const WAITLIST_ID = 'familia'

export function focusWaitlist(inputRef) {
  document.getElementById(WAITLIST_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  inputRef?.current?.focus({ preventScroll: true })
}
