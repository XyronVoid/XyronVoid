/* ===== dewly. — Store logic =====
 * Edit CONFIG, PRODUCTS and INGREDIENTS to make this store your own.
 */

const CONFIG = {
  whatsapp: "919876543210",  // Orders go here (country code, no "+")
  freeShippingAt: 499,
  shippingFee: 49,
  samplesAt: 999,            // Free samples unlock above this amount
  samplesCount: 2,
  routineOff: 0.15,          // Quiz routine discount
  bundleOff: 0.20,           // "Pick any 3" discount
  subscribeOff: 0.10,        // Subscribe & save discount
};

// Photos: an Unsplash photo id, or your own file such as "images/serum.jpg".
// If a photo can't load, a drawn bottle in the product's tint is shown instead.
const u = (id, w = 600) => (id.startsWith("photo-") ? `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop` : id);

const CONCERNS = [
  { key: "acne",      label: "Acne & breakouts", icon: "🫧" },
  { key: "dullness",  label: "Dullness",         icon: "✨" },
  { key: "darkspots", label: "Dark spots",       icon: "🌗" },
  { key: "dryness",   label: "Dryness",          icon: "💧" },
  { key: "oil",       label: "Oil control",      icon: "🍃" },
  { key: "ageing",    label: "Fine lines",       icon: "⏳" },
];

const INGREDIENTS = [
  { key: "niacinamide", name: "Niacinamide",     icon: "🌿", bg: "#dcebd8", text: "Vitamin B3 that controls oil, refines pores and fades post-acne marks." },
  { key: "vitaminc",    name: "Vitamin C",       icon: "🍊", bg: "#ffe1cf", text: "An antioxidant that brightens dull skin and evens out tone." },
  { key: "hyaluronic",  name: "Hyaluronic Acid", icon: "💧", bg: "#dfeaf7", text: "Holds up to 1000× its weight in water for plump, bouncy skin." },
  { key: "ceramides",   name: "Ceramides",       icon: "🧱", bg: "#f3e3d3", text: "Lipids that repair your skin barrier and lock in moisture." },
  { key: "salicylic",   name: "Salicylic Acid",  icon: "🫧", bg: "#e9e0f3", text: "A BHA that unclogs pores from inside and calms breakouts." },
  { key: "spf",         name: "Zinc & SPF 50",   icon: "☀️", bg: "#fff1c9", text: "Broad-spectrum PA++++ protection, with no white cast." },
];

