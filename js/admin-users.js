// js/admin-users.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("admin-users");
  if (!contenedor) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  if (usuarios.length === 0) {
    contenedor.innerHTML = "<p>No hay usuarios registrados.</p>";
    return;
  }

  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>RUN</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Región</th>
        <th>Comuna</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector("tbody");

  usuarios.forEach((u, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.run || ""}</td>
      <td>${(u.firstName || "")} ${(u.lastName || "")}</td>
      <td>${u.email || ""}</td>
      <td>${u.role || ""}</td>
      <td>${u.region || ""}</td>
      <td>${u.comuna || ""}</td>
      <td>
        <button class="btn-small btn-edit" data-index="${i}">Editar</button>
        <button class="btn-small btn-del" data-index="${i}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  contenedor.innerHTML = "";
  contenedor.appendChild(tabla);

  contenedor.addEventListener("click", e => {
    // Eliminar usuario
    if (e.target.classList.contains("btn-del")) {
      const idx = parseInt(e.target.dataset.index, 10);
      if (!Number.isFinite(idx)) return;
      if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
      const usuariosAct = JSON.parse(localStorage.getItem("usuarios") || "[]");
      usuariosAct.splice(idx, 1);
      localStorage.setItem("usuarios", JSON.stringify(usuariosAct));
      // recargar la lista sin refrescar toda la página
      contenedor.dispatchEvent(new Event('refreshList'));
    }

    // Editar usuario -> guardamos índice y vamos al formulario de usuario
    if (e.target.classList.contains("btn-edit")) {
      const idx = parseInt(e.target.dataset.index, 10);
      if (!Number.isFinite(idx)) return;
      localStorage.setItem("editUserIndex", idx);
      window.location.href = "user-new.html";
    }
  });

  // Manejo sencillo para recargar la tabla tras eliminación (sin reload completo)
  contenedor.addEventListener('refreshList', () => {
    const newUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (newUsuarios.length === 0) {
      contenedor.innerHTML = "<p>No hay usuarios registrados.</p>";
      return;
    }
    // reconstruir tbody
    const newTbody = document.createElement('tbody');
    newUsuarios.forEach((u, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.run || ""}</td>
        <td>${(u.firstName || "")} ${(u.lastName || "")}</td>
        <td>${u.email || ""}</td>
        <td>${u.role || ""}</td>
        <td>${u.region || ""}</td>
        <td>${u.comuna || ""}</td>
        <td>
          <button class="btn-small btn-edit" data-index="${i}">Editar</button>
          <button class="btn-small btn-del" data-index="${i}">Eliminar</button>
        </td>
      `;
      newTbody.appendChild(tr);
    });
    // reemplazar tbody en la tabla actual
    const tablaExistente = contenedor.querySelector('table');
    if (tablaExistente) {
      tablaExistente.replaceChild(newTbody, tablaExistente.querySelector('tbody'));
    } else {
      contenedor.innerHTML = "";
      contenedor.appendChild(tabla);
    }
  });
});
