document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("admin-products");
  if (!contenedor) return;

  const productos = JSON.parse(localStorage.getItem("productos") || "[]");

  if (productos.length === 0) {
    contenedor.innerHTML = "<p>No hay productos registrados.</p>";
    return;
  }

  function money(clp) { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp); }

  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Categoría</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabla.querySelector("tbody");

  productos.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td>${money(p.price)}</td>
      <td>${p.stock}</td>
      <td>${p.category}</td>
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
      const productos = JSON.parse(localStorage.getItem("productos") || "[]");
      productos.splice(idx, 1);
      localStorage.setItem("productos", JSON.stringify(productos));
      location.reload();
    }
  });
});
