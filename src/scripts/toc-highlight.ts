document.addEventListener('astro:page-load', () => {
  const toc = document.querySelector('.toc');
  if (!toc) return;

  const links = toc.querySelectorAll<HTMLAnchorElement>('.toc__list a');
  const headings: HTMLElement[] = [];

  links.forEach((link) => {
    const id = link.getAttribute('href')?.replace('#', '');
    if (id) {
      const heading = document.getElementById(id);
      if (heading) headings.push(heading);
    }
  });

  if (headings.length === 0) return;

  const setActive = (id: string) => {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
          break;
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  );

  headings.forEach((h) => observer.observe(h));
});
