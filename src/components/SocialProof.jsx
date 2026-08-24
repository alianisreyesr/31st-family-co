import { config, brand } from '../lib/config.js'
import { testimonials } from '../data/testimonials.js'
import { track, events } from '../lib/analytics.js'

/**
 * Prueba social. El bloque de testimonios solo aparece cuando
 * `src/data/testimonials.js` tiene contenido real; mientras esté vacío se
 * muestra únicamente la llamada a Instagram. Preferimos una sección más corta a
 * una con reseñas inventadas.
 */
export function SocialProof() {
  return (
    <section className="social-proof section" aria-labelledby="comunidad-titulo">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">La comunidad</p>
          <h2 id="comunidad-titulo">Así se lleva.</h2>
        </div>
        <p>
          Etiquétanos con {brand.instagramHandle} y entra en el feed. Las mejores fotos las publica
          la familia, no nosotros.
        </p>
      </div>

      {testimonials.length > 0 && (
        <ul className="testimonials">
          {testimonials.map((item) => (
            <li key={item.id}>
              <blockquote>
                <p>{item.quote}</p>
              </blockquote>
              <p className="testimonial-author">
                {item.author}
                {item.city ? ` · ${item.city}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}

      <a
        className="button button-outline"
        href={config.instagramUrl}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => track(events.instagramClick, { origen: 'comunidad' })}
      >
        Ver el feed en Instagram
      </a>
    </section>
  )
}
