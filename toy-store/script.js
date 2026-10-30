/* ===== LOOPSY — Store logic =====
 * Edit the SETTINGS block (CONFIG, SIZES, EYES, MAKERS, COLLECTIONS, TOYS) to make this store your own.
 */
(function () {
  "use strict";

  /* ================= SETTINGS — edit these ================= */
  var CONFIG = {
    whatsapp: "919876543210",  // Orders go here: country code + number, no "+" or spaces
    freeShippingAt: 1499,
    shippingFee: 79,
    ribbon: 149,               // Embroidered name ribbon
    giftWrap: 99,
    readyDays: 2,              // Ready-to-ship sizes leave in this many days
    madeToOrderDays: 7         // Made-to-order sizes leave in this many days
  };

  // Each toy's price list follows this order. madeToOrder sizes ship later.
  var SIZES = [
    { key: "mini",     label: "Mini",     cm: "15 cm" },
    { key: "classic",  label: "Classic",  cm: "25 cm" },
    { key: "huggable", label: "Huggable", cm: "40 cm", madeToOrder: true }
  ];

  var EYES = [
    { key: "embroidered", label: "Embroidered eyes", note: "Baby-safe · 0+" },
    { key: "safety",      label: "Safety eyes", note: "Shiny · 3+" }
  ];

  var MAKERS = [
    { key: "sunita", name: "Sunita",  city: "Jaipur, Rajasthan",   since: 2019, made: 640, colour: "yellow" },
    { key: "meena",  name: "Meena",   city: "Madurai, Tamil Nadu", since: 2020, made: 510, colour: "pink" },
    { key: "rukhsar", name: "Rukhsar", city: "Lucknow, UP",        since: 2021, made: 380, colour: "mint" },
    { key: "lalita", name: "Lalita",  city: "Shillong, Meghalaya", since: 2022, made: 290, colour: "blue" }
  ];

  var COLLECTIONS = [
    { key: "all",      label: "All friends" },
    { key: "woodland", label: "🌻 Woodland" },
    { key: "winter",   label: "❄️ Winter" },
    { key: "family",   label: "👪 Families" }
  ];

  // img: photo in the images/ folder (replace with your own).
  // prices: one per size in SIZES (null = size not offered). hours: time to make a Classic.
  var TOYS = [
    { id: 1,  col: "winter",   name: "Bramble",  species: "Bear",      quote: "Loves cocoa, snow days and very long naps.",            img: "images/bear.jpg",           prices: [899, 1499, 2799], maker: "sunita",  hours: 7, tag: "Bestseller", colour: "yellow" },
    { id: 2,  col: "winter",   name: "Clover",   species: "Bunny",     quote: "Wears her pink scarf even in summer.",                  img: "images/bunny.jpg",          prices: [899, 1499, 2799], maker: "meena",   hours: 8, colour: "pink" },
    { id: 3,  col: "winter",   name: "Rusty",    species: "Fox",       quote: "Pretends to be brave, secretly scared of the dark.",    img: "images/fox.jpg",            prices: [949, 1549, 2899], maker: "rukhsar", hours: 8, tag: "New", colour: "orange" },
    { id: 4,  col: "woodland", name: "Hazel",    species: "Hedgehog",  quote: "Soft spikes, softer heart. Collects flowers.",           img: "images/hedgehog.jpg",       prices: [949, 1549, 2899], maker: "lalita",  hours: 9, colour: "mint" },
    { id: 5,  col: "woodland", name: "Pip",      species: "Mouse",     quote: "Tiny, curious and always in her best dress.",            img: "images/mouse.jpg",          prices: [849, 1399, 2599], maker: "meena",   hours: 6, colour: "blue" },
    { id: 6,  col: "woodland", name: "Daisy",    species: "Rabbit",    quote: "Brings a bunch of flowers to every tea party.",         img: "images/rabbit.jpg",         prices: [899, 1499, 2799], maker: "sunita",  hours: 8, tag: "Bestseller", colour: "pink" },
    { id: 7,  col: "woodland", name: "Acorn",    species: "Squirrel",  quote: "Hides snacks everywhere and forgets where.",            img: "images/squirrel.jpg",       prices: [949, 1549, 2899], maker: "rukhsar", hours: 9, colour: "yellow" },
    { id: 8,  col: "family",   name: "Snowy Friends", species: "Set of 4", quote: "Four sweater-wearing pals who do everything together.", img: "images/snowy-trio.jpg", prices: [2999, 4999, null], maker: "lalita", hours: 28, colour: "blue" },
    { id: 9,  col: "family",   name: "Fox & Friends", species: "Set of 3", quote: "A fox, a deer and a hare who share one big scarf.",    img: "images/fox-family.jpg",     prices: [2399, 3999, null], maker: "rukhsar", hours: 24, tag: "Gift set", colour: "orange" },
    { id: 10, col: "family",   name: "Bunny Siblings", species: "Set of 3", quote: "Big sister, middle brother and the baby. Never apart.", img: "images/bunny-siblings.jpg", prices: [2399, 3999, null], maker: "meena", hours: 22, colour: "mint" }
  ];
  /* ========================================================== */

  /* ---------- Helpers ---------- */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function byId(id) { for (var i = 0; i < TOYS.length; i++) if (TOYS[i].id === id) return TOYS[i]; return null; }
  function findBy(list, key, val) { for (var i = 0; i < list.length; i++) if (list[i][key] === val) return list[i]; return null; }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function photo(t) { return '<img src="' + esc(t.img) + '" alt="' + esc(t.name + ", crochet " + t.species.toLowerCase()) + '" loading="lazy" onerror="this.remove()" />'; }
  function firstSize(t) { for (var i = 0; i < t.prices.length; i++) if (t.prices[i] !== null) return i; return 0; }
  function sizeName(i) { return SIZES[i].label + " · " + SIZES[i].cm; }
  function today() { return new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); }
  // Bigger toys take longer: hours scale with size (Mini 0.6×, Classic 1×, Huggable 1.8×)
  function makeHours(t, si) { return Math.round(t.hours * [0.6, 1, 1.8][si]); }

  /* ---------- State ---------- */
  var cart = load("lp-cart", []);
  var gift = load("lp-gift", false);
  var filter = "all";
  var chosen = {};

  cart = cart.filter(function (l) { var t = byId(l.id); return t && t.prices[l.si] !== null && t.prices[l.si] !== undefined; });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  /* ---------- Shop ---------- */
  function renderFilters() {
    $("#filters").innerHTML = COLLECTIONS.map(function (c) {
      var n = c.key === "all" ? TOYS.length : TOYS.filter(function (t) { return t.col === c.key; }).length;
      return '<button class="chip ' + (filter === c.key ? "on" : "") + '" data-col="' + c.key + '">' + c.label + " <i>" + n + "</i></button>";
    }).join("");
  }

  function card(t, i) {
    var si = chosen[t.id] !== undefined ? chosen[t.id] : firstSize(t);
    var maker = findBy(MAKERS, "key", t.maker);
    return '<article class="card c-' + t.colour + '" style="--r:' + (i % 2 ? 1 : -1) * 0.6 + 'deg">' +
      '<button class="card-media" data-view="' + t.id + '" aria-label="Adopt ' + esc(t.name) + '">' + photo(t) +
        (t.tag ? '<span class="sticker s-white">' + esc(t.tag) + "</span>" : "") + "</button>" +
      '<div class="card-body">' +
        '<div class="name-row"><h3>' + esc(t.name) + '</h3><span class="species">' + esc(t.species) + "</span></div>" +
        '<p class="quote">“' + esc(t.quote) + "”</p>" +
        '<p class="maker">🪡 Made by ' + maker.name + " · " + makeHours(t, si) + " hrs</p>" +
        '<div class="sizes">' + SIZES.map(function (s, k) {
          if (t.prices[k] === null) return "";
          return '<button class="sz ' + (si === k ? "on" : "") + '" data-size="' + t.id + '" data-k="' + k + '" title="' + s.cm + '">' + s.label + "</button>";
        }).join("") + "</div>" +
        '<div class="card-foot"><b class="price">' + inr(t.prices[si]) + '</b><button class="btn btn-black btn-sm" data-view="' + t.id + '">Adopt →</button></div>' +
      "</div>" +
    "</article>";
  }

  function renderGrid() {
    var list = TOYS.filter(function (t) { return filter === "all" || t.col === filter; });
    $("#grid").innerHTML = list.map(card).join("");
  }

  function renderMakers() {
    $("#makerList").innerHTML = MAKERS.map(function (mk) {
      var toys = TOYS.filter(function (t) { return t.maker === mk.key; });
      return '<article class="maker-card c-' + mk.colour + '">' +
        '<div class="avatar">' + mk.name.charAt(0) + "</div>" +
        "<h3>" + mk.name + "</h3><p>" + mk.city + "</p>" +
        '<div class="maker-stats"><span><b>' + mk.made + "</b> toys made</span><span><b>" + (new Date().getFullYear() - mk.since) + "</b> yrs with us</span></div>" +
        '<div class="maker-toys">' + toys.map(function (t) { return '<button data-view="' + t.id + '" title="' + esc(t.name) + '">' + photo(t) + "</button>"; }).join("") + "</div>" +
      "</article>";
    }).join("");
    $("#customSize").innerHTML = SIZES.map(function (s) { return "<option>" + sizeName(SIZES.indexOf(s)) + "</option>"; }).join("");
  }

  /* ---------- Adopt modal ---------- */
  var m = null; // { id, si, eyes }

  function openModal(id) {
    var t = byId(id);
    m = { id: id, si: chosen[id] !== undefined ? chosen[id] : firstSize(t), eyes: 0 };
    $("#mImg").src = t.img;
    $("#mImg").alt = t.name + ", crochet " + t.species.toLowerCase();
    $("#mSpecies").textContent = t.species;
    $("#mName").textContent = t.name;
    $("#mQuote").textContent = "“" + t.quote + "”";
    $("#mAdopter").value = "";
    $("#mRibbon").checked = false;
    $("#mRibbonPrice").textContent = "+" + inr(CONFIG.ribbon);
    $("#cToy").textContent = t.name;
    $("#cDate").textContent = "Adopted on " + today();
    renderModal();
    $("#modal").hidden = false;
    $("#scrim").classList.add("show");
    document.body.classList.add("locked");
    setTimeout(function () { $("#modal .x").focus(); }, 30);
  }

  function modalPrice() { return byId(m.id).prices[m.si] + ($("#mRibbon").checked ? CONFIG.ribbon : 0); }

  function renderModal() {
    var t = byId(m.id);
    var maker = findBy(MAKERS, "key", t.maker);
    $("#mMaker").textContent = "🪡 Hand-made by " + maker.name + " in " + maker.city + " · about " + makeHours(t, m.si) + " hours";
    $("#mSizes").innerHTML = SIZES.map(function (s, k) {
      if (t.prices[k] === null) return "";
      return '<button class="opt ' + (m.si === k ? "on" : "") + '" data-msize="' + k + '"><b>' + s.label + "</b><small>" + s.cm + " · " + inr(t.prices[k]) + (s.madeToOrder ? " · made to order" : "") + "</small></button>";
    }).join("");
    $("#mEyes").innerHTML = EYES.map(function (e, k) {
      return '<button class="opt ' + (m.eyes === k ? "on" : "") + '" data-meyes="' + k + '"><b>' + e.label + "</b><small>" + e.note + "</small></button>";
    }).join("");
    var kid = $("#mAdopter").value.trim();
    $("#cKid").textContent = kid || "your little one";
    $("#mCert").classList.toggle("filled", !!kid);
    $("#mRibbon").disabled = !kid;
    if (!kid) $("#mRibbon").checked = false;
    $("#mAdd").textContent = "Adopt " + t.name + " · " + inr(modalPrice());
  }

  /* ---------- Cart ---------- */
  function linePrice(l) { return byId(l.id).prices[l.si] + (l.ribbon ? CONFIG.ribbon : 0); }

  function addToCart(id, si, eyes, adopter, ribbon) {
    var line = null;
    for (var i = 0; i < cart.length; i++) {
      var c = cart[i];
      if (c.id === id && c.si === si && c.eyes === eyes && c.adopter === adopter && c.ribbon === ribbon) line = c;
    }
    if (line) line.qty++;
    else cart.push({ id: id, si: si, eyes: eyes, adopter: adopter, ribbon: ribbon, qty: 1 });
    persist();
    var b = $("#cartBtn");
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
    toast("🧶 " + byId(id).name + " is coming home!");
  }

  function persist() { save("lp-cart", cart); save("lp-gift", gift); renderCart(); }

  function totals() {
    var toys = 0, ribbons = 0, count = 0;
    cart.forEach(function (l) { toys += byId(l.id).prices[l.si] * l.qty; ribbons += (l.ribbon ? CONFIG.ribbon : 0) * l.qty; count += l.qty; });
    var wrap = gift && cart.length ? CONFIG.giftWrap : 0;
    var sub = toys + ribbons;
    var ship = !cart.length || sub >= CONFIG.freeShippingAt ? 0 : CONFIG.shippingFee;
    return { toys: toys, extra: ribbons + wrap, count: count, ship: ship, total: sub + wrap + ship, sub: sub };
  }

  function etaText() {
    var slow = cart.some(function (l) { return SIZES[l.si].madeToOrder; });
    var days = slow ? CONFIG.madeToOrderDays : CONFIG.readyDays;
    var d = new Date(); d.setDate(d.getDate() + days);
    return { slow: slow, text: (slow ? "🪡 Includes a made-to-order toy. " : "📦 Ready to ship. ") + "Leaves our studio by " + d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) + "." };
  }

  function renderCart() {
    var t = totals();
    $("#cartCount").textContent = t.count;
    var left = CONFIG.freeShippingAt - t.sub;
    $("#shipMsg").innerHTML = !cart.length ? "Free shipping over <b>" + inr(CONFIG.freeShippingAt) + "</b>"
      : left > 0 ? "<b>" + inr(left) + "</b> more for free shipping" : "🎉 Free shipping unlocked!";
    $("#shipBar").style.width = Math.min(100, (t.sub / CONFIG.freeShippingAt) * 100) + "%";

    var empty = !cart.length;
    $("#cartFoot").hidden = empty;
    $("#giftRow").hidden = empty;
    $("#eta").hidden = empty;
    if (empty) {
      $("#cartItems").innerHTML = '<div class="empty"><span>🧸</span><p>No one\'s coming home yet.</p><a href="#shop" class="btn btn-black" data-close>Meet the friends</a></div>';
      return;
    }
    $("#cartItems").innerHTML = cart.map(function (l, i) {
      var toy = byId(l.id);
      var notes = [sizeName(l.si), EYES[l.eyes].label];
      return '<div class="item c-' + toy.colour + '">' +
        '<div class="thumb">' + photo(toy) + "</div>" +
        "<div><b>" + esc(toy.name) + "</b><small>" + notes.join(" · ") + "</small>" +
          (l.adopter ? '<span class="adopter">📜 Adopted by ' + esc(l.adopter) + (l.ribbon ? " + name ribbon" : "") + "</span>" : "") + "</div>" +
        '<div class="item-r"><b>' + inr(linePrice(l) * l.qty) + "</b>" +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div></div>' +
      "</div>";
    }).join("");
    $("#giftWrap").checked = gift;
    $("#giftPrice").textContent = "+" + inr(CONFIG.giftWrap);
    $("#eta").textContent = etaText().text;
    $("#cSub").textContent = inr(t.toys);
    $("#cExtraRow").hidden = !t.extra;
    $("#cExtra").textContent = inr(t.extra);
    $("#cShip").textContent = t.ship ? inr(t.ship) : "FREE";
    $("#cTotal").textContent = inr(t.total);
  }

  function openWhatsApp(msg) {
    var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
    var w = window.open(url, "_blank");
    if (!w) location.href = url; // popup blocked (e.g. in-app browsers)
  }

  function checkout() {
    var t = totals();
    var lines = cart.map(function (l) {
      var toy = byId(l.id);
      return "• " + toy.name + (toy.col === "family" ? "" : " the " + toy.species) + " (" + sizeName(l.si) + ", " + EYES[l.eyes].label.toLowerCase() + ") × " + l.qty + " = " + inr(linePrice(l) * l.qty) +
        (l.adopter ? "\n   Certificate for: " + l.adopter + (l.ribbon ? " (+ embroidered ribbon)" : "") : "");
    });
    var msg = "Hi LOOPSY! 🧶 I'd like to adopt:\n\n" + lines.join("\n") + "\n" +
      (gift ? "\n🎁 Gift wrap with a note: " + inr(CONFIG.giftWrap) : "") +
      "\nShipping: " + (t.ship ? inr(t.ship) : "FREE") +
      "\n*Total: " + inr(t.total) + "*\n\n" + etaText().text + "\n\nMy name and address:";
    openWhatsApp(msg);
  }

  /* ---------- Open / close ---------- */
  function openCart() { $("#cart").classList.add("open"); $("#scrim").classList.add("show"); document.body.classList.add("locked"); }
  function closeAll() {
    $("#cart").classList.remove("open");
    $("#nav").classList.remove("open");
    $("#header").classList.remove("nav-open");
    $("#modal").hidden = true;
    $("#scrim").classList.remove("show");
    document.body.classList.remove("locked");
    m = null;
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-view],[data-col],[data-size],[data-msize],[data-meyes],[data-q],[data-close]");
    if (!el) return;
    var d = el.dataset;
    if (d.view) { e.preventDefault(); openModal(+d.view); return; }
    if (d.col) { filter = d.col; renderFilters(); renderGrid(); return; }
    if (d.size) { chosen[+d.size] = +d.k; renderGrid(); return; }
    if (d.msize) { m.si = +d.msize; chosen[m.id] = m.si; renderModal(); return; }
    if (d.meyes) { m.eyes = +d.meyes; renderModal(); return; }
    if (d.q) {
      var l = cart[+d.q];
      l.qty += +d.d;
      if (l.qty < 1) cart.splice(+d.q, 1);
      persist();
      return;
    }
    if (el.hasAttribute("data-close")) closeAll();
  });

  $("#mAdopter").addEventListener("input", renderModal);
  $("#mRibbon").addEventListener("change", renderModal);
  $("#mAdd").addEventListener("click", function () {
    var name = $("#mAdopter").value.trim();
    addToCart(m.id, m.si, m.eyes, name, !!name && $("#mRibbon").checked);
    closeAll();
    renderGrid();
  });

  $("#giftWrap").addEventListener("change", function (e) { gift = e.target.checked; persist(); });

  $("#customForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    openWhatsApp("Hi LOOPSY! 🧶 I'd like a custom toy.\n\nWhat: " + f.kind.value + "\nSize: " + f.size.value +
      "\nAbout it: " + f.about.value.trim() + "\nName: " + f.name.value.trim() + "\n\nI'll send a photo here.");
  });

  $("#cartBtn").addEventListener("click", openCart);
  $("#checkout").addEventListener("click", checkout);
  $("#scrim").addEventListener("click", closeAll);
  $("#menuBtn").addEventListener("click", function () {
    // The sticky header is its own stacking layer, so lift it above the scrim while the menu is open
    $("#header").classList.add("nav-open");
    $("#nav").classList.add("open");
    $("#scrim").classList.add("show");
  });
  $$("#nav a").forEach(function (a) { a.addEventListener("click", closeAll); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderFilters();
  renderGrid();
  renderMakers();
  renderCart();
})();
