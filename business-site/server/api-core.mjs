// Shared API logic. Used by serve.mjs (local, file storage) and
// netlify/functions/api.mjs (Netlify Blobs). Written once, works with any
// storage adapter that implements:
//   getContent() -> object | null
//   setContent(object)
//   getImage(id) -> { data: Uint8Array, type: string } | null
//   setImage(id, data: Uint8Array, type: string)
//   deleteImage(id)
//
// Request/Response are the standard Web API classes (built into Node 18+).

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_JSON_BYTES = 256 * 1024;
const WRONG_PASSWORD_DELAY_MS = 700;
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const SECTIONS = ['services', 'offers', 'gallery', 'info'];
const IMAGE_ID_RE = /^[a-z0-9]{8,40}$/;
const IMAGE_URL_RE = /^\/api\/images\/([a-z0-9]{8,40})$/;
const LIMITS = { services: 40, offers: 10, gallery: 60 };

// ---------- small helpers ----------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
}

const fail = (status, error) => json({ error }, status);

class InputError extends Error {}

// Strip HTML tags, control characters and stray angle brackets, collapse whitespace, cap length.
function cleanText(value, max = 200, { multiline = false } = {}) {
  if (value === undefined || value === null) return '';
  let s = String(value).normalize('NFC');
  s = s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  if (multiline) {
    s = s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '');
    s = s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
  } else {
    s = s.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ');
  }
  s = s.trim();
  return s.length > max ? s.slice(0, max).trim() : s;
}

function cleanPhone(value) {
  const s = String(value ?? '').replace(/[^\d+\s-]/g, '').replace(/\s+/g, ' ').trim();
  return s.slice(0, 20);
}

function cleanWhatsApp(value) {
  // wa.me needs digits only, with country code (e.g. 919876543210).
  let digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 10) digits = '91' + digits; // assume India for 10-digit numbers
  if (digits && (digits.length < 10 || digits.length > 15)) {
    throw new InputError('WhatsApp number looks wrong. Use 10 digits, e.g. 9876543210.');
  }
  return digits;
}

function cleanEmail(value) {
  const s = cleanText(value, 120);
  if (s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) throw new InputError('Email address looks wrong.');
  return s;
}

function cleanId(value) {
  const s = String(value ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
  return s || newId();
}

function newId() {
  return randomBytes(8).toString('hex');
}

function cleanDate(value) {
  const s = String(value ?? '').trim();
  if (!s) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) {
    throw new InputError('Date must look like 2026-12-31.');
  }
  return s;
}

