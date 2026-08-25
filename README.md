# 31st Family Co

Sitio de 31st Family Co en React + Vite: lista de espera del próximo drop,
archivo de piezas agotadas, una página por pieza, prerender estático, captura de
emails, analítica opcional y páginas legales.

El inventario está agotado salvo el próximo drop, así que la conversión es entrar
en la Family List, no comprar. Ver [PENDIENTE.md](PENDIENTE.md).

## Requisitos

- Node.js 20 o superior
- npm

## Ejecutar localmente

```bash
npm install
cp .env.example .env   # opcional: el sitio funciona sin ninguna variable
npm run dev
```

Vite mostrará una URL local, normalmente `http://localhost:5173`.

## Scripts

| Script              | Qué hace                                                             |
| ------------------- | -------------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con recarga en caliente.                      |
| `npm run build`     | Build de cliente en `dist/` (SPA, sin prerender).                    |
| `npm run build:ssg` | **Build de producción**: prerenderiza cada ruta + sitemap + robots.  |
| `npm run preview`   | Sirve `dist/` como lo haría el host: sin fallback de SPA y con 404.  |
| `npm run images`    | Regenera las fotos de producto (WebP responsive) desde `originals/`. |
| `npm run brand`     | Regenera hero, historia, tarjeta OG, iconos y logotipo.              |
| `npm run fonts`     | Descarga las fuentes a `public/fonts/` y genera `fonts.css`.         |
| `npm run lint`      | ESLint, con reglas de React Hooks y accesibilidad (jsx-a11y).        |
| `npm run format`    | Prettier sobre todo el repo.                                         |
| `npm test`          | Vitest: lógica, interfaz e hidratación.                              |

Para publicar usa **`npm run build:ssg`**, no `npm run build`: es el que escribe
el HTML que leen Google y los previews de WhatsApp e Instagram.

## Configuración

Todo se controla con variables de entorno (ver [`.env.example`](.env.example)) y
**todo es opcional**: sin ninguna variable el sitio funciona y degrada con
elegancia en vez de romperse.

| Variable                   | Sin ella…                                                |
| -------------------------- | -------------------------------------------------------- |
| `VITE_SITE_URL`            | Las URLs canónicas apuntan a `31stfamilyco.com`.         |
| `VITE_NEWSLETTER_ENDPOINT` | El formulario avisa de que la lista no está conectada.   |
| `VITE_CHECKOUT_URL`        | Los botones de compra caen a WhatsApp y, si no, a DM.    |
| `VITE_WHATSAPP_NUMBER`     | Se usa Instagram como último recurso para pedidos.       |
| `VITE_PLAUSIBLE_DOMAIN`    | No se carga ningún script de terceros y no se mide nada. |

### Conectar la captura de emails (lo más urgente)

Antes, el formulario mostraba «Estás dentro» y **tiraba el email a la basura**.
Ahora, si no hay endpoint, lo dice claramente y ofrece escribir por email.

La vía más rápida para que empiece a guardar leads hoy:

