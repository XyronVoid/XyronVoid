/* ===== XYRON — Store logic =====
 * Edit PRODUCTS and WHATSAPP_NUMBER to make this template your own.
 */

// Your WhatsApp number with country code, no "+" or spaces (e.g. 919876543210)
const WHATSAPP_NUMBER = "919876543210";
const FREE_SHIPPING_AT = 1999;

const img = (id, w = 700) => `https://images.unsplash.com/${id}?w=${w}&q=80`;

const PRODUCTS = [
  { id: 1,  name: "Aurelia Classic Chrono",   cat: "watches",     price: 6499,  was: 9999,  rating: 4.9, reviews: 312, tag: "sale", img: img("photo-1523275335684-37898b6baf30"), desc: "Sapphire crystal, stainless steel case and Japanese quartz movement. Water resistant up to 50m." },
  { id: 2,  name: "Nordline Studio Headphones", cat: "audio",     price: 3999,  was: 5999,  rating: 4.8, reviews: 528, tag: "hot",  img: img("photo-1505740420928-5e560c06d30e"), desc: "Active noise cancellation, 40-hour battery and plush memory-foam ear cushions." },
  { id: 3,  name: "Kairo Runner Red",         cat: "sneakers",    price: 4299,  was: null,  rating: 4.7, reviews: 204, tag: "new",  img: img("photo-1542291026-7eec264c27ff"), desc: "Lightweight knit upper with responsive foam sole. Built for everyday comfort.", sizes: ["UK 6","UK 7","UK 8","UK 9","UK 10"] },
  { id: 4,  name: "Velour Leather Backpack",  cat: "accessories", price: 2899,  was: 3999,  rating: 4.8, reviews: 167, tag: "sale", img: img("photo-1553062407-98eeb64c6a62"), desc: "Full-grain vegan leather, padded 15\" laptop sleeve and water-resistant lining." },
  { id: 5,  name: "Monolith Smart Watch",     cat: "watches",     price: 4999,  was: 8999,  rating: 4.6, reviews: 441, tag: "sale", img: "images/smart-watch.jpg", desc: "AMOLED display, 14-day battery, heart-rate and SpO2 tracking." },
  { id: 6,  name: "Osteria Aviator Shades",   cat: "accessories", price: 1499,  was: 2199,  rating: 4.5, reviews: 98,  tag: null,   img: img("photo-1572635196237-14b3f281503f"), desc: "Polarised UV400 lenses with a featherweight metal frame." },
  { id: 7,  name: "Kairo Street White",       cat: "sneakers",    price: 3799,  was: null,  rating: 4.8, reviews: 276, tag: "new",  img: "images/white-sneakers.jpg", desc: "Minimal leather sneaker that goes with everything. Cushioned insole.", sizes: ["UK 6","UK 7","UK 8","UK 9","UK 10"] },
  { id: 8,  name: "Nordline Buds Air",        cat: "audio",       price: 2499,  was: 3499,  rating: 4.6, reviews: 389, tag: "hot",  img: img("photo-1590658268037-6bf12165a8df"), desc: "True wireless earbuds with ENC mics, low-latency gaming mode and 30-hour case." },
  { id: 9,  name: "Aurelia Minimal Gold",     cat: "watches",     price: 5499,  was: null,  rating: 4.9, reviews: 156, tag: "new",  img: img("photo-1524805444758-089113d48a6d"), desc: "Ultra-slim 7mm case with a sunray dial and genuine leather strap." },
  { id: 10, name: "Velour Card Wallet",       cat: "accessories", price: 899,   was: 1299,  rating: 4.7, reviews: 214, tag: null,   img: img("photo-1627123424574-724758594e93"), desc: "RFID-blocking slim wallet with quick-access card slot." },
  { id: 11, name: "Kairo Trail Pro",          cat: "sneakers",    price: 5299,  was: 6999,  rating: 4.7, reviews: 133, tag: "sale", img: img("photo-1491553895911-0055eca6402d"), desc: "Grippy rubber outsole and breathable mesh for city and trail.", sizes: ["UK 6","UK 7","UK 8","UK 9","UK 10"] },
  { id: 12, name: "Nordline Boom Speaker",     cat: "audio",      price: 3299,  was: 4499,  rating: 4.5, reviews: 187, tag: null,   img: img("photo-1608043152269-423dbba4e7e1"), desc: "360° sound, IPX7 waterproof and 20 hours of playtime." },
];

const DEAL_PRODUCT = { id: 99, name: "Aurelia Smart Watch Pro", cat: "watches", price: 4999, was: 8999, img: "images/smart-watch.jpg" };

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const inr = (n) => "₹" + n.toLocaleString("en-IN");
const findProduct = (id) => (id === DEAL_PRODUCT.id ? DEAL_PRODUCT : PRODUCTS.find((p) => p.id === id));

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
};

