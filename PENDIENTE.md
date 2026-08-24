# Estado, pruebas y pendientes

Documento de trabajo. Objetivo inmediato: **una vista previa que el cliente
pueda ver y aprobar, sin tocar el DNS de `31stfamilyco.com`.**

Última revisión: 24 de agosto de 2026.

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

- [ ] El hero muestra la foto de las gorras en la verja, no un degradado liso.
- [ ] Se ven **8 piezas** con foto real, categoría, precio y estado.
- [ ] Precios: cinco gorras a **$40**, Essential Tees **$35**, Socks **$15**,
      HeadBands **$12**.
- [ ] Ninguna tarjeta con el placeholder geométrico «31ST».

### Filtro por categoría

- [ ] `Gorras` deja 5 piezas · `Camisas` 1 · `Medias` 1 · `Head Bands` 1.
- [ ] `Todo` vuelve a 8.
- [ ] El texto de la derecha cambia a «5 de 8 piezas · Gorras».

### Ficha de producto

- [ ] «Ver detalles» abre la modal con la foto grande.
- [ ] En las piezas con varias fotos, las miniaturas cambian la principal.
- [ ] En **Essential Tees** aparecen las tallas **XS S M L XL** y el aviso de
      que las ventas son finales.
- [ ] En una gorra aparece «Talla única ajustable» y **ninguna** talla de camisa.
- [ ] `Escape` cierra y el foco vuelve al botón que la abrió.

### Comprar

- [ ] Todos los botones de compra abren `31stfamilyco.com` en una pestaña nueva.
- [ ] El de una pieza abre **su** ficha; el de la colección, la tienda.
- [ ] Ninguno se queda sin hacer nada.

### Family List

- [ ] Con un email válido responde que **la lista no está conectada** y ofrece
      escribir por correo. Eso es lo correcto hasta el punto 3.1: antes decía
      «Estás dentro» y tiraba el email.
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

63 pruebas. Cubren, entre otras cosas: que ningún botón de compra quede sin
destino, que no reaparezca la promesa de 30 días ni el envío gratis, que el
catálogo no invente tallas, que la hidratación no falle en ninguna ruta, y que
una vista previa nunca salga indexable.

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

### 3.3 Reparto entre «Día UNO» y «Serie DOS» — falta el dato

`collection` está en `null` en las 8 piezas. Las dos colecciones existen en la
tienda, pero su listado se sirve por API y no viene en el HTML, así que no se
puede deducir. Con el reparto se rellena y se añade el filtro por colección: el
mecanismo del filtro ya está montado.

### 3.4 Decisiones del cliente

- **Analítica**: sin `VITE_PLAUSIBLE_DOMAIN` no se mide nada y no se carga ningún
  script de terceros. El código ya está instrumentado.
- **Correo del dominio**: hoy el contacto es una cuenta de Gmail. Un
  `hola@31stfamilyco.com` cuesta poco y suma credibilidad.
- **Tallas de medias y head bands**: sin confirmar, así que `sizes` es `null`.
- **Testimonios**: `src/data/testimonials.js` está vacío y la sección se oculta
  sola. Solo mensajes reales y con permiso.
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
- Filtro por colección, cuando llegue el dato de 3.3.
- Carrito y checkout propios en lugar de enlazar a la tienda actual.
- Feed de Instagram vía Graph API. **No se puede raspar**: Instagram devuelve
  429 sin autenticación. Necesita un token de la cuenta.
- Migrar a TypeScript (por eso `react/prop-types` está desactivado en ESLint).
- Auto-hospedar las fuentes y añadir una CSP.
