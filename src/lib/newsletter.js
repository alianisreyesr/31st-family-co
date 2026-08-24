/**
 * Alta en la Family List.
 *
 * El comportamiento importante: si no hay endpoint configurado NO se finge el
 * exito. Antes el formulario mostraba "Estas dentro" y tiraba el email a la
 * basura; ahora devuelve `unconfigured` y la UI ofrece una via real de contacto.
 */
import { config } from './config.js'

// Validacion deliberadamente permisiva: el navegador ya aplica type="email" y
// el proveedor valida de verdad. Aqui solo se atajan errores obvios de tecleo.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(String(email).trim())
}

/**
 * @param {string} email
 * @param {{source?: string, signal?: AbortSignal}} [options]
 * @returns {Promise<{status: 'ok'|'invalid'|'unconfigured'|'error', message: string}>}
 */
export async function subscribe(email, options = {}) {
  const value = String(email).trim().toLowerCase()

  if (!isValidEmail(value)) {
    return { status: 'invalid', message: 'Revisa el email: parece incompleto.' }
  }

  if (!config.newsletterEndpoint) {
    return {
      status: 'unconfigured',
      message: 'La Family List todavía no está conectada. Escríbenos y te añadimos a mano.',
    }
  }

  try {
    const response = await fetch(config.newsletterEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email: value,
        source: options.source ?? 'landing',
      }),
      signal: options.signal,
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: 'No pudimos guardar tu email. Inténtalo de nuevo en un momento.',
      }
    }

    return { status: 'ok', message: 'Estás dentro. Bienvenido a la familia.' }
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    return {
      status: 'error',
      message: 'Fallo de conexión. Revisa tu red e inténtalo otra vez.',
    }
  }
}
