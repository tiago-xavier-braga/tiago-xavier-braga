import { buildBackground } from './background.js';
import { initReveal } from './reveal.js';
import { ICONS } from './icons.js';
import { escapeHTML, sanitizeInline, debounce } from './sanitize.js';

const FALLBACK = {
  name: 'Tiago Xavier Braga',
  role: 'Game Developer',
  bio: 'Unity & C# developer crafting immersive experiences across WebGL, mobile, and VR.',
  status: 'AVAILABLE',
  about: {
    title: 'Who I Am',
    paragraphs: [
      'Unity & C# developer crafting immersive experiences across WebGL, mobile, and VR.',
      'My background sits at the intersection of <strong>software engineering and interactive design</strong> — I care as much about how a system is architected as how it feels to use.',
      'Outside of work: prototyping new mechanics, reading about procedural generation, and debugging physics edge cases over coffee.'
    ]
  },
  stats: {
    yearsActive: 6,
    projectsShipped: 4,
    rolesHeld: 3,
    primaryEngine: 'Unity'
  },
  itchio: {
    url: 'https://xavigames.itch.io/',
    label: 'Play My Games',
    description: 'Check out my published games and prototypes on itch.io'
  },
  contact: [
    { label: 'GitHub', url: 'https://github.com/tiago-xavier-braga', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/tiago-xavier-braga', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:braga.tiagoxavier@gmail.com', icon: 'mail' },
    { label: 'itch.io', url: 'https://xavigames.itch.io/', icon: 'itchio' }
  ],
  experience: [
    { company: 'Haus', role: 'Game Developer', period: '2023 — Present', description: 'Building high-fidelity simulators in Unity for professional training environments.' },
    { company: 'Xavi Games', role: 'Indie Game Developer', period: '2025 — Present', description: 'Solo indie studio publishing personal game projects end-to-end.' }
  ],
  projects: [
    { title: 'Dominoes Colors', description: 'A relaxing puzzle game where you mix colors as you place each piece.', tags: ['Unity', 'C#', 'Puzzle'], platform: 'steam', url: '#', featured: true },
    { title: 'Police Chase', description: 'Arcade racing game escaping relentless police cars.', tags: ['Unity', 'Arcade', 'Web'], platform: 'itchio', url: '#', featured: true },
    { title: 'Train Rush', description: 'Rebuild a forgotten station into a thriving transport empire.', tags: ['Unity', 'Tycoon', 'Web'], platform: 'itchio', url: '#', featured: true }
  ]
};

function firstName(name) {
  return escapeHTML((name || '').split(' ').slice(0, 2).join(' '));
}

function lastName(name) {
  return escapeHTML((name || '').split(' ')[2] || '');
}

