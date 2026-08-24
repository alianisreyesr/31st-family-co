# 31st Family Co

Sitio de 31st Family Co en React + Vite: lista de espera del próximo drop,
archivo de piezas agotadas, prerender estático, captura de emails, analítica
opcional y páginas legales.

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

### Fotografía

Los originales descargados de la tienda viven en `originals/` (versionados,
fuera de `public/`) y son la fuente de verdad. `npm run images` genera de cada
uno tres anchos en WebP más un JPEG de respaldo: una tarjeta en móvil baja 20 kB
en vez de los 292 kB del original. `npm run brand` hace lo mismo con la foto del
hero, la de la sección de historia, la tarjeta de Open Graph y los iconos.

Para cambiar una foto: sustituye el archivo en `originals/products/<id>/N.jpg` y
ejecuta `npm run images`.

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
