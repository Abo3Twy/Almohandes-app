function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

document.addEventListener('click', (e) => {
  const downloadBtn = e.target.closest('.btn-download');
  if (downloadBtn) {
    window.open(downloadBtn.dataset.url, '_blank');
    return;
  }

  const copyBtn = e.target.closest('.btn-copy');
  if (copyBtn) {
    navigator.clipboard.writeText(copyBtn.dataset.url)
      .then(() => showToast('تم النسخ بنجاح 📋'))
      .catch(() => showToast('تعذر نسخ الرابط'));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchBox');
  searchBox.addEventListener('input', () => {
    const q = searchBox.value.trim().toLowerCase();
    const filtered = ALL_APPS.filter(app =>
      app.name.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q)
    );
    renderApps(filtered);
  });
});
