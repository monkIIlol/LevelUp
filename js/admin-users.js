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
      <td>${u.run}</td>
      <td>${u.firstName} ${u.lastName}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.region}</td>
      <td>${u.comuna}</td>
      <td>
        <button class="btn-small btn-del" data-index="${i}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  contenedor.appendChild(tabla);

  contenedor.addEventListener("click", e => {
    if (e.target.classList.contains("btn-del")) {
      const idx = parseInt(e.target.dataset.index, 10);
      if (!Number.isFinite(idx)) return;
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      usuarios.splice(idx, 1);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      location.reload();
    }
  });
});
