document.addEventListener('DOMContentLoaded', function () {
  // Аккордеон-меню
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const submenu = document.getElementById(btn.getAttribute('aria-controls'));
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      submenu.hidden = expanded;
    });
  });

  // Подсветка активного пункта и раскрытие нужного раздела
  const navLinks = document.querySelectorAll('.sidebar nav a');
  const path = window.location.pathname.replace(/\\/g, '/');
  let foundActive = false;

  navLinks.forEach(link => {
    if (path.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
      foundActive = true;
      // раскрыть родительский submenu
      const submenu = link.closest('.submenu');
      if (submenu) {
        submenu.hidden = false;
        const btn = document.querySelector('.accordion-btn[aria-controls="' + submenu.id + '"]');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    }
  });

  // Если на index.html — раскрыть оба раздела по умолчанию
  if (!foundActive && path.endsWith('/index.html')) {
    document.querySelectorAll('.submenu').forEach(submenu => submenu.hidden = false);
    document.querySelectorAll('.accordion-btn').forEach(btn => btn.setAttribute('aria-expanded', 'true'));
  }
});
