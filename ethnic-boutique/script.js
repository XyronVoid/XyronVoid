/* ===== ZARIYA — Boutique logic =====
 * Edit CONFIG, OCCASIONS and PRODUCTS to make this store your own.
 */

const CONFIG = {
  whatsapp: "919876543210",   // Orders and appointments go here (country code, no "+")
  stitchingFee: 499,          // Custom stitching charge per piece
  giftWrapFee: 99,
};

// Photos: an Unsplash photo id, or your own file such as "images/saree-1.jpg"
const u = (id, w = 800) => (id.startsWith("photo-") ? `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop` : id);

const OCCASIONS = [
  { name: "Wedding", note: "Bridal & guest", img: u("photo-1610030469983-98e550d6193c", 600) },
  { name: "Festive", note: "Diwali · Eid · Puja", img: u("photo-1583391733956-3750e0ff4e8b", 600) },
  { name: "Office",  note: "Elegant everyday", img: u("photo-1594736797933-d0501ba2fe65", 600) },
  { name: "Sangeet", note: "Mehendi & haldi", img: u("photo-1617627143750-d86bc21e42bb", 600) },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const PRODUCTS = [
  { id: 1,  name: "Rani Banarasi Silk Saree",   type: "Sarees",     fabric: "Silk",      occasion: "Wedding", price: 18999, was: 24999, badge: "Bestseller", sizes: ["Free size"], stitch: true,
    imgs: ["photo-1610030469983-98e550d6193c", "photo-1610189352649-6e1a3e3f8f1c"], work: "Pure zari brocade", desc: "A handwoven Banarasi in deep crimson with real zari buttis and a heavy pallu. Comes with an unstitched blouse piece." },
  { id: 2,  name: "Gulabi Kanjeevaram Saree",   type: "Sarees",     fabric: "Silk",      occasion: "Wedding", price: 21499, was: null,  badge: "Silk Mark",  sizes: ["Free size"], stitch: true,
    imgs: ["photo-1609357605129-26f69add5d6e", "photo-1610030469983-98e550d6193c"], work: "Temple border, contrast pallu", desc: "A rose-pink Kanjeevaram with a gold temple border, woven in Kanchipuram. Certified pure mulberry silk." },
  { id: 3,  name: "Noor Embroidered Lehenga",   type: "Lehengas",   fabric: "Georgette", occasion: "Sangeet", price: 32999, was: 39999, badge: "New",        sizes: SIZES, stitch: true,
    imgs: ["photo-1583391733956-3750e0ff4e8b", "photo-1617627143750-d86bc21e42bb"], work: "Sequin & resham", desc: "A blush georgette lehenga with sequin and resham embroidery, a 6-metre flare and a can-can lining. Includes a blouse and net dupatta." },
  { id: 4,  name: "Mehr Bridal Lehenga",        type: "Lehengas",   fabric: "Velvet",    occasion: "Wedding", price: 64999, was: null,  badge: "Bridal",     sizes: SIZES, stitch: true,
    imgs: ["photo-1614886137799-1629ba7d7a6e", "photo-1583391733956-3750e0ff4e8b"], work: "Zardozi & dabka", desc: "A maroon velvet bridal lehenga with hand zardozi, dabka and pearl work. Made to order in 4–5 weeks." },
  { id: 5,  name: "Chanderi Kurta Set",         type: "Kurta Sets", fabric: "Chanderi",  occasion: "Festive", price: 4999,  was: 6499,  badge: null,         sizes: SIZES, stitch: false,
    imgs: ["photo-1594736797933-d0501ba2fe65", "photo-1603189343302-e603f7add05a"], work: "Gota patti", desc: "A mint Chanderi kurta with gota patti yoke, straight pants and an organza dupatta." },
  { id: 6,  name: "Indigo Block-Print Set",     type: "Kurta Sets", fabric: "Cotton",    occasion: "Office",  price: 2799,  was: 3499,  badge: null,         sizes: SIZES, stitch: false,
    imgs: ["photo-1603189343302-e603f7add05a", "photo-1594736797933-d0501ba2fe65"], work: "Hand block print", desc: "A breathable Jaipur cotton kurta set with hand block-printed indigo motifs. Perfect for work days." },
  { id: 7,  name: "Phulkari Silk Dupatta",      type: "Kurta Sets", fabric: "Silk",      occasion: "Sangeet", price: 3299,  was: null,  badge: "Handmade",   sizes: ["Free size"], stitch: false,
    imgs: ["photo-1617627143750-d86bc21e42bb", "photo-1583391733956-3750e0ff4e8b"], work: "Phulkari hand embroidery", desc: "A vibrant Phulkari dupatta hand-embroidered by artisans in Patiala. It lifts any plain outfit." },
  { id: 8,  name: "Sitara Anarkali Gown",       type: "Kurta Sets", fabric: "Georgette", occasion: "Festive", price: 8999,  was: 11999, badge: null,         sizes: SIZES, stitch: true,
    imgs: ["photo-1612722432474-b971cdcea546", "photo-1594736797933-d0501ba2fe65"], work: "Mirror & thread work", desc: "A floor-length emerald Anarkali with mirror work on the yoke and a flared kalidar silhouette." },
  { id: 9,  name: "Tussar Silk Saree",          type: "Sarees",     fabric: "Silk",      occasion: "Office",  price: 7499,  was: 8999,  badge: null,         sizes: ["Free size"], stitch: true,
    imgs: ["photo-1610189352649-6e1a3e3f8f1c", "photo-1609357605129-26f69add5d6e"], work: "Kantha stitch border", desc: "A natural-toned Tussar silk saree with a kantha-stitched border. Light enough for long days." },
  { id: 10, name: "Organza Floral Saree",       type: "Sarees",     fabric: "Organza",   occasion: "Festive", price: 5999,  was: null,  badge: "New",        sizes: ["Free size"], stitch: true,
    imgs: ["photo-1621184455862-c163dfb30e0f", "photo-1610189352649-6e1a3e3f8f1c"], work: "Digital floral print", desc: "A sheer organza saree with soft floral prints and a scalloped embroidered border." },
  { id: 11, name: "Kundan Choker Set",          type: "Jewellery",  fabric: "Kundan",    occasion: "Wedding", price: 6499,  was: 7999,  badge: null,         sizes: ["One size"], stitch: false,
    imgs: ["photo-1599643478518-a784e5dc4c8f", "photo-1515562141207-7a88fb7ce338"], work: "Kundan & pearls", desc: "A gold-plated kundan choker with matching earrings and a maang tikka, finished with pearl drops." },
  { id: 12, name: "Temple Jhumkas",             type: "Jewellery",  fabric: "Silver",    occasion: "Sangeet", price: 2499,  was: null,  badge: "Bestseller", sizes: ["One size"], stitch: false,
    imgs: ["photo-1515562141207-7a88fb7ce338", "photo-1599643478518-a784e5dc4c8f"], work: "Oxidised 92.5 silver", desc: "Handcrafted temple jhumkas in oxidised sterling silver with goddess motifs." },
];

const LOOK = [7, 3, 12]; // product ids in "Shop the Look", in hotspot order

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const inr = (n) => "₹" + n.toLocaleString("en-IN");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const off = (p) => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const img = (src, alt, cls = "") => `<img ${cls ? `class="${cls}"` : ""} src="${u(src)}" alt="${alt}" loading="lazy" data-ph="${alt}" />`;

let cart = load("zr-cart", []);       // [{ id, size, stitch, qty }]
let wish = load("zr-wish", []);
let recent = load("zr-recent", []);
const filter = { type: "All", fabric: "All", occasion: null, sort: "featured" };

/* ---------- Photo fallback ---------- */
function fallback(el) {
  if (el.dataset.dead) return;
  el.dataset.dead = 1;
  const d = document.createElement("div");
  d.className = "ph " + (el.className || "");
  d.textContent = el.dataset.ph || "ZARIYA";
  el.replaceWith(d);
}
document.addEventListener("error", (e) => { if (e.target.tagName === "IMG") fallback(e.target); }, true);
$$("img").forEach((i) => { if (i.complete && i.naturalWidth === 0) fallback(i); });

/* ---------- Toast ---------- */
let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("show"), 2400);
}
const pop = (el) => { el.classList.add("pop"); setTimeout(() => el.classList.remove("pop"), 300); };