const PRODUCTS = [
  { id: 1,  name: "Clarifying Foam Cleanser", sub: "2% Salicylic Acid",         step: "Cleanser",    shape: "tube",    tint: "#cfe0cc", img: "photo-1556228578-8c89e6adf883", sizes: [["100 ml", 349], ["200 ml", 599]], rating: 4.7, reviews: 1820, concerns: ["acne", "oil"],             types: ["oily", "combination"],             ing: "salicylic" },
  { id: 2,  name: "Milky Cream Cleanser",     sub: "Ceramides + Oat",           step: "Cleanser",    shape: "bottle",  tint: "#f6efe6", img: "photo-1608248543803-ba4f8c70ae0b", sizes: [["100 ml", 379], ["200 ml", 649]], rating: 4.8, reviews: 1104, concerns: ["dryness"],                 types: ["dry", "sensitive"],                ing: "ceramides" },
  { id: 3,  name: "Rose Balancing Toner",     sub: "Hyaluronic + Rose water",   step: "Toner",       shape: "bottle",  tint: "#f9cfd0", img: "photo-1612817288484-6f916006741a", sizes: [["150 ml", 399]],                  rating: 4.6, reviews: 860,  concerns: ["dryness", "dullness"],     types: ["all"],                              ing: "hyaluronic" },
  { id: 4,  name: "10% Niacinamide Serum",    sub: "Niacinamide + Zinc",        step: "Serum",       shape: "dropper", tint: "#dcebd8", img: "photo-1620916566398-39f1143ab7be", sizes: [["30 ml", 549], ["50 ml", 799]],   rating: 4.9, reviews: 4210, concerns: ["acne", "oil", "darkspots"], types: ["oily", "combination"],             ing: "niacinamide", tag: "Bestseller" },
  { id: 5,  name: "Vitamin C Glow Serum",     sub: "15% Vitamin C + Ferulic",   step: "Serum",       shape: "dropper", tint: "#ffcfa8", img: "photo-1611930022073-b7a4ba5fcccd", sizes: [["30 ml", 699], ["50 ml", 999]],   rating: 4.8, reviews: 2950, concerns: ["dullness", "darkspots"],   types: ["all"],                              ing: "vitaminc", tag: "New" },
  { id: 6,  name: "Hydra Plump Serum",        sub: "2% Hyaluronic Acid",        step: "Serum",       shape: "dropper", tint: "#dfeaf7", img: "photo-1631729371254-42c2892f0e6e", sizes: [["30 ml", 599]],                   rating: 4.7, reviews: 1630, concerns: ["dryness", "ageing"],       types: ["dry", "sensitive", "combination"], ing: "hyaluronic" },
  { id: 7,  name: "Retinal Night Serum",      sub: "0.1% Retinal + Peptides",   step: "Serum",       shape: "dropper", tint: "#e9e0f3", img: "photo-1617897903246-719242758050", sizes: [["30 ml", 899]],                   rating: 4.6, reviews: 740,  concerns: ["ageing", "darkspots"],     types: ["oily", "dry", "combination"],      ing: "niacinamide" },
  { id: 8,  name: "Oil-Free Gel Moisturiser", sub: "Hyaluronic + Green tea",    step: "Moisturiser", shape: "jar",     tint: "#d8efe9", img: "photo-1598440947619-2c35fc9aa908", sizes: [["50 g", 449], ["100 g", 749]],    rating: 4.8, reviews: 2210, concerns: ["oil", "acne"],             types: ["oily", "combination"],             ing: "hyaluronic" },
  { id: 9,  name: "Ceramide Barrier Cream",   sub: "5 Ceramides + Squalane",    step: "Moisturiser", shape: "jar",     tint: "#f3e3d3", img: "photo-1570194065650-d99fb4bedf0a", sizes: [["50 g", 499], ["100 g", 849]],    rating: 4.9, reviews: 1980, concerns: ["dryness", "ageing"],       types: ["dry", "sensitive"],                ing: "ceramides" },
  { id: 10, name: "Invisible Sunscreen Gel",  sub: "SPF 50 PA++++",             step: "Sunscreen",   shape: "tube",    tint: "#fff1c9", img: "photo-1556229010-6c3f2c9ca5f8", sizes: [["50 g", 499], ["80 g", 699]],      rating: 4.9, reviews: 5340, concerns: ["oil", "darkspots"],        types: ["oily", "combination", "sensitive"], ing: "spf", tag: "Bestseller" },
  { id: 11, name: "Hydrating Sun Cream",      sub: "SPF 50 + Ceramides",        step: "Sunscreen",   shape: "tube",    tint: "#ffe6c7", img: "photo-1596755389378-c31d21fd1273", sizes: [["50 g", 499]],                    rating: 4.7, reviews: 1270, concerns: ["dryness", "darkspots"],    types: ["dry", "sensitive"],                ing: "spf" },
  { id: 12, name: "Kaolin Clay Mask",         sub: "Clay + Salicylic Acid",     step: "Mask",        shape: "jar",     tint: "#e8ddd2", img: "photo-1599305090598-fe179d501227", sizes: [["75 g", 449]],                    rating: 4.6, reviews: 690,  concerns: ["acne", "oil"],             types: ["oily", "combination"],             ing: "salicylic" },
  { id: 13, name: "Overnight Glow Mask",      sub: "Vitamin C + Rice water",    step: "Mask",        shape: "jar",     tint: "#ffd9c2", img: "photo-1571781926291-c477ebfd024b", sizes: [["50 g", 549]],                    rating: 4.7, reviews: 910,  concerns: ["dullness", "dryness"],     types: ["all"],                              ing: "vitaminc" },
  { id: 14, name: "Peptide Lip Butter",       sub: "Ceramides + Shea",          step: "Lip care",    shape: "tube",    tint: "#f4b6b0", img: "photo-1601049541289-9b1b7bbbfe19", sizes: [["10 g", 249]],                    rating: 4.8, reviews: 1450, concerns: ["dryness"],                 types: ["all"],                              ing: "ceramides" },
];

