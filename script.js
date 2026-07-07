// ==========================================================
// Année dans le footer
// ==========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================================
// Respect du "reduced motion"
// ==========================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================
// Terminal animé (signature du hero)
// ==========================================================
const typedCmdEl = document.getElementById('typedCmd');
const outputEl = document.getElementById('terminalOutput');
const cursorEl = document.getElementById('cursor');

const command = 'dbt run --select daouda_ka';

const outputLines = [
  { text: 'Running with dbt=1.11.12', cls: '' },
  { text: 'Found 1 engineer, 6 sources, ∞ curiosité', cls: '' },
  { text: '', cls: '' },
  { text: '1 of 1 START building daouda_ka .................... [RUN]', cls: '' },
  { text: '1 of 1 OK created data engineer daouda_ka ........... [SUCCESS]', cls: 'ok' },
  { text: '', cls: '' },
  { text: 'Completed successfully', cls: 'accent' },
  { text: 'Done. PASS=1 WARN=0 ERROR=0', cls: 'ok' },
];

function typeCommand(text, el, speed, onDone) {
  let i = 0;
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(step, speed);
    } else if (onDone) {
      onDone();
    }
  }
  step();
}

function printOutput(lines, container, lineDelay, onDone) {
  let i = 0;
  function step() {
    if (i < lines.length) {
      const p = document.createElement('p');
      p.textContent = lines[i].text || '\u00A0';
      if (lines[i].cls) p.classList.add(lines[i].cls);
      container.appendChild(p);
      i++;
      setTimeout(step, lineDelay);
    } else if (onDone) {
      onDone();
    }
  }
  step();
}

function runTerminal() {
  typedCmdEl.textContent = '';
  outputEl.innerHTML = '';

  if (prefersReducedMotion) {
    typedCmdEl.textContent = command;
    outputLines.forEach(l => {
      const p = document.createElement('p');
      p.textContent = l.text || '\u00A0';
      if (l.cls) p.classList.add(l.cls);
      outputEl.appendChild(p);
    });
    return;
  }

  typeCommand(command, typedCmdEl, 45, () => {
    setTimeout(() => {
      printOutput(outputLines, outputEl, 220);
    }, 300);
  });
}

// Lance l'animation une fois la page prête
window.addEventListener('load', () => {
  setTimeout(runTerminal, 400);
});

// ==========================================================
// Scroll reveal (IntersectionObserver)
// ==========================================================
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // léger décalage en cascade pour les éléments du même conteneur
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => io.observe(el));
}

// ==========================================================
// Nav : fond au scroll + lien actif
// ==========================================================
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
  const scrollY = window.scrollY;

  // état actif du lien de nav
  let currentId = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (scrollY >= top) currentId = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ==========================================================
// Menu mobile
// ==========================================================
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
