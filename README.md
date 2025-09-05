
# Level‑Up Gamer — Starter

Este starter cumple con los entregables de la **Evaluación 1**: HTML semántico, navegación completa, CSS externo, validaciones con JavaScript, carrito con `localStorage` y vistas básicas de administrador.

## Cómo ejecutar
Abre `index.html` en tu navegador. Todos los assets son locales. (El video es un placeholder).

## Dónde está cada evidencia

- **IE1.1.1 (HTML actual + hipervínculos, imágenes, botones, videos, navegación, formularios, footer)**  
  Páginas: `index.html`, `products.html`, `product.html`, `register.html`, `login.html`, `blog*.html`, `about.html`, `contact.html`.  
  Incluyen `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<img>`, `<a>`, `<button>`, `<video>`, formularios y elementos de navegación.

- **IE1.1.2 (CSS externo personalizado)**  
  Archivo: `css/styles.css` enlazado desde todas las páginas con `<link rel="stylesheet" …>`.

- **IE1.2.1 (Validaciones con JS + sugerencias/mensajes personalizados)**  
  Archivo: `js/validate.js`. Maneja `login`, `contacto`, `registro`, `admin product`, `admin user` con mensajes en `.error` y hints.

- **IE1.3.1 / IE1.1.3 (Explicación de estructura y semántica)**  
  Ver `REPORT.md` sección 1.

- **IE1.1.4 (Uso de CSS externo para UI atractiva y mantenible)**  
  Ver `REPORT.md` sección 2.

- **IE1.2.2 (Demostración de validaciones JS)**  
  Ver `REPORT.md` sección 3 (incluye capturas que puedes pegar).

- **IE1.3.1/IE1.3.2 (Cambios coherentes al repositorio remoto + colaboración)**  
  Ver `GIT-GUIA.md`: comandos, convención de commits, flujo de ramas y reparto de tareas.

- **Carrito y `localStorage` (requisito adicional)**  
  `js/products.js` + `products.html` y `product.html`. Persistencia en `localStorage` clave `cart`.

## Estructura
```
.
├─ index.html
├─ products.html
├─ product.html
├─ register.html
├─ login.html
├─ blog.html
├─ blog-detalle.html
├─ blog-detalle-2.html
├─ about.html
├─ contact.html
├─ admin/
│  ├─ index.html
│  ├─ products.html
│  ├─ product-new.html
│  ├─ users.html
│  └─ user-new.html
├─ css/styles.css
├─ js/main.js
├─ js/products.js
├─ js/validate.js
├─ js/admin.js
├─ assets/logo.svg
├─ assets/hero.jpg (placeholder)
└─ assets/intro.mp4 (placeholder)
```

prueba