const SAMPLES = ["Niacinamide Serum 5 ml", "Vitamin C Serum 5 ml", "Barrier Cream 10 g", "Sunscreen Gel 10 g", "Glow Mask 10 g", "Lip Butter mini"];

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const shortName = (p) => p.name.split(" ").slice(-2).join(" ");

// Drawn bottle, used as the background behind every photo and as the fallback
const art = (p) => `<div class="art ${p.shape}"><div class="bottle" style="--tint:${p.tint}" data-label="dewly. ${shortName(p)}"></div></div>`;
const photo = (p, w) => `<img src="${u(p.img, w)}" alt="${p.name}" loading="lazy" />`;
const media = (p, w = 600) => `${art(p)}${photo(p, w)}`;

document.addEventListener("error", (e) => { if (e.target.tagName === "IMG") e.target.remove(); }, true);

let bag = load("dw-bag", []);           // [{ id, si, qty, deal, sub }]
let samples = load("dw-samples", []);
const filter = { concern: null, type: "all", ing: null };
const chosenSize = {};

/* ---------- Toast ---------- */
let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("show"), 2300);
}

/* ---------- Hero ---------- */
$("#heroPhoto").innerHTML = media(byId(5), 800);

/* ---------- Shop ---------- */
function renderConcerns() {
  $("#concerns").innerHTML = CONCERNS.map((c) =>
    `<button class="concern ${filter.concern === c.key ? "on" : ""}" data-concern="${c.key}">${c.icon} ${c.label}</button>`).join("");
}

function card(p) {
  const si = chosenSize[p.id] || 0;
  const ing = INGREDIENTS.find((i) => i.key === p.ing);
  return `
    <article class="card">
      <div class="media" style="background:${p.tint}55">
        ${p.tag ? `<span class="tag ${p.tag === "Bestseller" ? "hot" : ""}">${p.tag}</span>` : ""}
        ${media(p)}
        <div class="hover-info"><b>${ing.icon} Key ingredient: ${ing.name}</b>${ing.text}</div>
      </div>
      <h3>${p.name}</h3>
      <p class="sub-name">${p.sub}</p>
      <div class="rating">★ ${p.rating} <span>(${p.reviews.toLocaleString("en-IN")} reviews)</span></div>
      <div class="chips">${p.concerns.slice(0, 2).map((c) => `<span>${CONCERNS.find((x) => x.key === c).label}</span>`).join("")}</div>
      <div class="card-foot">
        ${p.sizes.length > 1
          ? `<select class="size" data-size="${p.id}" aria-label="Size">${p.sizes.map((s, i) => `<option value="${i}" ${i === si ? "selected" : ""}>${s[0]}</option>`).join("")}</select>`
          : `<span class="size">${p.sizes[0][0]}</span>`}
        <button class="add" data-add="${p.id}">Add · ${inr(p.sizes[si][1])}</button>
      </div>
    </article>`;
}

function renderGrid() {
  const list = PRODUCTS.filter((p) =>
    (!filter.concern || p.concerns.includes(filter.concern)) &&
    (filter.type === "all" || p.types.includes("all") || p.types.includes(filter.type)) &&
    (!filter.ing || p.ing === filter.ing)
  );
  const af = $("#activeFilter");
  const ing = INGREDIENTS.find((i) => i.key === filter.ing);
  af.hidden = !ing;
  if (ing) af.innerHTML = `Showing products with <b>${ing.name}</b> <button data-clear-ing>Clear</button>`;
  $("#grid").innerHTML = list.length ? list.map(card).join("") : `<p class="empty">No match for this combination. Try another concern?</p>`;
}

