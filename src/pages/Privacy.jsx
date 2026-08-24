import { LegalPage } from './LegalPage.jsx'
import { config, brand } from '../lib/config.js'

/**
 * ⚠️ BORRADOR — revisar con asesoría legal antes de publicar.
 *
 * Describe lo que el sitio hace HOY: un formulario de email y analítica
 * agregada sin cookies. Si se añade checkout, píxel de Meta, chat en vivo o
 * cualquier cookie de terceros, este texto deja de ser cierto y hay que
 * actualizarlo (y probablemente añadir un banner de consentimiento).
 *
 * Los datos entre corchetes son obligatorios: sin nombre legal ni dirección, la
 * política no cumple con CAN-SPAM ni con el RGPD para visitas desde la UE.
 */
export function Privacy() {
  return (
    <LegalPage eyebrow="Legal" title="Política de privacidad" updatedAt="24 de agosto de 2026">
      <p>
        Esta política explica qué información recogemos en este sitio, para qué la usamos y qué
        puedes pedirnos sobre ella. Va en lenguaje claro a propósito.
      </p>

      <h2>Quién es responsable</h2>
      <p>
        {brand.name}, [NOMBRE LEGAL DE LA EMPRESA], con domicilio en [DIRECCIÓN POSTAL],{' '}
        {brand.location}. Para cualquier asunto de privacidad puedes escribirnos a{' '}
        <a className="inline-link" href={`mailto:${config.contactEmail}`}>
          {config.contactEmail}
        </a>
        .
      </p>

      <h2>Qué datos recogemos</h2>
      <ul>
        <li>
          <strong>Tu email</strong>, solo si te apuntas a la Family List. Nada más: no pedimos
          nombre, teléfono ni fecha de nacimiento.
        </li>
        <li>
          <strong>Estadísticas de visita agregadas</strong> (páginas vistas, país aproximado, tipo
          de dispositivo, sitio de procedencia). No usamos cookies de seguimiento ni creamos
          perfiles individuales, y no podemos identificarte a partir de estos datos.
        </li>
        <li>
          <strong>Lo que nos escribas</strong> por email o por mensaje directo, para poder
          responderte.
        </li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Avisarte de drops, restocks y lanzamientos, porque lo pediste al suscribirte.</li>
        <li>Responder tus preguntas sobre pedidos, tallas o devoluciones.</li>
        <li>
          Entender qué partes del sitio funcionan y cuáles no, en conjunto y sin identificarte.
        </li>
      </ul>
      <p>No vendemos, alquilamos ni cedemos tu email a nadie para que te haga publicidad. Nunca.</p>

      <h2>Con quién los compartimos</h2>
      <p>
        Solo con los proveedores necesarios para que el sitio funcione, y únicamente con los datos
        que necesitan: el servicio de envío de emails [NOMBRE DEL PROVEEDOR DE EMAIL], la analítica
        sin cookies [NOMBRE DEL PROVEEDOR DE ANALÍTICA] y el alojamiento del sitio [NOMBRE DEL
        HOSTING]. Cada uno trata los datos por nuestra cuenta y bajo contrato.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        Tu email se conserva mientras sigas suscrito. Si te das de baja, lo eliminamos de la lista
        activa y conservamos únicamente el registro mínimo de la baja para no volver a escribirte
        por error. Las estadísticas agregadas se conservan sin vinculación con ninguna persona.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes darte de baja con el enlace que aparece al final de cada email, o escribirnos para
        pedir acceso, corrección, eliminación o una copia de tus datos. Respondemos en un plazo
        máximo de 30 días. Si crees que hemos manejado mal tus datos, puedes reclamar ante la
        autoridad de protección de datos que te corresponda.
      </p>

      <h2>Cookies</h2>
      <p>
        Este sitio no instala cookies de publicidad ni de seguimiento. Usamos únicamente
        almacenamiento local del navegador para recordar detalles de interfaz, como que ya cerraste
        la barra de anuncio. Puedes borrarlo desde los ajustes de tu navegador sin perder ninguna
        funcionalidad.
      </p>

      <h2>Menores</h2>
      <p>
        Este sitio no está dirigido a menores de 13 años y no recogemos sus datos de forma
        consciente. Si nos avisas de que hemos recibido el email de un menor, lo eliminamos.
      </p>

      <h2>Cambios</h2>
      <p>
        Si actualizamos esta política, cambiamos la fecha de arriba. Cuando el cambio sea
        importante, te lo decimos por email antes de aplicarlo.
      </p>
    </LegalPage>
  )
}
