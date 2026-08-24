/**
 * Señales de confianza que se repiten junto a los botones de compra.
 *
 * Solo van aquí afirmaciones que la marca ya sostiene públicamente. Se retiró
 * «30 días para cambios» porque contradecía la política real publicada en
 * 31stfamilyco.com: toda venta es final salvo defecto de manufactura, con 7
 * días para reportarlo. Prometer un plazo de cambio que no existe genera
 * exactamente la reclamación que la política intenta evitar.
 *
 * ⚠️ Antes de añadir un punto nuevo: tiene que coincidir con el FAQ, con los
 * términos y con la barra de anuncio. Una contradicción entre ellos se resuelve
 * a favor del cliente.
 */
export const trustPoints = [
  { id: 'hecho', label: 'Diseñado en Puerto Rico' },
  { id: 'defectos', label: 'Garantía por defecto de fábrica' },
  { id: 'consulta', label: 'Te asesoramos antes de comprar' },
]
