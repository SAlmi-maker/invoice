// ============================================================
// JOSKA — Invoices Module
// Handles: create/edit/delete invoices, Firestore CRUD,
//          live totals, filtering, search, jsPDF export.
// ============================================================

const JOSKA_INVOICES = (() => {

  // ── State ─────────────────────────────────────────────────
  let currentUser    = null;
  let companySettings = {};
  let allInvoices    = [];
  let filteredInvoices = [];
  let activeStatus   = 'all';
  let searchQuery    = '';
  let editingId      = null;   // null = new, string = editing
  let deleteTargetId = null;
  let unsubscribe    = null;

  // ── Init ─────────────────────────────────────────────────
  async function init(user) {
    if (!user) return;
    currentUser = user;

    // Load company settings for PDF header
    try {
      const snap = await db.collection('users').doc(user.uid)
                           .collection('settings').doc('company').get();
      if (snap.exists) companySettings = snap.data();
    } catch (e) { /* non-critical */ }

    renderUserInfo(user);
    subscribeToInvoices(user.uid);
    wireUI();
    initThemeToggle();
    initSidebar();
    setTodayAsDefault();
  }

  // ── User info in sidebar ──────────────────────────────────
  function renderUserInfo(user) {
    const display = user.displayName || user.email.split('@')[0];
    const initials = display.slice(0, 2).toUpperCase();
    document.querySelectorAll('.user-name').forEach(el => el.textContent = display);
    document.querySelectorAll('.user-email').forEach(el => el.textContent = user.email);
    document.querySelectorAll('.user-avatar-text').forEach(el => el.textContent = initials);
    if (companySettings.companyName) {
      document.querySelectorAll('.company-name').forEach(el => el.textContent = companySettings.companyName);
    }
  }

  // ── Firestore real-time subscription ─────────────────────
  function subscribeToInvoices(uid) {
    if (unsubscribe) unsubscribe();
    showLoading(true);

    unsubscribe = db.collection('users').doc(uid)
      .collection('invoices')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        allInvoices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        applyFilters();
        showLoading(false);

        // Update nav badge
        const badge = document.getElementById('navInvoiceCount');
        if (badge) badge.textContent = allInvoices.length;
      }, err => {
        console.error('Invoice subscription error:', err);
        showLoading(false);
        showToast('error', JOSKA_I18N.t('settings.error'));
      });
  }

  // ── Filter & search ───────────────────────────────────────
  function applyFilters() {
    let list = allInvoices;

    if (activeStatus !== 'all') {
      list = list.filter(inv => inv.status === activeStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(inv =>
        (inv.clientName  || '').toLowerCase().includes(q) ||
        (inv.cin         || '').toLowerCase().includes(q) ||
        (inv.vehicleBrand|| '').toLowerCase().includes(q) ||
        (inv.vehicleModel|| '').toLowerCase().includes(q) ||
        (inv.plate       || '').toLowerCase().includes(q) ||
        (inv.invoiceNumber || '').toLowerCase().includes(q)
      );
    }

    filteredInvoices = list;
    renderTable(filteredInvoices);

    const badge = document.getElementById('invCountBadge');
    if (badge) badge.textContent = filteredInvoices.length;
  }

  // ── Render table ──────────────────────────────────────────
  function renderTable(invoices) {
    const tbody = document.getElementById('invTableBody');
    const empty = document.getElementById('invEmpty');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!invoices.length) {
      if (empty) empty.style.display = 'flex';
      return;
    }
    if (empty) empty.style.display = 'none';

    const currency = JOSKA_I18N.t('common.currency');
    const lang     = JOSKA_I18N.getLang();

    invoices.forEach((inv, i) => {
      const tr = document.createElement('tr');
      tr.style.animationDelay = `${i * 40}ms`;
      tr.classList.add('fade-in-row');

      const date = toDate(inv.createdAt);
      const dateStr = date ? date.toLocaleDateString(lang) : '—';

      const startStr = inv.startDate || '—';
      const endStr   = inv.endDate   || '—';
      const period   = (inv.startDate && inv.endDate)
        ? `${formatShortDate(inv.startDate, lang)} → ${formatShortDate(inv.endDate, lang)}`
        : '—';

      const total    = parseFloat(inv.total || 0);
      const status   = inv.status || 'draft';
      const statusLabel = JOSKA_I18N.t(`dash.${status}`);

      const num = inv.invoiceNumber || inv.id.slice(-6).toUpperCase();
      const vehicle = [inv.vehicleBrand, inv.vehicleModel].filter(Boolean).join(' ') || '—';

      tr.innerHTML = `
        <td><span class="invoice-num">#${escHtml(num)}</span></td>
        <td>
          <div style="font-weight:600;font-size:0.875rem;">${escHtml(inv.clientName || '—')}</div>
          <div style="font-size:0.75rem;color:var(--text-tertiary);">${escHtml(inv.cin || '')}</div>
        </td>
        <td>
          <div style="font-size:0.875rem;">${escHtml(vehicle)}</div>
          <div style="font-size:0.75rem;color:var(--text-tertiary);">${escHtml(inv.plate || '')}</div>
        </td>
        <td style="font-size:0.82rem;color:var(--text-secondary);">${period}</td>
        <td><span class="amount">${formatCurrency(total, currency)}</span></td>
        <td><span class="badge badge-${status}">${statusLabel}</span></td>
        <td>
          <div class="row-actions">
            <button class="inv-action-btn" title="Edit" onclick="JOSKA_INVOICES.openEdit('${inv.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="inv-action-btn" title="Download PDF" onclick="JOSKA_INVOICES.exportSingle('${inv.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <button class="inv-action-btn danger" title="Delete" onclick="JOSKA_INVOICES.openDelete('${inv.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </td>`;

      tbody.appendChild(tr);
    });
  }

  // ── Wire all UI events ────────────────────────────────────
  function wireUI() {
    // New invoice button
    document.getElementById('btnNewInvoice')?.addEventListener('click', openNew);

    // Modal close buttons
    document.getElementById('modalClose')?.addEventListener('click',  closeModal);
    document.getElementById('modalCancel')?.addEventListener('click', closeModal);

    // Click outside modal to close
    document.getElementById('invoiceModal')?.addEventListener('click', e => {
      if (e.target === document.getElementById('invoiceModal')) closeModal();
    });

    // Save buttons
    document.getElementById('modalSave')?.addEventListener('click', () => saveInvoice(false));
    document.getElementById('modalSaveDraft')?.addEventListener('click', () => saveInvoice(true));
    document.getElementById('modalPDF')?.addEventListener('click', () => saveAndExport());

    // Delete modal
    document.getElementById('deleteModalClose')?.addEventListener('click', closeDeleteModal);
    document.getElementById('deleteCancelBtn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('deleteConfirmBtn')?.addEventListener('click', confirmDelete);
    document.getElementById('deleteModal')?.addEventListener('click', e => {
      if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
    });

    // Export all filtered
    document.getElementById('btnExportAll')?.addEventListener('click', exportFiltered);

    // Search
    document.getElementById('invSearch')?.addEventListener('input', e => {
      searchQuery = e.target.value;
      applyFilters();
    });

    // Status tabs
    document.querySelectorAll('.inv-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.inv-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStatus = btn.dataset.status;
        applyFilters();
      });
    });

    // Live totals
    const priceFields = ['inv_dailyPrice','inv_startDate','inv_endDate','inv_insurance','inv_fuel','inv_extraDriver','inv_other'];
    priceFields.forEach(id => {
      document.getElementById(id)?.addEventListener('input', recalculate);
      document.getElementById(id)?.addEventListener('change', recalculate);
    });

    // Force uppercase plate
    document.getElementById('inv_plate')?.addEventListener('input', e => {
      const pos = e.target.selectionStart;
      e.target.value = e.target.value.toUpperCase();
      e.target.setSelectionRange(pos, pos);
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (document.getElementById('invoiceModal')?.classList.contains('open')) closeModal();
        if (document.getElementById('deleteModal')?.classList.contains('open')) closeDeleteModal();
      }
    });
  }

  // ── Default dates ─────────────────────────────────────────
  function setTodayAsDefault() {
    const today = new Date().toISOString().split('T')[0];
    const startEl = document.getElementById('inv_startDate');
    const endEl   = document.getElementById('inv_endDate');
    if (startEl && !startEl.value) startEl.value = today;
    if (endEl   && !endEl.value)   endEl.value   = today;
  }

  // ── Modal open/close ──────────────────────────────────────
  function openNew() {
    editingId = null;
    resetForm();
    setTodayAsDefault();
    recalculate();
    document.getElementById('modalTitle').setAttribute('data-i18n', 'inv.newInvoice');
    document.getElementById('modalTitle').textContent = JOSKA_I18N.t('inv.newInvoice');
    document.getElementById('invoiceModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('inv_clientName')?.focus(), 100);
  }

  function openEdit(id) {
    const inv = allInvoices.find(i => i.id === id);
    if (!inv) return;
    editingId = id;
    populateForm(inv);
    recalculate();
    document.getElementById('modalTitle').textContent = `${JOSKA_I18N.t('common.edit')} #${inv.invoiceNumber || id.slice(-6).toUpperCase()}`;
    document.getElementById('invoiceModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('invoiceModal').classList.remove('open');
    document.body.style.overflow = '';
    editingId = null;
  }

  // ── Delete modal ──────────────────────────────────────────
  function openDelete(id) {
    deleteTargetId = id;
    document.getElementById('deleteModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
    document.body.style.overflow = '';
    deleteTargetId = null;
  }

  async function confirmDelete() {
    if (!deleteTargetId || !currentUser) return;
    const btn = document.getElementById('deleteConfirmBtn');
    btn.disabled = true;
    try {
      await db.collection('users').doc(currentUser.uid)
              .collection('invoices').doc(deleteTargetId).delete();
      showToast('success', JOSKA_I18N.t('inv.deleted'));
      closeDeleteModal();
    } catch (e) {
      console.error(e);
      showToast('error', JOSKA_I18N.t('settings.error'));
    } finally {
      btn.disabled = false;
    }
  }

  // ── Form helpers ──────────────────────────────────────────
  function resetForm() {
    document.getElementById('invoiceForm').reset();
    document.getElementById('inv_id').value = '';
    document.getElementById('inv_status').value = 'draft';
    ['inv_insurance','inv_fuel','inv_extraDriver','inv_other'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '0';
    });
  }

  function populateForm(inv) {
    resetForm();
    const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el.value = val; };
    set('inv_id',           inv.id);
    set('inv_clientName',   inv.clientName);
    set('inv_cin',          inv.cin);
    set('inv_phone',        inv.phone);
    set('inv_vehicleBrand', inv.vehicleBrand);
    set('inv_vehicleModel', inv.vehicleModel);
    set('inv_plate',        inv.plate);
    set('inv_startDate',    inv.startDate);
    set('inv_endDate',      inv.endDate);
    set('inv_dailyPrice',   inv.dailyPrice);
    set('inv_insurance',    inv.insurance   || 0);
    set('inv_fuel',         inv.fuel        || 0);
    set('inv_extraDriver',  inv.extraDriver || 0);
    set('inv_other',        inv.other       || 0);
    set('inv_status',       inv.status);
    set('inv_notes',        inv.notes);
  }

  function readForm() {
    const g = id => document.getElementById(id)?.value ?? '';
    const n = id => parseFloat(document.getElementById(id)?.value || 0) || 0;
    return {
      clientName:   g('inv_clientName').trim(),
      cin:          g('inv_cin').trim(),
      phone:        g('inv_phone').trim(),
      vehicleBrand: g('inv_vehicleBrand').trim(),
      vehicleModel: g('inv_vehicleModel').trim(),
      plate:        g('inv_plate').trim().toUpperCase(),
      startDate:    g('inv_startDate'),
      endDate:      g('inv_endDate'),
      dailyPrice:   n('inv_dailyPrice'),
      insurance:    n('inv_insurance'),
      fuel:         n('inv_fuel'),
      extraDriver:  n('inv_extraDriver'),
      other:        n('inv_other'),
      status:       g('inv_status') || 'draft',
      notes:        g('inv_notes').trim(),
    };
  }

  function validateForm(data) {
    const required = ['clientName','cin','vehicleBrand','vehicleModel','plate','startDate','endDate'];
    for (const key of required) {
      if (!data[key]) {
        const labelMap = {
          clientName:   'inv.field.clientName',
          cin:          'inv.field.cin',
          vehicleBrand: 'inv.field.vehicleBrand',
          vehicleModel: 'inv.field.vehicleModel',
          plate:        'inv.field.plate',
          startDate:    'inv.field.startDate',
          endDate:      'inv.field.endDate',
        };
        showToast('error', `${JOSKA_I18N.t(labelMap[key] || key)} ${JOSKA_I18N.t('inv.isRequired')}`);
        document.getElementById(`inv_${key}`)?.focus();
        return false;
      }
    }
    if (data.dailyPrice <= 0) {
      showToast('error', JOSKA_I18N.t('inv.dailyPriceRequired'));
      document.getElementById('inv_dailyPrice')?.focus();
      return false;
    }
    if (data.startDate > data.endDate) {
      showToast('error', JOSKA_I18N.t('inv.dateRangeError'));
      return false;
    }
    return true;
  }

  // ── Live totals recalculation ─────────────────────────────
  function recalculate() {
    const startDate  = document.getElementById('inv_startDate')?.value;
    const endDate    = document.getElementById('inv_endDate')?.value;
    const dailyPrice = parseFloat(document.getElementById('inv_dailyPrice')?.value || 0) || 0;
    const insurance  = parseFloat(document.getElementById('inv_insurance')?.value  || 0) || 0;
    const fuel       = parseFloat(document.getElementById('inv_fuel')?.value       || 0) || 0;
    const extraDriver= parseFloat(document.getElementById('inv_extraDriver')?.value|| 0) || 0;
    const other      = parseFloat(document.getElementById('inv_other')?.value      || 0) || 0;

    const days = calcDays(startDate, endDate);
    const rental = days * dailyPrice;
    const total  = rental + insurance + fuel + extraDriver + other;

    const currency = JOSKA_I18N.t('common.currency');
    const daysEl   = document.getElementById('invDaysText');
    const rentalEl = document.getElementById('calcRental');
    const totalEl  = document.getElementById('invTotalDisplay');
    const daysWrap = document.getElementById('invDaysDisplay');

    if (daysEl) {
      if (days >= 0 && startDate && endDate) {
        daysEl.textContent = `${days} ${JOSKA_I18N.t('inv.days')}`;
        if (daysWrap) daysWrap.style.display = 'flex';
      } else {
        if (daysWrap) daysWrap.style.display = 'none';
      }
    }
    if (rentalEl) rentalEl.textContent = formatCurrency(rental, currency);
    if (totalEl)  totalEl.textContent  = formatCurrency(total, currency);
  }

  function calcDays(start, end) {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return diff < 0 ? 0 : diff + 1; // inclusive
  }

  // ── Save invoice ──────────────────────────────────────────
  async function saveInvoice(forceDraft = false) {
    const data = readForm();
    if (forceDraft) data.status = 'draft';
    if (!validateForm(data)) return;

    const saveBtn  = document.getElementById('modalSave');
    const draftBtn = document.getElementById('modalSaveDraft');
    setLoading(saveBtn,  true);
    setLoading(draftBtn, true);

    try {
      const days   = calcDays(data.startDate, data.endDate);
      const rental = days * data.dailyPrice;
      const total  = rental + data.insurance + data.fuel + data.extraDriver + data.other;

      const payload = {
        ...data,
        days,
        rentalSubtotal: rental,
        total,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const col = db.collection('users').doc(currentUser.uid).collection('invoices');

      if (editingId) {
        await col.doc(editingId).update(payload);
      } else {
        const invNumber = await generateInvoiceNumber();
        payload.invoiceNumber = invNumber;
        payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await col.add(payload);
      }

      showToast('success', JOSKA_I18N.t('settings.saved'));
      closeModal();
    } catch (err) {
      console.error(err);
      showToast('error', JOSKA_I18N.t('settings.error'));
    } finally {
      setLoading(saveBtn,  false);
      setLoading(draftBtn, false);
    }
  }

  async function saveAndExport() {
    const data = readForm();
    if (!validateForm(data)) return;

    const pdfBtn = document.getElementById('modalPDF');
    setLoading(pdfBtn, true);

    try {
      const days   = calcDays(data.startDate, data.endDate);
      const rental = days * data.dailyPrice;
      const total  = rental + data.insurance + data.fuel + data.extraDriver + data.other;

      const col     = db.collection('users').doc(currentUser.uid).collection('invoices');
      let invNumber, docId;

      if (editingId) {
        const inv = allInvoices.find(i => i.id === editingId);
        invNumber = inv?.invoiceNumber || editingId.slice(-6).toUpperCase();
        docId     = editingId;
        await col.doc(editingId).update({ ...data, days, rentalSubtotal: rental, total, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      } else {
        invNumber = await generateInvoiceNumber();
        const ref = await col.add({ ...data, days, rentalSubtotal: rental, total, invoiceNumber: invNumber, createdAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        docId = ref.id;
        editingId = docId;
      }

      const fullInv = { id: docId, invoiceNumber: invNumber, days, rentalSubtotal: rental, total, ...data };
      generatePDF(fullInv);
      showToast('success', JOSKA_I18N.t('inv.pdfReady'));
    } catch (err) {
      console.error(err);
      showToast('error', JOSKA_I18N.t('settings.error'));
    } finally {
      setLoading(pdfBtn, false);
    }
  }

  // ── Invoice number generator ──────────────────────────────
  async function generateInvoiceNumber() {
    const year  = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = allInvoices.length + 1;
    return `INV-${year}${month}-${String(count).padStart(4, '0')}`;
  }

  // ── Export single invoice ─────────────────────────────────
  function exportSingle(id) {
    const inv = allInvoices.find(i => i.id === id);
    if (!inv) return;
    generatePDF(inv);
  }

  // ── Export all filtered invoices (combined PDF) ───────────
  function exportFiltered() {
    if (!filteredInvoices.length) {
      showToast('error', JOSKA_I18N.t('inv.noInvoices'));
      return;
    }
    if (filteredInvoices.length === 1) {
      generatePDF(filteredInvoices[0]);
      return;
    }
    // Multiple: export one page per invoice
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    filteredInvoices.forEach((inv, i) => {
      if (i > 0) doc.addPage();
      buildPDFPage(doc, inv);
    });
    doc.save(`JOSKA-Invoices-${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('success', JOSKA_I18N.t('inv.pdfReady'));
  }

  // ── PDF Generation ────────────────────────────────────────
  function generatePDF(inv) {
    if (!window.jspdf) {
      showToast('error', 'jsPDF not loaded. Please check your internet connection.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    buildPDFPage(doc, inv);
    const filename = `JOSKA-${inv.invoiceNumber || inv.id.slice(-6)}.pdf`;
    doc.save(filename);
  }

  function buildPDFPage(doc, inv) {
    const currency = JOSKA_I18N.t('common.currency');
    const W = 210, M = 18; // A4 width, margin
    let y = 0;

    // ── Brand header bar ──
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, W, 30, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(companySettings.companyName || 'JOSKA', M, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 210, 255);
    doc.text(JOSKA_I18N.t('brand.tagline'), M, 24);

    // Invoice number (top right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    const numStr = `#${inv.invoiceNumber || inv.id.slice(-6).toUpperCase()}`;
    doc.text(numStr, W - M, 18, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 210, 255);
    doc.text(new Date().toLocaleDateString(JOSKA_I18N.getLang()), W - M, 24, { align: 'right' });

    y = 38;

    // ── Company info block ──
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const compLines = [
      companySettings.address || '',
      companySettings.phone   || '',
      companySettings.email   || '',
      companySettings.website || '',
    ].filter(Boolean);
    compLines.forEach(line => {
      doc.text(line, M, y);
      y += 4.5;
    });

    y += 4;

    // ── Divider ──
    doc.setDrawColor(220, 220, 230);
    doc.line(M, y, W - M, y);
    y += 6;

    // ── Two-column info: Customer | Vehicle ──
    const colLeft  = M;
    const colRight = W / 2 + 4;
    const yStart   = y;

    // Customer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('CUSTOMER', colLeft, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(inv.clientName || '—', colLeft, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`CIN / Passport: ${inv.cin || '—'}`, colLeft, y); y += 4.5;
    if (inv.phone) { doc.text(`Phone: ${inv.phone}`, colLeft, y); y += 4.5; }

    // Vehicle (right column, same y start)
    let yR = yStart;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('VEHICLE', colRight, yR);
    yR += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${inv.vehicleBrand || ''} ${inv.vehicleModel || ''}`.trim() || '—', colRight, yR);
    yR += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Plate: ${inv.plate || '—'}`, colRight, yR); yR += 4.5;

    y = Math.max(y, yR) + 6;

    // ── Rental period row ──
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(M, y, W - M * 2, 16, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('RENTAL PERIOD', M + 6, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    const periodStr = `${inv.startDate || '—'}  →  ${inv.endDate || '—'}`;
    doc.text(periodStr, M + 6, y + 12);

    // Days badge (right of band)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    const daysLabel = `${inv.days ?? calcDays(inv.startDate, inv.endDate)} ${JOSKA_I18N.t('inv.days')}`;
    doc.text(daysLabel, W - M - 6, y + 9, { align: 'right' });

    y += 22;

    // ── Line items table ──
    const tW = W - M * 2;
    const descW = tW * 0.5;
    const amtW  = tW * 0.25;

    // Table header
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(M, y, tW, 8, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('DESCRIPTION', M + 4, y + 5.5);
    doc.text('QTY',        M + descW + 2, y + 5.5);
    doc.text('UNIT PRICE', M + descW + amtW / 2, y + 5.5, { align: 'center' });
    doc.text('AMOUNT',     W - M - 4, y + 5.5, { align: 'right' });
    y += 8;

    const days       = inv.days ?? calcDays(inv.startDate, inv.endDate);
    const dailyPrice = parseFloat(inv.dailyPrice || 0);
    const rental     = days * dailyPrice;

    const rows = [
      { desc: `${JOSKA_I18N.t('inv.field.rentalSubtotal')} (${inv.vehicleBrand} ${inv.vehicleModel})`, qty: days, unit: dailyPrice, total: rental },
      ...(parseFloat(inv.insurance  || 0) > 0 ? [{ desc: JOSKA_I18N.t('inv.field.insurance'),  qty: 1, unit: parseFloat(inv.insurance),  total: parseFloat(inv.insurance)  }] : []),
      ...(parseFloat(inv.fuel       || 0) > 0 ? [{ desc: JOSKA_I18N.t('inv.field.fuel'),        qty: 1, unit: parseFloat(inv.fuel),       total: parseFloat(inv.fuel)       }] : []),
      ...(parseFloat(inv.extraDriver|| 0) > 0 ? [{ desc: JOSKA_I18N.t('inv.field.extraDriver'), qty: 1, unit: parseFloat(inv.extraDriver),total: parseFloat(inv.extraDriver)}] : []),
      ...(parseFloat(inv.other      || 0) > 0 ? [{ desc: JOSKA_I18N.t('inv.field.other'),       qty: 1, unit: parseFloat(inv.other),      total: parseFloat(inv.other)      }] : []),
    ];

    rows.forEach((row, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(M, y, tW, 9, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(String(row.desc), M + 4, y + 6.5);
      doc.text(String(row.qty),  M + descW + 2, y + 6.5);
      doc.text(formatCurrency(row.unit,  currency), M + descW + amtW / 2, y + 6.5, { align: 'center' });
      doc.text(formatCurrency(row.total, currency), W - M - 4, y + 6.5, { align: 'right' });
      doc.setDrawColor(226, 232, 240);
      doc.line(M, y + 9, W - M, y + 9);
      y += 9;
    });

    y += 4;

    // ── Total box ──
    const totalBoxH = 16;
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(W - M - 60, y, 60, totalBoxH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 210, 255);
    doc.text('TOTAL', W - M - 56, y + 6);
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(formatCurrency(parseFloat(inv.total || 0), currency), W - M - 4, y + 12.5, { align: 'right' });

    // Status badge
    const status = inv.status || 'draft';
    const statusColors = { paid: [16, 185, 129], pending: [245, 158, 11], overdue: [239, 68, 68], draft: [107, 114, 128] };
    const [r, g, b] = statusColors[status] || statusColors.draft;
    doc.setFillColor(r, g, b);
    doc.roundedRect(M, y + 2, 28, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(JOSKA_I18N.t(`dash.${status}`).toUpperCase(), M + 14, y + 9.5, { align: 'center' });

    y += totalBoxH + 8;

    // ── Notes ──
    if (inv.notes) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Notes: ${inv.notes}`, M, y);
      y += 6;
    }

    // ── Footer ──
    doc.setDrawColor(226, 232, 240);
    doc.line(M, 275, W - M, 275);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated by JOSKA — Invoice & Revenue Management', W / 2, 280, { align: 'center' });
    if (companySettings.email) doc.text(companySettings.email, W / 2, 284, { align: 'center' });
  }

  // ── Theme toggle ──────────────────────────────────────────
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const saved  = localStorage.getItem('joska_theme') || 'light';
    applyTheme(saved);
    toggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
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
  }

  // ── Sidebar toggle ────────────────────────────────────────
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
  function showLoading(state) {
    const loader = document.getElementById('invLoading');
    const tbody  = document.getElementById('invTableBody');
    if (loader) loader.style.display = state ? 'block' : 'none';
  }

  function setLoading(btn, state) {
    if (!btn) return;
    btn.disabled = state;
    btn.classList.toggle('loading', state);
  }

  function showToast(type, message) {
    const toast = document.getElementById('invToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className   = `toast toast-${type} show`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function formatCurrency(amount, currency) {
    if (isNaN(amount)) amount = 0;
    return new Intl.NumberFormat(JOSKA_I18N.getLang(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + currency;
  }

  function formatShortDate(dateStr, lang) {
    try {
      return new Date(dateStr).toLocaleDateString(lang, { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  }

  function toDate(ts) {
    if (!ts) return null;
    if (ts.toDate) return ts.toDate();
    if (ts instanceof Date) return ts;
    return null;
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { init, openEdit, openDelete, exportSingle };
})();


// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  JOSKA_I18N.init();
  JOSKA_AUTH.init();

  document.addEventListener('joska:authReady', ({ detail }) => {
    if (detail.user) JOSKA_INVOICES.init(detail.user);
  });

  document.addEventListener('joska:langChanged', () => {
    // Re-apply i18n strings after language switch (table re-renders via Firestore listener)
    JOSKA_I18N.applyToDOM();
  });
});
