import { SignupForm } from './SignupForm.jsx'

export function Signup() {
  return (
    <section className="signup" id="familia" aria-labelledby="signup-titulo">
      <div>
        <p className="eyebrow">Acceso anticipado</p>
        <h2 id="signup-titulo">
          El próximo drop
          <br />
          está cerca.
        </h2>
      </div>
      <SignupForm />
    </section>
  )
}
