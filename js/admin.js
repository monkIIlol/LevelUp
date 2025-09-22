
document.addEventListener('DOMContentLoaded', ()=>{
  const adminProducts = document.getElementById('admin-products');
  if(adminProducts){
    adminProducts.innerHTML = '<table><thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th></tr></thead><tbody>' +
      products.map(p=>`<tr><td>${p.code}</td><td>${p.name}</td><td>${money(p.price)}</td><td>${Math.floor(Math.random()*20)}</td></tr>`).join('')
      + '</tbody></table>';
  }

  // Fill categories in product form if present
  const catSel = document.getElementById('admin-category');
  if(catSel){
    catSel.innerHTML = '<option value="">Selecciona…</option>' + categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  }
});
