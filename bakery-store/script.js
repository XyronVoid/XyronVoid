/* ===== Butterbloom — Store logic =====
 * Edit the SETTINGS block (CONFIG, OCCASIONS, PRODUCTS, ADDONS, SLOTS) to make this bakery your own.
 */
(function () {
  "use strict";

  /* ================= SETTINGS — edit these ================= */
  var CONFIG = {
    whatsapp: "919876543210",  // Orders go here: country code + number, no "+" or spaces
    city: "Bengaluru",
    pinPrefixes: ["560"],      // Pincodes starting with these are served
    freeDeliveryAt: 999,
    deliveryFee: 49,
    egglessExtra: 50,          // Added per cake / cupcake box when eggless is chosen
    sameDayCutoff: 16,         // Same-day orders close at this hour (24h clock)
    leadHours: 3               // A same-day slot must start at least this many hours from now
  };

  var OCCASIONS = [
    { key: "birthday",    label: "Birthday",     icon: "🎂", bg: "#ffe1e8" },
    { key: "anniversary", label: "Anniversary",  icon: "💞", bg: "#f6e3f3" },
    { key: "wedding",     label: "Wedding",      icon: "💍", bg: "#f3ead9" },
    { key: "kids",        label: "Kids' party",  icon: "🎈", bg: "#dff0f4" },
    { key: "just",        label: "Just because", icon: "🍪", bg: "#f9ecd2" }
  ];

  var CATEGORIES = [
    { key: "all",    label: "Everything" },
    { key: "cake",   label: "🎂 Cakes" },
    { key: "bites",  label: "🧁 Cupcakes & macarons" },
    { key: "cookie", label: "🍪 Cookies" }
  ];

  // img: photo in the images/ folder (replace with your own).
  // egg: "option" (customer picks egg or eggless), "eggless" (always eggless) or "egg" (contains egg).
  // sizes: [label, price, serves]. lead: days of notice needed (0 = same day possible).
  var PRODUCTS = [
    { id: 1,  cat: "cake",   name: "Chocolate Lovers Cake",  desc: "Dark chocolate sponge, ganache drip and chocolate shards",        img: "images/chocolate-lovers-cake.jpg",    egg: "option",  sizes: [["0.5 kg", 649, "Serves 4–6"], ["1 kg", 1199, "Serves 8–10"], ["2 kg", 2299, "Serves 16–20"]], rating: 4.9, reviews: 3120, occ: ["birthday", "anniversary", "just"], tag: "Bestseller" },
    { id: 2,  cat: "cake",   name: "Caramel Crunch Cake",    desc: "Vanilla sponge, salted caramel and a praline crunch collar",     img: "images/caramel-crunch-cake.jpg",      egg: "option",  sizes: [["0.5 kg", 599, "Serves 4–6"], ["1 kg", 1099, "Serves 8–10"], ["2 kg", 2099, "Serves 16–20"]], rating: 4.8, reviews: 1870, occ: ["birthday", "just"] },
    { id: 3,  cat: "cake",   name: "Cotton Candy Cake",      desc: "Strawberry and vanilla layers with pastel buttercream swirls",  img: "images/cotton-candy-cake.jpg",        egg: "option",  sizes: [["0.5 kg", 699, "Serves 4–6"], ["1 kg", 1299, "Serves 8–10"], ["2 kg", 2499, "Serves 16–20"]], rating: 4.9, reviews: 1460, occ: ["kids", "birthday"], tag: "Kids' favourite" },
    { id: 4,  cat: "cake",   name: "Lemon Raspberry Cake",   desc: "Zesty lemon sponge, raspberry jam and pink buttercream petals", img: "images/lemon-raspberry-cake.jpg",     egg: "option",  sizes: [["0.5 kg", 649, "Serves 4–6"], ["1 kg", 1199, "Serves 8–10"], ["2 kg", 2299, "Serves 16–20"]], rating: 4.8, reviews: 980,  occ: ["anniversary", "birthday", "just"] },
    { id: 5,  cat: "cake",   name: "Macaron Crown Cake",     desc: "Vanilla bean sponge crowned with hand-made macarons",            img: "images/macaron-crown-cake.jpg",       egg: "option",  sizes: [["0.5 kg", 799, "Serves 4–6"], ["1 kg", 1499, "Serves 8–10"], ["2 kg", 2899, "Serves 16–20"]], rating: 4.9, reviews: 640,  occ: ["birthday", "anniversary", "kids"], tag: "New" },
    { id: 6,  cat: "cake",   name: "Floral Wedding Cake",    desc: "Three tiers of vanilla and red velvet with hand-made sugar flowers", img: "images/wedding-cake.jpg",          egg: "option",  sizes: [["3 kg · 3 tiers", 5499, "Serves 30–35"], ["5 kg · 3 tiers", 8999, "Serves 50–60"]], rating: 5.0, reviews: 210, occ: ["wedding", "anniversary"], tag: "3 days' notice", lead: 3 },
    { id: 7,  cat: "bites",  name: "Pastel Cupcakes",        desc: "Vanilla cupcakes with whipped buttercream, packed in a gift box", img: "images/cupcakes.jpg",              egg: "option",  sizes: [["Box of 6", 549], ["Box of 12", 999]], rating: 4.8, reviews: 1230, occ: ["kids", "birthday", "just"] },
    { id: 8,  cat: "bites",  name: "French Macarons",        desc: "Almond shells in rose, pistachio, salted caramel and berry",     img: "images/macarons.jpg",                 egg: "egg",     sizes: [["Box of 6", 449], ["Box of 12", 849]], rating: 4.7, reviews: 870, occ: ["anniversary", "just"] },
    { id: 9,  cat: "cookie", name: "Classic Choco Chip",     desc: "Brown butter dough loaded with dark chocolate chips",            img: "images/choco-chip-cookies.jpg",       egg: "eggless", sizes: [["Box of 6", 299], ["Box of 12", 549]], rating: 4.9, reviews: 2650, occ: ["just", "birthday"], tag: "Bestseller" },
    { id: 10, cat: "cookie", name: "White Choc Macadamia",   desc: "Chewy cookies with white chocolate and roasted macadamia",       img: "images/white-choc-cookies.jpg",       egg: "eggless", sizes: [["Box of 6", 349], ["Box of 12", 649]], rating: 4.8, reviews: 1120, occ: ["just"] },
    { id: 11, cat: "cookie", name: "Cranberry Orange",       desc: "Soft butter cookies with dried cranberries and orange zest",     img: "images/cranberry-orange-cookies.jpg", egg: "eggless", sizes: [["Box of 6", 329], ["Box of 12", 599]], rating: 4.7, reviews: 540, occ: ["just"], tag: "Seasonal" },
    { id: 12, cat: "cookie", name: "Cookie Gift Box",        desc: "4 giant cookies: double choc, choco chip, red velvet and sugar", img: "images/cookie-gift-box.jpg",          egg: "eggless", sizes: [["Box of 4", 499], ["Box of 8", 899]], rating: 4.9, reviews: 760, occ: ["anniversary", "birthday", "just"] }
  ];

  var ADDONS = [
    { key: "candles", label: "🕯️ Candles (10)",      price: 49 },
    { key: "topper",  label: "🎉 Happy Birthday topper", price: 99 },
    { key: "card",    label: "💌 Greeting card",     price: 79 },
    { key: "knife",   label: "🔪 Cake knife",        price: 29 }
  ];

  // [label, start hour, extra fee]
  var SLOTS = [
    ["10 AM – 1 PM", 10, 0],
    ["1 PM – 4 PM", 13, 0],
    ["4 PM – 7 PM", 16, 0],
    ["7 PM – 10 PM", 19, 0],
    ["🌙 Midnight, 11:30 PM – 12 AM", 23.5, 199]
  ];
  /* ========================================================== */

  /* ---------- Helpers ---------- */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function findBy(list, key, val) { for (var i = 0; i < list.length; i++) if (list[i][key] === val) return list[i]; return null; }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  // Local yyyy-mm-dd (toISOString would shift the day in Indian time)
  function isoDay(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return isoDay(d); }
  function prettyDay(iso) {
    var p = iso.split("-");
    return new Date(+p[0], p[1] - 1, +p[2]).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  // Photo with a soft placeholder behind it, in case the image can't load
  function photo(p) { return '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()" />'; }
  function vegMark(p) { return '<span class="' + (p.egg === "egg" ? "nonveg" : "veg") + '" title="' + (p.egg === "egg" ? "Contains egg" : "Eggless available") + '"></span>'; }
  function needsModal(p) { return p.cat === "cake" || p.egg === "option"; }

  /* ---------- State ---------- */
  var box = load("bb-box", []);
  var addons = load("bb-addons", []);
  var delivery = load("bb-delivery", { pin: "", date: "", slot: -1 });
  var filter = { cat: "all", occ: null, eggless: false };
  var chosenSize = {};

  // Drop any saved items that no longer exist (e.g. after editing PRODUCTS)
  box = box.filter(function (l) { var p = byId(l.id); return p && p.sizes[l.si]; });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  /* ---------- Same-day countdown ---------- */
  function tick() {
    var now = new Date();
    var cut = new Date(); cut.setHours(CONFIG.sameDayCutoff, 0, 0, 0);
    var el = $("#cutoff");
    if (now < cut) {
      var s = Math.floor((cut - now) / 1000);
      el.innerHTML = "⏰ Order in <b>" + pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + "</b> for same-day delivery";
    } else {
      el.innerHTML = "🌙 Same-day orders are closed. Order now for <b>tomorrow</b> or a midnight surprise";
    }
  }

  /* ---------- Occasions & menu ---------- */
  function renderOccasions() {
    $("#occasionList").innerHTML = OCCASIONS.map(function (o) {
      var n = PRODUCTS.filter(function (p) { return p.occ.indexOf(o.key) > -1; }).length;
      return '<button class="occasion ' + (filter.occ === o.key ? "on" : "") + '" data-occ="' + o.key + '" style="--bg:' + o.bg + '">' +
        '<span class="o-icon">' + o.icon + "</span><b>" + o.label + "</b><small>" + n + (n === 1 ? " treat" : " treats") + "</small></button>";
    }).join("");
    $("#customOccasion").innerHTML = OCCASIONS.map(function (o) { return "<option>" + o.label + "</option>"; }).join("");
  }

  function renderTabs() {
    $("#tabs").innerHTML = CATEGORIES.map(function (c) {
      return '<button class="tab ' + (filter.cat === c.key ? "on" : "") + '" data-cat="' + c.key + '">' + c.label + "</button>";
    }).join("");
  }

  function card(p) {
    var si = chosenSize[p.id] || 0;
    var s = p.sizes[si];
    var sizeCtl = p.sizes.length > 1
      ? '<select class="size" data-size="' + p.id + '" aria-label="Size">' + p.sizes.map(function (z, i) { return '<option value="' + i + '"' + (i === si ? " selected" : "") + ">" + z[0] + "</option>"; }).join("") + "</select>"
      : '<span class="size">' + s[0] + "</span>";
    return '<article class="card">' +
      '<div class="media" data-open="' + p.id + '">' +
        (p.tag ? '<span class="tag ' + (p.tag === "Bestseller" ? "hot" : "") + '">' + esc(p.tag) + "</span>" : "") +
        photo(p) +
      "</div>" +
      '<div class="card-body">' +
        '<div class="title-row">' + vegMark(p) + "<h3>" + esc(p.name) + "</h3></div>" +
        '<p class="desc">' + esc(p.desc) + "</p>" +
        '<div class="rating">★ ' + p.rating + " <span>(" + p.reviews.toLocaleString("en-IN") + ")</span>" + (s[2] ? '<span class="serves">· ' + s[2] + "</span>" : "") + "</div>" +
        '<div class="card-foot">' + sizeCtl +
          '<button class="add" data-add="' + p.id + '">' + (needsModal(p) ? "Customise · " : "Add · ") + inr(s[1]) + "</button>" +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) {
      return (filter.cat === "all" || p.cat === filter.cat) &&
        (!filter.occ || p.occ.indexOf(filter.occ) > -1) &&
        (!filter.eggless || p.egg !== "egg");
    });
    var occ = filter.occ ? findBy(OCCASIONS, "key", filter.occ) : null;
    var af = $("#activeFilter");
    af.hidden = !occ;
    if (occ) af.innerHTML = "Showing treats for <b>" + occ.icon + " " + occ.label + "</b> <button data-clear-occ>Show all</button>";
    $("#grid").innerHTML = list.length ? list.map(card).join("") : '<p class="empty">Nothing here yet. Try another category?</p>';
  }

  /* ---------- Customiser modal ---------- */
  var m = null; // { id, si, eggless, msg }

  function openModal(id) {
    var p = byId(id);
    m = { id: id, si: chosenSize[id] || 0, eggless: p.egg !== "egg", msg: "" };
    $("#mImg").src = p.img;
    $("#mImg").alt = p.name;
    $("#mTitle").innerHTML = vegMark(p) + esc(p.name);
    $("#mDesc").textContent = p.desc;
    $("#mMsg").value = "";
    $("#mEggWrap").hidden = p.egg !== "option";
    $("#mMsgWrap").hidden = p.cat !== "cake";
    $("#mLead").hidden = !p.lead;
    if (p.lead) $("#mLead").textContent = "📅 This cake needs " + p.lead + " days' notice. The earliest delivery is " + prettyDay(addDays(p.lead)) + ".";
    renderModal();
    $("#modal").hidden = false;
    $("#scrim").classList.add("show");
    document.body.classList.add("locked");
    setTimeout(function () { $("#modal .x").focus(); }, 30);
  }

  function modalPrice() {
    var p = byId(m.id);
    return p.sizes[m.si][1] + (p.egg === "option" && m.eggless ? CONFIG.egglessExtra : 0);
  }

  function renderModal() {
    var p = byId(m.id);
    $("#mSizes").innerHTML = p.sizes.map(function (s, i) {
      return '<button class="opt ' + (m.si === i ? "on" : "") + '" data-msize="' + i + '"><b>' + s[0] + "</b><small>" + (s[2] ? s[2] + " · " : "") + inr(s[1]) + "</small></button>";
    }).join("");
    $("#mEgg").innerHTML =
      '<button class="opt ' + (m.eggless ? "on" : "") + '" data-megg="1"><b><span class="veg"></span> Eggless</b><small>+' + inr(CONFIG.egglessExtra) + "</small></button>" +
      '<button class="opt ' + (!m.eggless ? "on" : "") + '" data-megg="0"><b><span class="nonveg"></span> With egg</b><small>Classic recipe</small></button>';
    var msg = $("#mMsg").value.trim();
    $("#mMsgCount").textContent = $("#mMsg").value.length + "/30";
    $("#mPlaque").hidden = !msg || p.cat !== "cake";
    $("#mPlaque").textContent = msg;
    $("#mAdd").textContent = "Add to box · " + inr(modalPrice());
  }

  /* ---------- Box ---------- */
  function unitPrice(l) {
    var p = byId(l.id);
    return p.sizes[l.si][1] + (p.egg === "option" && l.eggless ? CONFIG.egglessExtra : 0);
  }

  function addToBox(id, si, eggless, msg) {
    var line = null;
    for (var i = 0; i < box.length; i++) {
      var b = box[i];
      if (b.id === id && b.si === si && b.eggless === eggless && b.msg === msg) line = b;
    }
    if (line) line.qty++;
    else box.push({ id: id, si: si, eggless: eggless, msg: msg, qty: 1 });
    persist();
    var btn = $("#boxBtn");
    btn.classList.remove("bump");
    void btn.offsetWidth;
    btn.classList.add("bump");
    toast("🧁 " + byId(id).name + " added to your box");
  }

  function persist() { save("bb-box", box); save("bb-addons", addons); renderBox(); }
  function saveDelivery() { save("bb-delivery", delivery); }

  function hasCake() { return box.some(function (l) { return byId(l.id).cat === "cake"; }); }
  function pinOk(pin) {
    return /^\d{6}$/.test(pin) && CONFIG.pinPrefixes.some(function (pre) { return pin.indexOf(pre) === 0; });
  }

  // Earliest date: today before the cutoff, otherwise tomorrow, pushed out by any item's notice period
  function minDate() {
    var lead = 0;
    box.forEach(function (l) { lead = Math.max(lead, byId(l.id).lead || 0); });
    var sameDayOpen = new Date().getHours() < CONFIG.sameDayCutoff;
    return addDays(Math.max(lead, sameDayOpen ? 0 : 1));
  }

  function slotOpen(i) {
    if (delivery.date !== isoDay(new Date())) return true;
    var now = new Date();
    return SLOTS[i][1] >= now.getHours() + now.getMinutes() / 60 + CONFIG.leadHours;
  }

  function totals() {
    var sub = 0, count = 0;
    box.forEach(function (l) { sub += unitPrice(l) * l.qty; count += l.qty; });
    var add = 0;
    addons.forEach(function (k) { var a = findBy(ADDONS, "key", k); if (a) add += a.price; });
    var ship = !box.length || sub >= CONFIG.freeDeliveryAt ? 0 : CONFIG.deliveryFee;
    var mid = delivery.slot > -1 && SLOTS[delivery.slot] ? SLOTS[delivery.slot][2] : 0;
    return { sub: sub, count: count, add: add, ship: ship, mid: mid, total: sub + add + ship + mid };
  }

  function renderDelivery() {
    var min = minDate();
    var d = $("#dDate");
    d.min = min;
    d.max = addDays(60);
    if (delivery.date && delivery.date < min) { delivery.date = ""; delivery.slot = -1; }
    d.value = delivery.date;
    if (delivery.slot > -1 && !slotOpen(delivery.slot)) delivery.slot = -1;
    $("#dSlot").innerHTML = '<option value="-1">Choose a slot</option>' + SLOTS.map(function (s, i) {
      var open = slotOpen(i);
      return '<option value="' + i + '"' + (delivery.slot === i ? " selected" : "") + (open ? "" : " disabled") + ">" + s[0] + (s[2] ? " (+" + inr(s[2]) + ")" : "") + (open ? "" : " · closed") + "</option>";
    }).join("");
    $("#dSlot").disabled = !delivery.date;
    $("#dateNote").textContent = "Earliest delivery: " + prettyDay(min) + (min === isoDay(new Date()) ? " (today)" : "") + ".";
    $("#pin").value = delivery.pin;
    renderPin();
    saveDelivery();
  }

  function renderPin() {
    var msg = $("#pinMsg");
    var label = $("#pinLabel");
    if (!delivery.pin) { msg.textContent = ""; msg.className = "pin-msg"; label.textContent = "Check delivery"; return; }
    if (pinOk(delivery.pin)) {
      msg.textContent = "✓ We deliver to " + delivery.pin + ". Yay!";
      msg.className = "pin-msg ok";
      label.textContent = "Delivering to " + delivery.pin;
    } else {
      msg.textContent = "Sorry, we don't deliver to " + delivery.pin + " yet. We only bake for " + CONFIG.city + " for now.";
      msg.className = "pin-msg bad";
      label.textContent = "Check delivery";
    }
  }

  function renderBox() {
    var t = totals();
    $("#boxCount").textContent = t.count;

    var left = CONFIG.freeDeliveryAt - t.sub;
    $("#shipMsg").innerHTML = !box.length ? "Free delivery on orders over <b>" + inr(CONFIG.freeDeliveryAt) + "</b>"
      : left > 0 ? "Add <b>" + inr(left) + "</b> more for free delivery" : "🎉 You've unlocked <b>free delivery!</b>";
    $("#shipBar").style.width = Math.min(100, (t.sub / CONFIG.freeDeliveryAt) * 100) + "%";

    var empty = !box.length;
    $("#boxExtras").hidden = empty;
    $("#boxFoot").hidden = empty;
    if (empty) {
      $("#boxItems").innerHTML = '<div class="box-empty"><span>🧁</span><p>Your box is empty. Let\'s fix that.</p><a href="#menu" class="btn btn-berry" data-close>See today\'s menu</a></div>';
      return;
    }

    $("#boxItems").innerHTML = box.map(function (l, i) {
      var p = byId(l.id);
      var notes = [p.sizes[l.si][0]];
      if (p.egg === "option") notes.push(l.eggless ? "Eggless" : "With egg");
      return '<div class="item">' +
        '<div class="thumb">' + photo(p) + "</div>" +
        "<div><b>" + esc(p.name) + "</b><small>" + notes.join(" · ") + "</small>" +
          (l.msg ? '<span class="msg">✍️ “' + esc(l.msg) + "”</span>" : "") + "</div>" +
        '<div class="item-r"><span class="p">' + inr(unitPrice(l) * l.qty) + "</span>" +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div></div>' +
      "</div>";
    }).join("");

    var cake = hasCake();
    $("#addonList").innerHTML = ADDONS.filter(function (a) { return cake || (a.key !== "knife" && a.key !== "topper"); }).map(function (a) {
      var on = addons.indexOf(a.key) > -1;
      return '<button class="addon ' + (on ? "on" : "") + '" data-addon="' + a.key + '" aria-pressed="' + on + '">' + a.label + " <b>+" + inr(a.price) + "</b></button>";
    }).join("");
    // Cake-only add-ons are dropped when no cake is left in the box
    if (!cake && addons.some(function (k) { return k === "knife" || k === "topper"; })) {
      addons = addons.filter(function (k) { return k !== "knife" && k !== "topper"; });
      save("bb-addons", addons);
    }

    renderDelivery();
    t = totals();
    $("#bSub").textContent = inr(t.sub);
    $("#bAddonRow").hidden = !t.add;
    $("#bAddons").textContent = inr(t.add);
    $("#bShip").textContent = t.ship ? inr(t.ship) : "FREE";
    $("#bMidRow").hidden = !t.mid;
    $("#bMid").textContent = inr(t.mid);
    $("#bTotal").textContent = inr(t.total);
  }

  function checkout() {
    if (!pinOk(delivery.pin)) { toast("📍 Please enter a pincode we deliver to"); $("#pin").focus(); return; }
    if (!delivery.date) { toast("📅 Please choose a delivery date"); $("#dDate").focus(); return; }
    if (delivery.slot < 0) { toast("⏰ Please choose a time slot"); $("#dSlot").focus(); return; }
    var t = totals();
    var lines = box.map(function (l) {
      var p = byId(l.id);
      var notes = [p.sizes[l.si][0]];
      if (p.egg === "option") notes.push(l.eggless ? "eggless" : "with egg");
      return "• " + p.name + " (" + notes.join(", ") + ") × " + l.qty + " = " + inr(unitPrice(l) * l.qty) +
        (l.msg ? "\n   Message on cake: \"" + l.msg + "\"" : "");
    });
    var msg = "Hi Butterbloom! 🧁 I'd like to order:\n\n" + lines.join("\n") + "\n";
    if (addons.length) msg += "\nAdd-ons: " + addons.map(function (k) { var a = findBy(ADDONS, "key", k); return a.label.replace(/^\S+\s/, "") + " (" + inr(a.price) + ")"; }).join(", ") + "\n";
    msg += "\n📍 Pincode: " + delivery.pin +
      "\n📅 Delivery: " + prettyDay(delivery.date) + ", " + SLOTS[delivery.slot][0].replace("🌙 ", "") +
      "\n\nBakes: " + inr(t.sub) +
      (t.add ? "\nAdd-ons: " + inr(t.add) : "") +
      "\nDelivery: " + (t.ship ? inr(t.ship) : "FREE") +
      (t.mid ? "\nMidnight delivery: " + inr(t.mid) : "") +
      "\n*Total: " + inr(t.total) + "*\n\nMy name and address:";
    openWhatsApp(msg);
  }

  function openWhatsApp(msg) {
    var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
    var w = window.open(url, "_blank");
    if (!w) location.href = url; // popup blocked (e.g. in-app browsers)
  }

  /* ---------- Open / close ---------- */
  function openBox() { $("#box").classList.add("open"); $("#scrim").classList.add("show"); document.body.classList.add("locked"); }
  function closeAll() {
    $("#box").classList.remove("open");
    $("#nav").classList.remove("open");
    $("#header").classList.remove("nav-open");
    $("#modal").hidden = true;
    $("#scrim").classList.remove("show");
    document.body.classList.remove("locked");
    m = null;
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-add],[data-open],[data-occ],[data-cat],[data-clear-occ],[data-msize],[data-megg],[data-q],[data-addon],[data-close]");
    if (!el) return;
    var d = el.dataset;

    if (d.add || d.open) {
      var p = byId(+(d.add || d.open));
      if (needsModal(p) || d.open) openModal(p.id);
      else addToBox(p.id, chosenSize[p.id] || 0, true, "");
      return;
    }
    if (d.occ) {
      filter.occ = filter.occ === d.occ ? null : d.occ;
      renderOccasions(); renderGrid();
      if (filter.occ) $("#menu").scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (d.cat) { filter.cat = d.cat; renderTabs(); renderGrid(); return; }
    if (el.hasAttribute("data-clear-occ")) { filter.occ = null; renderOccasions(); renderGrid(); return; }
    if (d.msize) { m.si = +d.msize; renderModal(); return; }
    if (d.megg) { m.eggless = d.megg === "1"; renderModal(); return; }
    if (d.q) {
      var l = box[+d.q];
      l.qty += +d.d;
      if (l.qty < 1) box.splice(+d.q, 1);
      persist();
      return;
    }
    if (d.addon) {
      addons = addons.indexOf(d.addon) > -1 ? addons.filter(function (k) { return k !== d.addon; }) : addons.concat([d.addon]);
      persist();
      return;
    }
    if (el.hasAttribute("data-close")) closeAll();
  });

  document.addEventListener("change", function (e) {
    if (e.target.dataset.size) {
      chosenSize[+e.target.dataset.size] = +e.target.value;
      renderGrid();
    }
  });

  $("#mMsg").addEventListener("input", renderModal);
  $("#mAdd").addEventListener("click", function () {
    var p = byId(m.id);
    var msg = p.cat === "cake" ? $("#mMsg").value.trim() : "";
    addToBox(m.id, m.si, p.egg === "option" ? m.eggless : p.egg !== "egg", msg);
    closeAll();
  });

  $("#egglessOnly").addEventListener("change", function (e) { filter.eggless = e.target.checked; renderGrid(); });

  function checkPin() {
    delivery.pin = $("#pin").value.replace(/\D/g, "");
    saveDelivery();
    renderPin();
  }
  $("#pinCheck").addEventListener("click", checkPin);
  $("#pin").addEventListener("keydown", function (e) { if (e.key === "Enter") checkPin(); });
  $("#pin").addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/\D/g, "");
    if (e.target.value.length === 6) checkPin();
  });
  $("#pinBtn").addEventListener("click", function () { openBox(); if (box.length) setTimeout(function () { $("#pin").focus(); }, 300); });

  $("#dDate").addEventListener("change", function (e) {
    var v = e.target.value;
    delivery.date = v && v >= minDate() ? v : "";
    if (v && !delivery.date) toast("📅 The earliest date we can deliver is " + prettyDay(minDate()));
    renderBox();
  });
  $("#dSlot").addEventListener("change", function (e) { delivery.slot = +e.target.value; saveDelivery(); renderBox(); });

  $("#customForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var msg = "Hi Butterbloom! 🎂 I'd like a custom cake.\n\n" +
      "Occasion: " + f.occasion.value + "\nWeight: " + f.weight.value + "\nFlavour: " + f.flavour.value +
      "\nDate needed: " + prettyDay(f.date.value) + "\nEggless: " + (f.eggless.checked ? "Yes" : "No") +
      "\n\nMy idea: " + f.idea.value.trim();
    openWhatsApp(msg);
  });
  $("#customDate").min = addDays(2);

  $("#boxBtn").addEventListener("click", openBox);
  $("#checkout").addEventListener("click", checkout);
  $("#scrim").addEventListener("click", closeAll);
  $("#menuBtn").addEventListener("click", function () {
    // The sticky header is its own stacking layer, so lift it above the scrim while the menu is open
    $("#header").classList.add("nav-open");
    $("#nav").classList.add("open");
    $("#scrim").classList.add("show");
  });
  $$("#nav a").forEach(function (a) { a.addEventListener("click", closeAll); });
  $("#newsForm").addEventListener("submit", function (e) { e.preventDefault(); e.target.reset(); toast("💌 You're on the list! ₹100 off is on its way"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  window.addEventListener("scroll", function () { $("#header").classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderOccasions();
  renderTabs();
  renderGrid();
  renderBox();
  tick();
  setInterval(tick, 1000);
})();