/* ---------- Bag ---------- */
const unitPrice = (l) => byId(l.id).sizes[l.si][1] * (1 - (l.deal || 0)) * (l.sub ? 1 - CONFIG.subscribeOff : 1);

function addToBag(id, si = 0, deal = 0, quiet = false) {
  const line = bag.find((l) => l.id === id && l.si === si && l.deal === deal);
  if (line) line.qty++;
  else bag.push({ id, si, qty: 1, deal, sub: false });
  persist();
  const b = $("#bagBtn");
  b.classList.remove("bump");
  void b.offsetWidth;
  b.classList.add("bump");
  if (!quiet) toast(`💕 ${byId(id).name} added`);
}

function persist() {
  save("dw-bag", bag);
  renderBag();
}

function totals() {
  const full = bag.reduce((s, l) => s + byId(l.id).sizes[l.si][1] * l.qty, 0);
  const sub = bag.reduce((s, l) => s + unitPrice(l) * l.qty, 0);
  const ship = !bag.length || sub >= CONFIG.freeShippingAt ? 0 : CONFIG.shippingFee;
  return { full, sub, save: full - sub, ship, total: sub + ship };
}

function renderBag() {
  const t = totals();
  $("#bagCount").textContent = bag.reduce((s, l) => s + l.qty, 0);

  const left = CONFIG.freeShippingAt - t.sub;
  const sLeft = CONFIG.samplesAt - t.sub;
  $("#shipMsg").innerHTML = left > 0
    ? `You're <b>${inr(left)}</b> away from free shipping`
    : sLeft > 0 ? `✓ Free shipping! Add <b>${inr(sLeft)}</b> more for ${CONFIG.samplesCount} free samples`
    : `🎁 Free shipping + ${CONFIG.samplesCount} free samples unlocked!`;
  $("#shipBar").style.width = Math.min(100, (t.sub / CONFIG.samplesAt) * 100) + "%";

  if (t.sub < CONFIG.samplesAt && samples.length) { samples = []; save("dw-samples", samples); }

  if (!bag.length) {
    $("#bagBody").innerHTML = `<div class="bag-empty"><span>🧴</span><p>Your bag is feeling a little dry…</p><a href="#quiz" class="btn btn-plum" data-close>Take the skin quiz</a></div>`;
    $("#bagFoot").hidden = true;
    return;
  }
  $("#bagFoot").hidden = false;

  const dealLabel = (d) => (d === CONFIG.routineOff ? `Quiz routine −${d * 100}%` : d === CONFIG.bundleOff ? `Pick-3 bundle −${d * 100}%` : "");
  $("#bagBody").innerHTML = bag.map((l, i) => {
    const p = byId(l.id);
    const base = p.sizes[l.si][1] * l.qty;
    const now = unitPrice(l) * l.qty;
    return `
      <div class="item">
        <div class="thumb" style="background:${p.tint}55">${media(p, 200)}</div>
        <div>
          <b>${p.name}</b>
          <small>${p.sizes[l.si][0]}</small>
          ${l.deal ? `<span class="deal">${dealLabel(l.deal)}</span>` : ""}
        </div>
        <div class="item-r">
          <span class="p">${now < base ? `<s>${inr(base)}</s>` : ""}${inr(now)}</span>
          <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div>
        </div>
        <label class="subscribe"><input type="checkbox" data-sub="${i}" ${l.sub ? "checked" : ""} /> 🔁 Deliver every month &amp; <b>save ${CONFIG.subscribeOff * 100}%</b></label>
      </div>`;
  }).join("") + samplesBox(t);

  $("#bSub").textContent = inr(t.full);
  $("#bSaveRow").hidden = t.save < 1;
  $("#bSave").textContent = "−" + inr(t.save);
  $("#bShip").textContent = t.ship ? inr(t.ship) : "FREE";
  $("#bTotal").textContent = inr(t.total);
}

