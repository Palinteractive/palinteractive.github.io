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

  // Full-screen archive viewer. Click any archive card to inspect the original page at large scale.
  const lightboxItems = [...document.querySelectorAll('[data-lightbox]')];
  if (lightboxItems.length) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = `
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded portfolio image">
        <button class="lightbox-close" type="button" aria-label="Close expanded image">×</button>
        <img class="lightbox-image" alt="">
        <div class="lightbox-bar"><span class="lightbox-title"></span><span>ESC / click background to close</span></div>
      </div>`;
    document.body.appendChild(box);

    const image = box.querySelector('.lightbox-image');
    const title = box.querySelector('.lightbox-title');
    const close = box.querySelector('.lightbox-close');
    let lastTrigger = null;

    const openBox = item => {
      lastTrigger = item;
      image.src = item.dataset.lightbox;
      image.alt = item.dataset.lightboxTitle || item.querySelector('img')?.alt || 'Expanded portfolio image';
      title.textContent = item.dataset.lightboxTitle || '';
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-lock');
      close.focus();
    };
    const closeBox = () => {
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-lock');
      image.removeAttribute('src');
      if (lastTrigger) lastTrigger.focus();
    };

    lightboxItems.forEach(item => {
      item.addEventListener('click', () => openBox(item));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(item); }
      });
    });
    close.addEventListener('click', closeBox);
    box.addEventListener('click', e => { if (e.target === box) closeBox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) closeBox(); });
  }
})();
