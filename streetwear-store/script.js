/* ===== VOIDWEAR — Store logic =====
 * Edit the CONFIG and PRODUCTS below to make this store your own.
 */

const CONFIG = {
  whatsapp: "919876543210",          // Your WhatsApp number with country code, no "+"
  freeShippingAt: 999,
  dropDate: null,                     // e.g. "2026-12-01T19:00:00" — null = 3 days from now
  coupons: { VOID15: 0.15, FIRST10: 0.10 },
};

// Product photos live in the images/ folder, so they load even without internet.
// Swap in your own photos by replacing the files (or changing these paths).
const img = (file) => `images/${file}`;

const PRODUCTS = [
  { id: 1,  name: "Void Oversized Tee",       cat: "T-Shirts", price: 899,  was: 1299, pop: 98, isNew: true,  stock: "in",  sizes: ["S","M","L","XL","XXL"], colors: ["#111","#f2f2f2","#6b6b5a"], img: img("oversized-tee.jpg"),   desc: "240 GSM heavyweight cotton, drop shoulder, boxy fit. Puff-printed back graphic." },
  { id: 2,  name: "Eclipse Zip Hoodie",       cat: "Hoodies",  price: 2199, was: 2999, pop: 95, isNew: true,  stock: "low", sizes: ["S","M","L","XL"],       colors: ["#1f2a4a","#111"],           img: img("zip-hoodie.jpg"),      desc: "420 GSM brushed fleece, double-layered hood and a full metal zip. Built for winter." },
  { id: 3,  name: "Utility Wide Pants",       cat: "Bottoms",  price: 1799, was: null, pop: 88, isNew: false, stock: "in",  sizes: ["28","30","32","34","36"], colors: ["#111","#2f3326"],          img: img("wide-pants.jpg"),      desc: "Relaxed wide leg in heavy twill, with deep pockets and an easy drawstring waist." },
  { id: 4,  name: "Night Leather Jacket",     cat: "Jackets",  price: 3499, was: 4499, pop: 80, isNew: true,  stock: "in",  sizes: ["M","L","XL"],           colors: ["#5a3420","#111"],           img: img("leather-jacket.jpg"),  desc: "Soft vegan leather, quilted lining and zip cuffs. Gets better with every wear." },
  { id: 5,  name: "Static Red Tee",           cat: "T-Shirts", price: 999,  was: null, pop: 91, isNew: false, stock: "in",  sizes: ["S","M","L","XL"],       colors: ["#c8262b","#111"],           img: img("red-tee.jpg"),         desc: "Oversized tee in a loud garment-dyed red with a ribbed neck." },
  { id: 6,  name: "Void Court Sneakers",      cat: "Footwear", price: 3299, was: 3999, pop: 86, isNew: false, stock: "low", sizes: ["7","8","9","10","11"],  colors: ["#f2f2f2"],                  img: img("court-sneakers.jpg"),  desc: "Clean white leather low-tops with a cushioned footbed. UK sizing." },
  { id: 7,  name: "Logo Beanie",              cat: "Accessories", price: 599, was: 799, pop: 75, isNew: false, stock: "in", sizes: ["FREE"],               colors: ["#111","#c6ff3d"],           img: img("beanie.jpg"),          desc: "Chunky rib-knit beanie with a woven logo label. One size fits all." },
  { id: 8,  name: "Washed Black Tee",         cat: "T-Shirts", price: 849,  was: 1099, pop: 84, isNew: false, stock: "in",  sizes: ["S","M","L","XL","XXL"], colors: ["#2a2a2a"],                  img: img("black-tee.jpg"),       desc: "Acid-washed for a vintage look. Every piece is slightly unique." },
  { id: 9,  name: "Forest Knit Crewneck",     cat: "Hoodies",  price: 2499, was: null, pop: 70, isNew: true,  stock: "out", sizes: ["S","M","L","XL"],       colors: ["#1f4a35"],                  img: img("forest-crewneck.jpg"), desc: "Soft brushed knit crewneck in deep forest green with ribbed trims." },
  { id: 10, name: "Classic Blue Denim",       cat: "Bottoms",  price: 1999, was: 2599, pop: 82, isNew: false, stock: "in",  sizes: ["28","30","32","34"],   colors: ["#1f2a3a"],                  img: img("blue-denim.jpg"),      desc: "13oz stretch denim with a relaxed straight leg and a rolled hem." },
  { id: 11, name: "Rose Knit Crewneck",       cat: "Hoodies",  price: 2299, was: 2799, pop: 66, isNew: false, stock: "in",  sizes: ["S","M","L","XL"],       colors: ["#e58aa8"],                  img: img("rose-crewneck.jpg"),   desc: "Relaxed-fit crewneck in a soft rose knit. Unisex sizing." },
  { id: 12, name: "Ember Knit Crewneck",      cat: "Hoodies",  price: 2299, was: null, pop: 78, isNew: false, stock: "in",  sizes: ["S","M","L","XL"],       colors: ["#e8571f"],                  img: img("ember-crewneck.jpg"),  desc: "Bold orange knit crewneck that stands out in any crowd." },
];

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const off = (p) => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);

