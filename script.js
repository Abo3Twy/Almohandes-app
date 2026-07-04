function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

function findApp(id) {
  return ALL_APPS.find(a => a.id === id);
}

function openModal(app) {
  const card = document.getElementById('modalCard');
  card.innerHTML = `
    <button class="modal-close" data-close>✕</button>
    <div class="modal-head">
      <div class="app-icon" ${iconStyle(app)}>${iconLetter(app)}</div>
      <div>
        <div class="modal-title">${app.name}</div>
        <div class="app-dev">${app.developer || ''}</div>
      </div>
    </div>
    <div class="modal-meta-grid">
      <div class="meta-box"><strong style="color:var(--star)">${app.rating || '—'}</strong><span>التقييم</span></div>
      <div class="meta-box"><strong>${app.downloads || '—'}</strong><span>تحميلات</span></div>
      <div class="meta-box"><strong>${app.size || '—'}</strong><span>الحجم</span></div>
      <div class="meta-box"><strong>${app.version || '—'}</strong><span>الإصدار</span></div>
    </div>
    <p class="modal-long">${app.longDescription || app.description || ''}</p>
    <div class="modal-actions">
      <button class="btn btn-primary" data-download="${app.downloadUrl}">⬇ تحميل الآن</button>
      <button class="btn btn-ghost" data-copy="${app.downloadUrl}" title="نسخ الرابط">
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 9V6a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-3M4 9h7a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2z" stroke="currentColor" stroke-width="1.8"/></svg>
      </button>
    </div>
  `;
  document.getElementById('modal').classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

document.addEventListener('click', (e) => {
  // تحميل
  const dl = e.target.closest('[data-download]');
  if (dl) { e.stopPropagation(); window.open(dl.dataset.download, '_blank'); return; }

  // نسخ الرابط
  const cp = e.target.closest('[data-copy]');
  if (cp) {
    e.stopPropagation();
    navigator.clipboard.writeText(cp.dataset.copy)
      .then(() => showToast('تم نسخ الرابط بنجاح 📋'))
      .catch(() => showToast('تعذّر نسخ الرابط'));
    return;
  }

  // فلتر فئة
  const chip = e.target.closest('.chip');
  if (chip) {
    CURRENT_CAT = chip.dataset.cat;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
    render();
    return;
  }

  // إغلاق النافذة
  if (e.target.closest('[data-close]') || e.target.id === 'modal') { closeModal(); return; }

  // فتح تفاصيل التطبيق
  const cardEl = e.target.closest('.app-card');
  if (cardEl) {
    const app = findApp(cardEl.dataset.id);
    if (app) openModal(app);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchBox').addEventListener('input', () => render());
});
