// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  links.classList.toggle('open');
});

// Close nav when a link is clicked on mobile
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
  });
});

// =====================
// Experience flashcard carousel
// =====================
(() => {
  const carousel = document.querySelector('.exp-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.exp-track');
  const cards = Array.from(carousel.querySelectorAll('.exp-card'));
  const dotsWrap = carousel.querySelector('.exp-dots');
  const prevBtn = carousel.querySelector('.exp-arrow-prev');
  const nextBtn = carousel.querySelector('.exp-arrow-next');

  let index = 0;
  let inView = false;

  // Build dots to match number of cards
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'exp-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to experience ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.exp-dot'));

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    cards.forEach((card, i) => card.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
  }

  function goTo(i) {
    index = (i + cards.length) % cards.length;
    render();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  // Clicking a card advances to the next one
  cards.forEach(card => {
    card.addEventListener('click', next);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    });
  });

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Left/right arrow key navigation, only while the carousel is in view
  document.addEventListener('keydown', (e) => {
    if (!inView) return;
    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  });

  // Track whether the carousel is visible so keyboard nav doesn't fire
  // while the user is scrolled somewhere else on the page
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        inView = entry.isIntersecting;
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(carousel);

  render();
})();