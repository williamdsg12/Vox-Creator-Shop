/**
 * MILLION-DOLLAR SAAS INTERACTIVE ANIMATIONS SYSTEM
 * Powered by Vanilla JS (IntersectionObserver + Fallback Scroll Engine)
 * Inspired by FusionAds, Vercel, Linear, Raycast, Stripe, Framer
 */

document.addEventListener('DOMContentLoaded', () => {
  setupStaggeredRevealTargets();
  initScrollReveals();
  initAnimatedCounters();
  init3DCardTiltAndSpotlight();
  initGlobalCursorGlow();
  initFAQAccordion();
});

// Re-check reveals on load and scroll as failsafe
window.addEventListener('load', checkRevealsFallback);
window.addEventListener('scroll', checkRevealsFallback, { passive: true });

/* 1. SETUP STAGGERED REVEAL TARGETS AUTOMATICALLY */
function setupStaggeredRevealTargets() {
  const cardContainers = document.querySelectorAll(
    '.comparativo-grid-redesign, .why-us-grid-v2, .vertical-timeline-v2, .deliverables-grid-12, .testimonials-grid-v2, .pricing-cards-wrapper, .faq-accordion-container'
  );

  cardContainers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, idx) => {
      if (!child.classList.contains('reveal-on-scroll')) {
        child.classList.add('reveal-on-scroll');
      }
      child.style.transitionDelay = `${(idx % 4) * 0.12}s`;
    });
  });
}

/* 2. SCROLL REVEAL OBSERVER ENGINE */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Allow re-triggering when scrolling back up
        if (entry.boundingClientRect.top > window.innerHeight) {
          entry.target.classList.remove('is-visible');
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

function checkRevealsFallback() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
  const windowHeight = window.innerHeight;

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= windowHeight - 40) {
      el.classList.add('is-visible');
    }
  });
}

/* 3. ANIMATED NUMBER COUNTERS */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');

  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSingleCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  counterElements.forEach(el => counterObserver.observe(el));
}

function animateSingleCounter(el) {
  const target = parseFloat(el.getAttribute('data-counter-target'));
  const prefix = el.getAttribute('data-counter-prefix') || '';
  const suffix = el.getAttribute('data-counter-suffix') || '';
  const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
  const duration = 2200;
  const startTimestamp = performance.now();

  function updateCount(now) {
    const elapsed = now - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easeOutExpo curve
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = target * easeProgress;

    let formattedValue = currentValue.toFixed(decimals);
    if (decimals === 0) {
      formattedValue = Math.floor(currentValue).toLocaleString('pt-BR');
    } else {
      formattedValue = formattedValue.replace('.', ',');
    }

    el.textContent = `${prefix}${formattedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      let finalFormatted = target.toFixed(decimals);
      if (decimals === 0) {
        finalFormatted = Math.floor(target).toLocaleString('pt-BR');
      } else {
        finalFormatted = finalFormatted.replace('.', ',');
      }
      el.textContent = `${prefix}${finalFormatted}${suffix}`;
    }
  }

  requestAnimationFrame(updateCount);
}

/* 4. 3D CARD TILT & MOUSE SPOTLIGHT GLOW */
function init3DCardTiltAndSpotlight() {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouchDevice) return;

  const tiltCards = document.querySelectorAll('.tilt-card, .why-us-card-v2, .deliv-card, .pricing-card-v2, .comparativo-card-v2, .testimonial-card-v2, .step-card-box');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* 5. GLOBAL CURSOR GLOW FOLLOW EFFECT */
function initGlobalCursorGlow() {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouchDevice) return;

  let cursorOrb = document.querySelector('.global-cursor-spotlight');
  if (!cursorOrb) {
    cursorOrb = document.createElement('div');
    cursorOrb.className = 'global-cursor-spotlight';
    document.body.appendChild(cursorOrb);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursorGlow() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    cursorOrb.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
    requestAnimationFrame(renderCursorGlow);
  }

  requestAnimationFrame(renderCursorGlow);
}

/* 6. FAQ ACCORDION HANDLER */
function initFAQAccordion() {
  const faqButtons = document.querySelectorAll('.faq-question-btn');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item-v2');
      const isActive = parent.classList.contains('active');

      document.querySelectorAll('.faq-item-v2.active').forEach(item => {
        if (item !== parent) {
          item.classList.remove('active');
        }
      });

      parent.classList.toggle('active', !isActive);
    });
  });
}
