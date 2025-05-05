document.getElementById('to-calendar-btn').addEventListener('click', () => {
  const aula = document.getElementById('aula');
  aula.classList.add('zoom-out');
  setTimeout(() => {
    window.location.href = 'Calendario.html';
  }, 300);
});
