
// Update cart count on load
document.addEventListener('DOMContentLoaded', () => {
  const countEl = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (countEl) countEl.textContent = cart.reduce((a,i)=>a+i.qty,0);

  // Fill featured and categories if present
  if (document.getElementById('featured-grid')) {
    renderFeatured();
  }
  if (document.getElementById('filter-category')) {
    fillCategories();
    bindProductsFilters();
    renderProducts();
    bindCart();
  }
  if (document.getElementById('product-detail')) {
    renderProductDetail();
    bindCart();
  }
  // Regions/Comunas
  if (document.getElementById('region-select')) {
    fillRegions('#region-select', '#comuna-select');
  }
  if (document.getElementById('admin-region')) {
    fillRegions('#admin-region', '#admin-comuna');
  }
});

const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

toggleBtn?.addEventListener('click', () => {
  nav.classList.toggle('show');
});