function samplesBox(t) {
  const unlocked = t.sub >= CONFIG.samplesAt;
  return `
    <div class="samples">
      <h4>🎁 Pick ${CONFIG.samplesCount} free samples</h4>
      <p>${unlocked ? `${samples.length}/${CONFIG.samplesCount} chosen` : `Unlocks at ${inr(CONFIG.samplesAt)}`}</p>
      <div class="sample-list">${SAMPLES.map((s) => {
        const on = samples.includes(s);
        const disabled = !unlocked || (!on && samples.length >= CONFIG.samplesCount);
        return `<button class="${on ? "on" : ""}" data-sample="${s}" ${disabled ? "disabled" : ""}>${s}</button>`;
      }).join("")}</div>
    </div>`;
}

function checkout() {
  const t = totals();
  const lines = bag.map((l) => {
    const p = byId(l.id);
    const tags = [l.deal === CONFIG.routineOff && "quiz routine", l.deal === CONFIG.bundleOff && "pick-3 bundle", l.sub && "monthly subscription"].filter(Boolean);
    return `• ${p.name} (${p.sizes[l.si][0]}) × ${l.qty} = ${inr(unitPrice(l) * l.qty)}${tags.length ? ` [${tags.join(", ")}]` : ""}`;
  });
  let msg = `Hi dewly! 💕 I'd like to order:\n\n${lines.join("\n")}\n`;
  if (samples.length) msg += `\n🎁 Free samples: ${samples.join(", ")}`;
  if (t.save >= 1) msg += `\nYou saved: ${inr(t.save)}`;
  msg += `\nShipping: ${t.ship ? inr(t.ship) : "FREE"}\n*Total: ${inr(t.total)}*`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Skin quiz ---------- */
const QUESTIONS = [
  { key: "type", q: "How does your skin feel by midday?", opts: [
    ["oily", "💦", "Shiny all over", "Oily skin"], ["dry", "🏜️", "Tight or flaky", "Dry skin"],
    ["combination", "☯️", "Oily T-zone, dry cheeks", "Combination skin"], ["sensitive", "🌸", "Red or itchy easily", "Sensitive skin"] ] },
  { key: "concern", q: "What's your #1 skin concern?", opts: [
    ["acne", "🫧", "Acne & breakouts", ""], ["dullness", "✨", "Dull, tired skin", ""],
    ["darkspots", "🌗", "Dark spots & tan", ""], ["ageing", "⏳", "Fine lines", ""] ] },
  { key: "time", q: "How much time do you give your skin?", opts: [
    ["minimal", "⚡", "Keep it quick", "3 steps"], ["full", "🧖‍♀️", "I love a ritual", "5 steps"] ] },
  { key: "sun", q: "How much sun do you get?", opts: [
    ["outdoor", "☀️", "Outdoors a lot", "Commute, college, field work"], ["indoor", "🏠", "Mostly indoors", "Office or home"] ] },
];
let quiz = { step: 0, answers: {} };

function buildRoutine(a) {
  const oily = a.type === "oily" || a.type === "combination";
  const cleanser = oily ? 1 : 2;
  const serum = { acne: 4, dullness: 5, darkspots: 5, ageing: a.type === "sensitive" ? 6 : 7 }[a.concern];
  const moist = oily ? 8 : 9;
  const sun = oily || a.sun === "outdoor" ? 10 : 11;
  return a.time === "minimal" ? [cleanser, serum, sun] : [cleanser, 3, serum, moist, sun];
}

function renderQuiz() {
  const card = $("#quizCard");
  const done = quiz.step >= QUESTIONS.length;
  $("#quizBar").style.width = (Math.min(quiz.step, QUESTIONS.length) / QUESTIONS.length) * 100 + "%";
  $("#quizStep").textContent = done ? "Your routine is ready ✨" : `Question ${quiz.step + 1} of ${QUESTIONS.length}`;

  if (!done) {
    const q = QUESTIONS[quiz.step];
    card.innerHTML = `
      <h3>${q.q}</h3>
      <div class="options">${q.opts.map(([v, icon, label, note]) =>
        `<button class="opt" data-answer="${v}"><span>${icon}</span><div>${label}${note ? `<small>${note}</small>` : ""}</div></button>`).join("")}</div>
      ${quiz.step ? `<button class="quiz-back" data-quiz-back>← Back</button>` : ""}`;
    return;
  }

  const ids = buildRoutine(quiz.answers);
  const full = ids.reduce((s, id) => s + byId(id).sizes[0][1], 0);
  const typeLabel = QUESTIONS[0].opts.find((o) => o[0] === quiz.answers.type)[3];
  const concernLabel = CONCERNS.find((c) => c.key === quiz.answers.concern).label.toLowerCase();
  card.innerHTML = `
    <div class="result-top">
      <div><h3>Your ${ids.length}-step routine</h3><p>For ${typeLabel.toLowerCase()} focused on ${concernLabel}</p></div>
      <span class="save-pill">${CONFIG.routineOff * 100}% OFF</span>
    </div>
    <div class="routine">${ids.map((id, i) => {
      const p = byId(id);
      return `<div class="step"><i>${i + 1}</i><div class="thumb" style="background:${p.tint}55">${media(p, 200)}</div><div><b>${p.name}</b><small>${p.step} · ${p.sub}</small></div><span class="p">${inr(p.sizes[0][1])}</span></div>`;
    }).join("")}</div>
    <div class="result-total"><span>Routine total</span><span><s>${inr(full)}</s><b>${inr(full * (1 - CONFIG.routineOff))}</b></span></div>
    <button class="btn btn-plum btn-full" data-add-routine="${ids.join(",")}">Add my routine to bag</button>
    <button class="quiz-back" data-quiz-restart>↺ Retake quiz</button>`;
}

/* ---------- Bundle builder ---------- */
let picks = [];
function renderBundle() {
  $("#bundlePicks").innerHTML = PRODUCTS.filter((p) => p.step !== "Lip care").map((p) => `
    <button class="pick ${picks.includes(p.id) ? "on" : ""}" data-pick="${p.id}">
      <span class="check">✓</span>
      <div class="media" style="background:${p.tint}55">${media(p, 400)}</div>
      <b>${p.name}</b><small>${p.step} · ${inr(p.sizes[0][1])}</small>
    </button>`).join("");

  $("#slots").innerHTML = [0, 1, 2].map((i) => {
    const p = byId(picks[i]);
    return p
      ? `<div class="slot filled"><div class="thumb" style="background:${p.tint}">${media(p, 120)}</div><span>${p.name}</span><button data-unpick="${p.id}" aria-label="Remove">✕</button></div>`
      : `<div class="slot">✦ Pick product ${i + 1}</div>`;
  }).join("");

  const full = picks.reduce((s, id) => s + byId(id).sizes[0][1], 0);
  $("#bundleTotal").innerHTML = picks.length
    ? `<span>${picks.length === 3 ? "Bundle price" : `${3 - picks.length} more to unlock 20% off`}</span><span>${picks.length === 3 ? `<s>${inr(full)}</s>` : ""}<b>${inr(picks.length === 3 ? full * (1 - CONFIG.bundleOff) : full)}</b></span>`
    : "";
  const btn = $("#addBundle");
  btn.disabled = picks.length < 3;
  btn.textContent = picks.length < 3 ? `Pick ${3 - picks.length} more` : "Add bundle to bag";
}

/* ---------- Ingredients ---------- */
$("#ingredientList").innerHTML = INGREDIENTS.map((i) => {
  const n = PRODUCTS.filter((p) => p.ing === i.key).length;
  return `<button class="ing" data-ing="${i.key}"><div class="ico" style="background:${i.bg}">${i.icon}</div><h3>${i.name}</h3><p>${i.text}</p><small>See ${n} product${n === 1 ? "" : "s"} →</small></button>`;
}).join("");

/* ---------- Before / after ---------- */
(() => {
  const src = u("photo-1616394584738-fc6e612e71b9", 900);
  const probe = new Image();
  probe.onload = () => $$(".ba-img").forEach((el) => (el.style.backgroundImage = `url(${src})`));
  probe.onerror = () => $$(".ba-img").forEach((el) => el.classList.add("no-photo"));
  probe.src = src;
  $("#baRange").addEventListener("input", (e) => $("#ba").style.setProperty("--pos", e.target.value + "%"));
})();

/* ---------- Overlays ---------- */
function openBag() { $("#bag").classList.add("open"); $("#scrim").classList.add("show"); }
function closeAll() {
  $("#bag").classList.remove("open");
  $("#nav").classList.remove("open");
  $("#scrim").classList.remove("show");
}

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-concern],[data-add],[data-answer],[data-quiz-back],[data-quiz-restart],[data-add-routine],[data-pick],[data-unpick],[data-ing],[data-clear-ing],[data-q],[data-sample],[data-close]");
  if (!el) return;
  const d = el.dataset;

  if (d.concern) { filter.concern = filter.concern === d.concern ? null : d.concern; renderConcerns(); return renderGrid(); }
  if (d.add) return addToBag(+d.add, chosenSize[+d.add] || 0);
  if (d.answer) { quiz.answers[QUESTIONS[quiz.step].key] = d.answer; quiz.step++; return renderQuiz(); }
  if ("quizBack" in d) { quiz.step--; return renderQuiz(); }
  if ("quizRestart" in d) { quiz = { step: 0, answers: {} }; return renderQuiz(); }
  if (d.addRoutine) {
    d.addRoutine.split(",").forEach((id) => addToBag(+id, 0, CONFIG.routineOff, true));
    toast(`✨ Routine added with ${CONFIG.routineOff * 100}% off!`);
    return openBag();
  }
  if (d.pick) {
    const id = +d.pick;
    if (picks.includes(id)) picks = picks.filter((p) => p !== id);
    else if (picks.length < 3) picks.push(id);
    else toast("You've picked 3 already. Remove one to swap");
    return renderBundle();
  }
  if (d.unpick) { picks = picks.filter((p) => p !== +d.unpick); return renderBundle(); }
  if (d.ing) {
    Object.assign(filter, { ing: d.ing, concern: null, type: "all" });
    $("#typeSelect").value = "all";
    renderConcerns();
    renderGrid();
    return $("#shop").scrollIntoView({ behavior: "smooth" });
  }
  if ("clearIng" in d) { filter.ing = null; return renderGrid(); }
  if (d.q) {
    const l = bag[+d.q];
    l.qty += +d.d;
    if (l.qty < 1) bag.splice(+d.q, 1);
    return persist();
  }
  if (d.sample) {
    samples = samples.includes(d.sample) ? samples.filter((s) => s !== d.sample) : [...samples, d.sample].slice(0, CONFIG.samplesCount);
    save("dw-samples", samples);
    return renderBag();
  }
  if ("close" in d) return closeAll();
});

