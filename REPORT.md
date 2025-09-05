
# REPORT — Evaluación 1

## 1) Estructura y etiquetado HTML (IE1.1.3)
- Semántica usada: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Accesibilidad: `aria-label` en navegación y carrito; `aria-live` para contador del carrito; `alt` en imágenes; `label` asociado a `input`.
- Navegación: menú principal persistente con hipervínculos a todas las vistas; footer con enlaces claves.
- Elementos solicitados: imágenes, botones, videos, formularios y elementos de navegación.

## 2) Hojas de estilo CSS externas (IE1.1.4)
- `css/styles.css` centraliza el diseño (paleta, tipografía Roboto/Orbitron, layout responsive).
- Razones para externalizar: caché, separación de responsabilidades, mantenibilidad, reutilización en múltiples páginas.
- Principios: grid responsivo, contraste alto en tema oscuro, botones con jerarquía visual, componentes reutilizables (`.card`, `.btn`).

## 3) Validaciones por JavaScript (IE1.2.2)
- Formularios validados:
  - **Login**: email permitido y password 4–10.
  - **Contacto**: nombre requerido, email permitido, comentario requerido máx 500.
  - **Registro (tienda y admin)**: RUN chileno sin puntos/guion con dígito verificador; nombres y apellidos con límites; rol, región y comuna; dirección máx 300; email dominios permitidos.
  - **Producto (admin)**: código min 3; nombre máx 100; descripción máx 500; precio ≥ 0; stock entero ≥ 0; stock crítico entero ≥ 0; categoría requerida.
- UX: mensajes `.error` contextuales + `hint` bajo campos.
- Técnica: listeners a `submit`, funciones `emailValido`, `validarRUN`, helpers `showError/clearError`.

## 4) Repositorio remoto y colaboración (IE1.3.2)
- **Convención de commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:` con mensajes claros en español.
- **Flujo**: rama `main` protegida; ramas por tarea: `feat/ui-home`, `feat/validaciones`, `feat/cart`, `docs/report`.
- **Distribución**: Dev A (HTML/CSS), Dev B (JS y validaciones), Dev C (admin y cart), Dev D (documentación y pruebas).
- **Pull Requests**: revisión por 1 compañero mínimo; checklist de criterios de aceptación.

## 5) Evidencias
- Capturas sugeridas: Home, Productos, Detalle, Registro (con error RUN), Contacto (con error comentario), Admin producto (con error precio).
- Enlace GitHub y commit log mostrando cambios coherentes.

> Notas: Los dominios de correo aceptados y reglas de validación provienen del enunciado de la evaluación.
