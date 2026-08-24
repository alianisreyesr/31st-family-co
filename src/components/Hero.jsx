import { trustPoints } from '../data/trust.js'
import { brandImages } from '../data/brand-images.js'

const hero = brandImages.hero

export function Hero() {
  return (
    <section className="hero" id="inicio">
      {/*
        Foto real de la marca a sangre detrás del titular. Va como <img> y no
        como `background-image` para poder darle `srcset`, `fetchPriority` y
        medidas: es la imagen más grande de la página y la que marca el LCP.
      */}
      <picture className="hero-media">
        <source
          type="image/webp"
          srcSet={hero.anchos.map((w) => `${hero.base}-${w}.webp ${w}w`).join(', ')}
          sizes="100vw"
        />
        <img
          src={`${hero.base}-${hero.respaldo}.jpg`}
          alt=""
          width={hero.width}
          height={hero.height}
          fetchPriority="high"
          decoding="sync"
        />
      </picture>

      <div className="hero-content">
        <p className="eyebrow">31st Family Co · Puerto Rico</p>
        <h1>
          Más que una marca.
          <br />
          <em>Somos familia.</em>
        </h1>
        <p className="hero-copy">
          Gorras premium creadas desde nuestras raíces para quienes llevan su historia con orgullo.
        </p>
        <div className="hero-actions">
          <a className="button button-light" href="#drop">
            Ver el drop actual
          </a>
          <a className="text-link" href="#historia">
            Conoce nuestra historia <span aria-hidden="true">→</span>
          </a>
        </div>
        <ul className="trust-strip">
          {trustPoints.map((point) => (
            <li key={point.id}>{point.label}</li>
          ))}
        </ul>
      </div>
      <a className="scroll-cue" href="#drop">
        Explorar{' '}
        <span aria-hidden="true" className="scroll-cue-arrow">
          ↓
        </span>
      </a>
    </section>
  )
}
