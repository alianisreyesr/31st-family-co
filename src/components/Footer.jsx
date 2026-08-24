import { Link } from 'react-router-dom'
import { Logo } from './Logo.jsx'
import { config, brand } from '../lib/config.js'
import { track, events } from '../lib/analytics.js'

export function Footer() {
  return (
    <footer className="footer">
      <Logo as="plain" className="footer-logo" />
      <p>{brand.tagline}</p>

      <nav className="footer-links" aria-label="Enlaces del pie de página">
        <a href="/#drop">Colección</a>
        <a href="/#historia">Historia</a>
        <a href="/#preguntas">Preguntas</a>
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => track(events.instagramClick, { origen: 'pie' })}
        >
          Instagram
        </a>
        <a
          href={config.tiktokUrl}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => track(events.socialClick, { red: 'tiktok', origen: 'pie' })}
        >
          TikTok
        </a>
        <a
          href={config.facebookUrl}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => track(events.socialClick, { red: 'facebook', origen: 'pie' })}
        >
          Facebook
        </a>
        <a href={`mailto:${config.contactEmail}`} onClick={() => track(events.contactClick)}>
          Contacto
        </a>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/terminos">Términos</Link>
      </nav>

      <small>
        © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
      </small>
    </footer>
  )
}
