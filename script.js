/* ============================================================
   UTIL: DOM helper
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ============================================================
   DARK / LIGHT MODE
   ============================================================ */
const modeToggle = $('#modeToggle');

function setModeIcon() {
  // Swap icon based on current theme
  const isDark = document.body.classList.contains('dark');
  modeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
}

// On load: use saved preference or system preference
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if ((saved === 'dark') || (!saved && prefersDark)) document.body.classList.add('dark');
  setModeIcon();
})();

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  setModeIcon();
});

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
const counters = $$('.counter');
let countersStarted = false;

function runCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach(counter => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1000; // ms
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target; // ensure exact end value
    }
    requestAnimationFrame(tick);
  });
}

// Observe hero for when counters should start
const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) runCounters();
  });
}, { threshold: 0.4 });
countersObserver.observe($('#home'));

/* ============================================================
   INTERACTIVE TIMELINE
   ============================================================ */
const timelineItems = $$('.timeline-item');
timelineItems.forEach(item => {
  const header = $('.timeline-header', item);
  const content = $('.timeline-content', item);

  // Expand/collapse on button click
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    content.hidden = expanded;
    header.classList.toggle('open', !expanded);
  });

  // Reveal animation on scroll
  item.classList.add('reveal');
});

// Reveal observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.2 });

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   PORTFOLIO FILTERS
   ============================================================ */
const filterBtns = $$('.filter-btn');
const cards = $$('.card-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});



/* ============================================================
   CONTACT FORM (client-side validation helper)
   ============================================================ */
const form = $('.contact-form');
const statusEl = $('#formStatus');
form?.addEventListener('submit', (e) => {
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();

  let ok = true;
  // Simple checks (you can extend these)
  if (!name) { $('#err-name').textContent = 'Please enter your name.'; ok = false; } else { $('#err-name').textContent = ''; }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) { $('#err-email').textContent = 'Enter a valid email.'; ok = false; } else { $('#err-email').textContent = ''; }
  if (!message) { $('#err-message').textContent = 'Please enter a message.'; ok = false; } else { $('#err-message').textContent = ''; }

  if (!ok) {
    e.preventDefault();
    statusEl.textContent = 'Please fix the highlighted fields.';
  } else {
    statusEl.textContent = 'Sending…';
    // Let the form submit normally to Formspree
  }
});
