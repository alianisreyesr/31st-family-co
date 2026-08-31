import { Link } from 'react-router-dom'
import { Logo } from './Logo.jsx'
import { config, brand } from '../lib/config.js'
import { track, events } from '../lib/analytics.js'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Logo as="plain" className="footer-logo" variant="light" />
          <p>
            Born in Puerto Rico.
            <br />
            Built to stand out.
          </p>
        </div>

        <nav className="footer-links" aria-label="Enlaces del pie de página">
          <a href="/#proximo-drop">Próximo drop</a>
          <a href="/#archivo">Archivo</a>
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
      </div>

      <div className="footer-bottom">
        <small>
          © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
        </small>
        <small>{brand.location} · Estados Unidos</small>
      </div>
    </footer>
  )
}
