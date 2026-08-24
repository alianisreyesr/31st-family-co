import { brandImages } from '../data/brand-images.js'

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
        <h2>Todo comienza con la familia.</h2>
        <p>
          31st Family Co nació de una idea simple: lo que construimos juntos tiene más fuerza. Cada
          pieza es un recordatorio de las raíces que nos forman y de la visión que nos mueve.
        </p>
        <p>
          No buscamos seguir tendencias. Creamos piezas para las personas que entienden que estilo,
          esfuerzo y pertenencia pueden ir de la mano.
        </p>
        <a className="text-link light-link" href="#familia">
          Conoce a la familia <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
