/* ═══════════════════════════════════════════
   Briarcliff Homes — Main Script
═══════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Scroll-based nav style ──────────────────
  const nav = document.getElementById('nav');

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile menu ─────────────────────────────
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const bar1       = document.getElementById('bar1');
  const bar2       = document.getElementById('bar2');
  const bar3       = document.getElementById('bar3');
  let menuOpen     = false;

  function openMenu() {
    menuOpen = true;
    menuBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.style.transform = 'translateX(0)';
    bar1.style.transform = 'translateY(6px) rotate(45deg)';
    bar2.style.opacity   = '0';
    bar3.style.transform = 'translateY(-6px) rotate(-45deg)';
  }

  function closeMenu() {
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.style.transform = 'translateX(100%)';
    bar1.style.transform = '';
    bar2.style.opacity   = '1';
    bar3.style.transform = '';
  }

  menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ── Scroll-reveal (IntersectionObserver) ────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.style.opacity  = '1';
      el.style.transform = 'none';
    });
  }

  // ── Hero parallax (desktop only, hero-height capped) ──
  const heroImg     = document.getElementById('heroImg');
  const heroSection = document.getElementById('hero');

  if (heroImg && !prefersReduced && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > heroSection.offsetHeight) return;
      heroImg.style.transform = `translateY(${window.scrollY * 0.2}px) scale(1.05)`;
    }, { passive: true });
  }

  // Hero load animation — strip slow transition after it fires so parallax is instant
  if (heroImg) {
    const heroPhoto = heroImg.querySelector('img');
    const markLoaded = () => {
      heroImg.classList.add('loaded');
      setTimeout(() => { heroImg.style.transition = 'none'; }, 8100);
    };
    if (heroPhoto) {
      if (heroPhoto.complete) markLoaded();
      else heroPhoto.addEventListener('load', markLoaded);
    }
  }

  // ── Animated stat counters ──────────────────
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const step   = prefersReduced ? 0 : 1200 / target;
      let current  = 0;
      const timer  = setInterval(() => {
        current = Math.min(current + Math.ceil(target / 60), target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ── Portfolio lightbox ──────────────────────
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose   = document.getElementById('lightbox-close');

  document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View ' + (card.getAttribute('data-title') || 'project'));

    const openLightbox = () => {
      lbImg.src            = card.getAttribute('data-img');
      lbImg.alt            = card.getAttribute('data-title') || '';
      lbCaption.textContent = card.getAttribute('data-title') || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };

    card.addEventListener('click', openLightbox);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // ── Inquiry form ────────────────────────────
  const form    = document.getElementById('inquiry-form');
  const success = document.getElementById('form-success');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl  = document.getElementById('name');
    const emailEl = document.getElementById('email');
    if (!nameEl.value.trim() || !emailEl.value.trim()) {
      nameEl.focus();
      return;
    }
    success.classList.remove('hidden');
    form.reset();
    setTimeout(() => success.classList.add('hidden'), 6000);
  });

})();
