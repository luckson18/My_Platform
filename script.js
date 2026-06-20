/* ============================================
   LUCKY 🍀 DATA SCIENCE PORTFOLIO — SCRIPT
============================================ */

/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1700);
});

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

// Persist theme across visits
const savedTheme = localStorage.getItem('lucky-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('lucky-theme', next);
});

/* ===== NAVBAR: sticky + active links ===== */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  // Sticky shadow
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link tracking
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 100;
    if (window.scrollY >= top) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });

/* ===== HAMBURGER MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ===== BACK TO TOP ===== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== TYPING EFFECT ===== */
const phrases = [
  'Aspiring Data Analyst',
  'ML Enthusiast',
  'Visual Storyteller',
  'Problem Solver',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let pause     = false;
const typedEl = document.getElementById('typedText');

function type() {
  if (pause) {
    setTimeout(type, 1600);
    pause = false;
    return;
  }
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) { pause = true; deleting = true; }
    setTimeout(type, 90);
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(type, 45);
  }
}
// Start typing after loader
setTimeout(type, 1900);

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children cards/items within a parent
      const delay = Array.from(entry.target.parentElement?.children || [])
        .indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== SKILL BARS ===== */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillFills.forEach(el => skillObserver.observe(el));

/* ===== COUNT-UP ANIMATION (Stats section) ===== */
const statNumbers = document.querySelectorAll('.stat-number');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count, 10);
      let start    = 0;
      const dur    = 1400;
      const step   = Math.ceil(target / (dur / 16));
      const timer  = setInterval(() => {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        entry.target.textContent = start;
      }, 16);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => countObserver.observe(el));

/* ===== PROJECT FILTER ===== */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      // Animate out then in
      if (match) {
        card.classList.remove('hidden');
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => card.classList.add('hidden'), 280);
      }
    });
  });
});

/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById('contactForm');

function validateField(id, errorId, check, msg) {
  const field = document.getElementById(id);
  const err   = document.getElementById(errorId);
  if (!check(field.value.trim())) {
    field.classList.add('error');
    err.textContent = msg;
    return false;
  }
  field.classList.remove('error');
  err.textContent = '';
  return true;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameOk  = validateField('name',    'nameError',    v => v.length >= 2,  'Please enter your name.');
  const emailOk = validateField('email',   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email.');
  const msgOk   = validateField('message', 'messageError', v => v.length >= 10, 'Message must be at least 10 characters.');

  if (nameOk && emailOk && msgOk) {
    const success = document.getElementById('formSuccess');
    success.textContent = '✅ Message sent! I\'ll get back to you soon.';
    success.classList.add('visible');
    contactForm.reset();
    setTimeout(() => success.classList.remove('visible'), 5000);
  }
});

// Live validation on blur
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', () => {
    el.classList.remove('error');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
  });
});

/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== CHART BARS - animate on enter ===== */
const chartBars = document.querySelectorAll('.chart-bar');
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transition = 'height 0.8s cubic-bezier(0.4,0,0.2,1)';
      chartObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
chartBars.forEach(b => chartObserver.observe(b));
