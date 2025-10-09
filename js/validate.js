

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
  fillRegions('#region-select', '#comuna-select');
  fillRegions('#admin-region', '#admin-comuna');

  // límites de fecha: solo mayores de edad
  const bd = document.querySelector('form#form-register input[name="birthDate"]');
  if (bd) {
    const today = new Date();
    const maxAdult = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    bd.setAttribute('max', fmt(maxAdult));
    bd.setAttribute('min', '1900-01-01');
  }
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
      //login demo
      if (email === "admin@levelup.cl" && pass === "admin123") {
        window.location.href = "admin/index.html";
      } else if (email === "cliente@levelup.cl" && pass === "cliente123") {
        localStorage.removeItem("descuento");
        window.location.href = "products.html";
      } else if (email.endsWith("@duocuc.cl")) {
        localStorage.setItem("descuento", "20");
        alert("¡Bienvenido! Tienes 20% de descuento 🎉");
        window.location.href = "products.html";
      } else {
        localStorage.removeItem("descuento");
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

    // Fecha de nacimiento: requerida en registro y debe implicar >= 18 años
    clearError(birthDate);
    const isRegister = form.matches('#form-register');

    if (isRegister) {
      const v = (birthDate && birthDate.value) ? birthDate.value : '';
      if (!v) {
        showError(birthDate, 'Fecha de nacimiento requerida');
        ok = false;
      } else {
        const d = new Date(v);
        const isValid = !isNaN(d.getTime());
        const today = new Date();
        const minDate = new Date(1900, 0, 1);
        // calcular edad exacta
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;

        if (!isValid) {
          showError(birthDate, 'Fecha inválida');
          ok = false;
        } else if (d > today) {
          showError(birthDate, 'La fecha no puede ser futura');
          ok = false;
        } else if (d < minDate) {
          showError(birthDate, 'La fecha es demasiado antigua');
          ok = false;
        } else if (age < 18) {
          showError(birthDate, 'Debes ser mayor de 18 años');
          ok = false;
        }
      }
    }

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
      // Guardar producto en localStorage
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
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
      productos.push(producto);
      localStorage.setItem('productos', JSON.stringify(productos));
      alert('Producto válido ✅');
      form.reset();
    }
  }
});
