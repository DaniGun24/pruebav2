// script.js
document.addEventListener('DOMContentLoaded', () => {
  // ————————————————
  // 1) Validación de email + popup
  // ————————————————
  const joinBtn    = document.getElementById('join-btn');
  const emailForm  = document.getElementById('email-form');
  const emailInput = document.getElementById('email-input');
  const overlay    = document.getElementById('modal-overlay');
  const errorBox   = document.getElementById('error-box');
  const retryBtn   = errorBox.querySelector('.retry-btn');
  const helpBtn    = errorBox.querySelector('.help-btn');

  // Mostrar/ocultar el form
  joinBtn.addEventListener('click', () => {
    // Ocultamos cualquier popup y quitamos blur
    errorBox.classList.add('hidden');
    overlay.classList.remove('active');

    // Toggle del formulario
    emailForm.classList.toggle('hidden');
    if (!emailForm.classList.contains('hidden')) {
      emailInput.focus();
    }
  });

  // Al enviar el form
  emailForm.addEventListener('submit', async e => {
    e.preventDefault();
    const correo = emailInput.value.trim();
    if (!correo) return;

    // Ocultamos form y activamos overlay
    emailForm.classList.add('hidden');
    overlay.classList.add('active');

    try {
      // Llamada a tu Google Apps Script
      const resp = await fetch(
        'https://script.google.com/macros/s/AKfycbylqL69lMV3oyr14RAiUcsrqFs07Wnt3PRCLUSUmRfGlKVxJlkX_kcPko2d7GFwoPIK/exec'
        + '?correo=' + encodeURIComponent(correo)
      );
      const json = await resp.json();

      if (json.success) {
        // 1) Guardamos datos en sessionStorage
        sessionStorage.setItem('nombre',   json.nombre);
        sessionStorage.setItem('apellido', json.apellido);
        // 2) Redirigimos a bienvenida.html
        window.location.href = 'bienvenida.html';
      } else {
        throw new Error(json.message || 'Correo no registrado');
      }
    } catch(err) {
      // Mostrar popup de error (mantener overlay para blur)
      errorBox.classList.remove('hidden');
    }
  });

  // “Reintentar” en el popup de error
  retryBtn.addEventListener('click', () => {
    errorBox.classList.add('hidden');
    overlay.classList.remove('active');
    emailForm.classList.remove('hidden');
    emailInput.focus();
  });

  // “Hablar con un asesor”
  helpBtn.addEventListener('click', () => {
    window.location.href = 'https://tusitio.com/contacto';
  });

  // ————————————————
  // 2) Contador regresivo dd:hh:mm:ss
  // ————————————————
  const target = new Date('2025-06-09T09:00:00-05:00').getTime();
  const ids    = ['days','hours','minutes','seconds'];

  function updateCountdown() {
    const now  = Date.now();
    let   diff = Math.max(0, target - now) / 1000;  // segundos restantes

    const days    = Math.floor(diff / 86400);
    const hours   = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = Math.floor(diff % 60);

    [days, hours, minutes, seconds].forEach((v,i) => {
      const el = document.getElementById(ids[i]);
      if (el) el.textContent = String(v).padStart(2,'0');
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