const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

let cart = load("vw-cart", []);           // [{ id, size, color, qty }]
let wish = load("vw-wish", []);
let coupon = load("vw-coupon", null);
const filter = { cat: "All", max: 5000, size: null, sort: "new" };

/* ---------- Image fallback ---------- */
function fallback(img) {
  if (img.dataset.dead) return;
  img.dataset.dead = 1;
  const d = document.createElement("div");
  d.className = "ph";
  d.textContent = img.dataset.ph || img.alt || "VOIDWEAR";
  img.replaceWith(d);
}
document.addEventListener("error", (e) => { if (e.target.tagName === "IMG") fallback(e.target); }, true);
$$("img").forEach((i) => { if (i.complete && i.naturalWidth === 0) fallback(i); });

/* ---------- UI helpers ---------- */
let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("show"), 2200);
}
function pop(el) { el.classList.add("pop"); setTimeout(() => el.classList.remove("pop"), 250); }

/* ---------- Product card ---------- */
function card(p) {
  let label = "";
  if (p.stock === "out") label = `<span class="plabel sold">SOLD OUT</span>`;
  else if (p.stock === "low") label = `<span class="plabel low">ALMOST GONE</span>`;
  else if (off(p)) label = `<span class="plabel">-${off(p)}%</span>`;
  else if (p.isNew) label = `<span class="plabel">NEW</span>`;

  return `
    <article class="pcard" data-open="${p.id}">
      <div class="pmedia">
        ${label}
        <button class="pwish ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.4 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.7 1.2-1.6 2.8-2.7 4.8-2.7 3.8 0 6.2 3.8 4.7 7.3C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.name}" loading="lazy" data-ph="${p.name}" />
        ${p.stock === "out" ? "" : `<button class="quick-add" data-quick="${p.id}">+ QUICK ADD</button>`}
      </div>
      <div class="pinfo">
        <div><span class="pcat">${p.cat}</span><h3>${p.name}</h3></div>
        <div class="pprice"><b>${inr(p.price)}</b>${p.was ? `<s>${inr(p.was)}</s>` : ""}</div>
      </div>
      <div class="swatches">${p.colors.map((c) => `<i style="background:${c}"></i>`).join("")}</div>
    </article>`;
}

/* ---------- Drops rail ---------- */
function renderRail() {
  $("#dropRail").innerHTML = PRODUCTS.filter((p) => p.isNew).map(card).join("");
}
function scrollRail(dir) {
  const rail = $("#dropRail");
  const step = rail.querySelector(".pcard")?.offsetWidth + 20 || 300;
  rail.scrollBy({ left: dir * step, behavior: "smooth" });
}

/* ---------- Shop + filters ---------- */
function renderFilters() {
  const cats = ["All", ...new Set(PRODUCTS.map((p) => p.cat))];
  $("#fCats").innerHTML = cats.map((c) => {
    const n = c === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === c).length;
    return `<button class="${filter.cat === c ? "on" : ""}" data-cat="${c}">${c}<small>${n}</small></button>`;
  }).join("");

  const sizes = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34"];
  $("#fSizes").innerHTML = sizes.map((s) => `<button class="${filter.size === s ? "on" : ""}" data-fsize="${s}">${s}</button>`).join("");
}

