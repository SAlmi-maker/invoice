const JOSKA_CLIENTS = (() => {
  let currentUser = null;
  let allClients = [];
  let deleteTargetId = null;
  let unsubscribe = null;
  let searchQuery = '';

  const $ = id => document.getElementById(id);
  const toast = $('clientToast');
  const tbody = $('clientTableBody');
  const loading = $('clientLoading');
  const empty = $('clientEmpty');
  const search = $('clientSearch');
  const countBadge = $('clientCount');

  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = `toast toast-${type} show`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function loadingDone() { loading.style.display = 'none'; }
  function setEmpty(v) { empty.style.display = v ? 'flex' : 'none'; }

  function makeClient(doc) {
    const d = doc.data();
    return {
      id: doc.id,
      name: d.name || '',
      cin: d.cin || '',
      phone: d.phone || '',
      email: d.email || '',
      address: d.address || '',
      notes: d.notes || '',
      createdAt: d.createdAt ? d.createdAt.toDate() : null
    };
  }

  function render() {
    const q = searchQuery.trim().toLowerCase();
    let filtered = allClients;
    if (q) {
      filtered = allClients.filter(c =>
        (c.name + ' ' + c.cin + ' ' + c.phone + ' ' + c.email).toLowerCase().includes(q)
      );
    }
    countBadge.textContent = filtered.length;

    if (!filtered.length) {
      tbody.innerHTML = '';
      setEmpty(true);
      return;
    }
    setEmpty(false);

    tbody.innerHTML = filtered.map(c => {
      const count = window.clientInvoiceCounts ? (window.clientInvoiceCounts[c.name] || 0) : '-';
      return `<tr>
        <td><span style="font-weight:600;">${escHtml(c.name)}</span></td>
        <td>${escHtml(c.cin)}</td>
        <td>${escHtml(c.phone)}</td>
        <td>${escHtml(c.email)}</td>
        <td><span class="badge badge-outline" style="font-weight:600;">${count}</span></td>
        <td>
          <div class="row-actions">
            <button class="inv-action-btn" onclick="JOSKA_CLIENTS.openEdit('${c.id}')" title="${JOSKA_I18N.t('common.edit')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="inv-action-btn" onclick="location.href='invoices.html?clientName=${encodeURIComponent(c.name)}&cin=${encodeURIComponent(c.cin)}&phone=${encodeURIComponent(c.phone)}'" title="${JOSKA_I18N.t('clients.createInvoice')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </button>
            <button class="inv-action-btn danger" onclick="JOSKA_CLIENTS.openDelete('${c.id}')" title="${JOSKA_I18N.t('common.delete')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function openModal(client = null) {
    const modal = $('clientModal');
    $('client_id').value = client ? client.id : '';
    $('client_name').value = client ? client.name : '';
    $('client_cin').value = client ? client.cin : '';
    $('client_phone').value = client ? client.phone : '';
    $('client_email').value = client ? client.email : '';
    $('client_address').value = client ? client.address : '';
    $('client_notes').value = client ? client.notes : '';
    $('clientModalTitle').textContent = client ? JOSKA_I18N.t('clients.editClient') : JOSKA_I18N.t('clients.newClient');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $('clientModal').classList.remove('open');
    document.body.style.overflow = '';
    $('clientForm').reset();
    $('client_id').value = '';
  }

  async function saveClient(e) {
    e.preventDefault();
    const id = $('client_id').value;
    const name = $('client_name').value.trim();
    const cin = $('client_cin').value.trim();
    if (!name || !cin) {
      showToast(JOSKA_I18N.t('common.fillRequired'), 'error');
      return;
    }

    const saveBtn = $('clientSaveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = JOSKA_I18N.t('common.saving');

    try {
      const data = {
        name: $('client_name').value.trim(),
        cin: $('client_cin').value.trim(),
        phone: $('client_phone').value.trim(),
        email: $('client_email').value.trim(),
        address: $('client_address').value.trim(),
        notes: $('client_notes').value.trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const col = db.collection('users').doc(currentUser.uid).collection('clients');

      if (id) {
        await col.doc(id).update(data);
        showToast(JOSKA_I18N.t('clients.updated'));
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await col.add(data);
        showToast(JOSKA_I18N.t('clients.saved'));
      }
      closeModal();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = JOSKA_I18N.t('common.save');
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId || !currentUser) return;
    const btn = $('deleteConfirmBtn');
    btn.disabled = true;
    try {
      await db.collection('users').doc(currentUser.uid).collection('clients').doc(deleteTargetId).delete();
      showToast(JOSKA_I18N.t('clients.deleted'));
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error', 'error');
    } finally {
      btn.disabled = false;
    }
  }

  function closeDeleteModal() {
    $('deleteModal').classList.remove('open');
    document.body.style.overflow = '';
    deleteTargetId = null;
  }

  function subscribe() {
    if (unsubscribe) unsubscribe();
    loading.style.display = 'flex';
    setEmpty(false);

    const col = db.collection('users').doc(currentUser.uid).collection('clients');
    unsubscribe = col.orderBy('createdAt', 'desc').onSnapshot(snap => {
      allClients = snap.docs.map(makeClient);
      loadingDone();
      render();
      loadInvoiceCounts();
    }, err => {
      console.error('Clients snapshot error', err);
      loadingDone();
      setEmpty(true);
    });
  }

  function loadInvoiceCounts() {
    if (!currentUser) return;
    db.collection('users').doc(currentUser.uid).collection('invoices').get().then(snap => {
      const counts = {};
      snap.forEach(d => {
        const name = d.data().clientName || '';
        if (name) counts[name] = (counts[name] || 0) + 1;
      });
      window.clientInvoiceCounts = counts;
      render();
    }).catch(() => {});
  }

  function init(user) {
    if (!user) return;
    currentUser = user;
    subscribe();

    $('btnNewClient').addEventListener('click', () => openModal());
    $('clientModalClose').addEventListener('click', closeModal);
    $('clientModalCancel').addEventListener('click', closeModal);
    $('clientSaveBtn').addEventListener('click', saveClient);
    $('clientForm').addEventListener('submit', saveClient);

    $('deleteModalClose').addEventListener('click', closeDeleteModal);
    $('deleteCancelBtn').addEventListener('click', closeDeleteModal);
    $('deleteConfirmBtn').addEventListener('click', confirmDelete);

    search.addEventListener('input', e => {
      searchQuery = e.target.value;
      render();
    });
    search.addEventListener('search', () => render());

    document.querySelectorAll('.modal-backdrop').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target === el) {
          el.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  return { init, openEdit: openModal, openDelete: id => { deleteTargetId = id; $('deleteModal').classList.add('open'); document.body.style.overflow = 'hidden'; } };
})();

document.addEventListener('DOMContentLoaded', () => {
  JOSKA_I18N.init();
  JOSKA_AUTH.init();

  document.addEventListener('joska:authReady', ({ detail }) => {
    if (detail.user) JOSKA_CLIENTS.init(detail.user);
  });

  document.addEventListener('joska:langChanged', () => {
    JOSKA_I18N.applyToDOM();
    render();
  });
});
