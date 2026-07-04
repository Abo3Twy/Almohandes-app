let STORE = {};
let ALL_APPS = [];
let CURRENT_CAT = 'الكل';

async function loadStore() {
  const grid = document.getElementById('appsGrid');
  try {
    const res = await fetch('data.json?v=' + Date.now());
    const data = await res.json();
    STORE = data.store || {};
    ALL_APPS = data.apps || [];
    applyBranding();
    buildFilters();
    render();
  } catch (err) {
    grid.innerHTML = '<p class="empty-state">تعذّر تحميل قائمة التطبيقات.</p>';
    console.error(err);
  }
}

function applyBranding() {
  if (STORE.name) {
    document.getElementById('brandName').textContent = STORE.name;
    document.getElementById('heroTitle').textContent = STORE.name;
  }
  if (STORE.tagline) document.getElementById('heroTagline').textContent = STORE.tagline;
  if (STORE.logoText) document.getElementById('brandLogo').textContent = STORE.logoText;
  document.getElementById('statApps').textContent = ALL_APPS.length;
  document.getElementById('year').textContent = new Date().getFullYear();
}

function buildFilters() {
  const cats = ['الكل', ...new Set(ALL_APPS.map(a => a.category).filter(Boolean))];
  const box = document.getElementById('filters');
  box.innerHTML = cats.map(c =>
    `<button class="chip ${c === CURRENT_CAT ? 'active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
}

function iconStyle(app) {
  const color = app.color || '#6c8cff';
  if (app.icon) {
    return `style="background-image:url('${app.icon}'); background-color:${color}"`;
  }
  return `style="background:${color}"`;
}

function iconLetter(app) {
  return app.icon ? '' : (app.name ? app.name.trim()[0] : '?');
}

function stars(rating) {
  return rating ? `★ ${rating}` : '';
}

function render() {
  const grid = document.getElementById('appsGrid');
  const q = (document.getElementById('searchBox').value || '').trim().toLowerCase();

  let list = ALL_APPS.filter(a => {
    const matchCat = CURRENT_CAT === 'الكل' || a.category === CURRENT_CAT;
    const matchQ = !q ||
      a.name.toLowerCase().includes(q) ||
      (a.category || '').toLowerCase().includes(q) ||
      (a.developer || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (!list.length) {
    grid.innerHTML = '<p class="empty-state">لا توجد تطبيقات مطابقة 🔍</p>';
    return;
  }

  grid.innerHTML = list.map((app, i) => `
    <article class="app-card" data-id="${app.id}" style="animation-delay:${i * 0.05}s">
      ${app.featured ? '<span class="featured-tag">⭐ مميّز</span>' : ''}
      <div class="card-top">
        <div class="app-icon" ${iconStyle(app)}>${iconLetter(app)}</div>
        <div class="card-head">
          <div class="app-name">${app.name}</div>
          <div class="app-dev">${app.developer || ''}</div>
        </div>
      </div>
      <div class="badges">
        ${app.rating ? `<span class="badge star">${stars(app.rating)}</span>` : ''}
        ${app.downloads ? `<span class="badge">⬇ ${app.downloads}</span>` : ''}
        ${app.size ? `<span class="badge">${app.size}</span>` : ''}
        ${app.category ? `<span class="badge">${app.category}</span>` : ''}
      </div>
      <p class="app-desc">${app.description || ''}</p>
      <div class="card-actions">
        <button class="btn btn-primary" data-download="${app.downloadUrl}">تحميل</button>
        <button class="btn btn-ghost" data-copy="${app.downloadUrl}" title="نسخ الرابط">
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 9V6a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-3M4 9h7a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2z" stroke="currentColor" stroke-width="1.8"/></svg>
        </button>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadStore);
