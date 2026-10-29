// Public website. Renders every section from site.config.json (inlined in the
// page), then fetches /api/content (owner's changes from /admin) and merges it
// over the config. If the API is down, the site still works from the config.
(function () {
  'use strict';

  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Line icons for service cards live in icons.js (shared with the admin panel).
  const ICONS = window.SITE_ICONS || {};


  // ---------- helpers ----------

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const safeUrl = (u) => {
    const s = String(u || '').trim();
    return /^(https?:\/\/|\/api\/images\/|assets\/|\/assets\/)/.test(s) ? s : '';
  };
  const slots = (name) => $$(`[data-slot="${name}"]`);
  const setText = (name, text) => slots(name).forEach((el) => (el.textContent = text || ''));
  const setHref = (name, href) =>
    slots(name).forEach((el) => {
      if (href) el.setAttribute('href', href);
      else el.removeAttribute('href');
      el.hidden = !href;
    });

  function iconSvg(name) {
    const paths = ICONS[String(name || '').toLowerCase()];
    if (paths) {
      return `<svg class="card__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
    }
    return name ? `<span class="card__emoji" aria-hidden="true">${esc(name)}</span>` : iconSvg('star');
  }

  const telHref = (phone) => (phone ? 'tel:' + String(phone).replace(/[^\d+]/g, '') : '');
  const waHref = (number, text) => {
    const n = String(number || '').replace(/\D/g, '');
    return n ? `https://wa.me/${n}${text ? '?text=' + encodeURIComponent(text) : ''}` : '';
  };

  // ---------- time & hours (always in the business time zone) ----------

  function nowIn(timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', hourCycle: 'h23',
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t)?.value || '';
      return {
        day: get('weekday').slice(0, 3).toLowerCase(),
        minutes: Number(get('hour')) * 60 + Number(get('minute')),
        date: `${get('year')}-${get('month')}-${get('day')}`,
      };
    } catch {
      const d = new Date();
      return { day: DAYS[(d.getDay() + 6) % 7], minutes: d.getHours() * 60 + d.getMinutes(), date: d.toISOString().slice(0, 10) };
    }
  }

  // "10:00-14:00, 17:00-21:00" -> [[600, 840], [1020, 1260]]
  function parseHours(value) {
    const s = String(value || '').toLowerCase();
    if (!s || s.includes('closed')) return [];
    return s.split(',').map((slot) => {
      const m = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(slot);
      return m ? [m[1] * 60 + +m[2], m[3] * 60 + +m[4]] : null;
    }).filter(Boolean);
  }

  function fmtTime(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    const h = Math.floor(mins / 60), m = mins % 60;
    const h12 = h % 12 || 12;
    return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'AM' : 'PM'}`;
  }

  const fmtSlots = (slots) => (slots.length ? slots.map(([a, b]) => `${fmtTime(a)} – ${fmtTime(b)}`).join(', ') : 'Closed');

  function openStatus(hours, timeZone) {
    const now = nowIn(timeZone);
    const idx = DAYS.indexOf(now.day);
    const today = parseHours(hours[now.day]);
    const yesterday = parseHours(hours[DAYS[(idx + 6) % 7]]);

    // Open from yesterday's late-night slot (e.g. 18:00-01:00)?
    for (const [a, b] of yesterday) if (b < a && now.minutes < b) return { open: true, until: b };
    for (const [a, b] of today) {
      const end = b <= a ? b + 1440 : b;
      if (now.minutes >= a && now.minutes < end) return { open: true, until: b };
    }
    const later = today.find(([a]) => a > now.minutes);
    if (later) return { open: false, next: `today ${fmtTime(later[0])}` };
    for (let i = 1; i <= 7; i++) {
      const day = DAYS[(idx + i) % 7];
      const first = parseHours(hours[day])[0];
      if (first) return { open: false, next: `${i === 1 ? 'tomorrow' : DAY_LABELS[day]} ${fmtTime(first[0])}` };
    }
    return { open: false };
  }

  // ---------- data ----------

  function readConfig() {
    const el = document.getElementById('site-config');
    if (el) {
      try {
        return Promise.resolve(JSON.parse(el.textContent));
      } catch {}
    }
    return fetch('site.config.json').then((r) => r.json());
  }

  function fetchContent() {
    const ctrl = 'AbortController' in window ? new AbortController() : null;
    const timer = ctrl && setTimeout(() => ctrl.abort(), 4000);
    return fetch('/api/content', { signal: ctrl?.signal, headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .finally(() => clearTimeout(timer));
  }

  function merge(config, content) {
    const site = JSON.parse(JSON.stringify(config));
    site.notice = { closed: false, message: '' };
    if (!content || typeof content !== 'object') return site;
    if (Array.isArray(content.services)) site.services = content.services;
    if (Array.isArray(content.offers)) site.offers = content.offers;
    if (Array.isArray(content.gallery)) site.gallery = content.gallery;
    if (content.info) {
      if (content.info.hours) site.hours = { ...site.hours, ...content.info.hours };
      if (content.info.contact) {
        const c = content.info.contact;
        site.contact = { ...site.contact };
        for (const k of ['phone', 'whatsapp', 'email', 'address']) if (c[k] !== undefined && (c[k] || k === 'email')) site.contact[k] = c[k];
      }
      if (content.info.notice) site.notice = content.info.notice;
    }
    return site;
  }

  // ---------- rendering ----------

  function renderBasics(site) {
    const b = site.business || {};
    const c = site.contact || {};
    const name = b.name || 'Our Business';

    slots('brand').forEach((el) => {
      el.innerHTML = b.logo && safeUrl(b.logo)
        ? `<img src="${esc(safeUrl(b.logo))}" alt="${esc(name)}" class="brand__logo" width="160" height="40">`
        : `<span class="brand__name">${esc(name)}</span>`;
    });
    setText('name', name);
    setText('tagline', b.tagline);
    setText('address', c.address);

    const phoneLinks = slots('phone-link');
    phoneLinks.forEach((el) => {
      el.textContent = c.phone || '';
      el.setAttribute('href', telHref(c.phone));
    });
    const topPhone = $('.topbar__phone');
    if (topPhone && c.phone) topPhone.innerHTML = `<svg class="i" aria-hidden="true"><use href="#i-phone"/></svg>${esc(c.phone)}`;

    const email = slots('email-link');
    email.forEach((el) => {
      el.textContent = c.email || '';
      el.setAttribute('href', c.email ? 'mailto:' + c.email : '#');
    });
    slots('email-row').forEach((el) => (el.hidden = !c.email));

    const msg = site.whatsappMessage || `Hi ${name}! I found you on your website.`;
    const wa = waHref(c.whatsapp, msg);
    ['wa-book', 'wa-hero', 'wa-fab'].forEach((s) => setHref(s, wa));
    ['call-hero', 'call-fab'].forEach((s) => setHref(s, telHref(c.phone)));

    const q = encodeURIComponent(c.address || name);
    setHref('directions', safeUrl(c.directionsUrl) || `https://www.google.com/maps/dir/?api=1&destination=${q}`);

    // Hero
    const h = site.hero || {};
    setText('hero-eyebrow', h.eyebrow || b.tagline);
    setText('hero-headline', h.headline || name);
    setText('hero-subtext', h.subtext);
    const heroImg = $('#hero-img');
    const heroSrc = safeUrl(h.image);
    if (heroSrc && heroImg.getAttribute('src') !== heroSrc) heroImg.src = heroSrc;
    heroImg.hidden = !heroSrc;

    // About
    const a = site.about || {};
    setText('about-title', a.title || `About ${name}`);
    $('#about-text').innerHTML = String(a.text || '')
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
      .join('');
    const aboutImg = $('#about-img');
    if (safeUrl(a.image)) {
      aboutImg.src = safeUrl(a.image);
      aboutImg.alt = a.imageAlt || `Inside ${name}`;
    } else {
      aboutImg.closest('figure').hidden = true;
    }
    $('#about-stats').innerHTML = (a.highlights || [])
      .map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`)
      .join('');

    // Section headings
    const sec = site.sections || {};
    if (sec.services?.title) {
      setText('services-title', sec.services.title);
      setText('nav-services', sec.services.title.split(/[&,]/)[0].trim());
    }
    setText('services-subtitle', sec.services?.subtitle || '');
    if (sec.gallery?.title) setText('gallery-title', sec.gallery.title);
    setText('gallery-subtitle', sec.gallery?.subtitle || '');

    // Footer
    const social = site.social || {};
    $('#social').innerHTML = ['instagram', 'facebook', 'youtube']
      .filter((k) => /^https?:\/\//.test(social[k] || ''))
      .map((k) => `<a class="icon-btn" href="${esc(social[k])}" target="_blank" rel="noopener" aria-label="${k[0].toUpperCase() + k.slice(1)}"><svg class="i" aria-hidden="true"><use href="#i-${k}"/></svg></a>`)
      .join('');
    $('#year').textContent = new Date().getFullYear();
    const credit = site.credit || { text: 'Website by QuanShade Labs', url: '' };
    const creditEl = $('#credit');
    creditEl.textContent = credit.text || 'Website by QuanShade Labs';
    if (/^https?:\/\//.test(credit.url || '')) creditEl.href = credit.url;
    else creditEl.removeAttribute('href');

    // Map (lazy iframe)
    const mapSrc = /^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(c.mapEmbedUrl || '')
      ? c.mapEmbedUrl
      : `https://www.google.com/maps?q=${q}&output=embed`;
    const map = $('#map');
    if (map.dataset.src !== mapSrc) {
      map.dataset.src = mapSrc;
      map.innerHTML = `<iframe src="${esc(mapSrc)}" title="Map showing ${esc(name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
    }
  }

  function renderStatus(site) {
    const tz = site.timezone || 'Asia/Kolkata';
    const now = nowIn(tz);
    const badge = $('#status-badge');
    const notice = $('#notice');
    const n = site.notice || {};

    if (n.closed) {
      badge.className = 'status status--closed';
      badge.textContent = 'Temporarily closed';
      notice.hidden = false;
      notice.textContent = n.message || 'We are temporarily closed. Please call or WhatsApp us for updates.';
    } else {
      const st = openStatus(site.hours || {}, tz);
      badge.className = 'status ' + (st.open ? 'status--open' : 'status--closed');
      badge.textContent = st.open ? 'Open now' : 'Closed';
      badge.title = st.open ? `Closes at ${fmtTime(st.until)}` : st.next ? `Opens ${st.next}` : '';
      notice.hidden = true;
    }
    setText('today', `Today: ${fmtSlots(parseHours((site.hours || {})[now.day]))}`);

    $('#hours-table').innerHTML =
      '<tbody>' +
      DAYS.map((d) => {
        const isToday = d === now.day;
        return `<tr class="${isToday ? 'is-today' : ''}"><th scope="row">${DAY_LABELS[d]}${isToday ? ' <em>Today</em>' : ''}</th><td>${esc(fmtSlots(parseHours((site.hours || {})[d])))}</td></tr>`;
      }).join('') +
      '</tbody>';
  }

  function renderOffers(site) {
    const today = nowIn(site.timezone || 'Asia/Kolkata').date;
    const offers = (site.offers || []).filter((o) => o && o.title && !o.hidden && (!o.validTill || o.validTill >= today));
    const wrap = $('#offers');
    wrap.hidden = offers.length === 0;
    const fmtDate = (d) => {
      try {
        return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch {
        return d;
      }
    };
    $('#offers-list').innerHTML = offers
      .map((o) => `
        <article class="offer reveal">
          <span class="offer__tag">Offer</span>
          <div class="offer__body">
            <h3 class="offer__title">${esc(o.title)}</h3>
            ${o.text ? `<p>${esc(o.text)}</p>` : ''}
          </div>
          ${o.validTill ? `<p class="offer__date">Valid till ${esc(fmtDate(o.validTill))}</p>` : ''}
        </article>`)
      .join('');
  }

  function renderServices(site) {
    const items = (site.services || []).filter((s) => s && s.name && !s.hidden);
    const wa = (site.contact || {}).whatsapp;
    $('#services-list').innerHTML = items
      .map((s) => {
        const img = safeUrl(s.image);
        const ask = waHref(wa, `Hi! I would like to know more about "${s.name}".`);
        return `
        <article class="card reveal${img ? ' card--photo' : ''}">
          ${img ? `<img class="card__img" src="${esc(img)}" alt="" loading="lazy" decoding="async" width="600" height="400">` : `<div class="card__icon">${iconSvg(s.icon)}</div>`}
          <h3 class="card__title">${esc(s.name)}</h3>
          ${s.description ? `<p class="card__text">${esc(s.description)}</p>` : ''}
          <div class="card__foot">
            ${s.price ? `<span class="card__price">${esc(s.price)}</span>` : '<span></span>'}
            ${ask ? `<a class="card__link" href="${esc(ask)}" target="_blank" rel="noopener">Enquire <svg class="i" aria-hidden="true"><use href="#i-right"/></svg></a>` : ''}
          </div>
        </article>`;
      })
      .join('');
    $('#services').hidden = items.length === 0;

    const select = $('#enquiry-service');
    const current = select.value;
    select.innerHTML = '<option value="">Choose (optional)</option>' + items.map((s) => `<option>${esc(s.name)}</option>`).join('');
    select.value = current;
  }

  let galleryItems = [];
  function renderGallery(site) {
    galleryItems = (site.gallery || []).filter((g) => g && safeUrl(g.src));
    $('#gallery-list').innerHTML = galleryItems
      .map((g, i) => `
        <button class="gallery__item reveal" type="button" data-index="${i}" aria-label="Open photo: ${esc(g.alt || 'photo ' + (i + 1))}">
          <img src="${esc(safeUrl(g.src))}" alt="${esc(g.alt || '')}" loading="lazy" decoding="async" width="800" height="800">
        </button>`)
      .join('');
    $('#gallery').hidden = galleryItems.length === 0;
    $('a[href="#gallery"]').hidden = galleryItems.length === 0;
  }

  function renderReviews(site) {
    const items = (site.testimonials || []).filter((t) => t && t.text);
    $('#reviews').hidden = items.length === 0;
    $('a[href="#reviews"]').hidden = items.length === 0;
    $('#reviews-list').innerHTML = items
      .map((t) => {
        const r = Math.max(0, Math.min(5, Math.round(Number(t.rating) || 5)));
        return `
        <figure class="review">
          <div class="stars" role="img" aria-label="${r} out of 5 stars">${'★'.repeat(r)}<span>${'★'.repeat(5 - r)}</span></div>
          <blockquote>“${esc(t.text)}”</blockquote>
          <figcaption>${esc(t.name)}</figcaption>
        </figure>`;
      })
      .join('');
    setupSlider();
  }

  function renderFaq(site) {
    const items = (site.faq || []).filter((f) => f && f.q);
    $('#faq').hidden = items.length === 0;
    $('a[href="#faq"]').hidden = items.length === 0;
    $('#faq-list').innerHTML = items
      .map((f) => `
        <details class="faq__item reveal">
          <summary>${esc(f.q)}<span class="faq__plus" aria-hidden="true"></span></summary>
          <div class="faq__answer"><p>${esc(f.a)}</p></div>
        </details>`)
      .join('');
  }

  // ---------- behaviour ----------

  let revealObserver;
  function observeReveals() {
    const els = $$('.reveal:not(.is-in)');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    revealObserver ||= new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealObserver.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => revealObserver.observe(el));
  }

  let sliderTimer;
  function setupSlider() {
    const track = $('#reviews-list');
    const dots = $('#slider-dots');
    const cards = $$('.review', track);
    const perView = () => Math.max(1, Math.round(track.clientWidth / (cards[0]?.offsetWidth || track.clientWidth)));
    const pages = () => Math.max(1, Math.ceil(cards.length / perView()));
    const page = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    const go = (p) => {
      const n = pages();
      p = ((p % n) + n) % n;
      track.scrollTo({ left: p * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    const drawDots = () => {
      const n = pages();
      $('.slider__controls').hidden = n <= 1;
      dots.innerHTML = Array.from({ length: n }, (_, i) => `<button type="button" aria-label="Show reviews ${i + 1}" ${i === page() ? 'aria-current="true"' : ''}></button>`).join('');
    };
    drawDots();
    dots.onclick = (e) => {
      const i = [...dots.children].indexOf(e.target);
      if (i >= 0) go(i);
    };
    $('#slide-prev').onclick = () => go(page() - 1);
    $('#slide-next').onclick = () => go(page() + 1);
    track.onscroll = () => {
      [...dots.children].forEach((d, i) => d.toggleAttribute('aria-current', i === page()));
    };
    window.onresize = drawDots;

    clearInterval(sliderTimer);
    if (!reduceMotion && cards.length > 1) {
      let paused = false;
      const slider = $('#slider');
      slider.onmouseenter = slider.onfocusin = slider.ontouchstart = () => (paused = true);
      slider.onmouseleave = slider.onfocusout = () => (paused = false);
      sliderTimer = setInterval(() => {
        if (!paused && !document.hidden && pages() > 1) go(page() + 1);
      }, 6000);
    }
  }

  function setupLightbox() {
    const box = $('#lightbox');
    const img = $('#lb-img');
    const cap = $('#lb-cap');
    let index = 0;
    const show = (i) => {
      if (!galleryItems.length) return;
      index = (i + galleryItems.length) % galleryItems.length;
      const g = galleryItems[index];
      img.src = safeUrl(g.src);
      img.alt = g.alt || '';
      cap.textContent = g.alt || '';
    };
    const open = (i) => {
      show(i);
      if (typeof box.showModal === 'function') box.showModal();
      else box.setAttribute('open', '');
      document.body.classList.add('no-scroll');
    };
    const close = () => {
      if (typeof box.close === 'function') box.close();
      else box.removeAttribute('open');
    };
    box.addEventListener('close', () => document.body.classList.remove('no-scroll'));
    $('#gallery-list').addEventListener('click', (e) => {
      const item = e.target.closest('.gallery__item');
      if (item) open(Number(item.dataset.index));
    });
    $('#lb-close').onclick = close;
    $('#lb-prev').onclick = () => show(index - 1);
    $('#lb-next').onclick = () => show(index + 1);
    box.addEventListener('click', (e) => {
      if (e.target === box) close();
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    let startX = null;
    box.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
    box.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  function setupNav() {
    const nav = $('#nav');
    const toggle = $('#nav-toggle');
    const links = $('#nav-links');
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function setupForm(getSite) {
    const form = $('#enquiry');
    const err = $('#enquiry-error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const site = getSite();
      const d = Object.fromEntries(new FormData(form));
      const name = String(d.name || '').trim();
      if (!name) {
        err.hidden = false;
        err.textContent = 'Please enter your name.';
        form.elements.name.focus();
        return;
      }
      const number = (site.contact || {}).whatsapp;
      if (!number) {
        err.hidden = false;
        err.textContent = 'WhatsApp is not available right now. Please call us instead.';
        return;
      }
      err.hidden = true;
      const lines = [
        `Hello ${site.business?.name || ''}!`,
        `Name: ${name}`,
        d.phone && `Phone: ${String(d.phone).trim()}`,
        d.service && `Interested in: ${d.service}`,
        d.date && `Preferred date: ${new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`,
        d.message && String(d.message).trim() && `Message: ${String(d.message).trim()}`,
      ].filter(Boolean);
      window.open(waHref(number, lines.join('\n')), '_blank', 'noopener');
    });
  }

  // Keep the accent readable: lighten a dark accent on dark presets (and darken a
  // very light one on the light preset), then pick the text colour for accent buttons.
  function applyAccentContrast() {
    const root = document.documentElement;
    const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
    const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(accent);
    if (!m) return;
    let hex = m[1];
    if (hex.length === 3) hex = hex.replace(/./g, '$&$&');
    let rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const lum = ([r, g, b]) => {
      const c = [r, g, b].map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const darkTheme = root.dataset.theme !== 'light-minimal';
    const target = darkTheme ? 255 : 0;
    for (let i = 0; i < 10 && (darkTheme ? lum(rgb) < 0.2 : lum(rgb) > 0.3); i++) {
      rgb = rgb.map((v) => Math.round(v + (target - v) * 0.15));
    }
    root.style.setProperty('--accent', '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join(''));
    root.style.setProperty('--on-accent', lum(rgb) > 0.36 ? '#111' : '#fff');
  }

  // Floating WhatsApp/Call buttons appear once the hero buttons scroll away.
  function setupFab() {
    const fab = $('.fab');
    const ctas = $('.hero__ctas');
    if (!('IntersectionObserver' in window) || !ctas) return fab.classList.add('is-visible');
    new IntersectionObserver(([e]) => fab.classList.toggle('is-visible', !e.isIntersecting)).observe(ctas);
  }

  function renderAll(site) {
    renderBasics(site);
    renderStatus(site);
    renderOffers(site);
    renderServices(site);
    renderGallery(site);
    renderReviews(site);
    renderFaq(site);
    observeReveals();
  }

  // ---------- start ----------

  document.documentElement.classList.add('js');

  function start() {
    let site;
    readConfig()
      .then((config) => {
        site = merge(config, null);
        applyAccentContrast();
        renderAll(site);
        setupNav();
        setupFab();
        setupLightbox();
        setupForm(() => site);
        setInterval(() => renderStatus(site), 60 * 1000);
        return fetchContent().then((content) => {
          if (content && Object.keys(content).some((k) => k !== 'updatedAt')) {
            site = merge(config, content);
            renderAll(site);
          }
        });
      })
      .catch((err) => {
        console.warn('Could not load site config', err);
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
