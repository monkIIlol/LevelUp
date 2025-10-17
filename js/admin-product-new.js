document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-product");
  if (!form) return;

  const productos = JSON.parse(localStorage.getItem("productos") || "[]");

  // Obtener índice del producto a editar (si existe)
  const editIndex = parseInt(localStorage.getItem("editProductIndex"), 10);

  const editIndexNum = editIndex !== null ? parseInt(editIndex, 10) : null;

  // Cargar datos si estamos editando
  if (editIndexNum !== null && productos[editIndexNum]) {
    const p = productos[editIndexNum];
    form.code.value = p.code;
    form.name.value = p.name;
    form.description.value = p.description;
    form.price.value = p.price;
    form.stock.value = p.stock;
    form.stockCritical.value = p.stockCritical || "";
    form.category.value = p.category;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Crear objeto producto
    const producto = {
      code: form.code.value.trim(),
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: parseFloat(form.price.value),
      stock: parseInt(form.stock.value, 10),
      stockCritical: parseInt(form.stockCritical.value, 10) || 0,
      category: form.category.value,
      imageName: form.image.files && form.image.files[0] ? form.image.files[0].name : null,
      createdAt: new Date().toISOString()
    };

    // Editar o agregar
    if (editIndexNum !== null) {
      productos[editIndexNum] = producto;
      localStorage.removeItem("editProductIndex");
      alert("Producto actualizado ✅");
    } else {
      productos.push(producto);
      alert("Producto agregado ✅");
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    window.location.href = "products.html";
  });
});
