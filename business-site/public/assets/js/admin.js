// Owner admin panel. Every change is saved to the server straight away.
// The password is kept in sessionStorage (cleared when the tab closes) and
// sent as the x-admin-password header; the server checks it on every request.
(function () {
  'use strict';

  const KEY = 'adminPassword';
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
  const MAX_SIDE = 1600;
  const MAX_UPLOAD = 3 * 1024 * 1024;
  const ICONS = window.SITE_ICONS || {};

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  // Config photos are relative ("assets/images/…"); make them work from /admin too.
  const imgSrc = (src) => (/^assets\//.test(src || '') ? '/' + src : src || '');
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  let config = {};
  let state = { services: [], offers: [], gallery: [], info: null };
  let tab = 'services';

  // ---------- API ----------

  const password = () => sessionStorage.getItem(KEY) || '';

  async function api(path, { method = 'GET', body, headers = {} } = {}) {
    const isJson = body !== undefined && !(body instanceof Blob);
    const res = await fetch(path, {
      method,
      headers: { 'x-admin-password': password(), ...(isJson ? { 'content-type': 'application/json' } : {}), ...headers },
      body: isJson ? JSON.stringify(body) : body,
    });
    let data = {};
    try {
      data = await res.json();
    } catch {}
    if (res.status === 401) {
      logout('Your session ended. Please log in again.');
      throw new Error('Wrong password.');
    }
    if (!res.ok) throw new Error(data.error || 'Could not save. Check your internet and try again.');
    return data;
  }

  // ---------- toast ----------

  let toastTimer;
  function toast(msg, isError = false) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('is-error', isError);
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), isError ? 4500 : 2200);
  }

  // ---------- login ----------

  function showLogin(message) {
    $('#app-view').hidden = true;
    $('#login-view').hidden = false;
    const err = $('#login-error');
    err.hidden = !message;
    err.textContent = message || '';
    setTimeout(() => $('#password').focus(), 50);
  }

  function logout(message) {
    sessionStorage.removeItem(KEY);
    showLogin(message);
  }

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#login-btn');
    const pw = $('#password').value;
    if (!pw) return;
    btn.disabled = true;
    btn.textContent = 'Checking…';
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'x-admin-password': pw } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not log in.');
      sessionStorage.setItem(KEY, pw);
      $('#password').value = '';
      await openApp();
    } catch (err) {
      showLogin(err.message === 'Failed to fetch' ? 'No internet connection. Please try again.' : err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Log in';
    }
  });

  $('#logout').addEventListener('click', () => logout());

  // ---------- load ----------

  const withIds = (list) => (Array.isArray(list) ? list : []).map((x) => ({ ...x, id: x.id || uid() }));

  async function openApp() {
    const [cfg, content] = await Promise.all([
      fetch('/site.config.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
      api('/api/admin/content'),
    ]);
    config = cfg || {};
    applyContent(content);
    $('#biz-name').textContent = config.business?.name || 'Your business';
    document.title = `Admin · ${config.business?.name || 'Website'}`;
    $('#login-view').hidden = true;
    $('#app-view').hidden = false;
    render();
  }

  // Owner's saved data wins; otherwise fall back to site.config.json.
  function applyContent(content) {
    content = content || {};
    state.services = withIds(content.services ?? config.services);
    state.offers = withIds(content.offers ?? config.offers);
    state.gallery = withIds(content.gallery ?? config.gallery);
    const c = config.contact || {};
    state.info = content.info || {
      hours: { ...(config.hours || {}) },
      contact: { phone: c.phone || '', whatsapp: c.whatsapp || '', email: c.email || '', address: c.address || '' },
      notice: { closed: false, message: '' },
    };
  }

  async function save(section, items, okMsg = 'Saved ✓') {
    const body = section === 'info' ? items : { items };
    const res = await api(`/api/admin/${section}`, { method: 'PUT', body });
    applyContent(res.content);
    render();
    toast(okMsg);
  }

  // Run an action, show errors nicely, re-render on failure.
  async function run(fn) {
    try {
      await fn();
    } catch (err) {
      toast(err.message, true);
      render();
    }
  }

  async function resetSection(section, label) {
    if (!confirm(`Undo all your changes to ${label} and go back to the original website version?`)) return;
    await run(async () => {
      const res = await api(`/api/admin/${section}`, { method: 'DELETE' });
      applyContent(res.content);
      render();
      toast('Back to original ✓');
    });
  }

  // ---------- images ----------

  // Resize in the browser to max 1600px and convert to WebP (JPEG if WebP is not supported).
  async function prepareImage(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error(`"${file.name}" is not a JPG, PNG or WebP photo.`);
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      bitmap = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Could not read "${file.name}".`));
        img.src = URL.createObjectURL(file);
      });
    }
    const w = bitmap.width, h = bitmap.height;
    const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const toBlob = (type, q) => new Promise((r) => canvas.toBlob(r, type, q));
    let blob = await toBlob('image/webp', 0.82);
    if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg', 0.85);
    if (blob && blob.size > MAX_UPLOAD) blob = await toBlob(blob.type, 0.6);
    if (!blob || blob.size > MAX_UPLOAD) throw new Error(`"${file.name}" is too big even after resizing.`);
    return blob;
  }

  async function uploadImage(file) {
    const blob = await prepareImage(file);
    const res = await api('/api/admin/images', { method: 'POST', body: blob, headers: { 'content-type': blob.type } });
    return res.url;
  }

  // ---------- generic edit sheet ----------

  function openSheet(title, bodyHtml, onSave, onReady) {
    const sheet = $('#sheet');
    $('#sheet-title').textContent = title;
    $('#sheet-body').innerHTML = bodyHtml;
    $('#sheet-error').hidden = true;
    const form = $('#sheet-form');
    const saveBtn = $('#sheet-save');
    form.onsubmit = async (e) => {
      e.preventDefault();
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';
      try {
        await onSave(form);
        sheet.close();
      } catch (err) {
        $('#sheet-error').hidden = false;
        $('#sheet-error').textContent = err.message;
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    };
    $('#sheet-cancel').onclick = () => sheet.close();
    sheet.showModal();
    onReady?.(form);
    const first = $('input, textarea', form);
    if (first && window.matchMedia('(min-width: 620px)').matches) first.focus();
  }

  // ---------- render ----------

  function render() {
    $$('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    const panel = $('#panel');
    panel.innerHTML = { services: servicesHtml, offers: offersHtml, gallery: galleryHtml, info: infoHtml }[tab]();
    if (tab === 'info') bindInfo();
  }

  $$('.tabs button').forEach((b) =>
    b.addEventListener('click', () => {
      tab = b.dataset.tab;
      render();
      window.scrollTo({ top: 0 });
    })
  );

  const moveBtns = (i, len) => `
    <button class="btn btn--icon" data-act="up" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
    <button class="btn btn--icon" data-act="down" data-i="${i}" ${i === len - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>`;

  // --- services ---

  function servicesHtml() {
    const items = state.services;
    return `
      <div class="panel__head"><div><h2>Services &amp; prices</h2><p class="muted">${items.filter((s) => !s.hidden).length} showing on your website</p></div></div>
      <p class="help">Tap <b>Edit</b> to change a name or price. <b>Hide</b> removes it from the website without deleting it.</p>
      ${items.length ? '' : '<div class="empty">No services yet. Add your first one below.</div>'}
      <ul class="list">
        ${items
          .map((s, i) => `
          <li class="item${s.hidden ? ' is-hidden' : ''}">
            <div class="item__top">
              ${s.image ? `<img class="item__thumb" src="${esc(imgSrc(s.image))}" alt="">` : ''}
              <div class="item__main">
                <div class="item__title">${esc(s.name)}${s.hidden ? '<span class="badge badge--off">Hidden</span>' : ''}</div>
                ${s.price ? `<div class="item__price">${esc(s.price)}</div>` : ''}
                ${s.description ? `<div class="item__meta">${esc(s.description)}</div>` : ''}
              </div>
            </div>
            <div class="item__actions">
              <button class="btn btn--primary" data-act="edit" data-i="${i}">Edit</button>
              <button class="btn" data-act="toggle" data-i="${i}">${s.hidden ? 'Show' : 'Hide'}</button>
              ${moveBtns(i, items.length)}
              <button class="btn btn--danger" data-act="delete" data-i="${i}">Delete</button>
            </div>
          </li>`)
          .join('')}
      </ul>
      <button class="btn btn--primary btn--big" data-act="add">+ Add a service</button>
      <button class="reset" data-act="reset">Undo all changes to services</button>`;
  }

  function iconPicker(current) {
    const names = Object.keys(ICONS);
    const custom = current && !ICONS[current] ? current : '';
    return `
      <div class="field"><span>Icon</span>
        <div class="icon-pick">
          ${names
            .map((n) => `
            <input type="radio" name="icon" id="ic-${n}" value="${n}" ${n === current ? 'checked' : ''}>
            <label for="ic-${n}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>${n}</label>`)
            .join('')}
        </div>
        <small>Or type an emoji instead:</small>
        <input name="emoji" maxlength="4" value="${esc(custom)}" placeholder="e.g. 💇">
      </div>`;
  }

  function editService(index) {
    const s = index === undefined ? { id: uid(), name: '', description: '', price: '', icon: '', image: '' } : { ...state.services[index] };
    let image = s.image || '';
    openSheet(
      index === undefined ? 'Add a service' : 'Edit service',
      `
      <label class="field"><span>Name *</span><input name="name" required maxlength="80" value="${esc(s.name)}" placeholder="e.g. Haircut"></label>
      <label class="field"><span>Price</span><input name="price" maxlength="40" value="${esc(s.price)}" placeholder="e.g. ₹299 or From ₹199"><small>Leave empty to hide the price.</small></label>
      <label class="field"><span>Short description</span><textarea name="description" maxlength="300" placeholder="One or two lines about this service">${esc(s.description)}</textarea></label>
      <div class="field"><span>Photo (optional)</span>
        <div class="sheet-photo" id="svc-photo"></div>
      </div>
      ${iconPicker(s.icon)}`,
      async (form) => {
        const name = form.name.value.trim();
        if (!name) throw new Error('Please enter a name.');
        const emoji = form.emoji.value.trim();
        const icon = emoji || form.querySelector('input[name="icon"]:checked')?.value || '';
        const item = { ...s, name, price: form.price.value.trim(), description: form.description.value.trim(), icon, image };
        const list = state.services.slice();
        if (index === undefined) list.push(item);
        else list[index] = item;
        await save('services', list);
      },
      () => {
        const box = $('#svc-photo');
        const draw = () => {
          box.innerHTML = `
            ${image ? `<img src="${esc(imgSrc(image))}" alt="">` : ''}
            <span class="btn upload">${image ? 'Change photo' : 'Add photo'}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose photo"></span>
            ${image ? '<button type="button" class="btn btn--danger" data-remove>Remove</button>' : ''}`;
          $('input[type=file]', box).onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            box.querySelector('.upload').firstChild.textContent = 'Uploading…';
            try {
              image = await uploadImage(file);
            } catch (err) {
              toast(err.message, true);
            }
            draw();
          };
          const rm = $('[data-remove]', box);
          if (rm) rm.onclick = () => ((image = ''), draw());
        };
        draw();
      }
    );
  }

  // --- offers ---

  function offerStatus(o) {
    if (o.hidden) return '<span class="badge badge--off">Hidden</span>';
    if (o.validTill && o.validTill < todayStr()) return '<span class="badge badge--off">Expired</span>';
    return '<span class="badge badge--ok">Showing</span>';
  }

  function offersHtml() {
    const items = state.offers;
    return `
      <div class="panel__head"><div><h2>Offers</h2><p class="muted">Shown as a banner at the top of your website.</p></div></div>
      <p class="help">Add a <b>valid till</b> date and the offer disappears by itself after that day.</p>
      ${items.length ? '' : '<div class="empty">No offers right now. The offer banner is hidden on your website.</div>'}
      <ul class="list">
        ${items
          .map((o, i) => `
          <li class="item${o.hidden ? ' is-hidden' : ''}">
            <div class="item__main">
              <div class="item__title">${esc(o.title)}${offerStatus(o)}</div>
              ${o.text ? `<div class="item__meta">${esc(o.text)}</div>` : ''}
              <div class="item__meta">${o.validTill ? `Valid till ${esc(o.validTill)}` : 'No end date'}</div>
            </div>
            <div class="item__actions">
              <button class="btn btn--primary" data-act="edit" data-i="${i}">Edit</button>
              <button class="btn" data-act="toggle" data-i="${i}">${o.hidden ? 'Show' : 'Hide'}</button>
              ${moveBtns(i, items.length)}
              <button class="btn btn--danger" data-act="delete" data-i="${i}">Delete</button>
            </div>
          </li>`)
          .join('')}
      </ul>
      <button class="btn btn--primary btn--big" data-act="add">+ Add an offer</button>
      <button class="reset" data-act="reset">Undo all changes to offers</button>`;
  }

  function editOffer(index) {
    const o = index === undefined ? { id: uid(), title: '', text: '', validTill: '' } : { ...state.offers[index] };
    openSheet(
      index === undefined ? 'Add an offer' : 'Edit offer',
      `
      <label class="field"><span>Title *</span><input name="title" required maxlength="80" value="${esc(o.title)}" placeholder="e.g. Diwali Offer"></label>
      <label class="field"><span>Details</span><textarea name="text" maxlength="300" placeholder="e.g. 20% off on all facials">${esc(o.text)}</textarea></label>
      <label class="field"><span>Valid till (optional)</span><input name="validTill" type="date" value="${esc(o.validTill)}" min="${todayStr()}"><small>Leave empty to show until you delete it.</small></label>`,
      async (form) => {
        const title = form.title.value.trim();
        if (!title) throw new Error('Please enter a title.');
        const item = { ...o, title, text: form.text.value.trim(), validTill: form.validTill.value };
        const list = state.offers.slice();
        if (index === undefined) list.unshift(item);
        else list[index] = item;
        await save('offers', list);
      }
    );
  }

  // --- gallery ---

  function galleryHtml() {
    const items = state.gallery;
    return `
      <div class="panel__head"><div><h2>Photos</h2><p class="muted">${items.length} photo${items.length === 1 ? '' : 's'} in your gallery</p></div></div>
      <p class="help">Photos are made smaller automatically before uploading. JPG, PNG or WebP only. Use ← → to change the order.</p>
      <p class="progress" id="upload-progress" hidden></p>
      <label class="btn btn--primary btn--big upload" style="margin-bottom:18px">+ Add photos
        <input type="file" id="gallery-input" accept="image/jpeg,image/png,image/webp" multiple aria-label="Choose photos">
      </label>
      ${items.length ? '' : '<div class="empty">No photos yet.</div>'}
      <ul class="photos">
        ${items
          .map((g, i) => `
          <li class="photo">
            <img src="${esc(imgSrc(g.src))}" alt="${esc(g.alt)}" loading="lazy">
            <div class="photo__cap">${esc(g.alt || 'No caption')}</div>
            <div class="photo__actions">
              <button class="btn" data-act="up" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move earlier">←</button>
              <button class="btn" data-act="down" data-i="${i}" ${i === items.length - 1 ? 'disabled' : ''} aria-label="Move later">→</button>
              <button class="btn" data-act="edit" data-i="${i}" aria-label="Edit caption">✎</button>
              <button class="btn btn--danger" data-act="delete" data-i="${i}" aria-label="Delete photo">🗑</button>
            </div>
          </li>`)
          .join('')}
      </ul>
      <button class="reset" data-act="reset">Undo all changes to photos</button>`;
  }

  async function addPhotos(files) {
    const progress = $('#upload-progress');
    const list = state.gallery.slice();
    let added = 0;
    for (let i = 0; i < files.length; i++) {
      progress.hidden = false;
      progress.textContent = `Uploading photo ${i + 1} of ${files.length}…`;
      try {
        const url = await uploadImage(files[i]);
        list.push({ id: uid(), src: url, alt: files[i].name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').slice(0, 80) });
        added++;
      } catch (err) {
        toast(err.message, true);
      }
    }
    if (added) await save('gallery', list, `${added} photo${added === 1 ? '' : 's'} added ✓`);
    else render();
  }

  function editCaption(index) {
    const g = state.gallery[index];
    openSheet('Photo caption', `
      <img src="${esc(imgSrc(g.src))}" alt="" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px;margin-bottom:16px">
      <label class="field"><span>Caption</span><input name="alt" maxlength="120" value="${esc(g.alt)}" placeholder="e.g. Bridal makeup"><small>Helps Google and visitors using screen readers.</small></label>`,
    async (form) => {
      const list = state.gallery.slice();
      list[index] = { ...g, alt: form.alt.value.trim() };
      await save('gallery', list);
    });
  }

  // --- hours & contact ---

  function parseSlots(value) {
    const s = String(value || '').toLowerCase();
    if (!s || s.includes('closed')) return [];
    return s.split(',').map((x) => x.trim().split('-')).filter((p) => p.length === 2);
  }

  function infoHtml() {
    const info = state.info;
    const c = info.contact || {};
    const n = info.notice || {};
    return `
      <div class="panel__head"><div><h2>Hours &amp; contact</h2><p class="muted">Change these any time. Tap <b>Save</b> at the bottom.</p></div></div>
      <div class="card-box">
        <h3>Temporary closure</h3>
        <label class="check"><input type="checkbox" id="notice-closed" ${n.closed ? 'checked' : ''}>Temporarily closed (holiday, renovation…)</label>
        <label class="field"><span>Message for visitors</span><input id="notice-message" maxlength="200" value="${esc(n.message)}" placeholder="e.g. Closed for Diwali, back on 3rd Nov"></label>
      </div>
      <h3 style="margin:0 0 12px">Opening hours</h3>
      <div class="days">
        ${DAYS.map((d) => {
          const slots = parseSlots(info.hours?.[d]);
          const open = slots.length > 0;
          return `
          <div class="day" data-day="${d}">
            <div class="day__head">
              <span class="day__name">${DAY_LABELS[d]}</span>
              <div class="toggle" role="group" aria-label="${DAY_LABELS[d]} open or closed">
                <button type="button" data-open="1" aria-pressed="${open}">Open</button>
                <button type="button" data-open="0" class="is-closed" aria-pressed="${!open}">Closed</button>
              </div>
            </div>
            <div class="day__slots" ${open ? '' : 'hidden'}>
              ${(open ? slots : [['10:00', '20:00']]).map((sl, i) => slotHtml(sl, i)).join('')}
              ${slots.length < 2 ? '<button type="button" class="btn btn--small btn--ghost" data-addbreak>+ Add lunch break / second time</button>' : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="card-box">
        <h3>Contact details</h3>
        <label class="field"><span>Phone number *</span><input id="c-phone" type="tel" inputmode="tel" maxlength="20" value="${esc(c.phone)}"></label>
        <label class="field"><span>WhatsApp number</span><input id="c-whatsapp" type="tel" inputmode="numeric" maxlength="16" value="${esc(c.whatsapp)}"><small>10-digit mobile number is fine, e.g. 9876543210.</small></label>
        <label class="field"><span>Email</span><input id="c-email" type="email" maxlength="120" value="${esc(c.email)}"></label>
        <label class="field"><span>Address</span><textarea id="c-address" maxlength="200">${esc(c.address)}</textarea></label>
      </div>
      <button class="reset" data-act="reset">Undo all changes to hours &amp; contact</button>
      <div class="savebar"><button class="btn btn--primary btn--big" id="info-save">Save hours &amp; contact</button></div>`;
  }

  const slotHtml = ([a, b], i) => `
    <div class="slot${i > 0 ? ' slot--extra' : ''}" data-slot="${i}">
      <input type="time" value="${esc(a)}" aria-label="Opens at" required>
      <span>to</span>
      <input type="time" value="${esc(b)}" aria-label="Closes at" required>
      ${i > 0 ? '<button type="button" class="btn btn--icon btn--danger" data-rmslot aria-label="Remove second time">×</button>' : ''}
    </div>`;

  function bindInfo() {
    $$('.day').forEach((day) => {
      const slotsBox = $('.day__slots', day);
      $$('.toggle button', day).forEach((b) =>
        b.addEventListener('click', () => {
          const open = b.dataset.open === '1';
          $$('.toggle button', day).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          slotsBox.hidden = !open;
        })
      );
      slotsBox.addEventListener('click', (e) => {
        const add = e.target.closest('[data-addbreak]');
        if (add) {
          // Split the day: first time ends at 2 PM, second starts at 5 PM and keeps the old closing time.
          const [openIn, closeIn] = $$('.slot input', slotsBox);
          const close = closeIn.value > '17:00' ? closeIn.value : '21:00';
          if (closeIn.value > '14:00' && openIn.value < '14:00') closeIn.value = '14:00';
          add.insertAdjacentHTML('beforebegin', slotHtml(['17:00', close], 1));
          add.remove();
        }
        if (e.target.closest('[data-rmslot]')) {
          e.target.closest('.slot').remove();
          slotsBox.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn--small btn--ghost" data-addbreak>+ Add lunch break / second time</button>');
        }
      });
    });

    $('#info-save').addEventListener('click', () =>
      run(async () => {
        const hours = {};
        for (const day of $$('.day')) {
          const open = $('.toggle [data-open="1"]', day).getAttribute('aria-pressed') === 'true';
          if (!open) {
            hours[day.dataset.day] = 'closed';
            continue;
          }
          const slots = $$('.slot', day).map((s) => $$('input', s).map((x) => x.value));
          if (slots.some(([a, b]) => !a || !b)) throw new Error(`Please fill both times for ${DAY_LABELS[day.dataset.day]}.`);
          hours[day.dataset.day] = slots.map(([a, b]) => `${a}-${b}`).join(', ');
        }
        const body = {
          hours,
          contact: {
            phone: $('#c-phone').value.trim(),
            whatsapp: $('#c-whatsapp').value.trim(),
            email: $('#c-email').value.trim(),
            address: $('#c-address').value.trim(),
          },
          notice: { closed: $('#notice-closed').checked, message: $('#notice-message').value.trim() },
        };
        if (!body.contact.phone) throw new Error('Phone number is required.');
        const btn = $('#info-save');
        btn.disabled = true;
        btn.textContent = 'Saving…';
        await save('info', body);
      })
    );
  }

  // ---------- list actions (one handler for all tabs) ----------

  $('#panel').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const i = Number(btn.dataset.i);
    const section = tab;
    const labels = { services: 'services', offers: 'offers', gallery: 'photos', info: 'hours & contact' };

    if (act === 'reset') return resetSection(section, labels[section]);
    if (section === 'info') return;

    const list = state[section].slice();
    if (act === 'add') return section === 'services' ? editService() : editOffer();
    if (act === 'edit') return section === 'services' ? editService(i) : section === 'offers' ? editOffer(i) : editCaption(i);

    run(async () => {
      if (act === 'up' || act === 'down') {
        const j = act === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
        await save(section, list, 'Order saved ✓');
      } else if (act === 'toggle') {
        list[i] = { ...list[i], hidden: !list[i].hidden };
        await save(section, list, list[i].hidden ? 'Hidden from website ✓' : 'Showing on website ✓');
      } else if (act === 'delete') {
        const name = list[i].name || list[i].title || 'this photo';
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        list.splice(i, 1);
        await save(section, list, 'Deleted ✓');
      }
    });
  });

  $('#panel').addEventListener('change', (e) => {
    if (e.target.id === 'gallery-input' && e.target.files.length) {
      const files = Array.from(e.target.files);
      e.target.value = '';
      run(() => addPhotos(files));
    }
  });

  // ---------- start ----------

  if (password()) {
    openApp().catch((err) => showLogin(err.message === 'Failed to fetch' ? 'Cannot reach the server.' : err.message));
  } else {
    showLogin();
  }
})();
