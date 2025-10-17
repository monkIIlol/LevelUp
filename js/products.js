
// Data
const categories = [
  { id: 'JM', name: 'Juegos de Mesa' },
  { id: 'AC', name: 'Accesorios' },
  { id: 'CO', name: 'Consolas' },
  { id: 'CG', name: 'Computadores Gamers' },
  { id: 'SG', name: 'Sillas Gamers' },
  { id: 'MS', name: 'Mouse' },
  { id: 'MP', name: 'Mousepad' },
  { id: 'PP', name: 'Poleras Personalizadas' }
];

const products = [
  { code: 'JM001', category: 'JM', name: 'Catan', price: 29990, img: 'img/catan.png', desc: 'Juego de estrategia', details: ['Jugadores: 3-4', 'Edad: 10+', 'Duración: 60-120 min', 'Juego de comercio y construcción'] },
  { code: 'JM002', category: 'JM', name: 'Carcassonne', price: 24990, img: 'img/carcasone.png', desc: 'Colocación de losetas', details: ['Jugadores: 2-5', 'Edad: 8+', 'Duración: 35-45 min', 'Juego de colocación de losetas'] },
  { code: 'AC001', category: 'AC', name: 'Control Xbox Series', price: 59990, img: 'img/xbosseries.png', desc: 'Inalámbrico', details: ['Conexión: Inalámbrica', 'Compatibilidad: Xbox y PC', 'Batería: Recargable'] },
  { code: 'AC002', category: 'AC', name: 'HyperX Cloud II', price: 79990, img: 'img/hyperxcloud.png', desc: 'Sonido envolvente', details: ['Conexión: 3.5mm y USB', 'Micrófono: Desmontable', 'Compatibilidad: PC y Consolas'] },
  { code: 'CO001', category: 'CO', name: 'PlayStation 5', price: 549990, img: 'img/pley5.png', desc: 'Nueva generación', details: ['Almacenamiento: 825GB SSD', 'Resolución: Hasta 4K', 'Color: Blanco', 'Compatibilidad con juegos PS4'] },
  { code: 'CG001', category: 'CG', name: 'PC Gamer ROG Strix', price: 1299990, img: 'img/pcgamer.png', desc: 'Alto rendimiento', details: ['CPU: Intel i7', 'RAM: 16GB', 'GPU: RTX 3070', 'Almacenamiento: 1TB SSD'] },
  { code: 'SG001', category: 'SG', name: 'Silla Secretlab Titan', price: 349990, img: 'img/sillagamer.png', desc: 'Ergonómica', details: ['Altura ajustable', 'Reposabrazos 4D', 'Reclinable hasta 165°', 'Material: Cuero PU premium'] },
  { code: 'MS001', category: 'MS', name: 'Logitech G502 HERO', price: 49990, img: 'img/logitchg502.png', desc: 'Sensor preciso', details: ['DPI: 100-16000', 'Botones programables: 11', 'Peso ajustable', 'Iluminación RGB'] },
  { code: 'MP001', category: 'MP', name: 'Razer Goliathus Ext.', price: 29990, img: 'img/mousepadrazer.png', desc: 'RGB', details: ['Tamaño: XL', 'Base antideslizante', 'Superficie de microtextura', 'Iluminación Chroma RGB'] },
  { code: 'PP001', category: 'PP', name: "Polera 'Level‑Up'", price: 14990, img: 'img/polera-negra.png', desc: 'Personalizable', details: ['Material: Algodón 100%', 'Tallas: S, M, L, XL', 'Personalizable con tu nombre', 'Color: Negro'] }
];

if (!localStorage.getItem("productos")) {
  localStorage.setItem("productos", JSON.stringify(products));
}

const descuento = parseInt(localStorage.getItem("descuento")) || 0;

function aplicarDescuento(precio) {
  if (descuento > 0) {
    return precio - (precio * descuento / 100);
  }
  return precio;
}


function money(clp) { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp); }

function fillCategories() {
  const sel = document.getElementById('filter-category');
  categories.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.name;
    sel.appendChild(o);
  });
}

function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  grid.innerHTML = products.slice(0, 4).map(p => `<article class="card">
    <img src="${p.img}" alt="${p.name}"/>
    <h3>${p.name}</h3>
    <p><strong>${money(p.price)}</strong></p>
    <a class="btn" href="product.html?code=${encodeURIComponent(p.code)}">Ver</a>
  </article>`).join('');
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const q = (document.getElementById('filter-q').value || '').toLowerCase();
  const cat = document.getElementById('filter-category').value;
  const filtered = products.filter(p =>
    (!cat || p.category === cat) &&
    (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  );
  grid.innerHTML = filtered.map(p => `<article class="card">
    <img src="${p.img}" alt="${p.name}"/>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <p><strong>${money(p.price)}</strong></p>
    <div class="row">
      <a class="btn" href="product.html?code=${encodeURIComponent(p.code)}">Ver detalle</a>
      <button class="btn" data-add="${p.code}">Añadir</button>
    </div>
  </article>`).join('');
}

function bindProductsFilters() {
  document.getElementById('apply-filters').addEventListener('click', renderProducts);
}