function renderShop() {
  let list = PRODUCTS.filter((p) =>
    (filter.cat === "All" || p.cat === filter.cat) &&
    p.price <= filter.max &&
    (!filter.size || p.sizes.includes(filter.size))
  );
  const sorters = {
    new: (a, b) => b.isNew - a.isNew || b.id - a.id,
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    pop: (a, b) => b.pop - a.pop,
  };
  list.sort(sorters[filter.sort]);

  $("#resultCount").textContent = `SHOWING ${list.length} OF ${PRODUCTS.length} PRODUCTS`;
  $("#grid").innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="empty">Nothing matches these filters. <br/>Try clearing some.</div>`;
}

/* ---------- Product modal ---------- */
let pick = {};
function openProduct(id) {
  const p = byId(id);
  pick = { id, size: p.sizes.length === 1 ? p.sizes[0] : null, color: p.colors[0], qty: 1 };
  const soldOut = p.stock === "out";

  $("#modalBody").innerHTML = `
    <div class="m-media"><img src="${p.img}" alt="${p.name}" data-ph="${p.name}" /></div>
    <div class="m-info">
      <p class="kicker">${p.cat.toUpperCase()} ${p.isNew ? "· NEW DROP" : ""}</p>
      <h3>${p.name.toUpperCase()}</h3>
      <div class="m-price"><b>${inr(p.price)}</b>${p.was ? `<s>${inr(p.was)}</s><em>SAVE ${off(p)}%</em>` : ""}</div>
      <p class="m-desc">${p.desc}</p>
      <div>
        <p class="m-label">COLOUR</p>
        <div class="m-colors">${p.colors.map((c, i) => `<button class="${i === 0 ? "on" : ""}" data-color="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join("")}</div>
      </div>
      <div>
        <p class="m-label">SIZE <b id="pickedSize">${pick.size || "— select"}</b></p>
        <div class="m-sizes">${p.sizes.map((s) => `<button class="${pick.size === s ? "on" : ""}" data-msize="${s}">${s}</button>`).join("")}</div>
      </div>
      <div class="m-row">
        <div class="stepper"><button data-mqty="-1">−</button><span id="mQty">1</span><button data-mqty="1">+</button></div>
        <button class="btn btn-lime" id="mAdd" ${soldOut ? "disabled" : ""}>${soldOut ? "SOLD OUT" : "ADD TO CART"}</button>
      </div>
      <div class="m-perks">
        <span>⚡ Dispatched within 24 hours</span>
        <span>↺ Easy 7-day exchange</span>
        <span>₹ Cash on Delivery available</span>
      </div>
    </div>`;
  $("#modal").classList.add("open");
  $$("#modalBody img").forEach((i) => i.addEventListener("error", () => fallback(i)));
}

/* ---------- Cart ---------- */
function addToCart(id, size, color, qty = 1) {
  const p = byId(id);
  if (p.stock === "out") return toast("Sorry, this one's sold out");
  const line = cart.find((l) => l.id === id && l.size === size && l.color === color);
  if (line) line.qty += qty;
  else cart.push({ id, size, color, qty });
  persistCart();
  pop($("#cartCount"));
  toast(`ADDED: ${p.name}${size && size !== "FREE" ? ` (${size})` : ""}`);
}

function totals() {
  const sub = cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
  const rate = coupon ? CONFIG.coupons[coupon] || 0 : 0;
  const disc = sub * rate;
  return { sub, disc, total: sub - disc };
}

function persistCart() {
  save("vw-cart", cart);
  renderCart();
}

function renderCart() {
  const n = cart.reduce((s, l) => s + l.qty, 0);
  $("#cartCount").textContent = n;
  $("#cartCount2").textContent = n;
  $("#cartHeadCount").textContent = `(${n})`;

  const { sub, disc, total } = totals();
  $("#subTotal").textContent = inr(sub);
  $("#grandTotal").textContent = inr(total);
  $("#discountRow").hidden = !disc;
  $("#discount").textContent = "−" + inr(disc);
  $("#couponName").textContent = coupon || "";

  const left = CONFIG.freeShippingAt - sub;
  $("#shipMsg").innerHTML = left > 0
    ? `You're <b>${inr(left)}</b> away from <b>FREE SHIPPING</b>`
    : `<b>FREE SHIPPING UNLOCKED ✓</b>`;
  $("#shipFill").style.width = Math.min(100, (sub / CONFIG.freeShippingAt) * 100) + "%";

  if (!cart.length) {
    $("#cartList").innerHTML = `<div class="cart-empty"><h4>EMPTY.</h4><p>Your cart is waiting for the drop.</p></div>`;
    return;
  }
  $("#cartList").innerHTML = cart.map((l, i) => {
    const p = byId(l.id);
    return `
      <div class="citem">
        <img src="${p.img}" alt="${p.name}" data-ph="${p.cat}" />
        <div>
          <h4>${p.name}</h4>
          <small>${l.size && l.size !== "FREE" ? `Size ${l.size} · ` : ""}<i style="display:inline-block;width:10px;height:10px;background:${l.color};border:1px solid #555;vertical-align:middle"></i></small>
          <div class="stepper"><button data-cq="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-cq="${i}" data-d="1" aria-label="Increase">+</button></div>
        </div>
        <div class="citem-r"><b>${inr(p.price * l.qty)}</b><button data-rm="${i}">REMOVE</button></div>
      </div>`;
  }).join("");
}

function applyCoupon(code) {
  code = code.trim().toUpperCase();
  if (!code) return;
  if (CONFIG.coupons[code]) {
    coupon = code;
    save("vw-coupon", coupon);
    toast(`${code} APPLIED: ${CONFIG.coupons[code] * 100}% OFF 🔥`);
  } else {
    toast("Invalid coupon code");
  }
  renderCart();
}

function checkout() {
  if (!cart.length) return toast("Your cart is empty");
  const { sub, disc, total } = totals();
  const lines = cart.map((l) => {
    const p = byId(l.id);
    return `• ${p.name}${l.size && l.size !== "FREE" ? ` [${l.size}]` : ""} × ${l.qty} = ${inr(p.price * l.qty)}`;
  });
  let msg = `Hey VOIDWEAR! 🖤 I want to order:\n\n${lines.join("\n")}\n\nSubtotal: ${inr(sub)}`;
  if (disc) msg += `\nCoupon ${coupon}: −${inr(disc)}`;
  msg += `\n*Total: ${inr(total)}*`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Wishlist ---------- */
function toggleWish(id) {
  const p = byId(id);
  const had = wish.includes(id);
  wish = had ? wish.filter((w) => w !== id) : [...wish, id];
  save("vw-wish", wish);
  $("#wishCount").textContent = wish.length;
  pop($("#wishCount"));
  $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("on", !had));
  toast(had ? "Removed from wishlist" : `♥ SAVED: ${p.name}`);
}

/* ---------- Search ---------- */
function renderSearch(q) {
  q = q.trim().toLowerCase();
  const res = q ? PRODUCTS.filter((p) => (p.name + " " + p.cat).toLowerCase().includes(q)) : PRODUCTS.slice(0, 4);
  $("#searchResults").innerHTML =
    (q ? "" : `<p class="search-hint">TRENDING RIGHT NOW</p>`) +
    (res.length ? res.map(card).join("") : `<p class="search-hint">No results for "${q}"</p>`);
}

/* ---------- Overlays ---------- */
function openCart() { $("#cart").classList.add("open"); $("#scrim").classList.add("show"); }
function openSearch() {
  $("#searchOv").classList.add("open");
  renderSearch("");
  setTimeout(() => $("#searchInput").focus(), 50);
}
function closeAll() {
  $("#cart").classList.remove("open");
  $("#scrim").classList.remove("show");
  $("#modal").classList.remove("open");
  $("#searchOv").classList.remove("open");
}

/* ---------- Drop countdown ---------- */
const dropAt = CONFIG.dropDate ? new Date(CONFIG.dropDate) : new Date(Date.now() + 3 * 864e5 + 5 * 36e5);
function tick() {
  const d = Math.max(0, dropAt - Date.now());
  const pad = (n) => String(n).padStart(2, "0");
  $("#tD").textContent = pad(Math.floor(d / 864e5));
  $("#tH").textContent = pad(Math.floor((d % 864e5) / 36e5));
  $("#tM").textContent = pad(Math.floor((d % 36e5) / 6e4));
  $("#tS").textContent = pad(Math.floor((d % 6e4) / 1000));
}

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-wish],[data-quick],[data-open],[data-cat],[data-fsize],[data-msize],[data-color],[data-mqty],[data-cq],[data-rm]");
  if (!el) return;
  const d = el.dataset;

  if (d.wish) return toggleWish(+d.wish);
  if (d.quick) {
    const p = byId(+d.quick);
    // Quick add only skips the modal when there's a single size
    return p.sizes.length === 1 ? addToCart(p.id, p.sizes[0], p.colors[0]) : openProduct(p.id);
  }
  if (d.open) { $("#searchOv").classList.remove("open"); return openProduct(+d.open); }
  if (d.cat) { filter.cat = d.cat; renderFilters(); return renderShop(); }
  if (d.fsize) { filter.size = filter.size === d.fsize ? null : d.fsize; renderFilters(); return renderShop(); }
  if (d.msize) {
    pick.size = d.msize;
    $$("[data-msize]").forEach((b) => b.classList.toggle("on", b === el));
    return ($("#pickedSize").textContent = d.msize);
  }
  if (d.color) {
    pick.color = d.color;
    return $$("[data-color]").forEach((b) => b.classList.toggle("on", b === el));
  }
  if (d.mqty) {
    pick.qty = Math.max(1, pick.qty + +d.mqty);
    return ($("#mQty").textContent = pick.qty);
  }
  if (d.cq) {
    const l = cart[+d.cq];
    l.qty += +d.d;
    if (l.qty < 1) cart.splice(+d.cq, 1);
    return persistCart();
  }
  if (d.rm) { cart.splice(+d.rm, 1); return persistCart(); }
});

