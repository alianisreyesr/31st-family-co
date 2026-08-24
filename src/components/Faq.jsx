import { faqs } from '../data/faq.js'
import { config } from '../lib/config.js'

/**
 * Acordeón sobre `<details>` nativo: accesible por teclado, anunciado
 * correctamente por lectores de pantalla y funcional aunque el JavaScript falle
 * o todavía no haya hidratado. Cero estado, cero listeners.
 */
export function Faq() {
  return (
    <section className="faq section" id="preguntas" aria-labelledby="faq-titulo">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Antes de ordenar</p>
          <h2 id="faq-titulo">Preguntas frecuentes.</h2>
        </div>
        <p>
          Envíos, cambios y ajuste. Si te queda una duda que no está aquí, escríbenos a{' '}
          <a className="inline-link" href={`mailto:${config.contactEmail}`}>
            {config.contactEmail}
          </a>
          .
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.id} name="faq">
            <summary>
              <span>{faq.question}</span>
              <span className="faq-icon" aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
