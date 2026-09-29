/* ============================================================
   Just Party Decoration – script.js
   Handles: navbar, scroll-reveal, testimonial slider,
            gallery filter + lightbox, contact form + WhatsApp
   ============================================================ */

/* ── Hamburger Navigation ─────────────────────────────────── */
(function initNav() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Highlight active page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
})();

/* ── Scroll Reveal ────────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ── Testimonial Slider ───────────────────────────────────── */
(function initSlider() {
  const track  = document.querySelector('.slider__track');
  const dots   = document.querySelectorAll('.slider__dot');
  const prevBtn = document.querySelector('.slider__arrow--prev');
  const nextBtn = document.querySelector('.slider__arrow--next');
  if (!track) return;

  let current = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total  = cards.length;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-advance every 5 s
  let timer = setInterval(() => goTo(current + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 5000);
  });

  // Touch swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  goTo(0); // initialise dots
})();

/* ── Gallery Filter ───────────────────────────────────────── */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── Gallery Lightbox ─────────────────────────────────────── */
(function initLightbox() {
  const lightbox   = document.querySelector('.lightbox');
  const lbImg      = document.querySelector('.lightbox__img');
  const lbCaption  = document.querySelector('.lightbox__caption');
  const closeBtn   = document.querySelector('.lightbox__close');
  const prevBtn    = document.querySelector('.lightbox__prev');
  const nextBtn    = document.querySelector('.lightbox__next');
  if (!lightbox) return;

  let currentIndex = 0;
  const visibleItems = () => [...document.querySelectorAll('.gallery-item:not(.hidden)')];

  function openAt(index) {
    const items = visibleItems();
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img  = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    if (lbCaption) {
      const title = item.querySelector('.gallery-item__title');
      const tag   = item.querySelector('.gallery-item__tag');
      lbCaption.textContent = [title?.textContent, tag?.textContent].filter(Boolean).join(' · ');
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      const vi = visibleItems();
      openAt(vi.indexOf(item));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', () => openAt(currentIndex - 1));
  if (nextBtn)  nextBtn.addEventListener('click', () => openAt(currentIndex + 1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   openAt(currentIndex - 1);
    if (e.key === 'ArrowRight')  openAt(currentIndex + 1);
  });

  // Click backdrop to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
})();

/* ── Contact Form → WhatsApp ──────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  /* PLACEHOLDER: Replace with actual WhatsApp business number */
  const WA_NUMBER = '919876543210'; // format: country code + number, no +

  function validateField(input) {
    const errorEl = input.parentElement.querySelector('.form-error');
    let valid = true;
    let msg = '';

    if (input.required && !input.value.trim()) {
      valid = false;
      msg = 'This field is required.';
    } else if (input.type === 'tel') {
      const digits = input.value.replace(/\D/g, '');
      if (digits.length < 10) { valid = false; msg = 'Enter a valid 10-digit phone number.'; }
    } else if (input.type === 'date' && input.value) {
      const chosen = new Date(input.value);
      const today  = new Date();
      today.setHours(0,0,0,0);
      if (chosen < today) { valid = false; msg = 'Event date must be in the future.'; }
    }

    input.classList.toggle('error', !valid);
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.toggle('show', !valid); }
    return valid;
  }

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate all fields
    const fields = [...form.querySelectorAll('input[required], select[required], textarea[required]')];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) return;

    // Build WhatsApp message
    const name      = form.querySelector('#name').value.trim();
    const phone     = form.querySelector('#phone').value.trim();
    const eventType = form.querySelector('#eventType').value;
    const eventDate = form.querySelector('#eventDate').value;
    const message   = form.querySelector('#message').value.trim();

    const text = [
      `Hello Just Party Decoration! 🎉`,
      ``,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Event Type:* ${eventType}`,
      `*Event Date:* ${eventDate || 'TBD'}`,
      message ? `*Additional Details:* ${message}` : '',
    ].filter(l => l !== undefined).join('\n');

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  });
})();

/* ── Floating WhatsApp ────────────────────────────────────── */
(function initWAFloat() {
  /* PLACEHOLDER: Replace with actual WhatsApp business number */
  const WA_NUMBER = '919876543210';
  const btn = document.querySelector('.wa-float');
  if (btn) {
    btn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello! I would like to enquire about party decorations. 🎉')}`;
  }
})();

/* ── Navbar scroll shadow ─────────────────────────────────── */
(function initNavbarShadow() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(18,24,58,0.13)'
      : '0 2px 16px rgba(18,24,58,0.08)';
  }, { passive: true });
})();
