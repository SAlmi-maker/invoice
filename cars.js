const RENVA_CARS = (() => {
  let currentUser = null;
  let allCars = [];
  let deleteTargetId = null;
  let searchQuery = '';
  let statusFilter = 'all';
  let pendingImageFile = null;

  function lockScroll() { const y=window.scrollY; document.body.dataset.sy=y; document.documentElement.style.overflow='hidden'; document.body.style.position='fixed'; document.body.style.top=`-${y}px`; document.body.style.left='0'; document.body.style.right='0'; }
  function unlockScroll() { const y=parseInt(document.body.dataset.sy||'0'); document.documentElement.style.overflow=''; document.body.style.position=''; document.body.style.top=''; document.body.style.left=''; document.body.style.right=''; window.scrollTo(0,y); delete document.body.dataset.sy; }

  const $ = id => document.getElementById(id);
  let toast, grid, loading, empty, search;

  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = `toast toast-${type} show`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function loadingDone() { loading.style.display = 'none'; }
  function setEmpty(v) { empty.style.display = v ? 'flex' : 'none'; }

  function setBrandSubtitle(name) {
    document.querySelectorAll('.company-name').forEach(el => {
      el.textContent = name || RENVA_I18N.t('brand.subtitle');
    });
  }

  function makeCar(row, latestEndDate) {
    return {
      id: row.id,
      brand: row.brand || '',
      model: row.model || '',
      plate: row.plate || '',
      dailyPrice: row.daily_price || 0,
      status: row.status || 'available',
      image: row.image || '',
      notes: row.notes || '',
      endDate: latestEndDate || '',
      createdAt: row.created_at ? new Date(row.created_at) : null
    };
  }

  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render() {
    const q = searchQuery.trim().toLowerCase();
    let filtered = allCars;
    if (q) {
      filtered = allCars.filter(c =>
        (c.brand + ' ' + c.model + ' ' + c.plate + ' ' + c.notes).toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    const statusTabs = document.getElementById('carStatusTabs');
    if (statusTabs) {
      statusTabs.querySelectorAll('.inv-tab').forEach(tab => {
        const s = tab.dataset.status;
        const cnt = s === 'all' ? allCars.length : allCars.filter(c => c.status === s).length;
        const label = RENVA_I18N.t(tab.getAttribute('data-i18n') || '');
        tab.textContent = `${label} (${cnt})`;
        tab.classList.toggle('active', s === statusFilter);
      });
    }

    if (!filtered.length) {
      grid.innerHTML = '';
      setEmpty(true);
      return;
    }
    setEmpty(false);

    grid.innerHTML = filtered.map(c => {
      const imgHtml = c.image
        ? `<img src="${escHtml(c.image)}" alt="${escHtml(c.brand)}" class="car-card-img" />`
        : `<div class="car-card-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`;
      const statusLabels = { available: 'cars.available', unavailable: 'cars.unavailable', out_of_service: 'cars.outOfService' };
      const statusClass = statusLabels[c.status] ? c.status : 'unavailable';
      const statusLabel = RENVA_I18N.t(statusLabels[c.status] || 'cars.unavailable');
      const price = (() => { const n=new Intl.NumberFormat(RENVA_I18N.getLang(),{minimumFractionDigits:0,maximumFractionDigits:2}).format(c.dailyPrice); return n+' '+RENVA_I18N.t('common.currency'); })();
      return `<div class="car-card">
        ${imgHtml}
        <div class="car-card-body">
          <div class="car-card-title">${escHtml(c.brand)} ${escHtml(c.model)}</div>
          <div class="car-card-plate">${escHtml(c.plate)}</div>
          <div class="car-card-meta">
            <span class="car-card-price">${price}</span>
            <span class="car-card-status ${statusClass}">${statusLabel}</span>
          </div>
          <div class="car-card-actions">
            <button class="btn btn-ghost btn-sm" onclick="RENVA_CARS.openEdit('${c.id}')">${RENVA_I18N.t('common.edit')}</button>
            <button class="btn btn-sm" style="background:var(--red);color:#fff;" onclick="RENVA_CARS.openDelete('${c.id}')">${RENVA_I18N.t('common.delete')}</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function openModal(car = null) {
    const modal = $('carModal');
    $('car_id').value = car ? car.id : '';
    $('car_brand').value = car ? car.brand : '';
    $('car_model').value = car ? car.model : '';
    $('car_plate').value = car ? car.plate : '';
    $('car_dailyPrice').value = car ? car.dailyPrice : '';
    $('car_status').value = car ? car.status : 'available';
    $('car_notes').value = car ? car.notes : '';
    pendingImageFile = null;
    const wrap = $('carImagePreviewWrap');
    const preview = $('carImagePreview');
    if (car && car.image) {
      preview.src = car.image;
      wrap.style.display = 'block';
    } else {
      wrap.style.display = 'none';
      preview.src = '';
    }
    $('car_image').value = '';
    $('carModalTitle').textContent = car ? RENVA_I18N.t('cars.editCar') : RENVA_I18N.t('cars.newCar');
    const endDateEl = $('carRentalEnd');
    if (car && car.endDate) {
      endDateEl.textContent = RENVA_I18N.t('cars.rentalEnd') + ': ' + car.endDate;
      endDateEl.style.display = 'block';
    } else {
      endDateEl.style.display = 'none';
    }
    modal.classList.add('open');
    lockScroll();
  }

  function closeModal() {
    $('carModal').classList.remove('open');
    unlockScroll();
    $('carForm').reset();
    $('car_id').value = '';
    pendingImageFile = null;
    $('carImagePreviewWrap').style.display = 'none';
  }

  async function saveCar(e) {
    e.preventDefault();
    const id = $('car_id').value;
    const brand = $('car_brand').value.trim();
    const model = $('car_model').value.trim();
    const plate = $('car_plate').value.trim();
    const dailyPrice = parseFloat($('car_dailyPrice').value) || 0;
    if (!brand || !model || !plate) {
      showToast(RENVA_I18N.t('common.fillRequired'), 'error');
      return;
    }

    const saveBtn = $('carSaveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = RENVA_I18N.t('common.saving');

    try {
      const data = {
        brand,
        model,
        plate: plate.toUpperCase(),
        daily_price: dailyPrice,
        status: $('car_status').value,
        notes: $('car_notes').value.trim()
      };

      if (pendingImageFile) {
        data.image = await fileToBase64(pendingImageFile);
      }

      if (id) {
        const { error } = await sb.from('cars').update(data).eq('id', id);
        if (error) throw error;
        showToast(RENVA_I18N.t('cars.updated'));
      } else {
        data.user_id = currentUser.id;
        data.created_at = new Date().toISOString();
        const { error } = await sb.from('cars').insert(data);
        if (error) throw error;
        showToast(RENVA_I18N.t('cars.saved'));
      }
      closeModal();
      subscribe();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = RENVA_I18N.t('common.save');
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId || !currentUser) return;
    const btn = $('deleteConfirmBtn');
    btn.disabled = true;
    try {
      const { error } = await sb.from('cars').delete().eq('id', deleteTargetId);
      if (error) throw error;
      showToast(RENVA_I18N.t('cars.deleted'));
      closeDeleteModal();
      subscribe();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error', 'error');
    } finally {
      btn.disabled = false;
    }
  }

  function closeDeleteModal() {
    $('deleteModal').classList.remove('open');
    unlockScroll();
    deleteTargetId = null;
  }

  async function subscribe() {
    loading.style.display = 'flex';
    setEmpty(false);

    try {
      const [carResult, invResult] = await Promise.all([
        sb.from('cars').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false }),
        sb.from('invoices').select('plate, end_date').eq('user_id', currentUser.id).order('end_date', { ascending: false })
      ]);
      if (carResult.error) throw carResult.error;
      const endDateMap = {};
      if (invResult.data) {
        invResult.data.forEach(inv => {
          if (inv.plate && inv.end_date && !endDateMap[inv.plate]) {
            endDateMap[inv.plate] = inv.end_date.split('T')[0];
          }
        });
      }
      allCars = (carResult.data || []).map(c => makeCar(c, endDateMap[c.plate] || ''));
      loadingDone();
      render();
    } catch (err) {
      console.error('Cars load error', err);
      loadingDone();
      setEmpty(true);
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
        sidebar?.classList.remove('open');
        overlay.classList.remove('show');
      });
    }
  }

  function init(user) {
    if (!user || currentUser) return;
    currentUser = user;

    document.querySelectorAll('.user-email').forEach(el => el.textContent = user.email);
    document.querySelectorAll('.user-avatar-text').forEach(el => el.textContent = 'RV');

    sb.from('companies').select('company_name').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      const cn = data?.company_name || '';
      const initials = cn ? cn.slice(0, 2).toUpperCase() : 'RV';
      document.querySelectorAll('.user-avatar-text').forEach(el => el.textContent = initials);
      setBrandSubtitle(cn);
      RENVA_CARS._cn = cn;
    }).catch(() => {});

    toast      = $('carToast');
    grid       = $('carsGrid');
    loading    = $('carLoading');
    empty      = $('carEmpty');
    search     = $('carSearch');

    subscribe();
    window.addEventListener('focus', () => subscribe());
    initSidebar();

    $('btnNewCar').addEventListener('click', () => openModal());
    $('carModalClose').addEventListener('click', closeModal);
    $('carModalCancel').addEventListener('click', closeModal);
    $('carSaveBtn').addEventListener('click', saveCar);
    $('carForm').addEventListener('submit', saveCar);

    $('car_image').addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 500 * 1024) {
          showToast(RENVA_I18N.t('cars.imageTooLarge'), 'error');
          e.target.value = '';
          return;
        }
        pendingImageFile = file;
        const reader = new FileReader();
        reader.onload = ev => {
          $('carImagePreview').src = ev.target.result;
          $('carImagePreviewWrap').style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
    $('carImageRemove').addEventListener('click', () => {
      pendingImageFile = null;
      $('car_image').value = '';
      $('carImagePreviewWrap').style.display = 'none';
      $('carImagePreview').src = '';
    });

    $('deleteModalClose').addEventListener('click', closeDeleteModal);
    $('deleteCancelBtn').addEventListener('click', closeDeleteModal);
    $('deleteConfirmBtn').addEventListener('click', confirmDelete);

    search.addEventListener('input', e => {
      searchQuery = e.target.value;
      render();
    });
    search.addEventListener('search', () => render());

    const statusTabs = $('carStatusTabs');
    if (statusTabs) {
      statusTabs.addEventListener('click', e => {
        const tab = e.target.closest('.inv-tab');
        if (!tab) return;
        statusFilter = tab.dataset.status || 'all';
        render();
      });
    }

    document.querySelectorAll('.modal-backdrop').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target === el) {
          el.classList.remove('open');
          unlockScroll();
        }
      });
    });
  }

  function openEdit(id) {
    const car = allCars.find(c => c.id === id);
    if (car) openModal(car);
  }

  document.addEventListener('RENVA:langChanged', () => {
    RENVA_I18N.applyToDOM();
    setBrandSubtitle(RENVA_CARS._cn || '');
    RENVA_CARS.refresh();
  });

  return { init, openEdit, refresh: () => render(), openDelete: id => { deleteTargetId = id; $('deleteModal').classList.add('open'); lockScroll(); } };
})();

document.addEventListener('DOMContentLoaded', () => {
  RENVA_I18N.init();

  document.addEventListener('RENVA:authReady', ({ detail }) => {
    if (detail.user) RENVA_CARS.init(detail.user);
  });

  RENVA_AUTH.init();
});
