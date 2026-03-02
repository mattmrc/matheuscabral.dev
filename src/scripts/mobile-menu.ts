document.addEventListener('astro:page-load', () => {
  const menu = document.querySelector('[data-nav-menu]') as HTMLElement | null;
  const toggle = document.querySelector('[data-nav-toggle]') as HTMLElement | null;
  const navLinks = menu ? Array.from(menu.querySelectorAll('a')) : [];
  const mobileMenuQuery = window.matchMedia('(max-width: 900px)');

  const setMenuState = (isOpen: boolean) => {
    if (!menu || !toggle) return;

    if (!mobileMenuQuery.matches) {
      menu.dataset.open = 'true';
      menu.setAttribute('aria-hidden', 'false');
      menu.removeAttribute('inert');
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.forEach((link) => link.removeAttribute('tabindex'));
      return;
    }

    if (!isOpen && menu.contains(document.activeElement)) {
      toggle.focus({ preventScroll: true });
    }

    menu.dataset.open = isOpen ? 'true' : 'false';
    menu.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      menu.removeAttribute('inert');
    } else {
      menu.setAttribute('inert', '');
    }

    toggle.setAttribute('aria-expanded', String(isOpen));
    navLinks.forEach((link) => {
      if (isOpen) {
        link.removeAttribute('tabindex');
      } else {
        link.setAttribute('tabindex', '-1');
      }
    });
  };

  const closeMenu = () => setMenuState(false);

  if (toggle && menu) {
    setMenuState(false);
    mobileMenuQuery.addEventListener('change', () => setMenuState(false));

    toggle.addEventListener('click', () => {
      if (!mobileMenuQuery.matches) return;
      const isOpen = menu.dataset.open === 'true';
      setMenuState(!isOpen);
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }
});
