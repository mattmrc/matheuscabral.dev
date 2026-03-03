document.addEventListener('astro:page-load', () => {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const storageKey = 'theme';

  const setTheme = (value: string) => {
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
    try {
      localStorage.setItem(storageKey, value);
    } catch (_) {
      /* storage unavailable */
    }
    if (themeIcon) {
      themeIcon.textContent = value === 'dark' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
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
    if (themeIcon) {
      themeIcon.textContent = currentTheme === 'dark' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    }
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
