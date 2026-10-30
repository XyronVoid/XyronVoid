/* ===== Basketo — Store logic =====
 * Edit CONFIG, CATEGORIES, PRODUCTS and COMBOS to make this store your own.
 */

const CONFIG = {
  whatsapp: "919876543210",   // Orders go to this number (country code, no "+")
  freeDeliveryAt: 299,        // Free delivery above this cart value
  deliveryFee: 30,
  handlingFee: 5,
  pincodes: [],               // Leave empty to accept any valid pincode, or list e.g. ["400001", "400002"]
};

const CATEGORIES = [
  { name: "Fruits",     emoji: "🍎", bg: "#ffe9e4" },
  { name: "Vegetables", emoji: "🥦", bg: "#e4f6e6" },
  { name: "Dairy",      emoji: "🥛", bg: "#e8f2ff" },
  { name: "Bakery",     emoji: "🍞", bg: "#fff1dc" },
  { name: "Snacks",     emoji: "🍿", bg: "#fff6cc" },
  { name: "Beverages",  emoji: "🧃", bg: "#f1e8ff" },
  { name: "Staples",    emoji: "🌾", bg: "#f6efe2" },
  { name: "Eggs & Meat",emoji: "🥚", bg: "#ffeedd" },
];

// Each product can have several pack sizes (variants) with their own price and MRP
const PRODUCTS = [
  { id: 1,  name: "Fresh Bananas (Robusta)",  cat: "Fruits",     emoji: "🍌", best: true, v: [["6 pcs", 42, 55], ["12 pcs", 79, 110]] },
  { id: 2,  name: "Shimla Apples",            cat: "Fruits",     emoji: "🍎", best: true, v: [["4 pcs", 129, 160], ["1 kg", 219, 280]] },
  { id: 3,  name: "Alphonso Mangoes",         cat: "Fruits",     emoji: "🥭", v: [["2 pcs", 149, 199], ["6 pcs", 399, 540]] },
  { id: 4,  name: "Hass Avocado",             cat: "Fruits",     emoji: "🥑", v: [["1 pc", 129, 169]] },
  { id: 5,  name: "Desi Tomatoes",            cat: "Vegetables", emoji: "🍅", best: true, v: [["500 g", 24, 35], ["1 kg", 45, 68]] },
  { id: 6,  name: "Onions",                   cat: "Vegetables", emoji: "🧅", best: true, v: [["1 kg", 39, 52], ["2 kg", 75, 104]] },
  { id: 7,  name: "Fresh Broccoli",           cat: "Vegetables", emoji: "🥦", v: [["250 g", 59, 80]] },
  { id: 8,  name: "Orange Carrots",           cat: "Vegetables", emoji: "🥕", v: [["500 g", 32, 45]] },
  { id: 9,  name: "Toned Milk",               cat: "Dairy",      emoji: "🥛", best: true, v: [["500 ml", 28, 28], ["1 L", 56, 56]] },
  { id: 10, name: "Fresh Paneer",             cat: "Dairy",      emoji: "🧀", best: true, v: [["200 g", 89, 99], ["500 g", 210, 245]] },
  { id: 11, name: "Thick Curd",               cat: "Dairy",      emoji: "🥣", v: [["400 g", 45, 50]] },
  { id: 12, name: "Salted Butter",            cat: "Dairy",      emoji: "🧈", v: [["100 g", 58, 60], ["500 g", 275, 285]] },
  { id: 13, name: "Whole Wheat Bread",        cat: "Bakery",     emoji: "🍞", best: true, v: [["400 g", 45, 50]] },
  { id: 14, name: "Butter Croissants",        cat: "Bakery",     emoji: "🥐", v: [["2 pcs", 99, 120]] },
  { id: 15, name: "Classic Salted Chips",     cat: "Snacks",     emoji: "🍟", v: [["52 g", 20, 20], ["115 g", 50, 50]] },
  { id: 16, name: "Butter Popcorn",           cat: "Snacks",     emoji: "🍿", v: [["90 g", 49, 60]] },
  { id: 17, name: "Choco Chip Cookies",       cat: "Snacks",     emoji: "🍪", best: true, v: [["200 g", 75, 90]] },
  { id: 18, name: "Mixed Fruit Juice",        cat: "Beverages",  emoji: "🧃", v: [["1 L", 99, 125]] },
  { id: 19, name: "Tender Coconut Water",     cat: "Beverages",  emoji: "🥥", v: [["1 pc", 55, 70]] },
  { id: 20, name: "Assam Tea",                cat: "Beverages",  emoji: "🍵", v: [["250 g", 135, 160]] },
  { id: 21, name: "Basmati Rice",             cat: "Staples",    emoji: "🍚", best: true, v: [["1 kg", 129, 175], ["5 kg", 599, 850]] },
  { id: 22, name: "Chakki Atta",              cat: "Staples",    emoji: "🌾", v: [["5 kg", 249, 310], ["10 kg", 479, 600]] },
  { id: 23, name: "Farm Eggs",                cat: "Eggs & Meat",emoji: "🥚", best: true, v: [["6 pcs", 54, 60], ["12 pcs", 99, 120]] },
  { id: 24, name: "Fresh Chicken Curry Cut",  cat: "Eggs & Meat",emoji: "🍗", veg: false, v: [["500 g", 169, 210]] },
];

