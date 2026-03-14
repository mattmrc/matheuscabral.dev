document.addEventListener('astro:page-load', () => {
  const grid = document.querySelector('[data-project-grid]') as HTMLElement | null;
  if (!grid) return;

  const FADE_MS = 150;
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const cards = document.querySelectorAll<HTMLElement>('[data-project-card]');
  let animating = false;

  const setActive = (active: string) => {
    buttons.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        button.dataset.filter === active ? 'true' : 'false',
      );
    });
  };

  const applyFilter = (filter: string) => {
    cards.forEach((card) => {
      const tags = card.dataset.tags || '';
      const match = filter === 'all' || tags.split(',').includes(filter);
      card.classList.toggle('is-hidden', !match);
      card.setAttribute('aria-hidden', match ? 'false' : 'true');
    });

    // Re-equalize card heights for the new visible set
    if ((window as Record<string, unknown>).__equalizeCardGrids) {
      (window as Record<string, unknown>).__equalizeCardGrids as () => void;
      ((window as Record<string, unknown>).__equalizeCardGrids as () => void)();
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (animating) return;
      const filter = button.dataset.filter || 'all';
      setActive(filter);

      // Fade grid out, swap visibility, fade back in
      animating = true;
      grid.style.transition = `opacity ${FADE_MS}ms ease-out`;
      grid.style.opacity = '0';

      setTimeout(() => {
        applyFilter(filter);
        // Small delay for layout to settle before fading back in
        requestAnimationFrame(() => {
          grid.style.opacity = '1';
          setTimeout(() => {
            animating = false;
          }, FADE_MS);
        });
      }, FADE_MS);
    });
  });
});
