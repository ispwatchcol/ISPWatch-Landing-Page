/* ========================================
   ISPWatch Landing Page - JavaScript
   Interactivity, animations, and effects
======================================== */

// Respect users who prefer reduced motion / coarse pointers (touch)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initThemeToggle();
  initNavbar();
  initScrollReveal();
  initPricingToggle();
  initFAQ();
  initSmoothScroll();
  initCounterAnimation();
  initParticles();
  initSpotlight();
  initMagnetic();
  initHeroTilt();
});

/* ========== Theme Toggle ========== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    // Default to light if system prefers light
    html.setAttribute('data-theme', 'light');
  }
  // If prefersDark is true and no saved theme, dark is default (no attribute needed)

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      if (newTheme === 'dark') {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', newTheme);
      }

      localStorage.setItem('theme', newTheme);

      // Add a subtle animation
      themeToggle.style.transform = 'rotate(180deg)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 300);
    });
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', 'light');
      }
    }
  });
}

/* ========== Navbar ========== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
}

/* ========== Scroll Reveal ========== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!reveals.length) return;

  // Reduced motion or no observer support: reveal everything up front.
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target); // reveal once, then stop watching
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ========== Pricing Toggle (billing cycle) ========== */
function initPricingToggle() {
  const buttons = document.querySelectorAll('.cycle-btn');
  const prices = document.querySelectorAll('.pricing-amount');
  const note = document.getElementById('billing-note');

  if (!buttons.length) return;

  // Displayed price is the effective monthly rate for each billing cycle.
  const notes = {
    monthly: 'Facturación mensual · cancela cuando quieras',
    quarterly: 'Precio por mes facturado cada 3 meses · ahorra 15%',
    annual: 'Precio por mes facturado de forma anual · ahorra 25%',
  };

  const applyCycle = (cycle) => {
    if (note && notes[cycle]) note.textContent = notes[cycle];

    // Plans without data-* for paid cycles (e.g. the free Gratis plan) are left untouched.
    prices.forEach((price) => {
      const newPrice = price.dataset[cycle];
      if (newPrice === undefined) return;

      price.style.transform = 'scale(0.8)';
      price.style.opacity = '0';

      setTimeout(() => {
        price.textContent = newPrice;
        price.style.transform = 'scale(1)';
        price.style.opacity = '1';
      }, 150);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      applyCycle(btn.dataset.cycle);
    });
  });
}

/* ========== FAQ Accordion ========== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ========== Smooth Scroll ========== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Bare "#" links (logo, placeholder footer links): scroll to top.
      // Previously this threw a SyntaxError on querySelector('#').
      if (!href || href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }

      let target;
      try {
        target = document.querySelector(href);
      } catch (_) {
        return; // Not a valid selector — let the browser handle the link.
      }

      if (target) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });
}

/* ========== Counter Animation ========== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-value');
  const speed = 200;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';
    let current = 0;
    const increment = target / speed;

    const updateCount = () => {
      if (current < target) {
        current += increment;
        counter.textContent = prefix + Math.ceil(current).toLocaleString() + suffix;
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = prefix + target.toLocaleString() + suffix;
      }
    };

    updateCount();
  };

  // Observe counters
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    if (counter.getAttribute('data-target')) {
      observer.observe(counter);
    }
  });
}

/* ========== Particles Background ========== */
function initParticles() {
  const container = document.querySelector('.bg-particles');
  if (!container) return;

  // Skip the floating dots when motion is reduced.
  if (prefersReducedMotion) return;

  // Create particles
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    container.appendChild(particle);
  }
}

/* ========== Cursor Spotlight (feature cards) ========== */
function initSpotlight() {
  if (!hasFinePointer) return;

  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
}

/* ========== Magnetic Buttons (primary CTAs) ========== */
function initMagnetic() {
  if (!hasFinePointer || prefersReducedMotion) return;

  const strength = 0.28;
  const max = 7; // px

  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('pointerenter', () => {
      btn.style.transition = 'transform 180ms cubic-bezier(0.25, 1, 0.5, 1)';
    });

    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      const tx = Math.max(-max, Math.min(max, mx * strength));
      const ty = Math.max(-max, Math.min(max, my * strength));
      btn.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    btn.addEventListener('pointerleave', () => {
      // Clear inline styles so the CSS spring eases the button home.
      btn.style.transition = '';
      btn.style.transform = '';
    });
  });
}

