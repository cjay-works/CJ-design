const revealItems = document.querySelectorAll('.reveal');
const menuButton = document.querySelector('.menu-toggle');
const siteHeader = document.querySelector('.site-header');
const cursorGlow = document.querySelector('.cursor-glow');
const toast = document.querySelector('.toast');
const enquiryForm = document.querySelector('#enquiry-form');

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
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(enquiryForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const business = String(formData.get('business') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = `Website enquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Reply email: ${email}`,
      `Website type: ${business}`,
      '',
      message || 'I would like to discuss a website project.'
    ].join('\n');
    showToast('Opening your email app with the enquiry…');
    window.setTimeout(() => {
      window.location.href = `mailto:cjaydesign063@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 250);
  });
}