let cart = store.get("xyron-cart", []);       // [{ id, qty, size }]
let wishlist = store.get("xyron-wish", []);   // [id]
let state = { filter: "all", sort: "featured", query: "" };

// Replace broken images with an elegant placeholder
function handleImgError(e) {
  const el = e.target;
  if (el.tagName !== "IMG" || el.dataset.failed) return;
  el.dataset.failed = "1";
  const ph = document.createElement("div");
  ph.className = "ph";
  ph.textContent = el.dataset.fallback || el.alt || "XYRON";
  el.replaceWith(ph);
}
document.addEventListener("error", handleImgError, true);
// Images that already failed before this script loaded
$$("img").forEach((el) => {
  if (el.complete && el.naturalWidth === 0) handleImgError({ target: el });
});

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

function bump(el) {
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 300);
}

/* ---------- Products ---------- */
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

function productCard(p) {
  const wished = wishlist.includes(p.id);
  const tagLabel = { sale: p.was ? `-${Math.round((1 - p.price / p.was) * 100)}%` : "Sale", new: "New", hot: "Bestseller" }[p.tag];
  return `
    <article class="product" data-id="${p.id}">
      <div class="product-media">
        ${p.tag ? `<span class="tag ${p.tag}">${tagLabel}</span>` : ""}
        <button class="wish ${wished ? "active" : ""}" data-wish="${p.id}" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.4 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.7 1.2-1.6 2.8-2.7 4.8-2.7 3.8 0 6.2 3.8 4.7 7.3C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.name}" loading="lazy" data-fallback="${p.name}" />
        <div class="product-actions">
          <button class="add-btn" data-add="${p.id}">Add to Cart</button>
          <button class="qv-btn" data-view="${p.id}">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <div class="rating">${stars(p.rating)}<span>${p.rating} (${p.reviews})</span></div>
        <div class="price"><span class="now">${inr(p.price)}</span>${p.was ? `<span class="was">${inr(p.was)}</span>` : ""}</div>
      </div>
    </article>`;
}

function renderProducts() {
  let list = PRODUCTS.filter((p) =>
    (state.filter === "all" || p.cat === state.filter) &&
    p.name.toLowerCase().includes(state.query)
  );
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);

  $("#productGrid").innerHTML = list.map(productCard).join("");
  $("#emptyState").hidden = list.length > 0;
}

function setFilter(filter) {
  state.filter = filter;
  $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === filter));
  renderProducts();
}

/* ---------- Cart ---------- */
function addToCart(id, size = null) {
  const p = findProduct(id);
  if (!p) return;
  const line = cart.find((i) => i.id === id && i.size === size);
  if (line) line.qty++;
  else cart.push({ id, qty: 1, size });
  saveCart();
  bump($("#cartCount"));
  toast(`✓ ${p.name} added to cart`);
}

function saveCart() {
  store.set("xyron-cart", cart);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + findProduct(i.id).price * i.qty, 0);
  $("#cartCount").textContent = count;
  $("#cartSubtotal").textContent = inr(subtotal);

  const left = FREE_SHIPPING_AT - subtotal;
  $("#shipText").innerHTML = left > 0
    ? `Add <b>${inr(left)}</b> more for <b>FREE shipping</b>`
    : `🎉 You've unlocked <b>FREE shipping!</b>`;
  $("#shipBar").style.width = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100) + "%";

  if (!cart.length) {
    $("#cartItems").innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
        <p>Your cart is empty.</p>
      </div>`;
    return;
  }

  $("#cartItems").innerHTML = cart.map((item, idx) => {
    const p = findProduct(item.id);
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}" data-fallback="${p.cat}" />
        <div class="cart-item-info">
          <h4>${p.name}${item.size ? ` · ${item.size}` : ""}</h4>
          <div class="p">${inr(p.price * item.qty)}</div>
          <div class="qty">
            <button data-qty="${idx}" data-delta="-1" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button data-qty="${idx}" data-delta="1" aria-label="Increase">+</button>
          </div>
          <button class="remove" data-remove="${idx}">Remove</button>
        </div>
      </div>`;
  }).join("");
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.add("show");
}
function closeAll() {
  $("#cartDrawer").classList.remove("open");
  $("#nav").classList.remove("open");
  $("#overlay").classList.remove("show");
  $("#modal").classList.remove("open");
  $("#modal").setAttribute("aria-hidden", "true");
}

