(() => {
  const doc = document.documentElement;
  doc.classList.add('js');

  // Header: đổi nền khi cuộn (trang chủ có header trong suốt trên ảnh hero).
  const header = document.querySelector('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu di động.
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    const label = toggle.querySelector('.visually-hidden');
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      label.textContent = open ? label.dataset.labelClose : label.dataset.labelOpen;
      if (open) menu.querySelector('a')?.focus();
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setOpen(false));
  }

  // Hiện dần khi cuộn tới; bỏ qua nếu người dùng chọn giảm chuyển động.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el, i) => { el.style.setProperty('--d', `${(i % 4) * 70}ms`); io.observe(el); });
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  // Đưa focus tới thông báo lỗi/thành công của form.
  document.querySelector('[data-autofocus]')?.focus();

  // Nút gửi: chống bấm hai lần và báo đang gửi.
  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('[type="submit"][data-sending]');
      if (btn) { btn.disabled = true; btn.textContent = btn.dataset.sending; }
    });
  });

  // Admin: xác nhận trước khi xoá.
  document.querySelectorAll('[data-confirm]').forEach((el) => {
    el.addEventListener('submit', (e) => { if (!window.confirm(el.dataset.confirm)) e.preventDefault(); });
  });
})();
