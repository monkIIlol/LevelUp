

// regiones/comunas 
const regiones = {
  'Metropolitana de Santiago': ['Santiago', 'San Bernardo', 'Maipú', 'Puente Alto'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
  'Concepción': ['Concepción', 'Hualpen', 'Talcahuano', 'Tomé']
};

function fillRegions(regionSel, comunaSel) {
  const r = document.querySelector(regionSel);
  const c = document.querySelector(comunaSel);
  if (!r || !c) return;
  r.innerHTML = '<option value="">Selecciona…</option>' + Object.keys(regiones).map(x => `<option>${x}</option>`).join('');
  r.addEventListener('change', () => {
    const cs = regiones[r.value] || [];
    c.innerHTML = '<option value="">Selecciona…</option>' + cs.map(x => `<option>${x}</option>`).join('');
  });
}

// correos de todo tipo (uso general)
function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

// Chile RUN/RUT validación (input sin puntos ni guion)
function validarRUN(run) {
  if (!run) return false;
  const clean = String(run).toUpperCase().replace(/[^0-9K]/g, '');
  if (clean.length < 7 || clean.length > 9) return false;
  const dv = clean.slice(-1);
  const cuerpo = clean.slice(0, -1);
  let suma = 0, mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const res = 11 - (suma % 11);
  const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === dvCalc;
}

function showError(input, msg) {
  if (!input) return;
  let s = input.parentElement.querySelector('.error');
  if (!s) { s = document.createElement('div'); s.className = 'error'; input.parentElement.appendChild(s); }
  s.textContent = msg;
  input.setAttribute('aria-invalid', 'true');
}
function clearError(input) {
  if (!input) return;
  let s = input.parentElement.querySelector('.error');
  if (s) { s.textContent = ''; }
  input.removeAttribute('aria-invalid');
}

document.addEventListener('DOMContentLoaded', () => {
  fillRegions('#admin-region', '#admin-comuna');
});

// Manejo de envíos
document.addEventListener('submit', (e) => {
  const form = e.target;

  // LOGIN 
  if (form.matches('#form-login')) {
    e.preventDefault();
    const email = form.email.value.trim();
    const pass = form.password.value.trim();
    let ok = true;
    clearError(form.email); clearError(form.password);

    if (!email || email.length > 100 || !emailValido(email)) {
      showError(form.email, 'Correo inválido');
      ok = false;
    }
    if (!pass || pass.length < 4 || pass.length > 10) {
      showError(form.password, 'Contraseña inválida (4-10)');
      ok = false;
    }

    if (ok) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioActual = usuarios.find(u => u.email === email);

      if (email === "admin@levelup.cl" && pass === "admin123") {
        localStorage.setItem('currentUser', JSON.stringify({ firstName: "Admin", email }));
        window.location.href = "admin/index.html";
      } else if (email === "cliente@levelup.cl" && pass === "cliente123") {
        localStorage.removeItem("descuento");
        localStorage.setItem('currentUser', JSON.stringify({ firstName: "Cliente", email }));
        window.location.href = "products.html";
      } else if (usuarioActual) {
        localStorage.setItem('currentUser', JSON.stringify(usuarioActual));
        if (email.endsWith("@duocuc.cl")) localStorage.setItem("descuento", "20");
        window.location.href = "products.html";
      } else {
        localStorage.removeItem("descuento");
        localStorage.setItem('currentUser', JSON.stringify({ firstName: email.split("@")[0], email }));
        window.location.href = "products.html";
      }
    }

  }

  //  CONTACTO
  if (form.matches('#form-contact')) {
    e.preventDefault();
    let ok = true;
    const { name, email, comment } = form;
    [name, email, comment].forEach(clearError);

    if (!name.value.trim() || name.value.length > 100) {
      showError(name, 'Nombre requerido (máx 100)');
      ok = false;
    }
    if (!email.value.trim() || email.value.length > 100) {
      showError(email, 'Correo requerido (máx 100)');
      ok = false;
    } else if (!/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email.value.trim())) {
      showError(email, 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
      ok = false;
    }
    if (!comment.value.trim() || comment.value.length > 500) {
      showError(comment, 'Comentario requerido (máx 500)');
      ok = false;
    }

    if (ok) { alert('Mensaje enviado ✅'); form.reset(); }
  }

  //  REGISTRO/ADMIN USER 
  if (form.matches('#form-register') || form.matches('#form-admin-user')) {
    e.preventDefault();
    let ok = true;

    // elementos comunes
    const run = form.run;
    const firstName = form.firstName;
    const lastName = form.lastName;
    const email = form.email;
    const role = form.role;
    const region = form.region;
    const comuna = form.comuna;
    const address = form.address;
    const birthDate = form.birthDate;

    [run, firstName, lastName, email, role, region, comuna, address].forEach(clearError);

    // RUN
    if (!validarRUN(run.value)) { showError(run, 'RUN inválido (sin puntos ni guion, ej:19011022K)'); ok = false; }

    // Nombres y apellidos: solo letras y espacios
    const soloLetras = v => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v);

    if (!firstName.value.trim() || firstName.value.length > 50) {
      showError(firstName, 'Nombres requeridos (máx 50)');
      ok = false;
    } else if (!soloLetras(firstName.value.trim())) {
      showError(firstName, 'El nombre solo puede contener letras y espacios');
      ok = false;
    }

    if (!lastName.value.trim() || lastName.value.length > 100) {
      showError(lastName, 'Apellidos requeridos (máx 100)');
      ok = false;
    } else if (!soloLetras(lastName.value.trim())) {
      showError(lastName, 'Los apellidos solo pueden contener letras y espacios');
      ok = false;
    }

    // Email (dominios permitidos)
    if (!email.value.trim() || email.value.length > 100 ||
      !/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email.value.trim())) {
      showError(email, 'Correo inválido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com');
      ok = false;
    }

    if (!role.value) { showError(role, 'Selecciona un perfil'); ok = false; }
    if (!region.value) { showError(region, 'Selecciona región'); ok = false; }
    if (!comuna.value) { showError(comuna, 'Selecciona comuna'); ok = false; }
    if (!address.value || address.value.length > 300) { showError(address, 'Dirección requerida (máx 300)'); ok = false; }

    if (ok) {
      // localStorage (usuarios)
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = {
        run: run.value.trim(),
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        role: role.value,
        region: region.value,
        comuna: comuna.value,
        address: address.value.trim(),
        birthDate: birthDate ? birthDate.value : null
      };
      usuarios.push(usuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      // Guardar usuario logueado
      localStorage.setItem('currentUser', JSON.stringify({ email: usuario.email }));

      alert('Usuario válido ✅ ');
      form.reset();
    }
  }

  // PRODUCTOS 
  if (form.matches('#form-product')) {
    e.preventDefault();
    let ok = true;
    const { code, name, description, price, stock, stockCritical, category, image } = form;
    [code, name, description, price, stock, stockCritical, category].forEach(clearError);

    if (!code.value || code.value.trim().length < 3) { showError(code, 'Código requerido (min 3)'); ok = false; }
    if (!name.value || name.value.trim().length === 0 || name.value.length > 100) { showError(name, 'Nombre requerido (máx 100)'); ok = false; }
    if (description.value && description.value.length > 500) { showError(description, 'Descripción máx 500'); ok = false; }

    const p = parseFloat(price.value);
    if (isNaN(p) || p < 0) { showError(price, 'Precio debe ser ≥ 0'); ok = false; }

    const st = parseInt(stock.value, 10);
    if (!(Number.isInteger(st) && st >= 0)) { showError(stock, 'Stock debe ser entero ≥ 0'); ok = false; }

    if (stockCritical.value) {
      const sc = parseInt(stockCritical.value, 10);
      if (!(Number.isInteger(sc) && sc >= 0)) { showError(stockCritical, 'Stock crítico debe ser entero ≥ 0'); ok = false; }
    }

    if (!category.value) { showError(category, 'Selecciona categoría'); ok = false; }

    if (ok) {
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const editIndex = localStorage.getItem('editProductIndex');

      const producto = {
        code: code.value.trim(),
        name: name.value.trim(),
        description: description.value.trim(),
        price: parseFloat(price.value),
        stock: parseInt(stock.value, 10),
        stockCritical: stockCritical.value ? parseInt(stockCritical.value, 10) : null,
        category: category.value,
        imageName: (form.image && form.image.files && form.image.files[0]) ? form.image.files[0].name : null,
        createdAt: new Date().toISOString()
      };

      if (editIndex !== null) {
        productos[editIndex] = producto;
        localStorage.removeItem('editProductIndex');
        alert('Producto actualizado ✅');
      } else {
        productos.push(producto);
        alert('Producto agregado ✅');
      }

      localStorage.setItem('productos', JSON.stringify(productos));
      window.location.href = "products.html";
    }

  }
});