/* ---------- Hero slider ---------- */
const slides = $$(".slide");
let current = 0;
let autoplay;
$("#dots").innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}" data-slide="${i}"></button>`).join("");
function showSlide(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, j) => s.classList.toggle("active", j === current));
  $$("#dots button").forEach((d, j) => d.classList.toggle("on", j === current));
  clearInterval(autoplay);
  autoplay = setInterval(() => showSlide(current + 1), 6000);
}

/* ---------- Testimonials ---------- */
const quotes = $$(".q");
let qi = 0;
$("#qDots").innerHTML = quotes.map((_, i) => `<button aria-label="Review ${i + 1}" data-quote="${i}"></button>`).join("");
function showQuote(i) {
  qi = (i + quotes.length) % quotes.length;
  quotes.forEach((q, j) => q.classList.toggle("active", j === qi));
  $$("#qDots button").forEach((d, j) => d.classList.toggle("on", j === qi));
}
setInterval(() => showQuote(qi + 1), 7000);

/* ---------- Occasions ---------- */
$("#occasionList").innerHTML = OCCASIONS.map((o) => `
  <a href="#collections" class="occasion" data-occasion="${o.name}">
    <div class="arch"><div class="arch-inner">${img(o.img, o.name)}</div></div>
    <h3>${o.name}</h3><span>${o.note}</span>
  </a>`).join("");

