
// Update cart count on load
document.addEventListener('DOMContentLoaded', () => {
  const countEl = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (countEl) countEl.textContent = cart.reduce((a, i) => a + i.qty, 0);

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
  // Verifica si hay usuario logueado
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');
const navUser = document.getElementById('nav-user');
const userProfile = document.getElementById('user-profile');

if (currentUser) {
  if (navLogin) navLogin.style.display = 'none';
  if (navRegister) navRegister.style.display = 'none';
  if (navUser) {
    navUser.style.display = 'inline'; // 'inline' o 'block' según diseño
    if (userProfile) userProfile.textContent = currentUser.firstName || currentUser.email;
  }
} else {
  if (navUser) navUser.style.display = 'none';
  if (navLogin) navLogin.style.display = 'inline';
  if (navRegister) navRegister.style.display = 'inline';
}

// Botón de logout
const logoutBtn = document.getElementById('logout-btn');
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  location.reload();
});



});

const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

toggleBtn?.addEventListener('click', () => {
  nav.classList.toggle('show');
});

const userProfile = document.getElementById('userProfile');
const logoutBtn = document.getElementById('logoutBtn');

userProfile.addEventListener('click', () => {
  userProfile.classList.toggle('open');
});

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // Borrar session/localStorage
  localStorage.removeItem('user'); // depende de cómo guardas el usuario
  window.location.reload(); // recarga para mostrar login/register de nuevo
});





