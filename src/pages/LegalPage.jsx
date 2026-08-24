import { Link } from 'react-router-dom'

export function LegalPage({ eyebrow, title, updatedAt, children }) {
  return (
    <article className="legal">
      <p className="eyebrow dark">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="legal-updated">Última actualización: {updatedAt}</p>
      <div className="legal-body">{children}</div>
      <Link className="text-link" to="/">
        Volver al inicio <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
