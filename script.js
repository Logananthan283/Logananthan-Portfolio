// ===== Mobile Menu Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// ===== Smooth Scroll with Header Offset =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      navLinks.classList.remove('active');
    }
  });
});

// ===== Reveal on Scroll =====
const revealEls = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerBottom) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Contact Form Validation + Formspree =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Error elements
    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errMessage = document.getElementById('err-message');
    const formStatus = document.getElementById('formStatus');

    // Clear errors
    errName.textContent = '';
    errEmail.textContent = '';
    errMessage.textContent = '';
    formStatus.textContent = '';

    // Values
    const name = this.name.value.trim();
    const email = this._replyto.value.trim();
    const message = this.message.value.trim();

    let isValid = true;

    if (!name) {
      errName.textContent = 'Name is required.';
      isValid = false;
    }
    if (!email) {
      errEmail.textContent = 'Email is required.';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errEmail.textContent = 'Invalid email format.';
      isValid = false;
    }
    if (!message) {
      errMessage.textContent = 'Message is required.';
      isValid = false;
    } else if (message.length < 10) {
      errMessage.textContent = 'Message must be at least 10 characters.';
      isValid = false;
    }

    if (!isValid) return;

    formStatus.textContent = 'Sending...';

    try {
      const res = await fetch(this.action, {
        method: this.method,
        body: new FormData(this),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        formStatus.textContent = '✅ Message sent successfully!';
        this.reset();
      } else {
        formStatus.textContent = '❌ Failed to send message. Try again later.';
      }
    } catch (error) {
      formStatus.textContent = '❌ Network error. Please try again.';
    }
  });
}
