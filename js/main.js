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

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('annual');
    const isAnnual = toggle.classList.contains('annual');

    // Update labels
    if (monthlyLabel && annualLabel) {
      monthlyLabel.classList.toggle('active', !isAnnual);
      annualLabel.classList.toggle('active', isAnnual);
    }

    // Update prices with animation, reading values from data attributes.
    // Plans without data-monthly/data-annual (e.g. the free Básico plan) are left untouched.
    prices.forEach((price) => {
      const { monthly, annual } = price.dataset;
      if (monthly === undefined || annual === undefined) return;

      const newPrice = isAnnual ? annual : monthly;

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

      // Send email via FormSubmit.co
      const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Solicitud de Acceso - ISPWatch</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 20px;margin-bottom:20px;">
                <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:1px;">📡 ISPWatch</span>
              </div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">🚀 Nueva Solicitud de Acceso</h1>
              <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0;">Un usuario quiere probar ISPWatch CRM</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1e293b;padding:32px 40px;">

              <!-- Alert banner -->
              <div style="background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(6,182,212,0.2));border:1px solid rgba(99,102,241,0.4);border-radius:10px;padding:16px 20px;margin-bottom:28px;text-align:center;">
                <p style="color:#a5b4fc;font-size:14px;font-weight:600;margin:0;text-transform:uppercase;letter-spacing:1px;">⚡ Acción Requerida</p>
                <p style="color:#e2e8f0;font-size:13px;margin:6px 0 0 0;">Contactar al usuario dentro de las próximas <strong style="color:#818cf8;">24 horas</strong></p>
              </div>

              <!-- Email info card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#0f172a;border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:24px;">
                    <p style="color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px 0;">📧 Correo del Usuario</p>
                    <p style="color:#6366f1;font-size:20px;font-weight:700;margin:0;word-break:break-all;">${email}</p>
                  </td>
                </tr>
              </table>

              <!-- Details grid -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td width="48%" style="background:#0f172a;border:1px solid rgba(148,163,184,0.15);border-radius:12px;padding:20px;vertical-align:top;">
                    <p style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 6px 0;">📍 Origen</p>
                    <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;">${pageName}</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background:#0f172a;border:1px solid rgba(148,163,184,0.15);border-radius:12px;padding:20px;vertical-align:top;">
                    <p style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 6px 0;">📅 Fecha y Hora</p>
                    <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;">${dateStr}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <div style="text-align:center;margin-top:28px;">
                <a href="mailto:${email}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;letter-spacing:0.5px;">📨 Responder al Usuario</a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid rgba(99,102,241,0.2);">
              <p style="color:#475569;font-size:13px;margin:0 0 8px 0;">Este correo fue generado automáticamente por el sistema ISPWatch.</p>
              <p style="margin:0;">
                <a href="https://ispwatch-crm.app" style="color:#6366f1;text-decoration:none;font-size:13px;font-weight:600;">ispwatch-crm.app</a>
                <span style="color:#334155;margin:0 8px;">·</span>
                <a href="mailto:info@ispwatch-crm.com" style="color:#6366f1;text-decoration:none;font-size:13px;">info@ispwatch-crm.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const response = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: '🚀 Nueva Solicitud de Acceso - ISPWatch CRM',
          _template: 'table',
          email: email,
          _captcha: 'false',
          message: htmlBody
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
