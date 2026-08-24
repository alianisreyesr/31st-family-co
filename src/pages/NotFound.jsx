import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <article className="legal">
      <p className="eyebrow dark">Error 404</p>
      <h1>Esta página no existe.</h1>
      <div className="legal-body">
        <p>
          El enlace puede estar roto o la pieza que buscabas ya no está en línea. Vuelve al drop
          actual o escríbenos y te ayudamos a encontrarla.
        </p>
      </div>
      <Link className="text-link" to="/">
        Ver el drop actual <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
