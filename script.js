document.getElementById('year').textContent = new Date().getFullYear();

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu toggle
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  if (navLinks.classList.contains('open')) {
    navLinks.style.display = 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = '#faf6ee';
    navLinks.style.padding = '1.5rem 2rem';
    navLinks.style.boxShadow = '0 12px 20px rgba(0,0,0,0.08)';
  } else {
    navLinks.removeAttribute('style');
  }
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navLinks.removeAttribute('style');
}));

// Reveal-on-scroll for cards, steps, etc.
const revealTargets = document.querySelectorAll('.card, .step, .p-card, .num-card, .testi, .partner-col');
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => revealObserver.observe(el));

// Animated counters
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(el => counterObserver.observe(el));

// Occupancy chart bars
const chartCols = document.querySelectorAll('.bar-col');
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 60);
      chartObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
chartCols.forEach(el => chartObserver.observe(el));

// Lead form
const form = document.getElementById('leadForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Thanks! We\'ll be in touch within 48 hours →';
  btn.disabled = true;
  setTimeout(() => {
    form.reset();
    btn.textContent = originalText;
    btn.disabled = false;
  }, 4000);
});
