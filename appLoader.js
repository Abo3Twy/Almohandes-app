let ALL_APPS = [];

async function loadApps() {
  const grid = document.getElementById('appsGrid');
  try {
    const res = await fetch('data.json');
    ALL_APPS = await res.json();
    renderApps(ALL_APPS);
  } catch (err) {
    grid.innerHTML = '<p class="empty-state">تعذر تحميل قائمة التطبيقات.</p>';
    console.error(err);
  }
}

function renderApps(apps) {
  const grid = document.getElementById('appsGrid');
  grid.innerHTML = '';

  if (!apps.length) {
    grid.innerHTML = '<p class="empty-state">لا توجد تطبيقات مطابقة.</p>';
    return;
  }

  apps.forEach(app => {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.innerHTML = `
      <div class="app-card-top">
        <div class="app-icon" style="background-image:url('${app.icon}')"></div>
        <div>
          <div class="app-name">${app.name}</div>
          <div class="app-meta">${app.version} · ${app.size} · ${app.category}</div>
        </div>
      </div>
      <div class="app-desc">${app.description}</div>
      <div class="app-actions">
        <button class="btn btn-download" data-url="${app.downloadUrl}">تحميل</button>
        <button class="btn btn-copy" data-url="${app.downloadUrl}" title="نسخ رابط التحميل">🔗</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadApps);
