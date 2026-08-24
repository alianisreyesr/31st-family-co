import { describe, expect, it } from 'vitest'
import { faqs } from './faq.js'
import { trustPoints } from './trust.js'

/**
 * Guardia sobre las afirmaciones de política.
 *
 * La política real de 31st Family Co (publicada en 31stfamilyco.com) es: todas
 * las ventas son finales salvo defecto de manufactura, con 7 días para
 * reportarlo. Una versión anterior de este repo prometía «30 días para cambios»
 * en el FAQ, en los términos y en la franja de confianza del hero — una promesa
 * que la marca no ofrece y que genera exactamente la reclamación que su política
 * intenta evitar.
 *
 * Estos tests no validan estilo: validan que el sitio no prometa algo que la
 * marca no cumple. Si la política cambia de verdad, actualiza el test a la vez
 * que el contenido.
 */

const textoDeFaqs = faqs.map((faq) => `${faq.question} ${faq.answer}`).join(' ')
const textoDeConfianza = trustPoints.map((point) => point.label).join(' ')
const todo = `${textoDeFaqs} ${textoDeConfianza}`.toLowerCase()

describe('afirmaciones de política', () => {
  it('no promete una ventana de devolución de 30 días', () => {
    expect(todo).not.toMatch(/30\s*d[íi]as/)
  })

  it('no ofrece cambios por talla o por cambio de opinión', () => {
    expect(todo).not.toMatch(/cambio de talla|cambiar por otra talla/)
  })

  it('deja claro que las ventas son finales', () => {
    expect(todo).toMatch(/ventas son finales/)
  })

  it('indica la ventana real de 7 días para defectos', () => {
    expect(todo).toMatch(/7\s*d[íi]as/)
  })

  it('no menciona envío gratis en ninguna forma', () => {
    // La marca confirmó que no ofrece envío gratis por encima de ningún monto.
    // Si algún día lo ofrece, hay que actualizar FAQ, términos y barra de
    // anuncio a la vez — y entonces este test.
    expect(todo).not.toMatch(/env[íi]o gratis/)
  })

  it('cada pregunta tiene id único y respuesta no vacía', () => {
    const ids = faqs.map((faq) => faq.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const faq of faqs) {
      expect(faq.answer.trim().length).toBeGreaterThan(40)
    }
  })
})
