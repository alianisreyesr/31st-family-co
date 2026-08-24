# Imágenes

Esta carpeta ya no se usa. Las fotos de producto viven en `public/products/` y
se generan automáticamente.

## Cómo cambiar o añadir una foto

1. Pon el original (JPEG, lo más grande que tengas) en
   `originals/products/<id-del-producto>/N.jpg`, numerando desde `1`. El `N`
   decide el orden en la galería, y `1.jpg` es la foto de portada.
2. Ejecuta `npm run images`.

El script genera de cada original tres anchos en WebP más un JPEG de respaldo,
y escribe `src/data/product-images.js` con las medidas reales de cada archivo
(que es lo que permite reservar el hueco en el layout y evitar saltos al
cargar). Los originales se quedan versionados en `originals/`, fuera de
`public/`, para no publicar nunca una foto sin optimizar.

Para la foto del hero, la de la sección de historia, la tarjeta de Open Graph y
los iconos: pon los originales en `originals/site/` y ejecuta `npm run brand`.
