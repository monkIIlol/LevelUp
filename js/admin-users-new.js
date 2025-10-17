document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-admin-user");
  if (!form) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const editIndex = localStorage.getItem("editUserIndex");

  if (editIndex !== null) {
    const u = usuarios[editIndex];
    if (u) {
      form.run.value = u.run;
      form.firstName.value = u.firstName;
      form.lastName.value = u.lastName;
      form.email.value = u.email;
      form.role.value = u.role;
      form.region.value = u.region;
      form.comuna.value = u.comuna;
      form.address.value = u.address;
      if (u.birthDate) form.birthDate.value = u.birthDate;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      run: form.run.value.trim(),
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      role: form.role.value,
      region: form.region.value,
      comuna: form.comuna.value,
      address: form.address.value.trim(),
      birthDate: form.birthDate.value || null
    };

    if (editIndex !== null) {
      usuarios[editIndex] = nuevoUsuario;
      localStorage.removeItem("editUserIndex");
      alert("Usuario actualizado ✅");
    } else {
      usuarios.push(nuevoUsuario);
      alert("Usuario agregado ✅");
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    window.location.href = "users.html";
  });
});