const COMBOS = [
  { id: 101, name: "Breakfast Combo",     emoji: "🍞🥛🥚🧈", bg: "#fff1dc", desc: "Bread, 1L milk, 6 eggs & butter",          v: [["Combo", 199, 260]] },
  { id: 102, name: "Weekly Veggie Basket",emoji: "🍅🧅🥕🥦", bg: "#e4f6e6", desc: "Tomato, onion, carrot & broccoli, 2.5 kg", v: [["Combo", 169, 235]] },
  { id: 103, name: "Movie Night Pack",    emoji: "🍿🍟🍪🧃", bg: "#f1e8ff", desc: "Popcorn, chips, cookies & juice",          v: [["Combo", 229, 295]] },
];

const COUPONS = [
  { code: "FRESH50",  desc: "₹50 off on orders above ₹299",    min: 299, calc: () => 50 },
  { code: "SAVE10",   desc: "10% off up to ₹100 above ₹499",   min: 499, calc: (t) => Math.min(100, Math.round(t * 0.1)) },
  { code: "FIRST100", desc: "₹100 off on orders above ₹699",   min: 699, calc: () => 100 },
];

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const ALL = [...PRODUCTS, ...COMBOS];
const byId = (id) => ALL.find((p) => p.id === id);
const catBg = (p) => p.bg || CATEGORIES.find((c) => c.name === p.cat)?.bg || "#f3f1e8";
const keyOf = (id, vi) => `${id}:${vi}`;

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

let cart = load("bk-cart", {});            // { "id:variantIndex": qty }
let pincode = load("bk-pin", null);
let coupon = null;
let slot = 0;
let activeCat = "Best sellers";
const chosenVariant = {};                  // product id -> selected variant index

/* ---------- Toast ---------- */
let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("show"), 2000);
}

/* ---------- Categories & tabs ---------- */
function renderCats() {
  $("#cats").innerHTML = CATEGORIES.map((c) => `
    <button class="cat ${activeCat === c.name ? "on" : ""}" data-cat="${c.name}">
      <span class="cat-tile" style="background:${c.bg}">${c.emoji}</span>${c.name}
    </button>`).join("");
  $("#tabs").innerHTML = ["Best sellers", ...CATEGORIES.map((c) => c.name)].map((n) =>
    `<button class="tab ${activeCat === n ? "on" : ""}" data-cat="${n}">${n}</button>`).join("");
}

/* ---------- Product cards ---------- */
function addControl(id, vi) {
  const qty = cart[keyOf(id, vi)] || 0;
  return qty
    ? `<div class="stepper"><button data-dec="${id}" data-vi="${vi}" aria-label="Remove one">−</button><span>${qty}</span><button data-inc="${id}" data-vi="${vi}" aria-label="Add one">+</button></div>`
    : `<button class="add" data-inc="${id}" data-vi="${vi}">ADD</button>`;
}

function productCard(p) {
  const vi = chosenVariant[p.id] || 0;
  const [label, price, mrp] = p.v[vi];
  const off = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
  return `
    <article class="card" data-card="${p.id}">
      <div class="thumb" style="background:${catBg(p)}">
        ${off ? `<span class="off">${off}%<br/>OFF</span>` : ""}
        ${p.veg === false ? "" : `<span class="veg" title="Vegetarian"></span>`}
        <span class="big">${p.emoji}</span>
      </div>
      <span class="eta">⏱ 30 MINS</span>
      <h3>${p.name}</h3>
      <div class="variant">
        ${p.v.length > 1
          ? `<select data-variant="${p.id}" aria-label="Pack size">${p.v.map((v, i) => `<option value="${i}" ${i === vi ? "selected" : ""}>${v[0]}</option>`).join("")}</select>`
          : label}
      </div>
      <div class="card-foot">
        <div class="price"><b>${inr(price)}</b>${off ? `<s>${inr(mrp)}</s>` : ""}</div>
        <span class="ctl">${addControl(p.id, vi)}</span>
      </div>
    </article>`;
}

