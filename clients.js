(function() {
  const COLLECTION = 'clients';
  let clients = [];
  let unsubscribe = null;
  let deleteTargetId = null;

  const $         = id => document.getElementById(id);
  const toast     = $('clientToast');
  const tbody     = $('clientTableBody');
  const loading   = $('clientLoading');
  const empty     = $('clientEmpty');
  const search    = $('clientSearch');
  const countBadge = $('clientCount');

  /* helpers */
  function showToast(msg, type='success') {
    toast.textContent = msg;
    toast.className = 'toast show ' + type;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.className='toast', 2800);
  }

  function loadingDone() { loading.style.display = 'none'; }
  function setEmpty(v)   { empty.style.display = v ? 'block' : 'none'; }

  function getId(doc) { return doc.id; }
  function makeClient(doc) {
    const d = doc.data();
    return {
      id:       doc.id,
      name:     d.name || '',
      cin:      d.cin || '',
      phone:    d.phone || '',
      email:    d.email || '',
      address:  d.address || '',
      notes:    d.notes || '',
      createdAt: d.createdAt ? d.createdAt.toDate() : null
    };
  }

  /* render */
  function render(filterText='') {
    const q = filterText.toLowerCase().trim();
    let filtered = clients;
    if (q) {
      filtered = clients.filter(c =>
        (c.name + c.cin + c.phone + c.email).toLowerCase().includes(q)
      );
    }
    countBadge.textContent = filtered.length;

    if (!filtered.length) {
      tbody.innerHTML = '';
      setEmpty(true);
      return;
    }
    setEmpty(false);

    const rows = filtered.map(c => {
      const invoiceCount = window.clientInvoiceCounts ? (window.clientInvoiceCounts[c.name] || 0) : '-';
      return `<tr>
        <td><span class="client-name">${esc(c.name)}</span></td>
        <td>${esc(c.cin)}</td>
        <td>${esc(c.phone)}</td>
        <td>${esc(c.email)}</td>
        <td><span class="badge badge-outline">${invoiceCount}</span></td>
        <td class="row-actions">
          <button class="btn-icon edit-client" data-id="${c.id}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="btn-icon delete-client" data-id="${c.id}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </td>
      </tr>`;
    }).join('');
    tbody.innerHTML = rows;

    /* bind edit buttons */
    tbody.querySelectorAll('.edit-client').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = clients.find(x => x.id === btn.dataset.id);
        if (c) openModal(c);
      });
    });
    tbody.querySelectorAll('.delete-client').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteTargetId = btn.dataset.id;
        $('deleteModal').classList.add('show');
      });
    });
  }

  function esc(s) {
    const div = document.createElement('div');
    div.textContent = s || '';
    return div.innerHTML;
  }

  /* modal */
  function openModal(client=null) {
    const modal = $('clientModal');
    $('client_id').value = client ? client.id : '';
    $('client_name').value  = client ? client.name  : '';
    $('client_cin').value   = client ? client.cin   : '';
    $('client_phone').value = client ? client.phone : '';
    $('client_email').value = client ? client.email : '';
    $('client_address').value = client ? client.address : '';
    $('client_notes').value   = client ? client.notes   : '';
    $('clientModalTitle').textContent = window.t ? t(client ? 'clients.editClient' : 'clients.newClient') : (client ? 'Edit Client' : 'New Client');
    modal.classList.add('show');
  }

  function closeModal() {
    $('clientModal').classList.remove('show');
    $('clientForm').reset();
    $('client_id').value = '';
  }

  async function saveClient(e) {
    e.preventDefault();
    const id   = $('client_id').value;
    const name = $('client_name').value.trim();
    const cin  = $('client_cin').value.trim();
    if (!name || !cin) {
      showToast(t ? t('common.fillRequired') : 'Please fill required fields', 'error');
      return;
    }

    const btn = $('clientSaveBtn');
    btn.disabled = true;
    btn.textContent = t ? t('common.saving') : 'Saving...';

    try {
      const data = {
        name:     $('client_name').value.trim(),
        cin:      $('client_cin').value.trim(),
        phone:    $('client_phone').value.trim(),
        email:    $('client_email').value.trim(),
        address:  $('client_address').value.trim(),
        notes:    $('client_notes').value.trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (!id) {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection(COLLECTION).add(data);
        showToast(t ? t('clients.saved') : 'Client created');
      } else {
        await db.collection(COLLECTION).doc(id).update(data);
        showToast(t ? t('clients.updated') : 'Client updated');
      }
      closeModal();
    } catch (err) {
      console.error('Save client error', err);
      showToast(err.message || 'Error saving client', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = t ? t('common.save') : 'Save';
    }
  }

  async function deleteClient() {
    if (!deleteTargetId) return;
    const btn = $('deleteConfirmBtn');
    btn.disabled = true;
    try {
      await db.collection(COLLECTION).doc(deleteTargetId).delete();
      showToast(t ? t('clients.deleted') : 'Client deleted');
    } catch (err) {
      showToast(err.message || 'Error deleting client', 'error');
    } finally {
      btn.disabled = false;
      $('deleteModal').classList.remove('show');
      deleteTargetId = null;
    }
  }

  /* real-time subscription */
  function subscribe() {
    if (unsubscribe) unsubscribe();
    loading.style.display = 'flex';
    setEmpty(false);
    const q = db.collection(COLLECTION).orderBy('createdAt', 'desc');
    unsubscribe = q.onSnapshot(snap => {
      clients = snap.docs.map(makeClient);
      loadingDone();
      render(search.value);
      // update invoice counts if we have invoices
      if (typeof loadClientInvoiceCounts === 'function') loadClientInvoiceCounts();
    }, err => {
      console.error('Client snapshot error', err);
      loadingDone();
      setEmpty(true);
    });
  }

  /* invoice count per client */
  window.loadClientInvoiceCounts = function() {
    if (!window.db) return;
    // We'll query invoices collection and group by clientName
    db.collection('invoices').get().then(snap => {
      const counts = {};
      snap.forEach(doc => {
        const d = doc.data();
        const name = d.clientName || d.name || '';
        counts[name] = (counts[name] || 0) + 1;
      });
      window.clientInvoiceCounts = counts;
      render(search.value);
    }).catch(() => {});
  };

  /* init */
  function init() {
    if (typeof db === 'undefined') { setTimeout(init, 300); return; }
    subscribe();

    $('btnNewClient').addEventListener('click', () => openModal());
    $('clientModalClose').addEventListener('click', closeModal);
    $('clientModalCancel').addEventListener('click', closeModal);
    $('clientSaveBtn').addEventListener('click', saveClient);
    $('clientForm').addEventListener('submit', e => { e.preventDefault(); saveClient(e); });
    $('deleteModalClose').addEventListener('click', () => {
      $('deleteModal').classList.remove('show');
      deleteTargetId = null;
    });
    $('deleteCancelBtn').addEventListener('click', () => {
      $('deleteModal').classList.remove('show');
      deleteTargetId = null;
    });
    $('deleteConfirmBtn').addEventListener('click', deleteClient);

    search.addEventListener('input', e => render(e.target.value));
    search.addEventListener('search',  () => render());

    /* close modals on overlay click */
    document.querySelectorAll('.modal-backdrop').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target === el) {
          el.classList.remove('show');
          if (el.id === 'deleteModal') deleteTargetId = null;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
