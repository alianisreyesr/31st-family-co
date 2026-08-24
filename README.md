# 31st Family Co

Storefront inicial para 31st Family Co, construido con React y Vite. La interfaz se enfoca en una experiencia streetwear monocromática con catálogo, archivo de drops y una futura operación de inventario sencilla.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Catálogo

Los datos iniciales están en `src/data/catalog.js`.

- `status: 'available'`: producto disponible.
- `status: 'sold-out'`: aparece en el archivo y ofrece aviso de restock.
- `sku`: identificador único que se mantendrá al conectar inventario.
- `stock`: valor provisional; se sustituirá por el inventario en Medusa.

## Fotos originales

Consulta `public/images/README.md` para las carpetas y nombres exactos que debe usar cada foto. La app ya espera esos paths y muestra un placeholder elegante hasta que el archivo exista.

## Operación futura

La versión de producción se conectará a:

- Medusa + PostgreSQL para productos, inventario, órdenes y reportes.
- Stripe para pagos.
- Regiones de envío: Puerto Rico y Estados Unidos.

El admin para la marca se simplificará a Inicio, Inventario, Órdenes, Productos y Reportes. El inventario será la fuente única de verdad y cada ajuste guardará un historial.

## Próximos pasos

1. Subir las fotografías siguiendo la guía en `public/images/README.md`.
2. Confirmar cantidad inicial de cada variante de HeadBand y de futuros drops.
3. Crear Medusa, PostgreSQL y el dashboard 31st Admin.
4. Conectar Stripe en modo prueba.
5. Desplegar el storefront en Vercel.