function renderProductDetail() {
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const p = products.find(x => x.code === code) || products[0];
  const el = document.getElementById('product-detail');
  el.innerHTML = `<header><h1>${p.name}</h1></header>
    <img src="${p.img}" alt="${p.name}" />
    <p>${p.desc}</p>
    <p><strong>${money(p.price)}</strong></p>
    <button class="btn" data-add="${p.code}">Añadir al carrito</button>`;
}

function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function setCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

function addToCart(code) {
  const p = products.find(x => x.code === code);
  if (!p) return;
  const cart = getCart();
  const idx = cart.findIndex(i => i.code === code);
  if (idx >= 0) { cart[idx].qty += 1; } else { cart.push({ code: p.code, name: p.name, price: p.price, qty: 1 }); }
  setCart(cart);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = cart.reduce((a, i) => a + i.qty, 0);
  renderCart();

  // Mostrar mensaje
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userName = currentUser?.firstName || 'Usuario';
  showToast(`${userName} agregó "${p.name}" al carrito 🛒`);

  // Guardar historial para admin
  let history = JSON.parse(localStorage.getItem('cartHistory') || '[]');
  history.push({
    user: userName,
    product: p.name,
    code: p.code,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('cartHistory', JSON.stringify(history));

  function showToast(msg) {
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
  }
}

function renderCart() {
  const cont = document.getElementById('cart-items');
  if (!cont) return;
  const cart = getCart();

  if (cart.length === 0) {
    document.getElementById('cart-empty').style.display = 'block';
    document.getElementById('cart-total').textContent = 'Total: $0';
    cont.innerHTML = '';
  } else {
    document.getElementById('cart-empty').style.display = 'none';
    cont.innerHTML = cart.map(i => `
      <div class="cart-card">
        <h3>${i.name} <small>(${i.code})</small></h3>
        <p>Cantidad: ${i.qty}</p>
        <p>Precio: ${money(i.price * i.qty)}</p>
        <div class="cart-actions">
          <button class="btn btn-dec" data-dec="${i.code}">−</button>
          <button class="btn btn-inc" data-inc="${i.code}">+</button>
          <button class="btn btn-rem" data-rem="${i.code}">Quitar</button>
        </div>
      </div>
    `).join('');

    const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
    document.getElementById('cart-total').innerHTML = `<strong>Total:</strong> ${money(total)}`;
  }

  // actualizar contador del icono siempre
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = cart.reduce((a, i) => a + i.qty, 0);
  }
}


function bindCart() {
  document.body.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    const rem = e.target.closest('[data-rem]');

    if (add) { addToCart(add.dataset.add); }
    if (inc) {
      const c = getCart();
      const i = c.find(x => x.code === inc.dataset.inc);
      if (i) { i.qty++; setCart(c); renderCart(); }
    }
    if (dec) {
      const c = getCart();
      const i = c.find(x => x.code === dec.dataset.dec);
      if (i) {
        i.qty = Math.max(0, i.qty - 1);
        if (i.qty === 0) { c.splice(c.indexOf(i), 1); }
        setCart(c);
        renderCart();
      }
    }
    if (rem) {
      const c = getCart().filter(x => x.code !== rem.dataset.rem);
      setCart(c);
      renderCart();
    }
  });

  // Botón vaciar carrito
  const clearBtn = document.getElementById('cart-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    setCart([]);
    renderCart();
    showToast('Carrito vaciado 🗑️');
  });

  // Botón hacer pedido
  const checkoutBtn = document.getElementById('cart-checkout');
  checkoutBtn?.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Tu carrito está vacío ❌');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser?.firstName || 'Usuario';

    // Guardar historial de pedido
    let history = JSON.parse(localStorage.getItem('cartHistory') || '[]');
    cart.forEach(item => {
      history.push({
        user: userName,
        product: item.name,
        code: item.code,
        qty: item.qty,
        type: 'pedido',
        timestamp: new Date().toISOString()
      });
    });
    localStorage.setItem('cartHistory', JSON.stringify(history));

    // Vaciar carrito
    setCart([]);
    renderCart();

    // Mostrar mensaje de éxito
    showToast(`¡${userName} realizó su pedido con éxito ✅`);
  });

  renderCart();
}


function renderProductDetail() {
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const p = products.find(x => x.code === code) || products[0];
  const el = document.getElementById('product-detail');

  let detailsHTML = '';
  if (p.details) {
    detailsHTML = `<section id="product-details">
      <h3>Detalles</h3>
      <ul>${p.details.map(d => `<li>${d}</li>`).join('')}</ul>
    </section>`;
  }

  el.innerHTML = `<header><h1>${p.name}</h1></header>
    <img src="${p.img}" alt="${p.name}" />
    <p>${p.desc}</p>
    ${detailsHTML}
    <button class="btn" data-add="${p.code}">Añadir al carrito</button>`;
}


function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;

  // Estilo rápido para que se vea tipo alerta
  div.style.background = '#333';
  div.style.color = '#fff';
  div.style.padding = '0.7rem 1rem';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  div.style.opacity = '0';
  div.style.transition = 'opacity 0.3s';

  container.appendChild(div);

  // Aparecer
  requestAnimationFrame(() => {
    div.style.opacity = '1';
  });

  // Desaparecer después de 2 segundos
  setTimeout(() => {
    div.style.opacity = '0';
    div.addEventListener('transitionend', () => div.remove());
  }, 2000);
}


