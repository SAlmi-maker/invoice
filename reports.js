// ============================================================
// JOSKA — Reports Module
// Handles: revenue stats, monthly breakdown, Chart.js charts,
//          year selector, XLSX export, auth guard.
// ============================================================

const JOSKA_REPORTS = (() => {

  // ── State ─────────────────────────────────────────────────
  let currentUser     = null;
  let companySettings = {};
  let allInvoices     = [];
  let selectedYear    = new Date().getFullYear();
  let unsubscribe     = null;
  let barChart        = null;
  let doughnutChart   = null;

  const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // ── Init ─────────────────────────────────────────────────
  async function init(user) {
    if (!user) return;
    currentUser = user;

    try {
      const snap = await db.collection('users').doc(user.uid)
                           .collection('settings').doc('company').get();
      if (snap.exists) companySettings = snap.data();
    } catch (e) { /* non-critical */ }

    renderUserInfo(user);
    buildYearSelector();
    subscribeToInvoices(user.uid);
    wireUI();
    initThemeToggle();
    initSidebar();
  }

  // ── User info ─────────────────────────────────────────────
  function renderUserInfo(user) {
    const display  = user.displayName || user.email.split('@')[0];
    const initials = display.slice(0, 2).toUpperCase();
    document.querySelectorAll('.user-name').forEach(el => el.textContent = display);
    document.querySelectorAll('.user-email').forEach(el => el.textContent = user.email);
    document.querySelectorAll('.user-avatar-text').forEach(el => el.textContent = initials);
    if (companySettings.companyName) {
      document.querySelectorAll('.company-name').forEach(el => el.textContent = companySettings.companyName);
    }
  }

  // ── Year selector ─────────────────────────────────────────
  function buildYearSelector() {
    const sel = document.getElementById('yearSelect');
    if (!sel) return;
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 4; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      sel.appendChild(opt);
    }
    sel.value = selectedYear;
    sel.addEventListener('change', () => {
      selectedYear = parseInt(sel.value);
      renderAll();
    });
  }

  // ── Firestore real-time subscription ─────────────────────
  function subscribeToInvoices(uid) {
    if (unsubscribe) unsubscribe();

    unsubscribe = db.collection('users').doc(uid)
      .collection('invoices')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        allInvoices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderAll();
      }, err => {
        console.error('Reports subscription error:', err);
      });
  }

  // ── Master render ─────────────────────────────────────────
  function renderAll() {
    updateYearLabels();
    renderSummaryStats();
    renderCharts();
    renderMonthlyTable();
  }

  function updateYearLabels() {
    document.querySelectorAll('#selectedYearLabel, #selectedYearLabelTable')
      .forEach(el => el.textContent = selectedYear);
  }

  // ── Summary Stats ─────────────────────────────────────────
  function renderSummaryStats() {
    const now      = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const thisMonth = now.getMonth();
    const thisYear  = now.getFullYear();

    const currency = JOSKA_I18N.t('common.currency');
    const paid     = allInvoices.filter(inv => inv.status === 'paid');
    const toNum    = inv => parseFloat(inv.total || inv.amount || 0);

    const todayRev = paid
      .filter(inv => (inv.paidAt || getDateStr(inv) || '').startsWith(todayStr))
      .reduce((s, inv) => s + toNum(inv), 0);

    const monthRev = paid
      .filter(inv => {
        const d = toDate(inv.createdAt);
        return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((s, inv) => s + toNum(inv), 0);

    const yearRev = paid
      .filter(inv => {
        const d = toDate(inv.createdAt);
        return d && d.getFullYear() === thisYear;
      })
      .reduce((s, inv) => s + toNum(inv), 0);

    setVal('rValToday',    formatCurrency(todayRev, currency));
    setVal('rValMonth',    formatCurrency(monthRev, currency));
    setVal('rValYear',     formatCurrency(yearRev,  currency));
    setVal('rValInvoices', allInvoices.length);
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // ── Charts ────────────────────────────────────────────────
  function renderCharts() {
    renderBarChart();
    renderDoughnutChart();
  }

  function renderBarChart() {
    const ctx = document.getElementById('revenueBarChart');
    if (!ctx) return;

    const monthlyRevenue = Array(12).fill(0);
    const paid = allInvoices.filter(inv => inv.status === 'paid');

    paid.forEach(inv => {
      const d = toDate(inv.createdAt);
      if (d && d.getFullYear() === selectedYear) {
        monthlyRevenue[d.getMonth()] += parseFloat(inv.total || inv.amount || 0);
      }
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const labelColor = isDark ? '#94a3b8' : '#64748b';

    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTHS_EN,
        datasets: [{
          label: 'Revenue',
          data: monthlyRevenue,
          backgroundColor: 'rgba(37,99,235,0.8)',
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => formatCurrency(ctx.parsed.y, JOSKA_I18N.t('common.currency'))
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor, font: { size: 11 } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: labelColor,
              font: { size: 11 },
              callback: v => formatCurrency(v, JOSKA_I18N.t('common.currency'))
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  function renderDoughnutChart() {
    const ctx = document.getElementById('statusDoughnutChart');
    if (!ctx) return;

    const counts = { paid: 0, pending: 0, overdue: 0, draft: 0 };
    allInvoices.forEach(inv => {
      const s = inv.status || 'draft';
      if (counts[s] !== undefined) counts[s]++;
    });

    const labels = [
      JOSKA_I18N.t('dash.paid'),
      JOSKA_I18N.t('dash.pending'),
      JOSKA_I18N.t('dash.overdue'),
      JOSKA_I18N.t('dash.draft'),
    ];

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#0f172a';

    if (doughnutChart) doughnutChart.destroy();

    doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: [counts.paid, counts.pending, counts.overdue, counts.draft],
          backgroundColor: ['#10b981','#f59e0b','#ef4444','#6b7280'],
          borderWidth: 0,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: { size: 11 },
              padding: 14,
              usePointStyle: true,
              pointStyleWidth: 8,
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed}`
            }
          }
        }
      }
    });
  }

  // ── Monthly breakdown table ───────────────────────────────
  function renderMonthlyTable() {
    const tbody = document.getElementById('monthlyTableBody');
    if (!tbody) return;

    const currency = JOSKA_I18N.t('common.currency');
    const lang     = JOSKA_I18N.getLang();

    // Build 12-month data for selectedYear
    const months = Array.from({ length: 12 }, (_, m) => ({
      month: m,
      total: 0,
      paid: 0,
      pending: 0,
      count: 0,
    }));

    allInvoices.forEach(inv => {
      const d = toDate(inv.createdAt);
      if (!d || d.getFullYear() !== selectedYear) return;
      const m = d.getMonth();
      months[m].count++;
      const amt = parseFloat(inv.total || inv.amount || 0);
      if (inv.status === 'paid')    { months[m].total += amt; months[m].paid++; }
      if (inv.status === 'pending' || inv.status === 'overdue') months[m].pending++;
    });

    const maxRevenue = Math.max(...months.map(m => m.total), 1);

    tbody.innerHTML = '';

    const monthNames = Array.from({ length: 12 }, (_, m) =>
      new Date(selectedYear, m, 1).toLocaleDateString(lang, { month: 'long' })
    );

    months.forEach((data, m) => {
      const pct = data.total > 0 ? Math.round((data.total / maxRevenue) * 100) : 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:600;">${monthNames[m]}</td>
        <td class="num">${data.count}</td>
        <td class="num" style="color:var(--green);">${data.paid}</td>
        <td class="num" style="color:var(--yellow);">${data.pending}</td>
        <td class="revenue">${formatCurrency(data.total, currency)}</td>
        <td class="revenue-bar-cell">
          <div class="revenue-bar-wrap">
            <div class="revenue-bar-bg">
              <div class="revenue-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="revenue-bar-pct">${pct}%</span>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ── Wire UI ───────────────────────────────────────────────
  function wireUI() {
    document.getElementById('exportXlsxBtn')?.addEventListener('click', exportXlsx);
  }

  // ── XLSX Export ───────────────────────────────────────────
  function exportXlsx() {
    const currency = JOSKA_I18N.t('common.currency');
    const lang     = JOSKA_I18N.getLang();

    const monthNames = Array.from({ length: 12 }, (_, m) =>
      new Date(selectedYear, m, 1).toLocaleDateString(lang, { month: 'long' })
    );

    const months = Array.from({ length: 12 }, (_, m) => ({
      month: m, total: 0, paid: 0, pending: 0, count: 0,
    }));

    allInvoices.forEach(inv => {
      const d = toDate(inv.createdAt);
      if (!d || d.getFullYear() !== selectedYear) return;
      const m = d.getMonth();
      months[m].count++;
      const amt = parseFloat(inv.total || inv.amount || 0);
      if (inv.status === 'paid')    { months[m].total += amt; months[m].paid++; }
      if (inv.status === 'pending' || inv.status === 'overdue') months[m].pending++;
    });

    // Sheet 1: Monthly summary
    const summaryRows = [
      ['Month', 'Invoices', 'Paid', 'Pending/Overdue', `Revenue (${currency})`],
      ...months.map((d, m) => [
        monthNames[m], d.count, d.paid, d.pending,
        parseFloat(d.total.toFixed(2))
      ]),
      [],
      ['Total', '', '', '', parseFloat(months.reduce((s, d) => s + d.total, 0).toFixed(2))],
    ];

    // Sheet 2: Invoice detail
    const detailRows = [
      ['#', 'Invoice No.', 'Client', 'Vehicle', 'Start Date', 'End Date', `Total (${currency})`, 'Status', 'Created'],
    ];
    allInvoices.forEach((inv, i) => {
      const d = toDate(inv.createdAt);
      const vehicle = [inv.vehicleBrand, inv.vehicleModel].filter(Boolean).join(' ') || '—';
      detailRows.push([
        i + 1,
        inv.invoiceNumber || inv.id.slice(-6).toUpperCase(),
        inv.clientName   || '—',
        vehicle,
        inv.startDate    || '—',
        inv.endDate      || '—',
        parseFloat(parseFloat(inv.total || 0).toFixed(2)),
        inv.status       || 'draft',
        d ? d.toLocaleDateString(lang) : '—',
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
    const ws2 = XLSX.utils.aoa_to_sheet(detailRows);

    ws1['!cols'] = [{ wch: 16 }, { wch: 10 }, { wch: 8 }, { wch: 16 }, { wch: 18 }];
    ws2['!cols'] = [{ wch: 5 }, { wch: 14 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 14 }];

    XLSX.utils.book_append_sheet(wb, ws1, `Summary ${selectedYear}`);
    XLSX.utils.book_append_sheet(wb, ws2, 'All Invoices');

    const company = companySettings.companyName || 'JOSKA';
    XLSX.writeFile(wb, `${company}_Report_${selectedYear}.xlsx`);
  }

  // ── Theme toggle ──────────────────────────────────────────
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const saved  = localStorage.getItem('joska_theme') || 'light';
    applyTheme(saved);
    toggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('joska_theme', next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.querySelector('.theme-icon-sun')?.classList.toggle('hidden',  theme === 'light');
      toggle.querySelector('.theme-icon-moon')?.classList.toggle('hidden', theme === 'dark');
    }
    // Re-render charts with new colors if data is loaded
    if (allInvoices.length > 0) renderCharts();
  }

  // ── Sidebar ───────────────────────────────────────────────
  function initSidebar() {
    const hamburger = document.getElementById('hamburger');
    const sidebar   = document.getElementById('sidebar');
    const overlay   = document.getElementById('sidebarOverlay');
    hamburger?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('show');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  function toDate(ts) {
    if (!ts) return null;
    if (ts.toDate) return ts.toDate();
    if (ts instanceof Date) return ts;
    return null;
  }

  function getDateStr(inv) {
    const d = toDate(inv.createdAt);
    return d ? d.toISOString() : '';
  }

  function formatCurrency(amount, currency) {
    if (isNaN(amount)) amount = 0;
    return new Intl.NumberFormat(JOSKA_I18N.getLang(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + currency;
  }

  return { init };
})();


// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  JOSKA_I18N.init();
  JOSKA_AUTH.init();

  document.addEventListener('joska:authReady', ({ detail }) => {
    if (detail.user) JOSKA_REPORTS.init(detail.user);
  });

  document.addEventListener('joska:langChanged', () => {
    JOSKA_I18N.applyToDOM();
  });
});
