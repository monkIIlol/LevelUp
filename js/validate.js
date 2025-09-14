
// Simple regiones/comunas data (subset example)
const regiones = {
  'Metropolitana de Santiago': ['Santiago','Maipú','Puente Alto'],
  'Valparaíso': ['Valparaíso','Viña del Mar','Quilpué']
};

function fillRegions(regionSel, comunaSel){
  const r = document.querySelector(regionSel);
  const c = document.querySelector(comunaSel);
  r.innerHTML = '<option value="">Selecciona…</option>' + Object.keys(regiones).map(x=>`<option>${x}</option>`).join('');
  r.addEventListener('change', ()=>{
    const cs = regiones[r.value] || [];
    c.innerHTML = '<option value="">Selecciona…</option>' + cs.map(x=>`<option>${x}</option>`).join('');
  });
}

// Permitir correos de todo tipo
function emailValido(valor){
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  return ok;
}

// Chile RUN/RUT validation (input sin puntos ni guion)
function validarRUN(run){
  const clean = String(run).toUpperCase().replace(/[^0-9K]/g,'');
  if(clean.length < 7 || clean.length > 9) return false;
  const dv = clean.slice(-1);
  const cuerpo = clean.slice(0,-1);
  let suma = 0, mult = 2;
  for(let i=cuerpo.length-1;i>=0;i--){
    suma += parseInt(cuerpo[i],10) * mult;
    mult = mult === 7 ? 2 : mult+1;
  }
  const res = 11 - (suma % 11);
  const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === dvCalc;
}

function showError(input, msg){
  let s = input.parentElement.querySelector('.error');
  if(!s){ s = document.createElement('div'); s.className='error'; input.parentElement.appendChild(s); }
  s.textContent = msg;
  input.setAttribute('aria-invalid','true');
}
function clearError(input){
  let s = input.parentElement.querySelector('.error');
  if(s){ s.textContent=''; }
  input.removeAttribute('aria-invalid');
}

// Forms
document.addEventListener('submit', (e)=>{
  const form = e.target;
  if(form.matches('#form-login')){
    e.preventDefault();
    const email = form.email.value.trim();
    const pass = form.password.value.trim();
    let ok = true;
    clearError(form.email); clearError(form.password);
    if(!email || email.length>100 || !emailValido(email)){ showError(form.email, 'Correo inválido o dominio no permitido'); ok=false; }
    if(!pass || pass.length<4 || pass.length>10){ showError(form.password, 'La contraseña debe tener 4 a 10 caracteres'); ok=false; }
    if(ok){ alert('Login válido ✅'); }
  }
  if(form.matches('#form-contact')){
    e.preventDefault();
    let ok = true;
    const { name, email, comment } = form;
    [name,email,comment].forEach(clearError);
    if(!name.value.trim()){ showError(name, 'Requerido'); ok=false; }
    if(!email.value.trim() || email.value.length>100 || !emailValido(email.value)){ showError(email, 'Correo inválido o dominio no permitido'); ok=false; }
    if(!comment.value.trim()){ showError(comment, 'Requerido'); ok=false; }
    if(comment.value.length>500){ showError(comment, 'Máximo 500 caracteres'); ok=false; }
    if(ok){ alert('Mensaje enviado ✅'); form.reset(); }
  }
  if(form.matches('#form-register')){
    e.preventDefault();
    let ok = true;
    const { email, password, run, firstName, lastName, role, region, comuna, address } = form;
    [email,password,run,firstName,lastName,role,region,comuna,address].forEach(clearError);
    if(!email.value.trim() || email.value.length>100 || !emailValido(email.value)){ showError(email, 'Correo inválido o dominio no permitido'); ok=false; }
    if(!password.value || password.value.length<4 || password.value.length>10){ showError(password, 'Contraseña 4 a 10 caracteres'); ok=false; }
    if(!validarRUN(run.value)){ showError(run, 'RUN inválido (sin puntos ni guion)'); ok=false; }
    if(!firstName.value.trim() || firstName.value.length>50){ showError(firstName, 'Requerido (máx 50)'); ok=false; }
    if(!lastName.value.trim() || lastName.value.length>100){ showError(lastName, 'Requerido (máx 100)'); ok=false; }
    if(!role.value){ showError(role, 'Selecciona un rol'); ok=false; }
    if(!region.value){ showError(region, 'Selecciona una región'); ok=false; }
    if(!comuna.value){ showError(comuna, 'Selecciona una comuna'); ok=false; }
    if(!address.value.trim() || address.value.length>300){ showError(address, 'Dirección requerida (máx 300)'); ok=false; }
    if(ok){ alert('Registro válido ✅'); }
  }
  if(form.matches('#form-product')){
    e.preventDefault();
    let ok = true;
    const { code, name, description, price, stock, stockCritical, category } = form;
    [code,name,description,price,stock,stockCritical,category].forEach(clearError);
    if(!code.value || code.value.length<3){ showError(code, 'Código requerido (min 3)'); ok=false; }
    if(!name.value || name.value.length>100){ showError(name, 'Nombre requerido (máx 100)'); ok=false; }
    if(description.value.length>500){ showError(description, 'Máx 500'); ok=false; }
    const p = parseFloat(price.value);
    if(!(p>=0)){ showError(price, 'Precio ≥ 0'); ok=false; }
    const st = parseInt(stock.value,10);
    if(!(Number.isInteger(st) && st>=0)){ showError(stock, 'Stock entero ≥ 0'); ok=false; }
    if(stockCritical.value){
      const sc = parseInt(stockCritical.value,10);
      if(!(Number.isInteger(sc) && sc>=0)){ showError(stockCritical, 'Stock crítico entero ≥ 0'); ok=false; }
    }
    if(!category.value){ showError(category, 'Selecciona categoría'); ok=false; }
    if(ok){ alert('Producto válido ✅'); }
  }
  if(form.matches('#form-admin-user')){
    e.preventDefault();
    let ok = true;
    const { run, firstName, lastName, email, role, region, comuna, address } = form;
    [run,firstName,lastName,email,role,region,comuna,address].forEach(clearError);
    if(!validarRUN(run.value)){ showError(run,'RUN inválido'); ok=false; }
    if(!firstName.value || firstName.value.length>50){ showError(firstName,'Máx 50'); ok=false; }
    if(!lastName.value || lastName.value.length>100){ showError(lastName,'Máx 100'); ok=false; }
    if(!email.value || email.value.length>100 || !emailValido(email.value)){ showError(email,'Correo inválido o dominio no permitido'); ok=false; }
    if(!role.value){ showError(role,'Selecciona un perfil'); ok=false; }
    if(!region.value){ showError(region,'Selecciona región'); ok=false; }
    if(!comuna.value){ showError(comuna,'Selecciona comuna'); ok=false; }
    if(!address.value || address.value.length>300){ showError(address,'Dirección requerida (máx 300)'); ok=false; }
    if(ok){ alert('Usuario válido ✅'); }
  }
});
