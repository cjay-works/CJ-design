const revealItems = document.querySelectorAll('.reveal');
const menuButton = document.querySelector('.menu-toggle');
const siteHeader = document.querySelector('.site-header');
const cursorGlow = document.querySelector('.cursor-glow');
const toast = document.querySelector('.toast');
const enquiryForm = document.querySelector('#enquiry-form');
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

if (window.emailjs) {
  emailjs.init({ publicKey: 'hF50q5PxQvepS9lLE' });
}

function syncThemeControl() {
  const isLight = root.dataset.theme === 'light';
  themeToggle?.setAttribute('aria-pressed', String(isLight));
  themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  if (themeToggle) themeToggle.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
}

syncThemeControl();

themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('cj-theme', root.dataset.theme);
  syncThemeControl();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    siteHeader.classList.remove('menu-open');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
  });
});

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  });
}

const parallaxItems = document.querySelectorAll('[data-parallax]');
if (parallaxItems.length && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    parallaxItems.forEach((item) => {
      item.style.transform = `translate3d(${x * 7}px, ${y * 7}px, 0)`;
    });
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 4200);
}

if (enquiryForm) {
  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = enquiryForm.querySelector('.form-submit');
    const originalLabel = submitButton?.innerHTML;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending enquiry…';
    }
    showToast('Sending your enquiry…');

    try {
      if (!window.emailjs) throw new Error('Email service unavailable.');
      await emailjs.sendForm('service_ki4cy8e', 'template_x6cj49w', enquiryForm);

      enquiryForm.reset();
      showToast("Thanks! Your enquiry has been sent successfully. We'll get back to you soon.");
    } catch (error) {
      console.error('EmailJS enquiry error:', error);
      showToast('Something went wrong while sending your enquiry. Please try again or email cjaydesign063@gmail.com directly.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      }
    }
  });
}
