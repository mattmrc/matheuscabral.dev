document.addEventListener('astro:page-load', () => {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  const threshold = 400;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > threshold);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
