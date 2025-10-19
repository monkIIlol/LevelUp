document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("admin-products");
  if (!contenedor) return;

  let productos = JSON.parse(localStorage.getItem("productos") || "[]");

  function money(clp) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
  }

  function renderProductos() {
    if (productos.length === 0) {
      contenedor.innerHTML = "<p>No hay productos registrados.</p>";
      return;
    }

    const tabla = document.createElement("table");
    // 1. AÑADIMOS LA CABECERA "ACCIONES" A LA TABLA
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
      // 2. AÑADIMOS LA CELDA (TD) CON LOS BOTONES A CADA FILA
      tr.innerHTML = `
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${money(p.price)}</td>
                <td>${p.stock || 0}</td>
                <td>${p.category}</td>
                <td>
                    <button class="btn-edit" data-index="${i}">Editar</button>
                    <button class="btn-del" data-index="${i}">Eliminar</button>
                </td>
            `;
      tbody.appendChild(tr);
    });

    contenedor.innerHTML = "";
    contenedor.appendChild(tabla);
  }

  renderProductos();

  // Acciones (Esta parte ya estaba bien)
  contenedor.addEventListener("click", e => {
    // Aseguramos que el índice sea un número
    const idx = e.target.dataset.index ? parseInt(e.target.dataset.index, 10) : -1;
    if (idx === -1) return;

    if (e.target.classList.contains("btn-del")) {
      if (confirm("¿Seguro que quieres eliminar este producto?")) {
        productos.splice(idx, 1);
        localStorage.setItem("productos", JSON.stringify(productos));
        renderProductos();
      }
    }
    if (e.target.classList.contains("btn-edit")) {
      localStorage.setItem("editProductIndex", idx);
      window.location.href = "product-new.html";
    }
  });
});