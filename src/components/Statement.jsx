import { brandImages } from '../data/brand-images.js'
import { config } from '../lib/config.js'
import { track, events } from '../lib/analytics.js'

const foto = brandImages.statement

export function Statement() {
  return (
    <section className="statement" id="historia">
      <picture className="statement-photo">
        <source
          type="image/webp"
          srcSet={foto.anchos.map((w) => `${foto.base}-${w}.webp ${w}w`).join(', ')}
          sizes="(max-width: 860px) 100vw, 50vw"
        />
        <img
          src={`${foto.base}-${foto.respaldo}.jpg`}
          alt="Gorras de 31st Family Co sobre una mesa al aire libre en Puerto Rico"
          width={foto.width}
          height={foto.height}
          loading="lazy"
          decoding="async"
        />
      </picture>

      <div className="statement-copy">
        <p className="eyebrow">Nuestra historia</p>
        <h2>De las raíces familiares a un futuro sólido.</h2>
        <p>
          31st Family Co es una marca nacida en Puerto Rico. Construimos piezas con gráficos
          atrevidos, creatividad cruda y la convicción de que la autoexpresión no necesita permiso.
        </p>
        <p>
          No solo hacemos streetwear. Construimos una familia para quienes llevan su identidad con
          orgullo y están creando su propio camino.
        </p>
        <a
          className="text-link light-link"
          href={config.instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => track(events.instagramClick, { origen: 'historia' })}
        >
          Conoce la familia <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
