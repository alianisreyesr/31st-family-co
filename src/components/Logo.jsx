import { Link } from 'react-router-dom'
import { brandImages } from '../data/brand-images.js'

const marca = brandImages['logo-wordmark']

/**
 * El logotipo real de la marca: el monograma «31ST», no las letras compuestas
 * con la tipografía del sitio que había antes.
 *
 * Dos archivos y no uno con `filter: invert()`: sobre el negro del pie hace
 * falta la versión crema, y un filtro CSS sobre el borde suavizado del PNG deja
 * un halo. `width`/`height` son las medidas reales del archivo generado, para
 * que el hueco esté reservado y la cabecera no salte al cargar.
 *
 * El escudo entero —con «EST. 2024» y «FAMILY CO.» en arco— se queda para el
 * icono y la tarjeta social: a la altura de la cabecera ese texto mide cuatro
 * píxeles y solo ensucia.
 */
export function Logo({ as = 'link', className = 'logo', variant = 'ink' }) {
  const image = (
    <img
      className="logo-mark"
      src={`${marca.src}${variant === 'light' ? '-light' : ''}.png`}
      width={marca.width}
      height={marca.height}
      alt={as === 'plain' ? '31st Family Co' : ''}
      // La cabecera está en la primera pantalla: nada de carga diferida.
      loading="eager"
      decoding="sync"
    />
  )

  if (as === 'plain') {
    return <div className={className}>{image}</div>
  }

  return (
    // El nombre accesible lo pone el enlace, así que el alt de la imagen va
    // vacío: si no, un lector de pantalla lo anunciaría dos veces.
    <Link className={className} to="/" aria-label="31st Family Co, inicio">
      {image}
    </Link>
  )
}
