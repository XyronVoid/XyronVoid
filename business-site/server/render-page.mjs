// Bakes SEO tags, theme and the site config into public/index.html.
// Used by serve.mjs on every request and by scripts/build.mjs on Netlify,
// so search engines and link previews see real content without running JS.

const START = '<!--SITE:START-->';
const END = '<!--SITE:END-->';

const FONTS = {
  'dark-gold': 'family=Forum&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700',
  'light-minimal': 'family=Playfair+Display:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700',
  'bold-colour': 'family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700',
};

const SCHEMA_TYPES = {
  salon: 'BeautySalon',
  spa: 'DaySpa',
  gym: 'ExerciseGym',
  clinic: 'MedicalClinic',
  dentist: 'Dentist',
  coaching: 'EducationalOrganization',
  restaurant: 'Restaurant',
  cafe: 'CafeOrCoffeeShop',
  boutique: 'ClothingStore',
  bakery: 'Bakery',
};

const DAY_NAMES = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// JSON that is safe inside a <script> tag
const scriptJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, '');

export const presetOf = (config) => (FONTS[config?.theme?.preset] ? config.theme.preset : 'dark-gold');

function absolute(url, base) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return base ? base.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '') : url;
}

function jsonLd(config) {
  const b = config.business || {};
  const c = config.contact || {};
  const base = config.seo?.url || '';
  const data = {
    '@context': 'https://schema.org',
    '@type': SCHEMA_TYPES[b.category] || 'LocalBusiness',
    name: b.name,
    description: config.seo?.description || b.tagline,
    telephone: c.phone,
    email: c.email || undefined,
    address: c.address ? { '@type': 'PostalAddress', streetAddress: c.address, addressCountry: 'IN' } : undefined,
    url: base || undefined,
    image: absolute(config.seo?.image || config.hero?.image, base) || undefined,
    sameAs: Object.values(config.social || {}).filter((u) => /^https?:\/\//.test(u)),
    openingHoursSpecification: [],
  };
  for (const [day, value] of Object.entries(config.hours || {})) {
    if (!DAY_NAMES[day] || !value || value === 'closed') continue;
    for (const slot of String(value).split(',')) {
      const [opens, closes] = slot.trim().split('-');
      if (opens && closes) {
        data.openingHoursSpecification.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_NAMES[day], opens, closes });
      }
    }
  }
  const prices = (config.services || []).map((s) => s.price).filter(Boolean);
  if (prices.length) data.priceRange = '₹₹';
  return data;
}

export function renderHead(config) {
  const b = config.business || {};
  const seo = config.seo || {};
  const preset = presetOf(config);
  const accent = /^#[0-9a-f]{3,8}$/i.test(config.theme?.accent || '') ? config.theme.accent : '';
  const title = seo.title || [b.name, b.tagline].filter(Boolean).join(' | ');
  const desc = seo.description || config.hero?.subtext || '';
  const base = seo.url || '';
  const ogImage = absolute(seo.image || config.hero?.image, base);
  const heroImage = config.hero?.image;
  const bg = preset === 'light-minimal' ? '#faf8f5' : preset === 'bold-colour' ? '#101014' : '#0b0a09';

  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<meta name="theme-color" content="${bg}">`,
    base ? `<link rel="canonical" href="${esc(base)}">` : '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:site_name" content="${esc(b.name)}">`,
    base ? `<meta property="og:url" content="${esc(base)}">` : '',
    ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    // Load fonts without blocking the first paint
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${FONTS[preset]}&display=swap" media="print" onload="this.media='all'">`,
    heroImage ? `<link rel="preload" as="image" href="${esc(heroImage)}" fetchpriority="high">` : '',
    accent ? `<style>:root{--accent:${accent}}</style>` : '',
    `<script type="application/ld+json">${scriptJson(jsonLd(config))}</script>`,
    `<script id="site-config" type="application/json">${scriptJson(config)}</script>`,
  ]
    .filter(Boolean)
    .join('\n  ');
}

export function renderIndex(html, config) {
  const preset = presetOf(config);
  let out = html.replace(/<html([^>]*?)\sdata-theme="[^"]*"/, `<html$1 data-theme="${preset}"`);
  // Hero image in the HTML itself, so the browser starts loading it immediately
  const hero = /^(assets\/|https:\/\/)/.test(config.hero?.image || '') ? config.hero.image : '';
  out = out.replace(/<img class="hero__bg" id="hero-img"[^>]*>/, `<img class="hero__bg" id="hero-img"${hero ? ` src="${esc(hero)}"` : ''} alt="" fetchpriority="high" decoding="async">`);
  // Hero text and brand in the HTML too, so nothing jumps when the script runs
  // (matches filled tags too, so running the build again updates the text)
  const fill = (slot, text) =>
    (out = out.replace(new RegExp(`(<([a-z0-9]+)[^>]*data-slot="${slot}"[^>]*>)[^<]*(</\\2>)`), (_, open, _t, close) => open + esc(text) + close));
  const h = config.hero || {};
  const b = config.business || {};
  fill('hero-eyebrow', h.eyebrow || b.tagline || '');
  fill('hero-headline', h.headline || b.name || '');
  fill('hero-subtext', h.subtext || '');
  out = out.replace(/(<a class="brand" href="#top" data-slot="brand">)(?:<span class="brand__name">[^<]*<\/span>)?(<\/a>)/g, `$1<span class="brand__name">${esc(b.name || '')}</span>$2`);

  const i = out.indexOf(START);
  const j = out.indexOf(END);
  if (i === -1 || j === -1) return out;
  return out.slice(0, i + START.length) + '\n  ' + renderHead(config) + '\n  ' + out.slice(j);
}