function renderGrid() {
  const list = activeCat === "Best sellers" ? PRODUCTS.filter((p) => p.best) : PRODUCTS.filter((p) => p.cat === activeCat);
  $("#productsTitle").textContent = activeCat;
  $("#grid").innerHTML = list.length ? list.map(productCard).join("") : `<p class="empty">No products here yet.</p>`;
}

function renderCombos() {
  $("#combos").innerHTML = COMBOS.map((c) => {
    const [, price, mrp] = c.v[0];
    return `
      <article class="combo" data-card="${c.id}">
        <div class="combo-emojis" style="background:${c.bg}">${c.emoji}</div>
        <div><h3>${c.name}</h3><p>${c.desc}</p></div>
        <div class="combo-foot">
          <div class="price"><b>${inr(price)}</b><s>${inr(mrp)}</s> <span class="save-tag">Save ${inr(mrp - price)}</span></div>
          <span class="ctl">${addControl(c.id, 0)}</span>
        </div>
      </article>`;
  }).join("");
}

// Refresh only the ADD/stepper controls so dropdowns and animations aren't reset
function refreshControls() {
  $$("[data-card]").forEach((el) => {
    const id = +el.dataset.card;
    el.querySelector(".ctl").innerHTML = addControl(id, chosenVariant[id] || 0);
  });
}

/* ---------- Search ---------- */
function renderSuggest(q) {
  const box = $("#suggest");
  q = q.trim().toLowerCase();
  if (!q) return box.classList.remove("open");
  const hits = ALL.filter((p) => (p.name + " " + (p.cat || "combo")).toLowerCase().includes(q)).slice(0, 6);
  box.innerHTML = hits.length
    ? hits.map((p) => `
        <button data-pick="${p.id}">
          <span class="s-emoji" style="background:${catBg(p)}">${[...p.emoji][0]}</span>
          <span><b>${p.name}</b><small>${p.v[0][0]} · ${inr(p.v[0][1])}</small></span>
        </button>`).join("")
    : `<p class="none">No results for "${q}". Try "milk" or "apple".</p>`;
  box.classList.add("open");
}

function jumpTo(id) {
  const p = byId(id);
  $("#suggest").classList.remove("open");
  $("#searchInput").value = "";
  if (p.cat) {
    activeCat = p.cat;
    renderCats();
    renderGrid();
  }
  const el = $(`[data-card="${id}"]`);
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.animate([{ boxShadow: "0 0 0 0 rgba(31,138,76,.6)" }, { boxShadow: "0 0 0 10px rgba(31,138,76,0)" }], { duration: 900, iterations: 2 });
}

/* ---------- Cart ---------- */
function changeQty(id, vi, delta) {
  const k = keyOf(id, vi);
  const next = (cart[k] || 0) + delta;
  if (next <= 0) delete cart[k];
  else cart[k] = next;
  if (delta > 0 && next === 1) toast(`✓ ${byId(id).name} added`);
  save("bk-cart", cart);
  refreshControls();
  renderCart();
  if (delta > 0) {
    $("#cartBtn").classList.remove("bump");
    void $("#cartBtn").offsetWidth;
    $("#cartBtn").classList.add("bump");
  }
}

function lines() {
  return Object.entries(cart).map(([k, qty]) => {
    const [id, vi] = k.split(":").map(Number);
    const p = byId(id);
    const [label, price, mrp] = p.v[vi];
    return { id, vi, p, label, price, mrp, qty };
  });
}

function bill() {
  const ls = lines();
  const items = ls.reduce((s, l) => s + l.price * l.qty, 0);
  const mrpTotal = ls.reduce((s, l) => s + l.mrp * l.qty, 0);
  const count = ls.reduce((s, l) => s + l.qty, 0);
  const delivery = items === 0 || items >= CONFIG.freeDeliveryAt ? 0 : CONFIG.deliveryFee;
  const handling = items ? CONFIG.handlingFee : 0;
  const c = COUPONS.find((x) => x.code === coupon);
  const disc = c && items >= c.min ? c.calc(items) : 0;
  if (c && !disc) coupon = null; // cart dropped below the coupon minimum
  const total = items + delivery + handling - disc;
  const saved = mrpTotal - items + disc + (items && !delivery ? CONFIG.deliveryFee : 0);
  return { ls, items, count, delivery, handling, disc, total, saved };
}

