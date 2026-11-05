// NOVA STUDIO — shared interactions
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const themeButton = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('nova-theme');
  if (saved === 'dark') document.documentElement.dataset.theme = 'dark';
  const updateThemeIcon = () => {
    if (themeButton) themeButton.textContent = document.documentElement.dataset.theme === 'dark' ? '☾' : '☼';
  };
  updateThemeIcon();
  if (themeButton) themeButton.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    if (dark) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    localStorage.setItem('nova-theme', dark ? 'dark' : 'light');
    updateThemeIcon();
  });

  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

  const glow = document.querySelector('.cursor-glow');
  if (glow && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, {passive:true});
  }

  if (matchMedia('(hover:hover) and (pointer:fine)').matches &&
      !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.parallax').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        el.style.transform = `perspective(900px) rotateY(${x*9}deg) rotateX(${-y*9}deg) scale(1.02)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
  }

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold:.12});
    items.forEach(el => observer.observe(el));
  } else items.forEach(el => el.classList.add('visible'));
})();

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}
