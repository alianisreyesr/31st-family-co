/**
 * Preguntas frecuentes: envíos, devoluciones y tallas son las tres dudas que
 * más ventas frenan en accesorios, y hasta ahora el sitio no las respondía.
 *
 * Las respuestas de devoluciones y envíos están alineadas con las políticas
 * REALES publicadas en 31stfamilyco.com (verificadas el 24 de agosto de 2026):
 * toda venta es final salvo defecto de manufactura, con 7 días para reportarlo.
 * Si cambian esas políticas, este archivo, `src/pages/Terms.jsx` y la barra de
 * anuncio tienen que cambiar a la vez.
 *
 * El envío gratis por encima de un monto se retiró de todo el sitio: la marca
 * confirmó que no existe. No lo reintroduzcas sin una política que lo respalde.
 */
import { config } from '../lib/config.js'

export const faqs = [
  {
    id: 'envios',
    question: '¿Cuánto tarda el envío?',
    answer:
      'Preparamos cada pedido en cuanto se confirma y te enviamos el número de rastreo por email al despacharlo. Los tiempos de entrega son aproximados y varían según el destino, el método de envío y factores del transportista que no controlamos.',
  },
  {
    id: 'envio-gratis',
    question: '¿Cuánto cuesta el envío?',
    answer:
      'El costo se calcula en el checkout según el destino y el método que elijas, y lo ves antes de confirmar el pago.',
  },
  {
    id: 'devoluciones',
    question: '¿Puedo devolver o cambiar una pieza?',
    answer:
      'Todas las ventas son finales. No aceptamos devoluciones por cambio de opinión, error al ordenar ni talla incorrecta. La única excepción es un defecto de manufactura: tienes 7 días desde que recibes el pedido para reportarlo. Por eso, si tienes cualquier duda de talla o color, escríbenos ANTES de ordenar y te ayudamos.',
  },
  {
    id: 'defecto',
    question: 'Mi pieza llegó con un defecto. ¿Qué hago?',
    answer: `Escríbenos a ${config.contactEmail} dentro de los 7 días siguientes a recibirla, con tu nombre completo, número de orden, fecha de compra, una descripción del defecto y fotos claras de la pieza y del área afectada. Si confirmamos el defecto, cubrimos el envío de la devolución y eliges entre reemplazo (según disponibilidad) o reembolso completo al método de pago original. Si no se confirma, el envío de vuelta corre por tu cuenta.`,
  },
  {
    id: 'no-cubierto',
    question: '¿Qué no cubre la garantía?',
    answer:
      'Las variaciones leves de color, textura o acabado propias de todo proceso de producción, el desgaste normal por uso, y los daños por lavado inadecuado o manejo incorrecto. La pieza debe estar sin usar, con sus etiquetas y empaque intactos y sin señales de alteración.',
  },
  {
    id: 'tallas',
    question: '¿Qué talla me sirve?',
    answer:
      'Las gorras son talla única ajustable. Las camisas van de XS a XL. Como las ventas son finales, si dudas entre dos tallas escríbenos antes de ordenar: preferimos resolverlo por mensaje que dejarte con una pieza que no te sirve.',
  },
  {
    id: 'cuidado',
    question: '¿Cómo la lavo sin arruinarla?',
    answer:
      'A mano, con agua fría y jabón neutro, frotando suave sobre la mancha. Nunca a la lavadora ni a la secadora: el calor deforma la corona y la visera, y ese daño no entra en garantía. Deja secar al aire sobre algo redondeado para que mantenga la forma.',
  },
  {
    id: 'restock',
    question: 'Se agotó mi pieza. ¿Va a volver?',
    answer:
      'Los modelos base suelen volver. Las ediciones limitadas normalmente no. Apúntate a la Family List y te avisamos primero de cada restock y de cada drop nuevo.',
  },
  {
    id: 'mayoreo',
    question: '¿Hacen pedidos al por mayor o personalizados?',
    answer: `Sí, trabajamos con equipos, negocios y eventos. Escríbenos a ${config.contactEmail} con la cantidad y la fecha que necesitas y te preparamos una cotización.`,
  },
]
