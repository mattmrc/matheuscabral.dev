document.addEventListener('astro:page-load', () => {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const storageKey = 'theme';

  const setTheme = (value: string) => {
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
    try {
      localStorage.setItem(storageKey, value);
    } catch (_) {
      /* storage unavailable */
    }
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        value === 'dark' ? 'Switch theme to light mode' : 'Switch theme to dark mode',
      );
    }
  };

  if (themeToggle) {
    const currentTheme = document.documentElement.dataset.theme || 'dark';
    themeToggle.setAttribute(
      'aria-label',
      currentTheme === 'dark' ? 'Switch theme to light mode' : 'Switch theme to dark mode',
    );
    themeToggle.addEventListener('click', () => {
      const next =
        (document.documentElement.dataset.theme || 'dark') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  requestAnimationFrame(() => {
    document.documentElement.classList.add('theme-ready');
  });
});