/* ========== Hero App-Window Tilt (parallax) ========== */
function initHeroTilt() {
  if (!hasFinePointer || prefersReducedMotion) return;

  const hero = document.getElementById('hero');
  const win = document.getElementById('appWindow');
  if (!hero || !win) return;

  let raf = null;

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const ry = -7 + px * 6;  // base -7deg, ±3deg
      const rx = 3 - py * 6;   // base  3deg, ±3deg
      win.style.transform = `perspective(1600px) rotateY(${ry}deg) rotateX(${rx}deg)`;
    });
  });

  hero.addEventListener('pointerleave', () => {
    if (raf) cancelAnimationFrame(raf);
    win.style.transform = ''; // settle back to the CSS resting pose
  });
}

/* ========== Utility Functions ========== */

// Debounce function
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ========== Form Handling - Email Notification ========== */
// Using FormSubmit.co for sending email notifications
const EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/info@ispwatch-crm.com';

// Get all CTA forms (there may be multiple on different pages)
const ctaForms = document.querySelectorAll('.cta-form');

ctaForms.forEach(ctaForm => {
  ctaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = ctaForm.querySelector('input[type="email"]');
    const btn = ctaForm.querySelector('button');
    const email = emailInput.value.trim();

    if (!email) return;

    // Get original button content
    const originalHTML = btn.innerHTML;

    // Show loading state
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin-slow">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      Enviando...
    `;

    try {
      // Get current date/time for the email
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Get the page name
      const pageName = document.title || 'ISPWatch Landing Page';

      // Notificacion enviada como tabla limpia via FormSubmit (campos en el fetch).

      const response = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: '🚀 Nueva solicitud de acceso - ISPWatch CRM',
          _template: 'table',
          _captcha: 'false',
          email: email,
          Solicitud: 'Un cliente quiere probar ISPWatch CRM y pide que lo contacten.',
          Origen: pageName,
          Fecha: dateStr
        })
      });

      if (response.ok) {
        // Success - show confirmation
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          ¡Solicitud Enviada!
        `;
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        // Show success notification
        showNotification('¡Gracias! Nos pondremos en contacto contigo pronto.', 'success');

        // Reset form
        ctaForm.reset();

        // Reset button after delay
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);

      } else {
        throw new Error('Error en el servidor');
      }

    } catch (error) {
      console.error('Error sending form:', error);

      // Show error state
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Error al enviar
      `;
      btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

      showNotification('Hubo un error. Por favor intenta de nuevo.', 'error');

      // Reset button after delay
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
});

/* ========== Notification System ========== */
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existing = document.querySelector('.notification-toast');
  if (existing) existing.remove();

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification-toast notification-enter';
  notification.innerHTML = `
    <div class="notification-icon">
      ${type === 'success'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    }
    </div>
    <span>${message}</span>
    <button class="notification-close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  // Add styles inline for the notification
  notification.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 0.95rem;
    font-weight: 500;
    max-width: 400px;
  `;

  // Style the icon
  const iconDiv = notification.querySelector('.notification-icon');
  iconDiv.style.cssText = 'width: 24px; height: 24px; flex-shrink: 0;';
  iconDiv.querySelector('svg').style.cssText = 'width: 100%; height: 100%;';

  // Style the close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = 'background: none; border: none; padding: 4px; cursor: pointer; opacity: 0.8; margin-left: auto;';
  closeBtn.querySelector('svg').style.cssText = 'width: 18px; height: 18px; color: white;';
  closeBtn.addEventListener('click', () => notification.remove());

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/* ========== Scroll Progress ========== */
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', throttle(() => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight);
  scrollProgress.style.transform = `scaleX(${scrolled})`;
}, 10));

/* ========== Keyboard Navigation ========== */
document.addEventListener('keydown', (e) => {
  // ESC to close mobile menu
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }
});

/* ========== Lazy Loading Images ========== */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

console.log('🚀 ISPWatch Landing Page loaded successfully!');
