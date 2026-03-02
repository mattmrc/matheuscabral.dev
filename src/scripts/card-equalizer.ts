document.addEventListener('astro:page-load', () => {
  const cardRowKeys = ['meta', 'title', 'summary', 'tags', 'stack', 'action'];
  const cardGrids = Array.from(document.querySelectorAll('[data-card-grid]'));

  const equalizeGrid = (grid: Element) => {
    const cards = Array.from(grid.querySelectorAll('[data-card]')).filter(
      (card) => (card as HTMLElement).offsetParent !== null,
    );
    if (!cards.length) return;

    cardRowKeys.forEach((key) => {
      let maxHeight = 0;
      cards.forEach((card) => {
        const row = card.querySelector(`[data-card-row="${key}"]`) as HTMLElement | null;
        if (!row) return;
        row.style.minHeight = '0px';
        const height = row.offsetHeight;
        if (height > maxHeight) maxHeight = height;
      });
      cards.forEach((card) => {
        const row = card.querySelector(`[data-card-row="${key}"]`) as HTMLElement | null;
        if (!row) return;
        row.style.minHeight = maxHeight ? `${maxHeight}px` : '0px';
      });
    });
  };

  const equalizeAll = () => {
    cardGrids.forEach((grid) => equalizeGrid(grid));
  };

  const scheduleEqualize = () => {
    window.requestAnimationFrame(equalizeAll);
  };

  if (cardGrids.length) {
    scheduleEqualize();
    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(scheduleEqualize, 120);
    });
    window.addEventListener('orientationchange', scheduleEqualize);
    (window as Record<string, unknown>).__equalizeCardGrids = scheduleEqualize;
  }
});