function projectCard(p, index) {
  const tags = (p.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('');
  const num = String(index + 1).padStart(2, '0');
  return `
    <div class="project-card glass">
      <div class="card-num">PROJECT_${num}</div>
      <div class="card-title">${escapeHTML(p.title)}</div>
      <p class="card-desc">${escapeHTML(p.description)}</p>
      <div class="card-footer">
        <div class="tag-list">${tags}</div>
        <a href="${escapeHTML(p.url || '#')}" class="card-link" target="_blank" rel="noopener noreferrer">View Project</a>
      </div>
    </div>`;
}

function experienceItems(list) {
  return list.map((e, i, arr) => `
    <div class="exp-item reveal reveal-d${Math.min(i + 1, 3)}">
      <div class="exp-spine">
        <div class="exp-dot"></div>
        ${i < arr.length - 1 ? '<div class="exp-line"></div>' : ''}
      </div>
      <div class="exp-body">
        <div class="exp-period">${escapeHTML(e.period)}</div>
        <div class="exp-role">${escapeHTML(e.role)}</div>
        <div class="exp-company">${escapeHTML(e.company)}</div>
        <p class="exp-desc">${escapeHTML(e.description)}</p>
      </div>
    </div>`).join('');
}

function contactCards(list) {
  return list.map((c, i) => `
    <a href="${escapeHTML(c.url)}"
       class="contact-card glass reveal reveal-d${Math.min(i + 1, 3)}"
       target="_blank" rel="noopener noreferrer">
      ${ICONS[c.icon] || ''}
      ${escapeHTML(c.label)}
    </a>`).join('');
}

function aboutParagraphs(about) {
  return (about.paragraphs || []).map(p => `<p>${sanitizeInline(p)}</p>`).join('');
}

function render(d) {
  const s = d.stats || {};
  const allProjects = d.projects || [];
  const about = d.about || { title: 'Who I Am', paragraphs: [d.bio || ''] };

  const years = s.yearsActive ?? (new Date().getFullYear() - 2019);
  const shipped = s.projectsShipped ?? allProjects.length;
  const roles = s.rolesHeld ?? (d.experience || []).length;
  const engine = s.primaryEngine ?? 'Unity';

  const featured = allProjects.filter(p => p.featured).slice(0, 3);
  const featList = featured.length ? featured : allProjects.slice(0, 3);

  document.getElementById('root').innerHTML = `
    <nav class="site-nav">
      <a href="index.html" class="nav-logo">
        ${firstName(d.name)} <span>${lastName(d.name)}</span>
      </a>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div class="nav-status">
        <div class="status-dot"></div>
        ${escapeHTML(d.status ?? 'AVAILABLE')}
      </div>
    </nav>

    <section id="hero">
      <div class="container">
        <div class="hero-eyebrow">Game Developer</div>
        <h1 class="hero-name">
          ${firstName(d.name)}
          <span class="surname">${lastName(d.name)}</span>
        </h1>
        <div class="hero-role">${escapeHTML(d.role)}</div>
        <p class="hero-bio">${escapeHTML(d.bio)}</p>
        <div class="hero-cta">
          <a href="projects.html" class="btn btn-primary">View Projects</a>
          <a href="#contact" class="btn btn-ghost">Contact</a>
        </div>
      </div>
    </section>

    <div id="featured">
      <div class="container">
        <div class="feat-header">
          <div>
            <div class="section-label">Featured</div>
            <h2 class="section-title reveal" style="margin-bottom:0">Highlighted Work</h2>
          </div>
          <a href="projects.html" class="feat-see-all">See All Projects</a>
        </div>
        <div class="feat-grid">
          ${featList.map((p, i) => projectCard(p, i)).join('')}
        </div>
      </div>
    </div>

    <section id="about" class="home-section">
      <div class="container">
        <div class="section-label">About</div>
        <h2 class="section-title reveal">${escapeHTML(about.title)}</h2>
        <div class="about-grid">
          <div class="about-text reveal reveal-d1">
            ${aboutParagraphs(about)}
          </div>
          <div class="reveal reveal-d2">
            <div class="stat-ledger glass">
              <div class="ledger-head"><span>Metric</span><span>Value</span></div>
              <div class="ledger-row">
                <span class="ledger-key">Years active</span>
                <span class="ledger-val">${years}+</span>
              </div>
              <div class="ledger-row">
                <span class="ledger-key">Projects shipped</span>
                <span class="ledger-val">${shipped}+</span>
              </div>
              <div class="ledger-row">
                <span class="ledger-key">Roles held</span>
                <span class="ledger-val">${roles}</span>
              </div>
              <div class="ledger-row">
                <span class="ledger-key">Primary engine</span>
                <span class="ledger-val" style="font-size:18px;letter-spacing:2px">${escapeHTML(engine.toUpperCase())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="experience" class="home-section">
      <div class="container">
        <div class="section-label">Experience</div>
        <h2 class="section-title reveal">Career Path</h2>
        <div class="exp-list">
          ${experienceItems(d.experience || [])}
        </div>
      </div>
    </section>

    ${d.itchio ? `
    <section class="home-section" style="padding-top:0;border-top:none">
      <div class="container">
        <div class="itchio-banner glass">
          <div>
            <div class="itchio-label">Play My Games</div>
            <div class="itchio-title">${escapeHTML(d.itchio.label)}</div>
            <p class="itchio-desc">${escapeHTML(d.itchio.description)}</p>
          </div>
          <a href="${escapeHTML(d.itchio.url)}" class="btn-itchio" target="_blank" rel="noopener noreferrer">Open itch.io →</a>
        </div>
      </div>
    </section>` : ''}

    <section id="contact" class="home-section">
      <div class="container">
        <div class="section-label">Contact</div>
        <h2 class="section-title reveal">Let's Talk</h2>
        <div class="contact-grid">
          ${contactCards(d.contact || [])}
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <span>© ${new Date().getFullYear()}</span>
      <span class="sep">◆</span>
      <span>${escapeHTML(d.name)}</span>
      <span class="sep">◆</span>
      <span>Game Developer</span>
    </footer>
  `;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  initReveal();
  setTimeout(buildBackground, 100);
}

async function loadData() {
  try {
    const res = await fetch('./data/profile.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[home.js] Could not load profile.json, using fallback.', err);
    return FALLBACK;
  }
}

async function boot() {
  buildBackground();
  window.addEventListener('resize', debounce(buildBackground, 150));
  const data = await loadData();
  document.getElementById('loading').remove();
  render(data);
}

boot();
