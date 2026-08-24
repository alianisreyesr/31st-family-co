import { LegalPage } from './LegalPage.jsx'
import { config, brand } from '../lib/config.js'

/**
 * ⚠️ BORRADOR — revisar con asesoría legal antes de publicar.
 *
 * Las secciones de envíos, devoluciones y garantía reproducen las políticas
 * REALES publicadas en 31stfamilyco.com (verificadas el 24 de agosto de 2026):
 * toda venta es final salvo defecto de manufactura, con 7 días para reportarlo.
 * Una versión anterior de este archivo prometía 30 días de cambios, que la
 * marca no ofrece.
 *
 * Los plazos y condiciones de aquí tienen que coincidir palabra por palabra con
 * `src/data/faq.js` y con la barra de anuncio. Si cambias uno, cambia los tres:
 * una contradicción entre el FAQ y los términos se resuelve a favor del cliente.
 */
export function Terms() {
  return (
    <LegalPage eyebrow="Legal" title="Términos y condiciones" updatedAt="24 de agosto de 2026">
      <p>
        Al comprar en {brand.name} o usar este sitio aceptas lo que sigue. Está escrito para que se
        entienda sin abogado.
      </p>

      <h2>Quiénes somos</h2>
      <p>
        {brand.name}, [NOMBRE LEGAL DE LA EMPRESA], con domicilio en [DIRECCIÓN POSTAL],{' '}
        {brand.location}. Contacto:{' '}
        <a className="inline-link" href={`mailto:${config.contactEmail}`}>
          {config.contactEmail}
        </a>
        .
      </p>

      <h2>Precios y pedidos</h2>
      <p>
        Los precios están en dólares estadounidenses e incluyen los impuestos aplicables salvo que
        se indique lo contrario en el checkout. Un pedido queda confirmado cuando recibes el email
        de confirmación. Podemos cancelar un pedido y devolverte el importe completo si el producto
        se agotó, si el precio se publicó con un error evidente o si detectamos un uso fraudulento.
      </p>

      <h2>Envíos</h2>
      <p>
        El costo de envío se calcula en el checkout según el destino y el método elegido. Los
        tiempos de envío y entrega son aproximados y pueden variar según la ubicación, el método de
        envío y factores externos al control de {brand.name}. Te enviamos el número de rastreo por
        email al despachar el pedido.
      </p>

      <h2>Devoluciones y reembolsos</h2>
      <p>
        <strong>Todas las ventas son finales.</strong> No aceptamos devoluciones ni reembolsos por
        cambio de opinión, error al ordenar, talla incorrecta ni cualquier otro motivo ajeno a un
        defecto de manufactura.
      </p>
      <p>
        Si tu pieza presenta un defecto de manufactura, tienes <strong>7 días</strong> desde que la
        recibes para reportarlo escribiendo a{' '}
        <a className="inline-link" href={`mailto:${config.contactEmail}`}>
          {config.contactEmail}
        </a>{' '}
        con tu nombre completo, número de orden, fecha de compra, una descripción detallada del
        defecto y fotos claras del producto y del área afectada. Pasado ese plazo no podemos
        garantizar la reclamación.
      </p>
      <p>
        Si confirmamos el defecto, cubrimos el costo del envío de devolución y eliges entre el
        reemplazo del producto (sujeto a disponibilidad) o el reembolso completo al método de pago
        original. Si no se confirma ningún defecto, el costo del envío de devolución corre por
        cuenta del cliente. La pieza debe estar sin usar, en su condición original, con etiquetas y
        empaque intactos y sin señales de mal uso ni alteraciones.
      </p>

      <h2>Qué no cubre la garantía</h2>
      <p>
        Las variaciones leves en color, textura o acabado que son normales en procesos de
        producción; el desgaste por uso normal; y los daños provocados por lavado inadecuado o
        manejo incorrecto. La instrucción de lavado a mano está en las preguntas frecuentes y en la
        etiqueta: lavadora o secadora deforman la pieza y ese daño no entra en garantía.
      </p>

      <h2>Marca y contenido</h2>
      <p>
        El nombre {brand.name}, el logotipo, los diseños y las fotografías de este sitio son
        nuestros. Puedes compartirlos en redes citando la marca; no puedes reproducirlos en producto
        propio ni con fines comerciales sin permiso por escrito.
      </p>

      <h2>Fotos de la comunidad</h2>
      <p>
        Si nos etiquetas públicamente en redes, podemos pedirte permiso para republicar tu foto con
        crédito a tu cuenta. Nunca la usamos sin haberte preguntado antes, y si nos pides que la
        retiremos, la retiramos.
      </p>

      <h2>Límite de responsabilidad</h2>
      <p>
        Nuestra responsabilidad por cualquier reclamación relacionada con un pedido se limita al
        importe pagado por ese pedido. Nada en estos términos limita los derechos que la ley te
        reconoce como consumidor.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes del Estado Libre Asociado de {brand.location}, y
        cualquier disputa se resolverá ante sus tribunales.
      </p>

      <h2>Cambios</h2>
      <p>
        Podemos actualizar estos términos; la fecha de arriba indica la última versión. A tu pedido
        se le aplican los términos vigentes en el momento de la compra.
      </p>
    </LegalPage>
  )
}
