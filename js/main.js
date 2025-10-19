document.addEventListener('DOMContentLoaded', () => {
  const countEl = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (countEl) countEl.textContent = cart.reduce((a, i) => a + i.qty, 0);

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
  if (document.getElementById('region-select')) {
    fillRegions('#region-select', '#comuna-select');
  }
  if (document.getElementById('admin-region')) {
    fillRegions('#admin-region', '#admin-comuna');
  }

  // --- INICIO: Lógica de Sesión y Menú de Usuario ---
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const loggedOutView = document.getElementById('logged-out-view');
  const loggedInView = document.getElementById('logged-in-view');

  if (currentUser) {
    if (loggedOutView) loggedOutView.style.display = 'none';
    if (loggedInView) loggedInView.style.display = 'block';

    const userMenuButton = document.getElementById('user-menu-button');
    const userName = currentUser.firstName || currentUser.email.split('@')[0];
    // Reemplaza la línea que solo ponía el nombre por este bloque
    if (userMenuButton) {
      // Este es el código de un ícono de perfil simple en formato SVG
      const userIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="user-profile-icon">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    `;
      // Ahora insertamos el ícono, el nombre y la flecha en el botón
      userMenuButton.innerHTML = `${userIconSVG} ${userName} &#9662;`;
    }

  } else {
    if (loggedOutView) loggedOutView.style.display = 'block';
    if (loggedInView) loggedInView.style.display = 'none';
  }

  // --- Funcionalidad del Menú Desplegable ---
  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('user-dropdown');

  userMenuButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle('show');
  });

  window.addEventListener('click', (event) => {
    if (userDropdown && userDropdown.classList.contains('show')) {
      if (!event.target.matches('.user-menu-trigger')) {
        userDropdown.classList.remove('show');
      }
    }
  });

  // --- Funcionalidad del Botón "Cerrar Sesión" ---
  const logoutButton = document.getElementById('logout-button');
  logoutButton?.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
  // --- FIN: Lógica de Sesión y Menú de Usuario ---

}); // Fin del addEventListener 'DOMContentLoaded'

const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

toggleBtn?.addEventListener('click', () => {
  nav.classList.toggle('show');
});

