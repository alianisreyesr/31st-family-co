# 31st Family Co

Storefront inicial para 31st Family Co, construido con React y Vite. La versión actual está en modo **próximo drop**: no acepta pagos ni permite compras hasta que exista inventario físico confirmado.

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

## Modo próximo drop

Los productos disponibles se controlan desde `src/data/catalog.js`.

- `status: 'upcoming'`: muestra la pieza en “Próximamente” y dirige a la lista de acceso anticipado.
- `status: 'sold-out'`: muestra la pieza en el archivo y permite solicitar aviso de restock.
- `stock: 0`: evita que se active venta accidental.

Para activar una pieza cuando exista inventario real:

1. Actualizar su `stock` a la cantidad física.
2. Cambiar `status` a `available`.
3. Conectar el catálogo con Medusa para que el inventario sea dinámico.
4. Conectar Stripe y probar una orden antes de publicar compra real.

## Fotos originales

Consulta `public/images/README.md` para las carpetas y nombres exactos de las fotografías.

## Operación futura

La versión de producción se conectará a Medusa + PostgreSQL para inventario, órdenes y reportes; Stripe para pagos; y envíos para Puerto Rico y Estados Unidos. El admin se simplificará a Inicio, Inventario, Órdenes, Productos y Reportes.
