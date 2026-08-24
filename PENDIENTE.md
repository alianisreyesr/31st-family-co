# Estado, pruebas y pendientes

Documento de trabajo. Objetivo inmediato: **una vista previa que el cliente
pueda ver y aprobar, sin tocar el DNS de `31stfamilyco.com`.**

Última revisión: 24 de agosto de 2026.

## Qué es el sitio ahora

Una **lista de espera**, no una tienda. El inventario está agotado salvo las dos
cintas, que son el próximo drop, así que la conversión es entrar en la Family
List y no comprar. La portada va: próximo drop → historia → archivo de piezas
agotadas → promesa → preguntas → alta en la lista.

Ninguna pieza se anuncia como disponible y ningún botón dice «comprar»: hay un
test que lo impide. Si vuelve a haber stock, basta con poner `status:
'available'` y `stock` en `src/data/products.js`; la tarjeta cambia sola a un
botón de compra que resuelve un destino real.

---

## 1. Publicar la vista previa para el cliente

El DNS no se toca. Se publica en la URL que da el host y se enseña esa.

```bash
npm ci
VITE_SITE_URL=https://LA-URL-QUE-TE-DE-EL-HOST npm run build:ssg
```

El build imprime al final en qué modo salió:

```
Modo VISTA PREVIA: noindex + robots.txt bloqueado. No competirá con el sitio real.
```

**Comprueba que dice VISTA PREVIA.** Si dice PRODUCCIÓN, se te olvidó
`VITE_SITE_URL` y esa copia sí es indexable: Google la trataría como contenido
duplicado del sitio real del cliente y puede perjudicar a los dos.

Se deduce del dominio, así que no hay que acordarse de ninguna otra variable.
`VITE_NOINDEX=true|false` lo fuerza si hace falta.

### En Netlify

Con Git: conecta el repo. `netlify.toml` ya trae el comando y la carpeta.
Añade `VITE_SITE_URL` en _Site settings → Environment variables_ con la URL
`*.netlify.app` que te asignen.