// Image references: an uploaded image (/api/images/<id>), a file in
// public/assets/images, or a full https URL.
function cleanImageSrc(value) {
  const s = String(value ?? '').trim();
  if (!s) return '';
  if (IMAGE_URL_RE.test(s)) return s;
  if (/^\/?assets\/images\/[\w\-./]+$/.test(s) && !s.includes('..')) return s.replace(/^\//, '');
  if (/^https:\/\/[^\s"'<>]+$/.test(s) && s.length < 500) return s;
  throw new InputError('Invalid image.');
}

const TIME = '([01]\\d|2[0-3]):[0-5]\\d';
const SLOT_RE = new RegExp(`^${TIME}-${TIME}$`);

// Hours are strings: "10:00-20:00", "10:00-14:00, 17:00-21:00" or "closed".
function cleanHours(value) {
  const s = String(value ?? '').toLowerCase().replace(/\s+/g, '');
  if (!s || s === 'closed') return 'closed';
  const slots = s.split(',').filter(Boolean);
  if (slots.length > 2 || !slots.every((slot) => SLOT_RE.test(slot))) {
    throw new InputError('Opening hours must look like 10:00-20:00.');
  }
  if (slots.length === 2) {
    const [[, end1], [start2]] = slots.map((slot) => slot.split('-'));
    if (start2 < end1) throw new InputError('The second opening time must start after the first one ends.');
  }
  return slots.join(', ');
}

function arrayOf(value, max, name) {
  if (!Array.isArray(value)) throw new InputError(`${name} must be a list.`);
  if (value.length > max) throw new InputError(`Too many ${name} (max ${max}).`);
  return value;
}

// ---------- section validators ----------

const validators = {
  services(body) {
    const items = arrayOf(body.items, LIMITS.services, 'services');
    return items.map((it) => {
      const name = cleanText(it?.name, 80);
      if (!name) throw new InputError('Every service needs a name.');
      return {
        id: cleanId(it.id),
        name,
        description: cleanText(it.description, 300, { multiline: true }),
        price: cleanText(it.price, 40),
        icon: cleanText(it.icon, 24),
        image: cleanImageSrc(it.image),
        hidden: Boolean(it.hidden),
      };
    });
  },

  offers(body) {
    const items = arrayOf(body.items, LIMITS.offers, 'offers');
    return items.map((it) => {
      const title = cleanText(it?.title, 80);
      if (!title) throw new InputError('Every offer needs a title.');
      return {
        id: cleanId(it.id),
        title,
        text: cleanText(it.text, 300, { multiline: true }),
        validTill: cleanDate(it.validTill),
        hidden: Boolean(it.hidden),
      };
    });
  },

  gallery(body) {
    const items = arrayOf(body.items, LIMITS.gallery, 'photos');
    return items.map((it) => {
      const src = cleanImageSrc(it?.src);
      if (!src) throw new InputError('Photo is missing.');
      return { id: cleanId(it.id), src, alt: cleanText(it.alt, 120) };
    });
  },

  info(body) {
    const hoursIn = body.hours && typeof body.hours === 'object' ? body.hours : {};
    const hours = {};
    for (const d of DAYS) hours[d] = cleanHours(hoursIn[d]);
    const c = body.contact && typeof body.contact === 'object' ? body.contact : {};
    const phone = cleanPhone(c.phone);
    if (!phone) throw new InputError('Phone number is required.');
    const n = body.notice && typeof body.notice === 'object' ? body.notice : {};
    return {
      hours,
      contact: {
        phone,
        whatsapp: cleanWhatsApp(c.whatsapp),
        email: cleanEmail(c.email),
        address: cleanText(c.address, 200),
      },
      notice: {
        closed: Boolean(n.closed),
        message: cleanText(n.message, 200),
      },
    };
  },
};

// ---------- image helpers ----------

function sniffImageType(bytes) {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  const riff = String.fromCharCode(...bytes.subarray(0, 4));
  const webp = String.fromCharCode(...bytes.subarray(8, 12));
  if (riff === 'RIFF' && webp === 'WEBP') return 'image/webp';
  return null;
}

// Every uploaded image id referenced anywhere in the content.
function imageIdsIn(content) {
  const ids = new Set();
  const add = (src) => {
    const m = IMAGE_URL_RE.exec(src || '');
    if (m) ids.add(m[1]);
  };
  for (const s of content?.services || []) add(s.image);
  for (const g of content?.gallery || []) add(g.src);
  return ids;
}

// What visitors get: hidden services and expired/hidden offers removed.
function publicView(content, today) {
  const out = {};
  if (Array.isArray(content.services)) {
    out.services = content.services.filter((s) => !s.hidden).map(({ hidden, ...s }) => s);
  }
  if (Array.isArray(content.offers)) {
    out.offers = content.offers
      .filter((o) => !o.hidden && (!o.validTill || o.validTill >= today))
      .map(({ hidden, ...o }) => o);
  }
  if (Array.isArray(content.gallery)) out.gallery = content.gallery;
  if (content.info) out.info = content.info;
  out.updatedAt = content.updatedAt || null;
  return out;
}

function todayIn(timeZone) {
  try {
    // en-CA formats as YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function readLimited(request, max) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > max) return null;
  const buf = new Uint8Array(await request.arrayBuffer());
  return buf.length > max ? null : buf;
}

async function readJson(request) {
  const buf = await readLimited(request, MAX_JSON_BYTES);
  if (!buf) throw new InputError('Request is too large.');
  try {
    const data = JSON.parse(new TextDecoder().decode(buf));
    if (!data || typeof data !== 'object') throw new Error();
    return data;
  } catch {
    throw new InputError('Invalid data.');
  }
}

// ---------- the API ----------

/**
 * @param {object} opts
 * @param {object} opts.storage   storage adapter (see top of file)
 * @param {() => string} opts.getPassword  returns the admin password ('' = admin disabled)
 * @param {string} [opts.timeZone]  business time zone, used for offer expiry
 */
export function createApi({ storage, getPassword, timeZone = 'Asia/Kolkata' }) {
  async function loadContent() {
    const c = await storage.getContent();
    return c && typeof c === 'object' ? c : {};
  }

  async function checkPassword(request) {
    const expected = String(getPassword() || '');
    if (!expected) return { ok: false, response: fail(503, 'Admin is not set up. Set ADMIN_PASSWORD first.') };
    const given = String(request.headers.get('x-admin-password') || '');
    const a = createHash('sha256').update(given).digest();
    const b = createHash('sha256').update(expected).digest();
    if (given && timingSafeEqual(a, b)) return { ok: true };
    await sleep(WRONG_PASSWORD_DELAY_MS);
    return { ok: false, response: fail(401, 'Wrong password.') };
  }

  async function saveSection(section, value) {
    const content = await loadContent();
    const before = imageIdsIn(content);
    if (value === undefined) delete content[section];
    else content[section] = value;
    content.updatedAt = new Date().toISOString();
    await storage.setContent(content);
    // Delete uploaded photos that nothing uses any more.
    const after = imageIdsIn(content);
    for (const id of before) {
      if (!after.has(id)) {
        try {
          await storage.deleteImage(id);
        } catch (err) {
          console.error('Could not delete image', id, err);
        }
      }
    }
    return content;
  }

  async function handle(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method.toUpperCase();

    try {
      // Public: merged content for the website
      if (path === '/api/content' && method === 'GET') {
        const content = await loadContent();
        return json(publicView(content, todayIn(timeZone)), 200, {
          'cache-control': 'public, max-age=0, must-revalidate',
        });
      }

      // Public: uploaded images
      const imgMatch = /^\/api\/images\/([^/]+)$/.exec(path);
      if (imgMatch && method === 'GET') {
        const id = imgMatch[1];
        if (!IMAGE_ID_RE.test(id)) return fail(404, 'Not found.');
        const img = await storage.getImage(id);
        if (!img) return fail(404, 'Not found.');
        return new Response(img.data, {
          status: 200,
          headers: {
            'content-type': img.type || 'application/octet-stream',
            // ids are random and never reused, so images can be cached forever
            'cache-control': 'public, max-age=31536000, immutable',
            'x-content-type-options': 'nosniff',
          },
        });
      }

      if (path === '/api/login' && method === 'POST') {
        const auth = await checkPassword(request);
        return auth.ok ? json({ ok: true }) : auth.response;
      }

      if (path.startsWith('/api/admin/')) {
        const auth = await checkPassword(request);
        if (!auth.ok) return auth.response;
        const rest = path.slice('/api/admin/'.length);

        if (rest === 'content' && method === 'GET') {
          return json(await loadContent());
        }

        if (rest === 'images' && method === 'POST') {
          const bytes = await readLimited(request, MAX_IMAGE_BYTES);
          if (!bytes) return fail(413, 'Photo is too big. Maximum size is 3 MB.');
          const type = sniffImageType(bytes);
          if (!type) return fail(415, 'Only JPG, PNG or WebP photos are allowed.');
          const id = newId() + newId();
          await storage.setImage(id, bytes, type);
          return json({ id, url: `/api/images/${id}` }, 201);
        }

        if (SECTIONS.includes(rest) && method === 'PUT') {
          const body = await readJson(request);
          const value = validators[rest](body);
          const content = await saveSection(rest, value);
          return json({ ok: true, content });
        }

        // Reset a section back to what site.config.json says
        if (SECTIONS.includes(rest) && method === 'DELETE') {
          const content = await saveSection(rest, undefined);
          return json({ ok: true, content });
        }
      }

      return fail(404, 'Not found.');
    } catch (err) {
      if (err instanceof InputError) return fail(400, err.message);
      console.error(err);
      return fail(500, 'Something went wrong. Please try again.');
    }
  }

  return { handle };
}
