/* ===== KANAK — Store logic =====
 * Edit the SETTINGS block (CONFIG, CATEGORIES, METALS, PRODUCTS, LOOK) to make this store your own.
 */
(function () {
  "use strict";

  /* ================= SETTINGS — edit these ================= */
  var CONFIG = {
    whatsapp: "919876543210",  // Orders go here: country code + number, no "+" or spaces
    giftWrap: 199,
    freeGiftWrapAt: 5000,      // Gift wrap is free above this subtotal
    emiMonths: 3,              // "or 3 × ₹… with no-cost EMI"
    lookOff: 0.10,             // Discount when the full "Shop the look" set is added
    ringSizes: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]  // Indian sizes
  };

  var CATEGORIES = [
    { key: "all",       label: "All" },
    { key: "earrings",  label: "Earrings" },
    { key: "rings",     label: "Rings" },
    { key: "bracelets", label: "Bracelets" },
    { key: "necklaces", label: "Necklaces" },
    { key: "sets",      label: "Gift sets" }
  ];

  var METALS = [
    { key: "vermeil", label: "18k Gold Vermeil", short: "Vermeil" },
    { key: "solid",   label: "Solid 14k Gold",   short: "Solid gold" }
  ];

  // img: photo in the images/ folder (replace with your own).
  // price: [vermeil price, solid gold price]. ring: needs a ring size. engrave: can be engraved.
  var PRODUCTS = [
    { id: 1,  cat: "earrings",  name: "Citrine Drops",       desc: "Faceted citrine teardrops on fine hook wires.",              detail: "Drop 3.2 cm · Weight 2.1 g · Hook closure",        img: "images/citrine-drops.jpg",       price: [2490, 10490], tag: "Bestseller" },
    { id: 2,  cat: "earrings",  name: "Honey Topaz Drops",   desc: "Warm honey topaz set in a slim, polished bezel.",             detail: "Drop 2.8 cm · Weight 1.9 g · Hook closure",        img: "images/honey-topaz-drops.jpg",   price: [2690, 11290] },
    { id: 3,  cat: "earrings",  name: "Sage Amethyst Drops", desc: "Green amethyst teardrops, the colour of new leaves.",         detail: "Drop 3 cm · Weight 2 g · Hook closure",            img: "images/sage-drops.jpg",          price: [2690, 11290], tag: "New" },
    { id: 4,  cat: "earrings",  name: "Moonstone Halo",      desc: "A round moonstone framed by a fine gold halo.",               detail: "Drop 2.5 cm · Weight 1.8 g · Hook closure",        img: "images/moonstone-halo.jpg",      price: [2290, 9490] },
    { id: 5,  cat: "bracelets", name: "Pavé Stacking Bangles", desc: "Five slim bangles, two lined with tiny pavé crystals.",     detail: "Set of 5 · Inner diameter 6.2 cm · 2 mm wide",     img: "images/pave-bangles.jpg",        price: [5990, 24990], engrave: true },
    { id: 6,  cat: "rings",     name: "Twin Line Rings",     desc: "A plain band and a pavé eternity band, made to be worn together.", detail: "Set of 2 · 1.8 mm bands",                   img: "images/twin-line-rings.jpg",     price: [3490, 14490], ring: true },
    { id: 7,  cat: "rings",     name: "Dainty Ring Stack",   desc: "Four fine rings: bead, marquise, plain band and mini signet.", detail: "Set of 4 · Same size for all four",              img: "images/dainty-ring-stack.jpg",   price: [3990, 16490], ring: true, tag: "Bestseller" },
    { id: 8,  cat: "bracelets", name: "Starlit Cuffs",       desc: "Two open cuffs scattered with tiny crystal stars.",           detail: "Pair · Adjustable · 1.5 mm wire",                  img: "images/starlit-cuffs.jpg",       price: [4490, 18990], engrave: true },
    { id: 9,  cat: "necklaces", name: "Coin Layer Necklace", desc: "Two fine chains in one, with a coin you can engrave.",         detail: "Chains 40 cm + 45 cm · Coin 12 mm · Adjustable",   img: "images/coin-layer-necklace.jpg", price: [3290, 13990], engrave: true, tag: "Engravable" },
    { id: 10, cat: "sets",      name: "Sage Gem Trio",       desc: "Teardrop pendant, ring and studs in green amethyst. Arrives gift-boxed.", detail: "Pendant on 45 cm chain · Ring · Studs 5 mm", img: "images/sage-gem-set.jpg", price: [6490, 27490], ring: true, tag: "Gift set" }
  ];

  // Hotspots on the "Shop the look" photo: product id and position in %
  var LOOK = [
    { id: 9, x: 57, y: 42 },
    { id: 8, x: 64, y: 65 },
    { id: 7, x: 17, y: 73 }
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
  function photo(p) { return '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()" />'; }
  function catLabel(p) { return findBy(CATEGORIES, "key", p.cat).label; }
  // Ring size helpers: Indian size ≈ circumference − 40 mm; US size from circumference
  function indianSize(mm) { return Math.round(mm - 40); }
  function usSize(mm) { return Math.max(3, Math.round(((mm - 36.5) / 2.55) * 2) / 2); }

  /* ---------- State ---------- */
  var bag = load("kn-bag", []);
  var wish = load("kn-wish", []);
  var gift = load("kn-gift", { wrap: false, note: "" });
  var mySize = load("kn-size", null);
  var filter = { cat: "all", sort: "featured" };
  var cardMetal = {};
  var tab = "bag";

  bag = bag.filter(function (l) { return byId(l.id) && METALS[l.metal]; });
  wish = wish.filter(function (id) { return byId(id); });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  /* ---------- Shop ---------- */
  function renderCats() {
    $("#cats").innerHTML = CATEGORIES.map(function (c) {
      return '<button class="cat ' + (filter.cat === c.key ? "on" : "") + '" data-cat="' + c.key + '">' + c.label + "</button>";
    }).join("");
  }

  function heart(id) {
    var on = wish.indexOf(id) > -1;
    return '<button class="heart-btn ' + (on ? "on" : "") + '" data-wish="' + id + '" aria-pressed="' + on + '" aria-label="' + (on ? "Remove from" : "Save to") + ' wishlist">' +
      '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></button>';
  }

  function card(p, i) {
    var mi = cardMetal[p.id] || 0;
    var quick = !p.ring;
    return '<article class="card" style="--d:' + (i * 60) + 'ms">' +
      '<div class="media">' +
        (p.tag ? '<span class="tag">' + esc(p.tag) + "</span>" : "") +
        heart(p.id) +
        '<button class="media-btn" data-view="' + p.id + '" aria-label="View ' + esc(p.name) + '">' + photo(p) + "<span>Quick view</span></button>" +
      "</div>" +
      '<div class="card-info">' +
        "<div><h3>" + esc(p.name) + '</h3><p class="cat-name">' + catLabel(p) + "</p></div>" +
        '<p class="price">' + inr(p.price[mi]) + "</p>" +
      "</div>" +
      '<div class="card-row">' +
        '<div class="swatches" role="group" aria-label="Metal">' + METALS.map(function (m, k) {
          return '<button class="sw ' + m.key + (mi === k ? " on" : "") + '" data-metal="' + p.id + '" data-k="' + k + '" title="' + m.label + '" aria-label="' + m.label + '"></button>';
        }).join("") + '<small>' + METALS[mi].short + "</small></div>" +
        '<button class="quick" data-' + (quick ? "quick" : "view") + '="' + p.id + '">' + (quick ? "+ Add" : "Choose size") + "</button>" +
      "</div>" +
    "</article>";
  }

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) { return filter.cat === "all" || p.cat === filter.cat; });
    if (filter.sort !== "featured") {
      list = list.slice().sort(function (a, b) { return filter.sort === "low" ? a.price[0] - b.price[0] : b.price[0] - a.price[0]; });
    }
    $("#grid").innerHTML = list.map(card).join("");
  }

  /* ---------- Shop the look ---------- */
  function lookTotal() {
    var full = 0;
    LOOK.forEach(function (h) { full += byId(h.id).price[0]; });
    return { full: full, now: full * (1 - CONFIG.lookOff) };
  }

  function renderLook() {
    $("#lookPhoto").insertAdjacentHTML("beforeend", LOOK.map(function (h, i) {
      var p = byId(h.id);
      return '<button class="spot" style="left:' + h.x + "%;top:" + h.y + '%" data-spot="' + i + '" aria-label="' + esc(p.name) + '"><span></span></button>' +
        '<div class="spot-card' + (h.x > 60 ? " r" : h.x < 40 ? " l" : "") + '" id="spot' + i + '" style="left:' + h.x + "%;top:" + h.y + '%" hidden>' +
          '<div class="spot-thumb">' + photo(p) + "</div><div><b>" + esc(p.name) + "</b><small>" + inr(p.price[0]) + '</small><button data-view="' + p.id + '">View piece →</button></div></div>';
    }).join(""));
    $("#lookList").innerHTML = LOOK.map(function (h, i) {
      var p = byId(h.id);
      return '<button class="look-item" data-spot="' + i + '"><span class="n">' + (i + 1) + "</span>" + esc(p.name) + "<em>" + inr(p.price[0]) + "</em></button>";
    }).join("");
    var t = lookTotal();
    $("#addLook").innerHTML = "Add the full look · <s>" + inr(t.full) + "</s> " + inr(t.now);
    $("#lookNote").textContent = "Save " + Math.round(CONFIG.lookOff * 100) + "% when you buy all " + LOOK.length + " pieces in vermeil." +
      (LOOK.some(function (h) { return byId(h.id).ring; }) ? " Rings use your saved size, or we'll ask on WhatsApp." : "");
  }

  function showSpot(i) {
    var open = !$("#spot" + i).hidden;
    $$(".spot-card").forEach(function (c) { c.hidden = true; });
    $$(".spot").forEach(function (s) { s.classList.remove("on"); });
    if (!open) {
      $("#spot" + i).hidden = false;
      $$('.spot[data-spot="' + i + '"]')[0].classList.add("on");
    }
  }

  /* ---------- Product view ---------- */
  var m = null; // { id, metal, size, engrave }

  function openModal(id) {
    var p = byId(id);
    m = { id: id, metal: cardMetal[id] || 0, size: p.ring ? mySize : null };
    $("#mImg").src = p.img;
    $("#mImg").alt = p.name;
    $("#mCat").textContent = catLabel(p);
    $("#mTitle").textContent = p.name;
    $("#mDesc").textContent = p.desc;
    $("#mDetail").textContent = p.detail;
    $("#mEngrave").value = "";
    $("#mSizeWrap").hidden = !p.ring;
    $("#mEngraveWrap").hidden = !p.engrave;
    renderModal();
    $("#modal").hidden = false;
    $("#scrim").classList.add("show");
    document.body.classList.add("locked");
    setTimeout(function () { $("#modal .x").focus(); }, 30);
  }

  function renderModal() {
    var p = byId(m.id);
    $("#mPrice").textContent = inr(p.price[m.metal]);
    $("#mMetal").innerHTML = METALS.map(function (x, k) {
      return '<button class="opt ' + (m.metal === k ? "on" : "") + '" data-mmetal="' + k + '"><span class="sw ' + x.key + '"></span><span><b>' + x.label + "</b><small>" + inr(p.price[k]) + "</small></span></button>";
    }).join("");
    $("#mSizes").innerHTML = CONFIG.ringSizes.map(function (s) {
      return '<button class="rs ' + (m.size === s ? "on" : "") + '" data-rsize="' + s + '">' + s + "</button>";
    }).join("");
    var w = wish.indexOf(m.id) > -1;
    $("#mWish").classList.toggle("on", w);
    $("#mWish").setAttribute("aria-pressed", w);
    $("#mAdd").textContent = p.ring && !m.size ? "Choose a ring size" : "Add to bag · " + inr(p.price[m.metal]);
  }

  /* ---------- Bag & wishlist ---------- */
  function unitPrice(l) { return byId(l.id).price[l.metal] * (1 - (l.deal || 0)); }

  function addToBag(id, metal, size, engrave, deal, quiet) {
    deal = deal || 0;
    var line = null;
    for (var i = 0; i < bag.length; i++) {
      var b = bag[i];
      if (b.id === id && b.metal === metal && b.size === size && b.engrave === engrave && (b.deal || 0) === deal) line = b;
    }
    if (line) line.qty++;
    else bag.push({ id: id, metal: metal, size: size, engrave: engrave, deal: deal, qty: 1 });
    persist();
    var btn = $("#bagBtn");
    btn.classList.remove("bump");
    void btn.offsetWidth;
    btn.classList.add("bump");
    if (!quiet) toast(byId(id).name + " added to your bag");
  }

  function toggleWish(id) {
    var on = wish.indexOf(id) > -1;
    wish = on ? wish.filter(function (x) { return x !== id; }) : wish.concat([id]);
    save("kn-wish", wish);
    toast(on ? "Removed from your wishlist" : "♡ Saved to your wishlist");
    renderGrid();
    renderDrawer();
    if (m) renderModal();
  }

  function persist() { save("kn-bag", bag); save("kn-gift", gift); renderDrawer(); }

  function totals() {
    var sub = 0, count = 0;
    bag.forEach(function (l) { sub += unitPrice(l) * l.qty; count += l.qty; });
    var wrap = gift.wrap && bag.length ? (sub >= CONFIG.freeGiftWrapAt ? 0 : CONFIG.giftWrap) : 0;
    return { sub: sub, count: count, wrap: wrap, total: sub + wrap };
  }

  function lineNotes(l) {
    var p = byId(l.id);
    var n = [METALS[l.metal].label];
    if (p.ring) n.push(l.size ? "Size " + l.size : "Size to confirm");
    return n;
  }

  function renderDrawer() {
    var t = totals();
    $("#bagCount").textContent = t.count;
    $("#wishCount").textContent = wish.length;
    $("#tabBag").textContent = t.count;
    $("#tabWish").textContent = wish.length;
    $$(".dtab").forEach(function (b) { b.classList.toggle("on", b.dataset.tab === tab); });
    $("#bagPane").hidden = tab !== "bag";
    $("#wishPane").hidden = tab !== "wish";
    $("#bagFoot").hidden = tab !== "bag" || !bag.length;

    // Wishlist
    $("#wishPane").innerHTML = wish.length ? wish.map(function (id) {
      var p = byId(id);
      return '<div class="item"><div class="thumb">' + photo(p) + "</div>" +
        "<div><b>" + esc(p.name) + "</b><small>" + catLabel(p) + " · from " + inr(p.price[0]) + "</small></div>" +
        '<div class="item-r"><button class="mini" data-view="' + id + '">View</button><button class="link" data-wish="' + id + '">Remove</button></div></div>';
    }).join("") : '<div class="empty"><p>Nothing saved yet.</p><small>Tap the ♡ on any piece to keep it here.</small></div>';

    // Bag
    $("#giftBox").hidden = !bag.length;
    if (!bag.length) {
      $("#bagItems").innerHTML = '<div class="empty"><p>Your bag is empty.</p><a href="#shop" class="btn btn-dark" data-close>Shop the edit</a></div>';
      return;
    }
    $("#bagItems").innerHTML = bag.map(function (l, i) {
      var p = byId(l.id);
      return '<div class="item">' +
        '<div class="thumb">' + photo(p) + "</div>" +
        "<div><b>" + esc(p.name) + "</b><small>" + lineNotes(l).join(" · ") + "</small>" +
          (l.engrave ? '<span class="engrave">Engraved: “' + esc(l.engrave) + "”</span>" : "") +
          (l.deal ? '<span class="deal">Shop the look −' + Math.round(l.deal * 100) + "%</span>" : "") + "</div>" +
        '<div class="item-r"><span class="p">' + inr(unitPrice(l) * l.qty) + "</span>" +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div></div>' +
      "</div>";
    }).join("");

    $("#giftWrap").checked = gift.wrap;
    $("#giftNote").hidden = !gift.wrap;
    $("#giftNote").value = gift.note;
    $("#giftPrice").textContent = t.sub >= CONFIG.freeGiftWrapAt ? "· Free" : "· " + inr(CONFIG.giftWrap) + " (free over " + inr(CONFIG.freeGiftWrapAt) + ")";
    $("#bSub").textContent = inr(t.sub);
    $("#bGiftRow").hidden = !gift.wrap;
    $("#bGift").textContent = t.wrap ? inr(t.wrap) : "Free";
    $("#bTotal").textContent = inr(t.total);
    $("#emi").textContent = "or " + CONFIG.emiMonths + " × " + inr(t.total / CONFIG.emiMonths) + " with no-cost EMI";
  }

  function checkout() {
    var t = totals();
    var lines = bag.map(function (l) {
      var p = byId(l.id);
      var extra = [];
      if (l.engrave) extra.push('engraved "' + l.engrave + '"');
      if (l.deal) extra.push("shop the look −" + Math.round(l.deal * 100) + "%");
      return "• " + p.name + " (" + lineNotes(l).join(", ") + ") × " + l.qty + " = " + inr(unitPrice(l) * l.qty) + (extra.length ? " [" + extra.join(", ") + "]" : "");
    });
    var msg = "Hi KANAK! ✨ I'd like to order:\n\n" + lines.join("\n") + "\n";
    if (gift.wrap) msg += "\n🎁 Gift wrap: " + (t.wrap ? inr(t.wrap) : "Free") + (gift.note.trim() ? "\nGift note: \"" + gift.note.trim() + "\"" : "") + "\n";
    msg += "\nShipping: Free (insured)\n*Total: " + inr(t.total) + "*\n\nMy name and address:";
    var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
    var w = window.open(url, "_blank");
    if (!w) location.href = url; // popup blocked (e.g. in-app browsers)
  }

  /* ---------- Ring sizer ---------- */
  function renderSizer() {
    var mm = +$("#circ").value;
    $("#circOut").textContent = mm + " mm";
    $("#sizeOut").textContent = indianSize(mm);
    $("#sizeAlt").textContent = "Indian size · US " + usSize(mm);
  }

  /* ---------- Open / close ---------- */
  function openDrawer(which) {
    tab = which;
    renderDrawer();
    $("#drawer").classList.add("open");
    $("#scrim").classList.add("show");
    document.body.classList.add("locked");
  }
  function closeAll() {
    $("#drawer").classList.remove("open");
    $("#nav").classList.remove("open");
    $("#header").classList.remove("nav-open");
    $("#modal").hidden = true;
    $("#scrim").classList.remove("show");
    document.body.classList.remove("locked");
    m = null;
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-view],[data-quick],[data-wish],[data-metal],[data-cat],[data-spot],[data-mmetal],[data-rsize],[data-q],[data-tab],[data-close]");
    if (!el) {
      if (!e.target.closest(".spot-card")) $$(".spot-card").forEach(function (c) { c.hidden = true; });
      return;
    }
    var d = el.dataset;
    if (d.view) { $("#drawer").classList.remove("open"); openModal(+d.view); return; }
    if (d.quick) { addToBag(+d.quick, cardMetal[+d.quick] || 0, null, ""); return; }
    if (d.wish) { toggleWish(+d.wish); return; }
    if (d.metal) { cardMetal[+d.metal] = +d.k; renderGrid(); return; }
    if (d.cat) { filter.cat = d.cat; renderCats(); renderGrid(); return; }
    if (d.spot) { showSpot(+d.spot); return; }
    if (d.mmetal) { m.metal = +d.mmetal; renderModal(); return; }
    if (d.rsize) { m.size = +d.rsize; renderModal(); return; }
    if (d.q) {
      var l = bag[+d.q];
      l.qty += +d.d;
      if (l.qty < 1) bag.splice(+d.q, 1);
      persist();
      return;
    }
    if (d.tab) { tab = d.tab; renderDrawer(); return; }
    if (el.hasAttribute("data-close")) closeAll();
  });

  $("#mAdd").addEventListener("click", function () {
    var p = byId(m.id);
    if (p.ring && !m.size) { toast("Please choose a ring size"); $("#mSizes").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    addToBag(m.id, m.metal, p.ring ? m.size : null, p.engrave ? $("#mEngrave").value.trim() : "");
    closeAll();
  });
  $("#mWish").addEventListener("click", function () { toggleWish(m.id); });

  $("#addLook").addEventListener("click", function () {
    LOOK.forEach(function (h) { var p = byId(h.id); addToBag(h.id, 0, p.ring ? mySize : null, "", CONFIG.lookOff, true); });
    toast("The full look is in your bag, " + Math.round(CONFIG.lookOff * 100) + "% off");
  });

  $("#sort").addEventListener("change", function (e) { filter.sort = e.target.value; renderGrid(); });
  $("#circ").addEventListener("input", renderSizer);
  $("#saveSize").addEventListener("click", function () {
    mySize = indianSize(+$("#circ").value);
    save("kn-size", mySize);
    toast("Saved: ring size " + mySize + ". We'll pre-select it for you");
  });

  $("#giftWrap").addEventListener("change", function (e) { gift.wrap = e.target.checked; persist(); });
  $("#giftNote").addEventListener("input", function (e) { gift.note = e.target.value; save("kn-gift", gift); });

  $("#bagBtn").addEventListener("click", function () { openDrawer("bag"); });
  $("#wishBtn").addEventListener("click", function () { openDrawer("wish"); });
  $("#checkout").addEventListener("click", checkout);
  $("#scrim").addEventListener("click", closeAll);
  $("#menuBtn").addEventListener("click", function () {
    // The sticky header is its own stacking layer, so lift it above the scrim while the menu is open
    $("#header").classList.add("nav-open");
    $("#nav").classList.add("open");
    $("#scrim").classList.add("show");
  });
  $$("#nav a").forEach(function (a) { a.addEventListener("click", closeAll); });
  $("#newsForm").addEventListener("submit", function (e) { e.preventDefault(); e.target.reset(); toast("You're on the list. Welcome to KANAK ✨"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  window.addEventListener("scroll", function () { $("#header").classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  if (mySize) $("#circ").value = mySize + 40;
  renderCats();
  renderGrid();
  renderLook();
  renderSizer();
  renderDrawer();
})();