document.addEventListener("click", (e) => {
  if (e.target.id !== "mAdd") return;
  if (!pick.size) {
    toast("Please select a size first");
    return $(".m-sizes").animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], { duration: 250 });
  }
  addToCart(pick.id, pick.size, pick.color, pick.qty);
  closeAll();
});

$("#openCart").addEventListener("click", openCart);
$("#bnCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeAll);
$("#scrim").addEventListener("click", closeAll);
$("#openSearch").addEventListener("click", openSearch);
$("#bnSearch").addEventListener("click", openSearch);
$("#closeSearch").addEventListener("click", closeAll);
$("#closeModal").addEventListener("click", closeAll);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeAll(); });
$("#openWish").addEventListener("click", () => toast(wish.length ? `♥ ${wish.length} SAVED ITEM(S)` : "Wishlist is empty"));
$("#checkout").addEventListener("click", checkout);
$("#prevDrop").addEventListener("click", () => scrollRail(-1));
$("#nextDrop").addEventListener("click", () => scrollRail(1));
$("#filterToggle").addEventListener("click", () => $("#filters").classList.toggle("open"));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

$("#searchInput").addEventListener("input", (e) => renderSearch(e.target.value));
$("#sort").addEventListener("change", (e) => { filter.sort = e.target.value; renderShop(); });
$("#price").addEventListener("input", (e) => {
  filter.max = +e.target.value;
  $("#priceOut").textContent = inr(filter.max);
  renderShop();
});
$("#clearFilters").addEventListener("click", () => {
  Object.assign(filter, { cat: "All", max: 5000, size: null });
  $("#price").value = 5000;
  $("#priceOut").textContent = inr(5000);
  renderFilters();
  renderShop();
});
$("#couponForm").addEventListener("submit", (e) => {
  e.preventDefault();
  applyCoupon($("#couponInput").value);
  $("#couponInput").value = "";
});
$("#joinForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("YOU'RE IN. CODE FIRST10 = 10% OFF");
});
window.addEventListener("scroll", () => $("#header").classList.toggle("stuck", scrollY > 10), { passive: true });

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
$("#wishCount").textContent = wish.length;
renderRail();
renderFilters();
renderShop();
renderCart();
tick();
setInterval(tick, 1000);