/* ---------- Collection ---------- */
function renderChips() {
  const types = ["All", ...new Set(PRODUCTS.map((p) => p.type))];
  const fabrics = ["All", ...new Set(PRODUCTS.map((p) => p.fabric))];
  $("#typeChips").innerHTML = types.map((t) => `<button class="chip ${filter.type === t ? "on" : ""}" data-type="${t}">${t}</button>`).join("");
  $("#fabricChips").innerHTML = fabrics.map((f) => `<button class="chip ${filter.fabric === f ? "on" : ""}" data-fabric="${f}">${f === "All" ? "All fabrics" : f}</button>`).join("");
}

function card(p) {
  return `
    <article class="card" data-open="${p.id}">
      <div class="card-media">
        ${p.badge ? `<span class="badge ${p.badge === "Bridal" || p.badge === "Silk Mark" ? "gold" : ""}">${p.badge}</span>` : ""}
        <button class="heart ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.3-8.8-8.6C1.8 8.1 4 4.8 7.3 4.8c1.9 0 3.4 1 4.7 2.6 1.3-1.6 2.8-2.6 4.7-2.6 3.3 0 5.5 3.3 4.1 6.6C19 15.7 12 20 12 20z"/></svg>
        </button>
        ${img(p.imgs[0], p.name)}
        ${p.imgs[1] ? img(p.imgs[1], p.name, "alt") : ""}
        <button class="card-cta" data-open="${p.id}">Quick View</button>
      </div>
      <div class="card-info">
        <small>${p.fabric} · ${p.type}</small>
        <h3>${p.name}</h3>
        <div class="price">${inr(p.price)}${p.was ? `<s>${inr(p.was)}</s><span class="off">${off(p)}% off</span>` : ""}</div>
      </div>
    </article>`;
}

