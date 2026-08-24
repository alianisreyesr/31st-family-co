import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribe } from '../lib/newsletter.js'
import { config } from '../lib/config.js'
import { track, events } from '../lib/analytics.js'

const IDLE = { status: 'idle', message: '' }

export function SignupForm({ interest = null, inputRef = null }) {
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

    // Qué pieza motivó el alta viaja al proveedor: sirve para saber qué avisar
    // primero y qué produce demanda antes de fabricarlo.
    const result = await subscribe(email, {
      source: interest ? `producto:${interest.id}` : 'landing',
    })

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
      {interest ? (
        <p className="signup-interest">
          Te avisaremos primero cuando <strong>{interest.name}</strong> esté disponible. Déjanos tu
          email.
        </p>
      ) : (
        <p>
          Únete a la Family List para recibir acceso temprano, restocks y noticias directamente de
          31st Family Co.
        </p>
      )}

      <form onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor="email">
          Tu email
        </label>
        <input
          ref={inputRef}
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
          {pending ? 'Enviando…' : 'Unirme'}
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
