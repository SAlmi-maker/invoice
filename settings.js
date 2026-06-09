// ============================================================
// JOSKA - Settings Module
// ============================================================

const JOSKA_SETTINGS = (() => {

  let currentSettings = {};
  let pendingLogoFile = null;
  let pendingSealFile = null;

  // ── Init ─────────────────────────────────────────────────
  function init(user) {
    if (!user) return;
    loadSettings(user.uid);
    wireForm(user.uid);
    wireFileUploads();
    initThemeToggle();
    initSidebar();
  }

  // ── Load Settings ─────────────────────────────────────────
  async function loadSettings(uid) {
    try {
      const doc = await db.collection('users').doc(uid)
                          .collection('settings').doc('company').get();
      if (doc.exists) {
        currentSettings = doc.data();
        populateForm(currentSettings);
      }
    } catch (err) {
      console.error('Settings load error:', err);
    }
  }

  function populateForm(data) {
  const fields = ['companyName', 'address', 'phone', 'email', 'website'];

  fields.forEach(f => {
    const el = document.getElementById(`field_${f}`);
    if (el && data[f]) {
      el.value = data[f];
    }
  });

  // Logo Preview
  if (data.logoBase64) {
    const preview = document.getElementById('logoPreview');
    if (preview) {
      preview.src = data.logoBase64;
      preview.style.display = 'block';
    }
  }

  // Seal Preview
  if (data.sealBase64) {
    const preview = document.getElementById('sealPreview');
    if (preview) {
      preview.src = data.sealBase64;
      preview.style.display = 'block';
    }
  }
}

  // ── Form Wiring ───────────────────────────────────────────
  function wireForm(uid) {
    const form = document.getElementById('settingsForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn     = document.getElementById('saveBtn');
      const toast   = document.getElementById('settingsToast');

      setLoading(btn, true);

      try {
        const updates = {
          companyName: document.getElementById('field_companyName')?.value.trim() || '',
          address:     document.getElementById('field_address')?.value.trim()     || '',
          phone:       document.getElementById('field_phone')?.value.trim()       || '',
          email:       document.getElementById('field_email')?.value.trim()       || '',
          website:     document.getElementById('field_website')?.value.trim()     || '',
          updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
        };

        // Save logo as Base64
        if (pendingLogoFile) {
          updates.logoBase64 = await fileToBase64(pendingLogoFile);
          pendingLogoFile = null;
        } else if (currentSettings.logoBase64) {
          updates.logoBase64 = currentSettings.logoBase64;
        }

        // Save seal as Base64
        if (pendingSealFile) {
          updates.sealBase64 = await fileToBase64(pendingSealFile);
          pendingSealFile = null;
        } else if (currentSettings.sealBase64) {
          updates.sealBase64 = currentSettings.sealBase64;
        }

        await db.collection('users').doc(uid)
                .collection('settings').doc('company').set(updates, { merge: true });

        currentSettings = { ...currentSettings, ...updates };
        showToast(toast, 'success', JOSKA_I18N.t('settings.saved'));
      } catch (err) {
        console.error('Settings save error:', err);
        showToast(toast, 'error', JOSKA_I18N.t('settings.error'));
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // ── File Uploads ──────────────────────────────────────────
  function wireFileUploads() {
    wireDropZone('logoDropZone', 'logoInput', 'logoPreview', file => { pendingLogoFile = file; });
    wireDropZone('sealDropZone', 'sealInput', 'sealPreview', file => { pendingSealFile = file; });
  }

  function wireDropZone(zoneId, inputId, previewId, onFile) {
    const zone    = document.getElementById(zoneId);
    const input   = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onFile(file);
        showPreview(preview, file);
      }
    });
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) { onFile(file); showPreview(preview, file); }
    });
  }

  function showPreview(previewEl, file) {
    if (!previewEl) return;
    const reader = new FileReader();
    reader.onload = e => { previewEl.src = e.target.result; previewEl.style.display = 'block'; };
    reader.readAsDataURL(file);
  }

  async function fileToBase64(file) {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);

  });
}

  // ── Helpers ───────────────────────────────────────────────
  function setLoading(btn, state) {
    if (!btn) return;
    btn.disabled = state;
    btn.classList.toggle('loading', state);
    const span = btn.querySelector('span');
    if (span) span.textContent = state ? JOSKA_I18N.t('settings.saving') : JOSKA_I18N.t('settings.saveBtn');
  }

  function showToast(toast, type, message) {
    if (!toast) return;
    toast.textContent = message;
    toast.className   = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const saved  = localStorage.getItem('joska_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next    = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('joska_theme', next);
      });
    }
  }

  function initSidebar() {
    const hamburger = document.getElementById('hamburger');
    const sidebar   = document.getElementById('sidebar');
    const overlay   = document.getElementById('sidebarOverlay');

    if (hamburger && sidebar) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay?.classList.toggle('show');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }
  }

  return { init };
})();


// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  JOSKA_I18N.init();
  JOSKA_AUTH.init();

  document.addEventListener('joska:authReady', ({ detail }) => {
    if (detail.user) JOSKA_SETTINGS.init(detail.user);
  });
});
