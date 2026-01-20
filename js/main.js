/* ========================================
   ISPWatch Landing Page - JavaScript
   Interactivity, animations, and effects
======================================== */

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

  const revealOnScroll = () => {
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 150;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
}

/* ========== Pricing Toggle ========== */
function initPricingToggle() {
  const toggle = document.querySelector('.toggle-switch');
  const monthlyLabel = document.querySelector('.monthly-label');
  const annualLabel = document.querySelector('.annual-label');
  const prices = document.querySelectorAll('.pricing-amount');

  // Monthly and annual prices
  const pricesData = {
    starter: { monthly: 29, annual: 24 },
    professional: { monthly: 79, annual: 66 },
    enterprise: { monthly: 149, annual: 124 }
  };

  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('annual');
      const isAnnual = toggle.classList.contains('annual');

      // Update labels
      if (monthlyLabel && annualLabel) {
        monthlyLabel.classList.toggle('active', !isAnnual);
        annualLabel.classList.toggle('active', isAnnual);
      }

      // Update prices with animation
      prices.forEach((price, index) => {
        const plans = ['starter', 'professional', 'enterprise'];
        const plan = plans[index];
        const newPrice = isAnnual ? pricesData[plan].annual : pricesData[plan].monthly;

        // Animate price change
        price.style.transform = 'scale(0.8)';
        price.style.opacity = '0';

        setTimeout(() => {
          price.textContent = newPrice;
          price.style.transform = 'scale(1)';
          price.style.opacity = '1';
        }, 150);
      });
    });
  }
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
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
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

  // Create particles
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    container.appendChild(particle);
  }
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

/* ========== Form Handling ========== */
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = ctaForm.querySelector('input[type="email"]').value;

    if (email) {
      // Show success message (you can customize this)
      const btn = ctaForm.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = '¡Enviado! ✓';
      btn.style.background = 'var(--secondary)';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        ctaForm.reset();
      }, 3000);
    }
  });
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