function renderGrid() {
  let list = PRODUCTS.filter((p) =>
    (filter.type === "All" || p.type === filter.type) &&
    (filter.fabric === "All" || p.fabric === filter.fabric) &&
    (!filter.occasion || p.occasion === filter.occasion)
  );
  if (filter.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (filter.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  $("#collTitle").textContent = filter.occasion ? `${filter.occasion} Collection` : "Our Collection";
  $("#grid").innerHTML = list.length ? list.map(card).join("") : `<p class="empty">No pieces match this selection. Try another fabric.</p>`;
}

function search(q) {
  q = q.trim().toLowerCase();
  Object.assign(filter, { type: "All", fabric: "All", occasion: null });
  renderChips();
  const list = PRODUCTS.filter((p) => `${p.name} ${p.type} ${p.fabric} ${p.occasion} ${p.work}`.toLowerCase().includes(q));
  $("#collTitle").textContent = q ? `Results for "${q}"` : "Our Collection";
  $("#grid").innerHTML = list.length ? list.map(card).join("") : `<p class="empty">Nothing found for "${q}".</p>`;
}

/* ---------- Product modal ---------- */
let pick = {};
function openProduct(id) {
  const p = byId(id);
  pick = { id, size: p.sizes.length === 1 ? p.sizes[0] : null, stitch: false };
  addRecent(id);

  $("#modalBody").innerHTML = `
    <div class="pd">
      <div class="gallery">
        <div class="thumbs">${p.imgs.map((s, i) => `<button class="${i === 0 ? "on" : ""}" data-thumb="${i}">${img(s, p.name)}</button>`).join("")}</div>
        <div class="main-img" id="mainImg">${img(p.imgs[0], p.name)}</div>
      </div>
      <div class="pd-info">
        <div>
          <p class="eyebrow">${p.type} · ${p.occasion}</p>
          <h2>${p.name}</h2>
        </div>
        <div class="price">${inr(p.price)}${p.was ? `<s>${inr(p.was)}</s><span class="off">${off(p)}% off</span>` : ""}</div>
        <p class="pd-desc">${p.desc}</p>
        <dl class="pd-meta"><dt>Fabric</dt><dd>${p.fabric}</dd><dt>Work</dt><dd>${p.work}</dd><dt>Care</dt><dd>Dry clean only</dd><dt>Ships in</dt><dd>${p.badge === "Bridal" ? "4–5 weeks (made to order)" : "2–4 days"}</dd></dl>
        ${p.sizes.length > 1 ? `
          <div>
            <div class="pd-label"><span>Select size</span><button data-sizeguide>Size guide</button></div>
            <div class="sizes">${p.sizes.map((s) => `<button data-size="${s}">${s}</button>`).join("")}</div>
          </div>` : ""}
        ${p.stitch ? `
          <label class="stitch">
            <input type="checkbox" id="stitchBox" />
            <span><b>Add custom stitching (+${inr(CONFIG.stitchingFee)})</b><small>${p.type === "Sarees" ? "Blouse stitched to your measurements, with fall & pico done" : "Tailored to your exact measurements. We'll call you to take them."}</small></span>
          </label>` : ""}
        <div class="pd-actions">
          <button class="btn btn-maroon" data-add="${p.id}">Add to Bag · ${inr(p.price)}</button>
          <button class="heart ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.3-8.8-8.6C1.8 8.1 4 4.8 7.3 4.8c1.9 0 3.4 1 4.7 2.6 1.3-1.6 2.8-2.6 4.7-2.6 3.3 0 5.5 3.3 4.1 6.6C19 15.7 12 20 12 20z"/></svg></button>
        </div>
        <a class="ask" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hi ZARIYA! I have a question about "${p.name}" (${inr(p.price)}).`)}">💬 Ask about this piece on WhatsApp</a>
      </div>
    </div>`;
  openModal("#modal");
}

function openModal(sel) {
  $(sel).classList.add("open");
  $(sel).setAttribute("aria-hidden", "false");
}

/* ---------- Recently viewed ---------- */
function addRecent(id) {
  recent = [id, ...recent.filter((r) => r !== id)].slice(0, 8);
  save("zr-recent", recent);
  renderRecent();
}
function renderRecent() {
  $("#recentSec").hidden = !recent.length;
  $("#recent").innerHTML = recent.map((id) => card(byId(id))).join("");
}

/* ---------- Shop the look ---------- */
function renderLook(active = null) {
  $("#lookItems").innerHTML = LOOK.map((id) => {
    const p = byId(id);
    return `<button class="look-item ${active === id ? "on" : ""}" data-open="${id}">
      ${img(p.imgs[0], p.name)}
      <div><h4>${p.name}</h4><span class="price">${inr(p.price)}</span></div>
    </button>`;
  }).join("");
  $$(".hotspot").forEach((h) => h.classList.toggle("on", +h.dataset.spot === active));
}

/* ---------- Bag ---------- */
function addToBag(id, size, stitch) {
  const p = byId(id);
  const line = cart.find((l) => l.id === id && l.size === size && l.stitch === stitch);
  if (line) line.qty++;
  else cart.push({ id, size, stitch, qty: 1 });
  save("zr-cart", cart);
  renderBag();
  pop($("#cartCount"));
  toast(`✦ ${p.name} added to your bag`);
}

function totals() {
  const sub = cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
  const stitching = cart.reduce((s, l) => s + (l.stitch ? CONFIG.stitchingFee * l.qty : 0), 0);
  const gift = $("#giftWrap").checked && cart.length ? CONFIG.giftWrapFee : 0;
  return { sub, stitching, gift, total: sub + stitching + gift };
}

function renderBag() {
  $("#cartCount").textContent = cart.reduce((s, l) => s + l.qty, 0);
  if (!cart.length) {
    $("#cartBody").innerHTML = `<div class="drawer-empty"><p>Your bag is waiting to be filled…</p><button class="btn btn-line" data-close>Continue shopping</button></div>`;
    $("#cartFoot").hidden = true;
    return;
  }
  $("#cartFoot").hidden = false;
  $("#cartBody").innerHTML = cart.map((l, i) => {
    const p = byId(l.id);
    return `
      <div class="line">
        ${img(p.imgs[0], p.name)}
        <div>
          <h4>${p.name}</h4>
          <small>${l.size}${l.stitch ? " · Custom stitched" : ""}</small>
          <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div>
        </div>
        <div class="line-r"><b>${inr((p.price + (l.stitch ? CONFIG.stitchingFee : 0)) * l.qty)}</b><button data-rm="${i}">Remove</button></div>
      </div>`;
  }).join("");
  const t = totals();
  $("#cSub").textContent = inr(t.sub);
  $("#cStitchRow").hidden = !t.stitching;
  $("#cStitch").textContent = inr(t.stitching);
  $("#cGiftRow").hidden = !t.gift;
  $("#cTotal").textContent = inr(t.total);
}

function checkout() {
  const t = totals();
  const lines = cart.map((l) => {
    const p = byId(l.id);
    return `• ${p.name} (${l.size}${l.stitch ? ", custom stitching" : ""}) × ${l.qty} = ${inr((p.price + (l.stitch ? CONFIG.stitchingFee : 0)) * l.qty)}`;
  });
  let msg = `Namaste ZARIYA 🙏\nI would like to order:\n\n${lines.join("\n")}\n`;
  if (t.gift) msg += `\n🎁 Gift wrap: ${inr(t.gift)}`;
  if (t.gift && $("#giftMsg").value.trim()) msg += `\nGift message: "${$("#giftMsg").value.trim()}"`;
  msg += `\n\n*Total: ${inr(t.total)}*`;
  if (cart.some((l) => l.stitch)) msg += `\n\nPlease contact me for stitching measurements.`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Wishlist ---------- */
function toggleWish(id) {
  const had = wish.includes(id);
  wish = had ? wish.filter((w) => w !== id) : [...wish, id];
  save("zr-wish", wish);
  $("#wishCount").textContent = wish.length;
  pop($("#wishCount"));
  $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("on", !had));
  renderWish();
  toast(had ? "Removed from wishlist" : `♡ Saved to your wishlist`);
}
function renderWish() {
  $("#wishCount").textContent = wish.length;
  $("#wishBody").innerHTML = wish.length
    ? wish.map((id) => {
        const p = byId(id);
        return `<div class="line">
          ${img(p.imgs[0], p.name)}
          <div><h4>${p.name}</h4><small>${inr(p.price)}</small></div>
          <div class="line-r"><button class="btn btn-maroon" data-open="${id}">View</button><button data-wish="${id}">Remove</button></div>
        </div>`;
      }).join("")
    : `<div class="drawer-empty"><p>Tap ♡ on any piece to save it here.</p><button class="btn btn-line" data-close>Browse collection</button></div>`;
}

