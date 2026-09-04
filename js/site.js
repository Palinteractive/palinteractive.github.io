(() => {
  const links = document.querySelectorAll('[data-scroll]');
  links.forEach(link => link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#')) {
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
    }
  }));

  // Pause offscreen videos to avoid wasting bandwidth on portfolio pages.
  const videos = [...document.querySelectorAll('video')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
      });
    }, {threshold:0.05});
    videos.forEach(v => io.observe(v));
  }
})();
