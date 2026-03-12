import { buildBackground } from './background.js';
import { initReveal } from './reveal.js';
import { ICONS, platformInfo } from './icons.js';

const FALLBACK_PROJECTS = [
  { title: 'Dominoes Colors', description: 'A relaxing puzzle game where you mix colors as you place each piece on the board.', tags: ['Unity', 'C#', 'Puzzle'], platform: 'steam', url: 'https://store.steampowered.com/app/2372580/Dominoes_Colors/' },
  { title: 'Police Chase', description: 'Arcade racing game escaping relentless police cars.', tags: ['Unity', 'Arcade', 'Web'], platform: 'itchio', url: 'https://xavigames.itch.io/' },
  { title: 'Train Rush', description: 'Rebuild a forgotten station into a thriving transport empire.', tags: ['Unity', 'Tycoon', 'Web'], platform: 'itchio', url: 'https://xavigames.itch.io/' },
];

const FALLBACK_META = {
  name: 'Tiago Xavier Braga',
  status: 'AVAILABLE',
};

function projectCard(project, index) {
  const { title, description, tags = [], platform, url } = project;
  const { label, iconKey } = platformInfo(platform);
  const tagHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
  const num = String(index + 1).padStart(2, '0');
  return `
    <a class="project-card glass reveal reveal-d${(index % 3) + 1}"
       href="${url || '#'}"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Open ${title} on ${label}">
      <div class="card-arrow">${ICONS.arrowUpRight}</div>
      <div class="card-num">PROJECT_${num}</div>
      <div class="card-title">${title}</div>
      <p class="card-desc">${description}</p>
      <div class="card-footer">
        <div class="tag-list">${tagHTML}</div>
        <span class="platform-badge">${ICONS[iconKey] || ''}${label}</span>
      </div>
    </a>`;
}

function render(projects, meta) {
  const gridEl = document.getElementById('projects-grid');
  if (!projects.length) {
    gridEl.innerHTML = `<p class="projects-empty">No projects found.</p>`;
  } else {
    gridEl.innerHTML = projects.map((p, i) => projectCard(p, i)).join('');
  }

  const logoEl = document.querySelector('.nav-logo');
  if (logoEl) {
    const parts = meta.name.split(' ');
    logoEl.innerHTML = `${parts.slice(0, 2).join(' ')} <span>${parts[2] || ''}</span>`;
  }

  const statusEl = document.querySelector('.nav-status');
  if (statusEl) {
    statusEl.innerHTML = `<div class="status-dot"></div>${meta.status || 'AVAILABLE'}`;
  }

  const footerName = document.querySelector('.footer-name');
  if (footerName) footerName.textContent = meta.name;
  const footerYear = document.querySelector('.footer-year');
  if (footerYear) footerYear.textContent = `© ${new Date().getFullYear()}`;

  initReveal();
  setTimeout(buildBackground, 100);
}

async function loadData() {
  try {
    const res = await fetch('./data/profile.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[projects.js] Could not load profile.json, using fallback.', err);
    return { projects: FALLBACK_PROJECTS, ...FALLBACK_META };
  }
}

async function boot() {
  buildBackground();
  window.addEventListener('resize', buildBackground);
  const data = await loadData();
  render(data.projects || [], { name: data.name, status: data.status });
}

boot();
