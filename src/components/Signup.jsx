import { SignupForm } from './SignupForm.jsx'

export function Signup({ interest = null, inputRef = null }) {
  return (
    <section className="signup" id="familia" aria-labelledby="signup-titulo">
      <div>
        <p className="eyebrow">Acceso anticipado</p>
        <h2 id="signup-titulo">
          El próximo drop
          <br />
          empieza aquí.
        </h2>
      </div>
      <SignupForm interest={interest} inputRef={inputRef} />
    </section>
  )
}