/* ---------- Drawers ---------- */
function openDrawer(sel) {
  closeAll();
  $(sel).classList.add("open");
  $("#scrim").classList.add("show");
}
function closeAll() {
  $$(".drawer, .modal").forEach((el) => el.classList.remove("open"));
  $$(".modal").forEach((el) => el.setAttribute("aria-hidden", "true"));
  $("#scrim").classList.remove("show");
  $("#nav").classList.remove("open");
}

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-wish],[data-add],[data-open],[data-type],[data-fabric],[data-occasion],[data-size],[data-thumb],[data-sizeguide],[data-close-size],[data-close],[data-slide],[data-quote],[data-spot],[data-q],[data-rm]");
  if (!el) return;
  const d = el.dataset;

  if (d.wish) return toggleWish(+d.wish);
  if (d.add) {
    const p = byId(+d.add);
    if (!pick.size) {
      toast("Please select your size");
      return $(".sizes")?.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], { duration: 260 });
    }
    addToBag(p.id, pick.size, !!$("#stitchBox")?.checked);
    return closeAll();
  }
  if (d.open) { closeAll(); return openProduct(+d.open); }
  if (d.type) { filter.type = d.type; filter.occasion = null; renderChips(); return renderGrid(); }
  if (d.fabric) { filter.fabric = d.fabric; renderChips(); return renderGrid(); }
  if (d.occasion) { Object.assign(filter, { type: "All", fabric: "All", occasion: d.occasion }); renderChips(); return renderGrid(); }
  if (d.size) {
    pick.size = d.size;
    return $$("[data-size]").forEach((b) => b.classList.toggle("on", b === el));
  }
  if (d.thumb) {
    const p = byId(pick.id);
    $$("[data-thumb]").forEach((b) => b.classList.toggle("on", b === el));
    $("#mainImg").classList.remove("zoom");
    return ($("#mainImg").innerHTML = img(p.imgs[+d.thumb], p.name));
  }
  if ("sizeguide" in d) return openModal("#sizeModal");
  if ("closeSize" in d) { $("#sizeModal").classList.remove("open"); return; }
  if ("close" in d) return closeAll();
  if (d.slide) return showSlide(+d.slide);
  if (d.quote) return showQuote(+d.quote);
  if (d.spot) return renderLook(+d.spot);
  if (d.q) {
    const l = cart[+d.q];
    l.qty += +d.d;
    if (l.qty < 1) cart.splice(+d.q, 1);
    save("zr-cart", cart);
    return renderBag();
  }
  if (d.rm) { cart.splice(+d.rm, 1); save("zr-cart", cart); return renderBag(); }
});