document.addEventListener("change", (e) => {
  const d = e.target.dataset;
  if (d.size) {
    chosenSize[+d.size] = +e.target.value;
    const btn = e.target.closest(".card-foot").querySelector(".add");
    btn.textContent = `Add · ${inr(byId(+d.size).sizes[+e.target.value][1])}`;
  }
  if (d.sub) {
    bag[+d.sub].sub = e.target.checked;
    persist();
    if (e.target.checked) toast(`🔁 Subscribed! You save ${CONFIG.subscribeOff * 100}% every month`);
  }
});

$("#addBundle").addEventListener("click", () => {
  picks.forEach((id) => addToBag(id, 0, CONFIG.bundleOff, true));
  picks = [];
  renderBundle();
  toast(`🎉 Bundle added with ${CONFIG.bundleOff * 100}% off!`);
  openBag();
});
$("#typeSelect").addEventListener("change", (e) => { filter.type = e.target.value; renderGrid(); });
$("#bagBtn").addEventListener("click", openBag);
$("#scrim").addEventListener("click", closeAll);
$("#checkout").addEventListener("click", checkout);
$("#menuBtn").addEventListener("click", () => { $("#nav").classList.add("open"); $("#scrim").classList.add("show"); });
$$("#nav a").forEach((a) => a.addEventListener("click", closeAll));
$("#newsForm").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("💌 Welcome to the dew club! Check your inbox"); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", scrollY > 8), { passive: true });

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
renderConcerns();
renderGrid();
renderQuiz();
renderBundle();
renderBag();
