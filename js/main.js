/* ============================================
   UCL Bioelectronics – Main JS
   ============================================ */

// ── Navigation scroll effect ────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile nav toggle ───────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
}

// Set active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Carousel ────────────────────────────────
class Carousel {
  constructor(el) {
    this.track  = el.querySelector('.carousel-track');
    this.slides = el.querySelectorAll('.carousel-slide');
    this.dots   = el.querySelectorAll('.carousel-dot');
    this.prevBtn = el.querySelector('.carousel-btn.prev');
    this.nextBtn = el.querySelector('.carousel-btn.next');
    this.current = 0;
    this.perView = this.getPerView();
    this.total   = Math.ceil(this.slides.length / this.perView);
    this.autoplayTimer = null;

    if (this.slides.length === 0) return;

    this.prevBtn?.addEventListener('click', () => this.go(this.current - 1));
    this.nextBtn?.addEventListener('click', () => this.go(this.current + 1));
    this.dots.forEach((d, i) => d.addEventListener('click', () => this.go(i)));

    window.addEventListener('resize', () => {
      this.perView = this.getPerView();
      this.total = Math.ceil(this.slides.length / this.perView);
      this.render();
    });

    this.startAutoplay();
    this.render();
  }

  getPerView() {
    if (window.innerWidth < 700) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  go(n) {
    this.current = ((n % this.total) + this.total) % this.total;
    this.render();
    this.resetAutoplay();
  }

  render() {
    const slideWidth = this.slides[0].offsetWidth;
    const gap = 16;
    this.track.style.transform = `translateX(-${this.current * (slideWidth + gap) * this.perView}px)`;
    this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(() => this.go(this.current + 1), 4500);
  }

  resetAutoplay() {
    clearInterval(this.autoplayTimer);
    this.startAutoplay();
  }
}

document.querySelectorAll('.carousel-wrap').forEach(el => new Carousel(el));

// ── Research theme accordion ─────────────────
document.querySelectorAll('.theme-header').forEach(header => {
  header.addEventListener('click', () => {
    const block = header.closest('.theme-block');
    const isOpen = block.classList.contains('open');
    // Close all
    document.querySelectorAll('.theme-block.open').forEach(b => b.classList.remove('open'));
    if (!isOpen) block.classList.add('open');
  });
});

// Open first theme by default
const firstTheme = document.querySelector('.theme-block');
if (firstTheme) firstTheme.classList.add('open');

// ── Publication filters ──────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.pub-filters');
    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.pub-item').forEach(item => {
      if (filter === 'all' || item.dataset.type === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ── Fade-up on scroll ────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
