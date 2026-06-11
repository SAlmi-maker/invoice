const JOSKA_DASHBOARD = (() => {
  let currentUser = null;
  let allInvoices = [];
  let companySettings = {};
  let unsubscribe = null;

  function init(user) {
    if (!user) return;
    currentUser = user;
    loadSettings(user.uid);
    subscribeToInvoices(user.uid);
    renderUserInfo(user);
    initThemeToggle();
    initSidebar();
    wireActions();
  }

  function renderUserInfo(user) {
    const display = user.displayName || user.email.split('@')[0];
    const initials = display.slice(0, 2).toUpperCase();
    document.querySelectorAll('.user-name').forEach(el => el.textContent = display);
    document.querySelectorAll('.user-email').forEach(el => el.textContent = user.email);
    document.querySelectorAll('.user-avatar-text').forEach(el => el.textContent = initials);
  }

  async function loadSettings(uid) {
    try {
      const snap = await db.collection('users').doc(uid)
        .collection('settings').doc('company').get();
      if (snap.exists) {
        companySettings = snap.data();
        if (companySettings.companyName) {
          document.querySelectorAll('.company-name').forEach(el => el.textContent = companySettings.companyName);
        }
      }
    } catch (e) { /* non-critical */ }
  }

  function subscribeToInvoices(uid) {
    if (unsubscribe) unsubscribe();
    setLoading(true);
    unsubscribe = db.collection('users').doc(uid)
      .collection('invoices')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        allInvoices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderAll();
        setLoading(false);
        const badge = document.getElementById('navInvoiceCount');
        if (badge) badge.textContent = allInvoices.length;
      }, err => {
        console.error('Dashboard subscription error:', err);
        setLoading(false);
      });
  }

  function renderAll() {
    renderStats();
    renderRecentInvoices();
  }

  function renderStats() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const currency = JOSKA_I18N.t('common.currency');

    const paid = allInvoices.filter(inv => inv.status === 'paid');
    const toNum = inv => parseFloat(inv.total || inv.amount || 0);

    const todayRev = paid.filter(inv => {
      const d = getDate(inv);
      return d && d.toISOString().split('T')[0] === todayStr;
    }).reduce((s, inv) => s + toNum(inv), 0);

    const monthRev = paid.filter(inv => {
      const d = getDate(inv);
      return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).reduce((s, inv) => s + toNum(inv), 0);

    const yearRev = paid.filter(inv => {
      const d = getDate(inv);
      return d && d.getFullYear() === thisYear;
    }).reduce((s, inv) => s + toNum(inv), 0);

    setText('dashValToday', formatCurrency(todayRev, currency));
    setText('dashValMonth', formatCurrency(monthRev, currency));
    setText('dashValYear', formatCurrency(yearRev, currency));
    setText('dashValInvoices', allInvoices.length);

    document.querySelectorAll('.stat-card').forEach(c => c.classList.add('visible'));
  }

  function renderRecentInvoices() {
    const tbody = document.getElementById('dashRecentBody');
    if (!tbody) return;
    const lang = JOSKA_I18N.getLang();
    const currency = JOSKA_I18N.t('common.currency');
    const recent = allInvoices.slice(0, 5);

    if (!recent.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:var(--text-tertiary);">${JOSKA_I18N.t('dash.noData')}</td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map((inv, i) => {
      const status = inv.status || 'draft';
      const statusLabel = JOSKA_I18N.t(`dash.${status}`);
      const date = getDate(inv);
      const dateStr = date ? date.toLocaleDateString(lang) : '—';
      const vehicle = [inv.vehicleBrand, inv.vehicleModel].filter(Boolean).join(' ') || '—';
      return `<tr class="fade-in-row" style="animation-delay:${i*50}ms">
        <td>${escHtml(inv.clientName || '—')}</td>
        <td style="color:var(--text-secondary);font-size:0.85rem;">${escHtml(vehicle)}</td>
        <td><span class="badge badge-${status}">${statusLabel}</span></td>
        <td style="text-align:right;font-weight:600;">${formatCurrency(parseFloat(inv.total||0), currency)}</td>
      </tr>`;
    }).join('');
  }

  function wireActions() {
    document.getElementById('btnNewInvoiceDash')?.addEventListener('click', () => {
      window.location.href = 'invoices.html';
    });
  }

  function getDate(inv) {
    if (inv.createdAt?.toDate) return inv.createdAt.toDate();
    if (inv.date) return new Date(inv.date);
    return null;
  }

  function formatCurrency(amount, currency) {
    if (isNaN(amount)) amount = 0;
    return new Intl.NumberFormat(JOSKA_I18N.getLang(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' ' + currency;
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setLoading(state) {
    document.querySelectorAll('.stat-card').forEach(c => c.classList.toggle('skeleton', state));
  }

  function initThemeToggle() {
    const saved = localStorage.getItem('joska_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('joska_theme', next);
    });
  }

  function initSidebar() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    hamburger?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('show');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  JOSKA_I18N.init();
  JOSKA_AUTH.init();
  document.addEventListener('joska:authReady', ({ detail }) => {
    if (detail.user) JOSKA_DASHBOARD.init(detail.user);
  });
  document.addEventListener('joska:langChanged', () => {
    JOSKA_I18N.applyToDOM();
  });
});