const SLOTS = (() => {
  const now = new Date().getHours();
  const today = now < 18 ? [{ t: "Today", s: "6 PM – 8 PM" }] : [];
  return [{ t: "⚡ Express", s: "In 30 minutes" }, ...today, { t: "Tomorrow", s: "7 AM – 9 AM" }, { t: "Tomorrow", s: "6 PM – 8 PM" }];
})();

function renderCart() {
  const b = bill();
  const itemsText = `${b.count} item${b.count === 1 ? "" : "s"}`;
  $("#cartItemsLabel").textContent = itemsText;
  $("#cartTotalLabel").textContent = inr(b.items);
  $("#barCount").textContent = itemsText;
  $("#barTotal").textContent = inr(b.total);
  $("#cartBar").hidden = !b.count;
  document.body.classList.toggle("has-cart", b.count > 0);

  if (!b.count) {
    $("#cartList").innerHTML = `<div class="cart-empty"><span>🛒</span><h4>Your cart is empty</h4><p>Add fresh items and they'll show up here.</p><button class="btn btn-green" data-close>Start shopping</button></div>`;
    $("#cartExtras").hidden = true;
    $("#drawerFoot").hidden = true;
    return;
  }
  $("#cartExtras").hidden = false;
  $("#drawerFoot").hidden = false;

  $("#cartList").innerHTML = b.ls.map((l) => `
    <div class="c-item">
      <span class="c-thumb" style="background:${catBg(l.p)}">${[...l.p.emoji][0]}</span>
      <div class="c-info"><h4>${l.p.name}</h4><small>${l.label}</small></div>
      <div class="c-right">${addControl(l.id, l.vi)}<b>${inr(l.price * l.qty)}</b></div>
    </div>`).join("");

  $("#slots").innerHTML = SLOTS.map((s, i) => `<button class="slot ${slot === i ? "on" : ""}" data-slot="${i}"><b>${s.t}</b><small>${s.s}</small></button>`).join("");
  $("#slotLabel").textContent = `${SLOTS[slot].t.replace("⚡ ", "")} · ${SLOTS[slot].s}`;
  $(".eta-card b").textContent = slot === 0 ? "Delivery in 30 minutes" : "Scheduled delivery";

  $("#coupons").innerHTML = COUPONS.map((c) => {
    const locked = b.items < c.min;
    const on = coupon === c.code;
    return `<div class="coupon ${on ? "on" : ""} ${locked ? "locked" : ""}">
      <div><b>${c.code}</b><small>${locked ? `Add ${inr(c.min - b.items)} more to unlock` : c.desc}</small></div>
      <button data-coupon="${c.code}" ${locked ? "disabled" : ""}>${on ? "REMOVE" : "APPLY"}</button>
    </div>`;
  }).join("");

  $("#bItems").textContent = inr(b.items);
  $("#bDelivery").innerHTML = b.delivery ? inr(b.delivery) : `<s style="color:var(--muted)">${inr(CONFIG.deliveryFee)}</s> FREE`;
  $("#bDeliveryNote").textContent = b.delivery ? `(free above ${inr(CONFIG.freeDeliveryAt)})` : "";
  $("#bHandling").textContent = inr(b.handling);
  $("#bCouponRow").hidden = !b.disc;
  $("#bCoupon").textContent = "−" + inr(b.disc);
  $("#bTotal").textContent = inr(b.total);
  $("#footTotal").textContent = inr(b.total);
  $("#savings").hidden = b.saved <= 0;
  $("#savings").textContent = `🎉 You're saving ${inr(b.saved)} on this order!`;
}

