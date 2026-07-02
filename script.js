document.getElementById('year').textContent = new Date().getFullYear();

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
  });
});

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
const revealTargets = document.querySelectorAll('.card, .step, .p-card, .num-card, .testi-slide, .partner-col');
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

// ---- Interactive dashboard charts ----
const months = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const occupancy = [78, 81, 84, 87, 89, 90, 86, 83, 80, 85, 88, 90];
const arbitrageIncome = [3100, 3300, 3500, 3900, 4000, 4350, 4200, 4050, 4350, 4500, 4750, 4950];
const traditionalIncome = [2150, 2150, 2180, 2180, 2200, 2200, 2200, 2200, 2220, 2220, 2250, 2250];

const NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const el = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function renderLineChart() {
  const svg = document.getElementById('occLineChart');
  if (!svg) return;
  const w = 600, h = 220, padL = 32, padR = 8, padT = 14, padB = 26;
  const min = 70, max = 95;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const xFor = i => padL + (i / (occupancy.length - 1)) * plotW;
  const yFor = v => padT + plotH - ((v - min) / (max - min)) * plotH;

  const defs = svgEl('defs', {});
  const grad = svgEl('linearGradient', { id: 'occAreaGrad', x1: 0, y1: 0, x2: 0, y2: 1 });
  grad.appendChild(svgEl('stop', { offset: '0%', style: 'stop-color:var(--gold); stop-opacity:0.45' }));
  grad.appendChild(svgEl('stop', { offset: '100%', style: 'stop-color:var(--gold); stop-opacity:0' }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  [75, 80, 85, 90, 95].forEach(v => {
    const y = yFor(v);
    svg.appendChild(svgEl('line', { x1: padL, x2: w - padR, y1: y, y2: y, class: 'chart-grid-line' }));
    const label = svgEl('text', { x: 4, y: y + 3, class: 'chart-axis-label' });
    label.textContent = v + '%';
    svg.appendChild(label);
  });

  const linePts = occupancy.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');
  const areaPts = `${padL},${padT + plotH} ${linePts} ${w - padR},${padT + plotH}`;
  svg.appendChild(svgEl('polygon', { points: areaPts, class: 'chart-area' }));
  svg.appendChild(svgEl('polyline', { points: linePts, class: 'chart-line' }));

  months.forEach((m, i) => {
    const x = xFor(i), y = yFor(occupancy[i]);
    const label = svgEl('text', { x, y: h - 6, class: 'chart-axis-label', 'text-anchor': 'middle' });
    label.textContent = m;
    svg.appendChild(label);

    const point = svgEl('circle', { cx: x, cy: y, r: 4, class: 'chart-point' });
    const tooltip = document.getElementById('occTooltip');
    point.addEventListener('mouseenter', () => {
      point.classList.add('active');
      tooltip.textContent = `${m}: ${occupancy[i]}% occupied`;
      tooltip.style.left = `${(x / w) * 100}%`;
      tooltip.style.top = `${(y / h) * 100}%`;
      tooltip.classList.add('show');
    });
    point.addEventListener('mouseleave', () => {
      point.classList.remove('active');
      tooltip.classList.remove('show');
    });
    svg.appendChild(point);
  });
}

renderLineChart();

// ---- Testimonial slider ----
const slides = document.querySelectorAll('.testi-slide');
const dots = document.querySelectorAll('.testi-dot');
let current = 0;
let autoTimer;

function goTo(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), 5000);
}

function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}

document.getElementById('testiNext')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
document.getElementById('testiPrev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

startAuto();