1. Crea un formulario en [Formspree](https://formspree.io) (plan gratis).
2. Copia su URL a `VITE_NEWSLETTER_ENDPOINT` en `.env`.
3. Vuelve a compilar.

Sirve cualquier endpoint que acepte un `POST` con
`{ "email": "...", "source": "landing" }`: Brevo, Klaviyo, Mailchimp con proxy o
una función propia en Netlify/Vercel.

### Conectar la compra

Los botones nunca están muertos: `src/lib/commerce.js` resuelve la cadena
checkout del producto → checkout general → WhatsApp → DM de Instagram. Para
vender de verdad, pon un **Shopify Buy Button** o un **Stripe Payment Link** en
`VITE_CHECKOUT_URL`, o una URL por producto en `checkoutUrl` dentro de
`src/data/products.js`.

## Editar el contenido

| Qué                        | Dónde                                          |
| -------------------------- | ---------------------------------------------- |
| Catálogo, precios, estados | [`src/data/products.js`](src/data/products.js) |
| Preguntas frecuentes       | [`src/data/faq.js`](src/data/faq.js)           |
| Señales de confianza       | [`src/data/trust.js`](src/data/trust.js)       |
| Títulos y metas por ruta   | [`src/lib/seo.js`](src/lib/seo.js)             |

Los precios van **en centavos** (`1200` = $12) para poder calcular subtotales y
descuentos sin parsear texto.

### El catálogo

[`src/data/products.js`](src/data/products.js) reconcilia dos fuentes:

- **El estado del negocio** (ids, SKU, stock, estado, colecciones, colorways)
  viene del inventario real. Manda: casi todo está agotado.
- **La fotografía y los precios de referencia** vienen del catálogo publicado en
  31stfamilyco.com.

| Pieza                     |  Precio | Categoría  | Colección    | Estado       |
| ------------------------- | ------: | ---------- | ------------ | ------------ |
| 31st HeadBand (negra)     |     $12 | Head Bands | —            | Próximamente |
| 31st HeadBand (blanca)    |     $12 | Head Bands | —            | Próximamente |
| 31st Signature Cap negra  | agotado | Gorras     | —            | Agotado      |
| 31st Signature Cap verde  | agotado | Gorras     | Second Serie | Agotado      |
| 31st Signature Cap terra. | agotado | Gorras     | Day One      | Agotado      |
| 1/31 Reverse              | agotado | Gorras     | Day One      | Agotado      |
| 2/31 PR Edition           | agotado | Gorras     | Day One      | Agotado      |
| 4/31 Love God             | agotado | Gorras     | Day One      | Agotado      |
| Essential Tees            | agotado | Camisas    | —            | Agotado      |
| 31st Socks v1             | agotado | Medias     | —            | Agotado      |

`price: null` significa agotado y no se publica precio; `referencePrice` guarda
lo que costó, para el JSON-LD y para cuando vuelva el stock.

**Para volver a vender una pieza**: pon su `status` en `'available'` y el
`stock`. La tarjeta cambia sola de «Avísame del restock» a un botón de compra
que resuelve un destino real (checkout propio → tienda → WhatsApp → DM).

### Rutas

| Ruta            | Qué es                                                     |
| --------------- | ---------------------------------------------------------- |
| `/`             | Portada: próximo drop, historia, archivo, preguntas, alta. |
| `/producto/:id` | Una página por pieza. El `id` del catálogo es el slug.     |
| `/privacidad`   | Política de privacidad.                                    |
| `/terminos`     | Términos y condiciones.                                    |

Las **páginas de producto** ([`src/pages/Product.jsx`](src/pages/Product.jsx))
existen para que una pieza tenga una dirección que compartir e indexar: antes el
sitio entero se resumía en tres URLs y una gorra concreta no se podía enlazar.
Cada una se prerenderiza con su título, su descripción, **su propia foto como
tarjeta social** y datos estructurados `Product` + `BreadcrumbList`.

La ficha en modal de la portada se queda como vista rápida —no pierdes el sitio
en la parrilla ni el filtro— y enlaza a la página permanente.

⚠️ El `id` de una pieza en `src/data/products.js` es su URL pública. Cambiarlo
rompe los enlaces ya compartidos y lo que Google tenga indexado: es un
renombrado, no una edición cosmética.

### Fotografía

Los originales descargados de la tienda viven en `originals/` (versionados,
fuera de `public/`) y son la fuente de verdad. `npm run images` genera de cada
uno tres anchos en WebP más un JPEG de respaldo: una tarjeta en móvil baja 20 kB
en vez de los 292 kB del original. `npm run brand` hace lo mismo con la foto del
hero, la de la sección de historia, la tarjeta de Open Graph y los iconos.

Para cambiar una foto: sustituye el archivo en `originals/products/<id>/N.jpg` y
ejecuta `npm run images`.

### El logotipo

La fuente es `originals/site/logo-b.png`: el escudo con «EST. 2024» y «FAMILY
CO.» en arco. Viene **relleno de un gris muy claro** —rgb(220, 219, 220)— sobre
transparente, así que tal cual queda a 1,2:1 de contraste sobre el crema del
sitio, o sea invisible. La silueta buena está en el canal alfa, y de ahí sale
todo: `npm run brand` la usa como máscara y la rellena de un color plano.

De ahí salen cuatro archivos en `public/brand/`:

| Archivo                     | Dónde se usa                             |
| --------------------------- | ---------------------------------------- |
| `logo-wordmark.png`         | Cabecera. El monograma `31ST` en tinta.  |
| `logo-wordmark-light.png`   | Pie, en crema sobre el negro.            |
| `logo-badge.png` / `-light` | El escudo entero, para donde haya sitio. |

**El monograma se aísla por componentes conectados**, no recortando: las patas
del `31ST` bajan hasta el arco de «FAMILY CO.», así que no hay ninguna línea por
la que cortar. El script etiqueta las formas y conserva las grandes —en el
escudo actual, 2 de 19— con un umbral relativo al mayor, para que siga
funcionando si algún día se sustituye el logotipo por otra versión. El build
imprime cuántos componentes conservó: si ese número cambia, mira el resultado.

A la altura de la cabecera el texto en arco mide cuatro píxeles y solo ensucia;
por eso ahí va el monograma y el escudo entero se reserva para el icono y la
tarjeta social.

⚠️ El original es de **500 × 500 px**. Da de sobra para la cabecera y los iconos,
pero si algún día hace falta el logotipo en grande —serigrafía, cartelería— hará
falta el vectorial.

## Fuentes y seguridad

### Fuentes auto-hospedadas

`npm run fonts` descarga las caras que usa el sitio a `public/fonts/` y genera
`src/styles/fonts.css`. Ya no hay ningún `<link>` a Google, por tres razones:

- **Velocidad.** El enlace a `fonts.googleapis.com` obligaba a abrir dos
  conexiones nuevas (DNS + TLS a googleapis y a gstatic) antes de poder pedir el
  primer archivo. Ahora viajan por la conexión que ya está abierta.
- **Privacidad.** Cada visita mandaba la IP y el user-agent a Google sin
  consentimiento. Eso ya no pasa, y la política de privacidad no tiene que
  mencionarlo.
- **Seguridad.** Con las fuentes en casa, `font-src 'self'` basta y la CSP no
  necesita abrir dominios de terceros.

Solo se guardan los subconjuntos `latin` y `latin-ext`: el sitio está en español
y los de cirílico, griego y vietnamita no se pedirían nunca. Son 14 archivos,
236 kB en total, de los que cada visita descarga los cuatro que necesita.

El nombre lleva la versión de la fuente —`manrope-v20-700-latin.woff2`—, así que
se cachean un año como inmutables: si Google publica una revisión, `npm run
fonts` la trae con otro nombre y el navegador la pide de nuevo.

⚠️ Al actualizarlas cambian de nombre, y los `preload` de `index.html` hay que
ajustarlos. Hay una prueba que falla si se olvida.

### Política de seguridad de contenidos

La escribe `npm run build:ssg` en un `<meta>` de cada página, deducida de la
configuración ([`src/lib/csp.js`](src/lib/csp.js)). Sin servicios conectados no
abre ningún host de terceros; al poner `VITE_NEWSLETTER_ENDPOINT` o
`VITE_PLAUSIBLE_DOMAIN`, abre exactamente ese origen y nada más. El build la
imprime al terminar.

Va en `<meta>` y no en una cabecera para que viaje con el HTML y valga igual en
Netlify, en Vercel o arrastrando `dist/` a cualquier sitio. La única directiva
que se pierde es `frame-ancestors`, que no se admite en `<meta>`: de eso se
encarga `X-Frame-Options: DENY` en `public/_headers` y `vercel.json`.

## Pendiente antes de publicar

Ver **[PENDIENTE.md](PENDIENTE.md)**: qué falta, quién lo tiene que aportar y la
lista de comprobación para probar el sitio antes de enseñarlo.

## Despliegue

`npm run build:ssg` deja en `dist/` un sitio estático servible en Netlify,
Vercel o Cloudflare Pages. Incluye `404.html`, `sitemap.xml`, `robots.txt` y las
cabeceras de caché. Cada ruta existe como HTML prerenderizado, así que no hace
falta fallback de SPA.

**`VITE_SITE_URL` decide si el despliegue es indexable.** Si no apunta a
`31stfamilyco.com`, el build lo trata como vista previa y emite `noindex` más un
`robots.txt` que lo bloquea todo, para que una copia en `*.netlify.app` no
compite como contenido duplicado contra el sitio real. El build imprime en qué
modo salió; conviene mirarlo. `VITE_NOINDEX=true|false` lo fuerza.

Los pasos concretos para publicar la vista previa del cliente y para pasarla
luego a producción están en [PENDIENTE.md](PENDIENTE.md).

El workflow de [CI](.github/workflows/ci.yml) ejecuta lint, formato, tests y
build en cada push y pull request.

## Estructura

```
src/
  components/   piezas de interfaz (una por sección)
  pages/        rutas: portada, ficha de producto, privacidad, términos, 404
  data/         contenido editable: catálogo, FAQ, testimonios
  lib/          config, comercio, newsletter, analítica, SEO
  hooks/        metadatos de documento y comportamiento de modal
  styles/       una hoja por sección, importadas desde styles/index.css
  entry-server.jsx  punto de entrada del prerender
  data/product-images.js  GENERADO por npm run images
  data/brand-images.js    GENERADO por npm run brand
scripts/
  prerender.mjs           HTML estático por ruta + sitemap + robots
  optimize-images.mjs     fotos de producto a WebP responsive
  build-brand-assets.mjs  hero, historia, tarjeta OG e iconos
originals/                fotografía original, fuente de verdad
```

## Siguientes pasos posibles

- Páginas de colección (`/coleccion/day-one`), ahora que hay fichas propias.
- Feed de Instagram vía Graph API (no se puede raspar: Instagram lo bloquea).
- Carrito, inventario y checkout nativo en lugar de enlace externo.
- Migrar a TypeScript (por eso `react/prop-types` está desactivado en ESLint).
- Mover el contenido a un CMS para editar sin tocar código.
