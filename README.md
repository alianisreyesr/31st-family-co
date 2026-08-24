# 31st Family Co

Sitio de 31st Family Co en React + Vite, con prerender estático, captura de
emails, analítica opcional y páginas legales.

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

| Script              | Qué hace                                                              |
| ------------------- | --------------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con recarga en caliente.                       |
| `npm run build`     | Build de cliente en `dist/` (SPA, sin prerender).                     |
| `npm run build:ssg` | **Build de producción**: prerenderiza cada ruta + sitemap + robots.   |
| `npm run preview`   | Sirve `dist/` para revisar el build.                                  |
| `npm run images`    | Regenera las fotos de producto (WebP responsive) desde `originals/`.  |
| `npm run brand`     | Regenera hero, historia, tarjeta OG e iconos desde `originals/site/`. |
| `npm run lint`      | ESLint, con reglas de React Hooks y accesibilidad (jsx-a11y).         |
| `npm run format`    | Prettier sobre todo el repo.                                          |
| `npm test`          | Vitest: lógica, interfaz e hidratación.                               |

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

| Qué                        | Dónde                                                  |
| -------------------------- | ------------------------------------------------------ |
| Catálogo, precios, estados | [`src/data/products.js`](src/data/products.js)         |
| Preguntas frecuentes       | [`src/data/faq.js`](src/data/faq.js)                   |
| Señales de confianza       | [`src/data/trust.js`](src/data/trust.js)               |
| Testimonios                | [`src/data/testimonials.js`](src/data/testimonials.js) |
| Títulos y metas por ruta   | [`src/lib/seo.js`](src/lib/seo.js)                     |

Los precios van **en centavos** (`4000` = $40) para poder calcular subtotales y
descuentos sin parsear texto.

### El catálogo es una réplica del real

[`src/data/products.js`](src/data/products.js) reproduce las 8 piezas publicadas
en 31stfamilyco.com con sus nombres, precios y fotografía reales:

| Pieza                  | Precio | Categoría  |
| ---------------------- | -----: | ---------- |
| 1/31 «A new beginning» |    $40 | Gorras     |
| 1/31 Reverse           |    $40 | Gorras     |
| 2/31 PR Edition        |    $40 | Gorras     |
| 3/31 Coffee Lover      |    $40 | Gorras     |
| 4/31 Love God          |    $40 | Gorras     |
| Essential Tees         |    $35 | Camisas    |
| 31st Socks v1          |    $15 | Medias     |
| 31st HeadBands         |    $12 | Head Bands |

`checkoutUrl` de cada pieza apunta a su ficha en la tienda actual, que ya tiene
carrito y checkout, así que los botones de compra llevan a una compra real.

### Fotografía

Los originales descargados de la tienda viven en `originals/` (versionados,
fuera de `public/`) y son la fuente de verdad. `npm run images` genera de cada
uno tres anchos en WebP más un JPEG de respaldo: una tarjeta en móvil baja 20 kB
en vez de los 292 kB del original. `npm run brand` hace lo mismo con la foto del
hero, la de la sección de historia, la tarjeta de Open Graph y los iconos.

Para cambiar una foto: sustituye el archivo en `originals/products/<id>/N.jpg` y
ejecuta `npm run images`.

## Pendiente antes de publicar

1. **Revisar los textos legales.** `src/pages/Privacy.jsx` y
   `src/pages/Terms.jsx` son borradores. Los `[CORCHETES]` (nombre legal,
   dirección, proveedores) son obligatorios de rellenar. Las secciones de
   envíos, devoluciones y garantía ya reproducen la política real publicada:
   **todas las ventas son finales salvo defecto de manufactura, con 7 días para
   reportarlo.** `src/data/policies.test.js` falla el build si alguien vuelve a
   colar una promesa de 30 días.
2. **Envío gratis desde $75: confirmado como irreal.** Se retiró de la barra de
   anuncio, del FAQ y de la franja de confianza. No lo devuelvas sin una
   política publicada que lo respalde.
3. **A qué colección pertenece cada pieza.** «Día UNO» y «Serie DOS» existen en
   su tienda, pero el listado por colección se sirve por API y no está en el
   HTML, así que `collection` quedó en `null` en vez de adivinarlo.
4. **Tallas de `Essential Tees`.** Su propia ficha no trae descripción ni
   tallas; el sitio dice «consúltanos antes de ordenar». Conviene publicarlas.
5. **Correo del dominio.** Hoy el contacto es una cuenta de Gmail. Un
   `hola@31stfamilyco.com` cuesta poco y suma credibilidad en una marca que
   vende.
6. **Testimonios.** `src/data/testimonials.js` está vacío a propósito y la
   sección se oculta sola. Rellénalo solo con mensajes reales y con permiso.
7. **Poner las UTM** en el link de la bio de Instagram para poder medir de dónde
   viene el tráfico.

## Despliegue

`npm run build:ssg` deja en `dist/` un sitio estático servible en Netlify,
Vercel, Cloudflare Pages o GitHub Pages. Incluye `404.html`, `sitemap.xml` y
`robots.txt`. Como hay rutas de cliente, configura el fallback a `index.html`
para las rutas no prerenderizadas.

El workflow de [CI](.github/workflows/ci.yml) ejecuta lint, formato, tests y
build en cada push y pull request.

## Estructura

```
src/
  components/   piezas de interfaz (una por sección)
  pages/        rutas: portada, privacidad, términos, 404
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

- Páginas de producto con URL propia (hoy la ficha es una modal).
- Filtro por categoría en la rejilla, ahora que hay cuatro.
- Feed de Instagram vía Graph API (no se puede raspar: Instagram lo bloquea).
- Carrito, inventario y checkout nativo en lugar de enlace externo.
- Migrar a TypeScript (por eso `react/prop-types` está desactivado en ESLint).
- Mover el contenido a un CMS para editar sin tocar código.