// Click-to-zoom on the main product photo
document.addEventListener("click", (e) => {
  const m = e.target.closest("#mainImg");
  if (m) m.classList.toggle("zoom");
});

$("#prevSlide").addEventListener("click", () => showSlide(current - 1));
$("#nextSlide").addEventListener("click", () => showSlide(current + 1));
$("#cartBtn").addEventListener("click", () => openDrawer("#cartDrawer"));
$("#wishBtn").addEventListener("click", () => { renderWish(); openDrawer("#wishDrawer"); });
$("#scrim").addEventListener("click", closeAll);
$$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); }));
$("#menuBtn").addEventListener("click", () => { $("#nav").classList.add("open"); $("#scrim").classList.add("show"); });
$$("#nav a").forEach((a) => a.addEventListener("click", closeAll));
$("#searchBtn").addEventListener("click", () => {
  $("#searchBar").classList.toggle("open");
  if ($("#searchBar").classList.contains("open")) setTimeout(() => $("#searchInput").focus(), 200);
});
$("#searchInput").addEventListener("input", (e) => search(e.target.value));
$("#searchInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#collections").scrollIntoView({ behavior: "smooth" }); });
$("#sort").addEventListener("change", (e) => { filter.sort = e.target.value; renderGrid(); });
$("#giftWrap").addEventListener("change", (e) => { $("#giftMsg").hidden = !e.target.checked; renderBag(); });
$("#checkout").addEventListener("click", checkout);
$("#addLook").addEventListener("click", () => {
  LOOK.forEach((id) => {
    const p = byId(id);
    if (p.sizes.length === 1) addToBag(id, p.sizes[0], false);
  });
  const needSize = LOOK.map(byId).filter((p) => p.sizes.length > 1);
  if (needSize.length) {
    toast(`Added! Now choose a size for the ${needSize[0].name}`);
    setTimeout(() => openProduct(needSize[0].id), 900);
  }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

// Appointment booking
$$("#apptType button").forEach((b) => b.addEventListener("click", () => $$("#apptType button").forEach((x) => x.classList.toggle("on", x === b))));
$("#apDate").min = new Date().toISOString().slice(0, 10);
$("#apptForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const type = $("#apptType .on").dataset.type;
  const date = new Date($("#apDate").value).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const msg = `Namaste ZARIYA 🙏\nI'd like to book a *${type}* appointment.\n\n👤 ${$("#apName").value}\n📞 ${$("#apPhone").value}\n📅 ${date} at ${$("#apTime").value}\n🛍️ Looking for: ${$("#apFor").value}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  toast("✦ Opening WhatsApp to confirm your appointment");
});
$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("✦ Welcome to the ZARIYA family");
});
window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", scrollY > 10), { passive: true });

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
showSlide(0);
showQuote(0);
renderChips();
renderGrid();
renderLook();
renderRecent();
renderBag();
renderWish();