function checkout() {
  if (!cart.length) return toast("Your cart is empty");
  const lines = cart.map((i) => {
    const p = findProduct(i.id);
    return `• ${p.name}${i.size ? ` (${i.size})` : ""} × ${i.qty} = ${inr(p.price * i.qty)}`;
  });
  const total = cart.reduce((s, i) => s + findProduct(i.id).price * i.qty, 0);
  const msg = `Hi XYRON! I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${inr(total)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Wishlist ---------- */
function toggleWish(id) {
  const p = findProduct(id);
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((w) => w !== id);
    toast("Removed from wishlist");
  } else {
    wishlist.push(id);
    toast(`♥ ${p.name} saved to wishlist`);
  }
  store.set("xyron-wish", wishlist);
  $("#wishCount").textContent = wishlist.length;
  bump($("#wishCount"));
  $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("active", wishlist.includes(id)));
}

/* ---------- Quick view ---------- */
function openQuickView(id) {
  const p = findProduct(id);
  $("#modalContent").innerHTML = `
    <div class="m-img"><img src="${p.img}" alt="${p.name}" data-fallback="${p.name}" /></div>
    <div class="m-info">
      <span class="eyebrow">${p.cat}</span>
      <h2>${p.name}</h2>
      <div class="rating">${stars(p.rating)}<span>${p.rating} · ${p.reviews} reviews</span></div>
      <p class="desc">${p.desc}</p>
      ${p.sizes ? `<div class="m-sizes">${p.sizes.map((s, i) => `<button class="${i === 2 ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}</div>` : ""}
      <div class="price" style="margin-bottom:24px"><span class="now">${inr(p.price)}</span>${p.was ? `<span class="was">${inr(p.was)}</span>` : ""}</div>
      <button class="btn btn-primary btn-block" data-modal-add="${p.id}">Add to Cart</button>
    </div>`;
  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
}

/* ---------- Countdown (resets every midnight) ---------- */
function tickCountdown() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const diff = Math.max(0, end - now);
  const pad = (n) => String(n).padStart(2, "0");
  $("#cdH").textContent = pad(Math.floor(diff / 3.6e6));
  $("#cdM").textContent = pad(Math.floor((diff % 3.6e6) / 6e4));
  $("#cdS").textContent = pad(Math.floor((diff % 6e4) / 1000));
}

/* ---------- Animated counters ---------- */
function animateCounters() {
  $$("[data-count]").forEach((el) => {
    const target = +el.dataset.count;
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / 1600);
      const v = Math.floor(target * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString("en-IN") + (k === 1 ? "+" : "");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a");
  if (!t) return;

  if (t.dataset.add) {
    addToCart(t.dataset.add === "deal" ? DEAL_PRODUCT.id : +t.dataset.add);
  } else if (t.dataset.view) {
    openQuickView(+t.dataset.view);
  } else if (t.dataset.wish) {
    toggleWish(+t.dataset.wish);
  } else if (t.dataset.modalAdd) {
    const size = $(".m-sizes button.active")?.dataset.size || null;
    addToCart(+t.dataset.modalAdd, size);
    closeAll();
  } else if (t.dataset.size) {
    $$(".m-sizes button").forEach((b) => b.classList.toggle("active", b === t));
  } else if (t.dataset.qty) {
    const item = cart[+t.dataset.qty];
    item.qty += +t.dataset.delta;
    if (item.qty <= 0) cart.splice(+t.dataset.qty, 1);
    saveCart();
  } else if (t.dataset.remove) {
    cart.splice(+t.dataset.remove, 1);
    saveCart();
  } else if (t.dataset.filter) {
    setFilter(t.dataset.filter);
  } else if (t.dataset.cat) {
    setFilter(t.dataset.cat);
  } else if (t.closest("#nav") && window.innerWidth <= 900) {
    closeAll();
  }
});

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeAll);
$("#overlay").addEventListener("click", closeAll);
$("#closeModal").addEventListener("click", closeAll);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeAll(); });
$("#checkoutBtn").addEventListener("click", checkout);
$("#wishlistBtn").addEventListener("click", () =>
  toast(wishlist.length ? `♥ ${wishlist.length} item(s) in your wishlist` : "Your wishlist is empty")
);
$("#menuToggle").addEventListener("click", () => {
  $("#nav").classList.add("open");
  $("#overlay").classList.add("show");
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

$("#searchInput").addEventListener("input", (e) => {
  state.query = e.target.value.trim().toLowerCase();
  renderProducts();
});
$("#searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#shop").scrollIntoView({ behavior: "smooth" });
});
$("#sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});

$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("🎉 Subscribed! Use code XYRON10 for 10% off");
});

window.addEventListener("scroll", () => {
  $("#header").classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

// Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("visible");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
$("#wishCount").textContent = wishlist.length;
renderProducts();
renderCart();
tickCountdown();
setInterval(tickCountdown, 1000);
animateCounters();