function placeOrder() {
  const form = $("#addrForm");
  if (!form.reportValidity()) return;
  if (!/^\d{10}$/.test($("#aPhone").value.replace(/\D/g, "").slice(-10))) return toast("Please enter a valid 10-digit phone number");
  const b = bill();
  const pay = $('input[name="pay"]:checked').value;
  const items = b.ls.map((l) => `• ${l.p.name} (${l.label}) × ${l.qty} = ${inr(l.price * l.qty)}`).join("\n");
  const msg =
`🧺 *New Basketo order*

${items}

Item total: ${inr(b.items)}
Delivery: ${b.delivery ? inr(b.delivery) : "FREE"}
Handling: ${inr(b.handling)}${b.disc ? `\nCoupon ${coupon}: −${inr(b.disc)}` : ""}
*To pay: ${inr(b.total)}* (${pay})

🕒 Slot: ${SLOTS[slot].t.replace("⚡ ", "")}, ${SLOTS[slot].s}
👤 ${$("#aName").value}
📞 ${$("#aPhone").value}
📍 ${$("#aAddr").value}${pincode ? `, ${pincode}` : ""}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Pincode ---------- */
function setPinLabel() {
  $("#pinLabel").textContent = pincode ? `Delivering to ${pincode}` : "Enter your pincode";
}
function checkPin(e) {
  e.preventDefault();
  const pin = $("#pinInput").value.trim();
  const res = $("#pinResult");
  if (!/^[1-9]\d{5}$/.test(pin)) {
    res.className = "pin-result bad";
    return (res.textContent = "Please enter a valid 6-digit pincode");
  }
  if (CONFIG.pincodes.length && !CONFIG.pincodes.includes(pin)) {
    res.className = "pin-result bad";
    return (res.textContent = "😔 Sorry, we don't deliver here yet. Coming soon!");
  }
  pincode = pin;
  save("bk-pin", pin);
  setPinLabel();
  res.className = "pin-result ok";
  res.textContent = "🎉 Yay! We deliver to your area in 30 minutes.";
  setTimeout(closeAll, 1100);
}

/* ---------- Overlays ---------- */
function openCart() { $("#drawer").classList.add("open"); $("#scrim").classList.add("show"); }
function openPin() {
  $("#pinModal").classList.add("open");
  $("#pinResult").textContent = "";
  $("#pinInput").value = pincode || "";
  setTimeout(() => $("#pinInput").focus(), 50);
}
function closeAll() {
  $("#drawer").classList.remove("open");
  $("#scrim").classList.remove("show");
  $("#pinModal").classList.remove("open");
}

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-inc],[data-dec],[data-cat],[data-pick],[data-slot],[data-coupon],[data-close],[data-jump]");
  if (!el) {
    if (!e.target.closest("#searchBox")) $("#suggest").classList.remove("open");
    return;
  }
  const d = el.dataset;
  if (d.inc) return changeQty(+d.inc, +d.vi, 1);
  if (d.dec) return changeQty(+d.dec, +d.vi, -1);
  if (d.cat || d.jump) {
    activeCat = d.cat || d.jump;
    renderCats();
    renderGrid();
    if (d.cat && el.classList.contains("cat")) $("#products").scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (d.pick) return jumpTo(+d.pick);
  if (d.slot) { slot = +d.slot; return renderCart(); }
  if (d.coupon) {
    coupon = coupon === d.coupon ? null : d.coupon;
    renderCart();
    if (coupon) toast(`🎉 ${coupon} applied!`);
    return;
  }
  if ("close" in d) return closeAll();
});

document.addEventListener("change", (e) => {
  if (!e.target.dataset.variant) return;
  const id = +e.target.dataset.variant;
  chosenVariant[id] = +e.target.value;
  const card = e.target.closest(".card");
  const fresh = document.createElement("div");
  fresh.innerHTML = productCard(byId(id));
  const next = fresh.firstElementChild;
  next.style.animation = "none";
  card.replaceWith(next);
});

$("#cartBtn").addEventListener("click", openCart);
$("#cartBar").addEventListener("click", openCart);
$("#scrim").addEventListener("click", closeAll);
$("#locationBtn").addEventListener("click", openPin);
$("#pinModal").addEventListener("click", (e) => { if (e.target.id === "pinModal") closeAll(); });
$("#pinForm").addEventListener("submit", checkPin);
$("#placeOrder").addEventListener("click", placeOrder);
$("#searchInput").addEventListener("input", (e) => renderSuggest(e.target.value));
$("#searchInput").addEventListener("focus", (e) => renderSuggest(e.target.value));
$("#searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#suggest [data-pick]")?.click();
});
$("#subForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("📬 Subscribed! Use FRESH50 on your next order");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeAll(); $("#suggest").classList.remove("open"); }
});

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
setPinLabel();
renderCats();
renderGrid();
renderCombos();
renderCart();
