
# GIT-GUIA

## Configuración
```bash
git init
git branch -M main
git remote add origin https://github.com/usuario/levelup-gamer.git
```

## Convención de commits
- `feat: agregar validación RUN en registro`
- `fix: corregir borde de inputs en focus`
- `docs: completar sección IE1.1.4 en REPORT.md`
- Mensaje en imperativo, breve y coherente.

## Flujo colaborativo
1. Crear issue/tarea.
2. Crear rama: `git checkout -b feat/validaciones-formularios`.
3. Commits pequeños y descriptivos.
4. Push: `git push -u origin feat/validaciones-formularios`.
5. Abrir PR, asignar revisor, describir cambios y criterios de aceptación.
6. Merge squash o merge commit según políticas.

## Distribución de tareas (ejemplo)
- A: HTML/CSS de tienda.
- B: Validaciones JS (login/registro/contacto).
- C: Carrito + `localStorage`.
- D: Admin (productos/usuarios) + documentación.

## Comandos útiles
```bash
git status
git add .
git commit -m "feat: carrito con localStorage y contador en header"
git push
git log --oneline --decorate --graph --all
```