Sin Git, para enseñarlo en cinco minutos: arrastra la carpeta `dist/` a
[app.netlify.com/drop](https://app.netlify.com/drop).

### En Vercel

`vercel.json` ya trae comando, carpeta y cabeceras. Añade `VITE_SITE_URL` con la
URL `*.vercel.app`.

### Cuando el cliente apruebe

1. Cambia `VITE_SITE_URL` a `https://31stfamilyco.com` y vuelve a compilar. El
   build debe decir **PRODUCCIÓN**.
2. Apunta el DNS al host nuevo.
3. Revisa que `https://31stfamilyco.com/robots.txt` diga `Allow: /` y no
   `Disallow: /`. Si quedó el robots de la vista previa, el sitio desaparece de
   Google.
4. Comparte el enlace en WhatsApp para ver que sale la tarjeta con la foto.

---

## 2. Cómo probarlo

```bash
npm ci
npm run dev
```

### Portada

- [ ] El hero muestra la foto de las gorras en la verja, con el sello EST. 2024.
- [ ] Debajo del hero va **El próximo capítulo** con las **2 cintas**
      (negra y blanca, con fotos distintas), marcadas «Próximamente».
- [ ] Más abajo, **Lo que se fue, dejó marca** con las **8 piezas agotadas**.
- [ ] Ninguna tarjeta con el placeholder geométrico «31ST».
- [ ] Ningún botón dice «comprar»: las acciones son «Quiero acceso» y
      «Avísame del restock».
- [ ] Las cintas muestran «Próximo drop» donde iría el precio; el archivo,
      «Agotado».

### Filtro del archivo

- [ ] `Day One` deja 4 · `Second Serie` 1 · `Gorras` 6 · `Camisas` 1 · `Medias` 1.
- [ ] `Todos` vuelve a 8.
- [ ] El texto de la derecha cambia a «4 de 8 piezas · Day One».

### Lista de espera

- [ ] «Quiero acceso» en una cinta baja al formulario, **pone el foco en el
      campo de email** y el texto dice «Te avisaremos primero cuando 31st
      HeadBand esté disponible».
- [ ] «Avísame del restock» en una pieza del archivo hace lo mismo.
- [ ] El mismo botón dentro de la ficha de producto cierra la modal y hace lo
      mismo.

### Ficha de producto

- [ ] «Ver detalles» abre la modal con la foto grande.
- [ ] En las piezas con varias fotos, las miniaturas cambian la principal.
- [ ] En **Essential Tees** aparecen las tallas **XS S M L XL**.
- [ ] En una gorra aparece «Talla única ajustable» y **ninguna** talla de camisa.
- [ ] `Escape` cierra y el foco vuelve al botón que la abrió.

### Family List

- [ ] Con un email válido responde que **la lista no está conectada** y ofrece
      escribir por correo. Eso es lo correcto hasta el punto 3.1: la versión
      anterior decía «Estás dentro» y tiraba el email.
- [ ] Con `ana@` avisa de que el email está incompleto.

### Políticas

- [ ] En Preguntas frecuentes: «**Todas las ventas son finales**» y «**7 días**»
      para defectos.
- [ ] En **ningún** sitio aparece «30 días» ni «envío gratis».
- [ ] `/privacidad` y `/terminos` cargan. `/loquesea` da el 404.

### Teclado y móvil

- [ ] `Tab` desde arriba: aparece «Saltar al contenido».
- [ ] Se ve **siempre** dónde está el foco, incluido el campo de email.
- [ ] A menos de 860 px: menú hamburguesa, `Escape` lo cierra.
- [ ] Al pasar el hero aparece abajo la barra fija de compra.

### Build

```bash
npm run build:ssg && npm run preview
```

- [ ] «Ver código fuente» muestra los nombres de los productos en el HTML, no un
      `<div id="root">` vacío. Es lo que leen Google y los previews de WhatsApp.
- [ ] Sin errores en la consola del navegador.

### Automático

```bash
npm run lint && npm test && npm run build:ssg
```

66 pruebas. Cubren, entre otras cosas: que nada se anuncie como disponible sin
stock, que no reaparezca la promesa de 30 días ni el envío gratis, que el
catálogo no invente tallas, que las dos cintas usen fotos distintas, que el
JSON-LD declare `SoldOut` y no `InStock`, que la hidratación no falle en ninguna
ruta, y que una vista previa nunca salga indexable.

---

## 3. Lo que falta

### 3.1 Conectar la Family List — bloqueante, 10 minutos

Es lo único que aún pierde clientes cada día. Crea un formulario en
[Formspree](https://formspree.io) (plan gratis) y pon su URL en
`VITE_NEWSLETTER_ENDPOINT`. Sirve cualquier endpoint que acepte un `POST` con
`{ "email": "...", "source": "landing" }`.

### 3.2 Cuatro datos para las páginas legales — bloqueante

Están marcados entre corchetes:

| Dato                       | Dónde                                          |
| -------------------------- | ---------------------------------------------- |
| Nombre legal de la empresa | `src/pages/Privacy.jsx`, `src/pages/Terms.jsx` |
| Dirección postal           | `src/pages/Privacy.jsx`, `src/pages/Terms.jsx` |
| Proveedor de email         | `src/pages/Privacy.jsx`                        |
| Proveedor de analítica     | `src/pages/Privacy.jsx`                        |

Sin nombre legal ni dirección, la política de privacidad no cumple CAN-SPAM.
Conviene que un abogado lea las dos páginas antes de publicar: las secciones de
envíos, devoluciones y garantía ya reproducen la política real publicada, pero
el resto es borrador.

### 3.3 `cap-green` y `reverse-1-31` parecen la misma gorra — decisión pendiente

En el inventario hay dos entradas para lo que las fotos muestran como **la misma
gorra verde**: `cap-green` (31st Signature Cap, Verde / Blanco, Second Serie) y
`reverse-1-31` (1/31 Reverse, Verde profundo / Suede claro, Day One).

Se conservan las dos porque el inventario es vuestro y no me corresponde borrar
un registro, pero **ahora mismo la misma gorra sale dos veces en el archivo**.
Conviene resolverlo antes de enseñárselo al cliente: o son dos piezas distintas
y hace falta diferenciar las fotos, o es una y sobra una entrada.

Las colecciones **Day One** y **Second Serie** ya están puestas, con filtro
propio, tal como venían en el inventario.

### 3.4 Decisiones del cliente

- **Analítica**: sin `VITE_PLAUSIBLE_DOMAIN` no se mide nada y no se carga ningún
  script de terceros. El código ya está instrumentado.
- **Correo del dominio**: hoy el contacto es una cuenta de Gmail. Un
  `hola@31stfamilyco.com` cuesta poco y suma credibilidad.
- **Tallas de medias y head bands**: sin confirmar, así que `sizes` es `null`.
- **Precio de las cintas en el lanzamiento**: está puesto en $12, heredado del
  inventario. Confirmar antes de anunciarlo.
- **UTMs** en el enlace de la bio de Instagram, para saber qué tráfico llega.

---

## 4. El sitio actual, si se mantiene en paralelo

Cuatro fallos detectados en `31stfamilyco.com` (Hostinger), arreglables desde su
panel sin tocar código:

1. **`lang="en-US"` en todas las páginas** con contenido en español. Google la
   clasifica como inglesa y los lectores de pantalla la pronuncian con fonética
   inglesa.
2. **Metadatos cruzados**: `/gorras-31st-family-co` lleva el título «31st Family
   Co Head Bands Online» y una descripción sobre _sports headbands_. La página de
   gorras está indexada como página de cintas.
3. **Títulos y descripciones en inglés** en un sitio en español para Puerto Rico.
4. **Marca duplicada** en el título de `/tienda-31st-family-co`:
   «… | 31st Family Co | 31st Family Co».

---

## 5. Backlog

- Páginas de producto con URL propia (hoy la ficha es una modal).
- Carrito y checkout propios para cuando vuelva a haber stock.
- Prueba social: fotos de la comunidad o reseñas reales, con permiso.
- Feed de Instagram vía Graph API. **No se puede raspar**: Instagram devuelve
  429 sin autenticación. Necesita un token de la cuenta.
- Migrar a TypeScript (por eso `react/prop-types` está desactivado en ESLint).
- Auto-hospedar las fuentes y añadir una CSP.
