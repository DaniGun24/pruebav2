// js/bienvenida.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Recuperar nombre y apellido guardados
  const nombre   = sessionStorage.getItem('nombre')   || '';
  const apellido = sessionStorage.getItem('apellido') || '';
  const fullName = [nombre, apellido].filter(Boolean).join(' ');

  // 2) Inyectar en el saludo principal
  const nombreEl = document.getElementById('nombre');
  if (nombreEl) {
    nombreEl.textContent = fullName;
  }

  // 3) Inyectar en la badge dentro de la card
  const badgeEl = document.querySelector('.username-badge');
  if (badgeEl) {
    badgeEl.textContent = fullName;
  }

  // 4) Manejar clic en “Ir a mi Aula →”
  const goBtn = document.querySelector('.go-btn');
  if (goBtn) {
    goBtn.addEventListener('click', () => {
      // redirige a la siguiente sección o página
      window.location.href = 'aula.html';
    });
  }
});
