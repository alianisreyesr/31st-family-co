import { brandImages } from '../data/brand-images.js'
import { brand } from '../lib/config.js'

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
        <p className="eyebrow">31st Family Co. · {brand.location}</p>
        <h1>
          Más que una marca.
          <br />
          <em>Somos familia.</em>
        </h1>
        <p className="hero-copy">
          Streetwear nacido en Puerto Rico, creado desde nuestras raíces para quienes no vinieron a
          encajar.
        </p>
        <div className="hero-actions">
          <a className="button button-light" href="#familia">
            Únete al próximo drop
          </a>
          <a className="text-link" href="#archivo">
            Explorar el archivo <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="hero-stamp" aria-hidden="true">
        <span>EST.</span>
        <strong>{brand.foundedYear}</strong>
        <span>FAMILY CO.</span>
      </div>
    </section>
  )
}
