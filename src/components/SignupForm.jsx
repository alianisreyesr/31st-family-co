import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribe } from '../lib/newsletter.js'
import { config } from '../lib/config.js'
import { track, events } from '../lib/analytics.js'

const IDLE = { status: 'idle', message: '' }

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState(IDLE)
  const [pending, setPending] = useState(false)
  const honeypotRef = useRef(null)

  const onSubmit = async (event) => {
    event.preventDefault()
    if (pending) return

    // Trampa para bots: un campo oculto que una persona nunca rellena.
    if (honeypotRef.current?.value) return

    setPending(true)
    setState(IDLE)
    track(events.newsletterSubmit)

    const result = await subscribe(email, { source: 'landing' })

    setState(result)
    setPending(false)

    if (result.status === 'ok') {
      setEmail('')
      track(events.newsletterSuccess)
    }
  }

  const isError = ['invalid', 'error', 'unconfigured'].includes(state.status)

  return (
    <div className="signup-content">
      <p>
        Únete a la Family List para recibir acceso temprano, restocks y lanzamientos exclusivos.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor="email">
          Tu email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (state.status !== 'idle') setState(IDLE)
          }}
          placeholder="Tu email"
          aria-invalid={isError || undefined}
          aria-describedby="email-estado"
          disabled={pending}
          required
        />

        {/* Honeypot: fuera de la pantalla y fuera del orden de tabulación. */}
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="empresa">No rellenar</label>
          <input id="empresa" name="empresa" type="text" tabIndex={-1} ref={honeypotRef} />
        </div>

        <button type="submit" disabled={pending}>
          {pending ? 'Enviando…' : 'Quiero acceso'}
        </button>
      </form>

      {/* Región viva permanente: si solo apareciera al haber mensaje, muchos
          lectores de pantalla no anunciarían el primer resultado. */}
      <p
        className={`form-status${isError ? ' form-status-error' : ''}${state.status === 'ok' ? ' form-status-ok' : ''}`}
        id="email-estado"
        role="status"
        aria-live="polite"
      >
        {state.message}
        {state.status === 'unconfigured' && (
          <>
            {' '}
            <a className="inline-link" href={`mailto:${config.contactEmail}`}>
              {config.contactEmail}
            </a>
          </>
        )}
      </p>

      <small>
        Sin spam. Solo drops, restocks y noticias de la familia. Puedes darte de baja cuando
        quieras: mira la <Link to="/privacidad">política de privacidad</Link>.
      </small>
    </div>
  )
}
