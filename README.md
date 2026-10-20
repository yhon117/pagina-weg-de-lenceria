# ELACE Lencería Boutique — Página Web de Lencería

Sitio web de la boutique **ELACE LENCERÍA Y BOUTIQUE S.A.S** (Santa Marta, Magdalena — Centro Comercial Arrecife), construido sobre un plan de negocio real: catálogo de productos, carrito de compras y sistema de compra simulado.

## Características

- **Catálogo** con 12 productos en 4 categorías: Pantis, Brasieres, Conjuntos y Babydolles
- **Precios del plan de negocio** (COP con IVA 19% incluido y desglosado)
- **Filtros por categoría** y **buscador** en vivo
- **Detalle de producto** con tallas (XS–XL) y cantidad
- **Carrito de compras** lateral con persistencia en `localStorage`
- **Código de descuento** `ELACE10` (10% off simulado)
- **Compra simulada**: formulario validado → procesamiento → número de orden `ELACE-2026-XXXX` (sin cobro real)
- **Secciones del plan de negocio**: Misión, Visión, proveedores, contacto por WhatsApp/Instagram/Facebook
- **Diseño responsive** en negro y dorado (Playfair Display + Montserrat)
- **Fotos de stock** con imagen de respaldo local si alguna URL falla

## Tecnologías

- HTML5, CSS3, JavaScript ES6 (módulos)
- [Webpack 5](https://webpack.js.org/) para desarrollo y build
- HTML5 Boilerplate como base

## Cómo ejecutar

```bash
npm.cmd install     # instalar dependencias (solo la primera vez)
npm.cmd run start   # desarrollo en http://localhost:8080
npm.cmd run build   # producción en dist/
```

> En Windows se usa `npm.cmd` porque PowerShell bloquea `npm.ps1` por política de ejecución.

También puedes abrir `dist/index.html` directamente en el navegador (las fotos de stock requieren internet).

## Estructura

```
├── index.html            # Página principal
├── css/style.css         # Estilos H5BP + estilos de la boutique
├── js/
│   ├── app.js            # Orquestador UI (catálogo, filtros, modales)
│   ├── products.js       # Datos de productos, categorías y precios
│   ├── cart.js           # Carrito + localStorage + totales
│   └── checkout.js       # Compra simulada
├── img/placeholder.svg   # Imagen de respaldo
└── dist/                 # Build de producción (generado)
```

## Aviso

Sitio de demostración: la compra es **simulada**, no se realiza ningún cobro ni se envían datos a ningún servidor.

---

ELACE Lencería Boutique S.A.S © 2026
