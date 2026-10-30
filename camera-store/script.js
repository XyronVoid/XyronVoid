/* ===== FILMWALA — Store logic =====
 * Edit the SETTINGS block (CONFIG, FORMATS, GRADES, PRODUCTS, TRADE, DEVELOP) to make this store your own.
 */
(function () {
  "use strict";

  /* ================= SETTINGS — edit these ================= */
  var CONFIG = {
    whatsapp: "919876543210",  // Orders go here: country code + number, no "+" or spaces
    filmPack: 1450,            // 3-roll film starter pack
    warranty: 999,             // Extend a camera's warranty from 6 to 18 months
    emiMonths: 6,
    compareMax: 3,
    tradeCreditBonus: 0.15     // Extra value when taking store credit instead of cash
  };

  var FORMATS = [
    { key: "all",     label: "All" },
    { key: "35mm",    label: "35mm" },
    { key: "120",     label: "120 medium format" },
    { key: "instant", label: "Instant" },
    { key: "126",     label: "126 cartridge" },
    { key: "digital", label: "Digital" },
    { key: "gear",    label: "Lenses & gear" }
  ];

  var GRADES = [
    { key: "A+", name: "Mint",      text: "Looks and works like new. Barely a mark, often with the original box." },
    { key: "A",  name: "Excellent", text: "Light signs of use you'll only see up close. Everything works perfectly." },
    { key: "B",  name: "Good",      text: "Visible wear, brassing or small dents. Fully working and tested on film." }
  ];

  // img: photo in the images/ folder (replace with your own). stock: how many you have.
  // specs: [label, value] pairs shown in the detail view and the compare table.
  var PRODUCTS = [
    { id: 1, name: "Nikkormat FT2",        year: 1975, format: "35mm",    grade: "A",  price: 15900, stock: 1, img: "images/nikkormat-slr.jpg",    tag: "Staff pick",
      specs: [["Lens", "50mm f/2"], ["Shutter", "1 s – 1/1000"], ["Light meter", "Centre-weighted, working"], ["Weight", "780 g"]],
      note: "New light seals and mirror foam. Tiny scuff on the top plate." },
    { id: 2, name: "Twin Lens Reflex",     year: 1958, format: "120",     grade: "A",  price: 36000, stock: 1, img: "images/twin-lens-camera.jpg",
      specs: [["Lens", "75mm f/3.5"], ["Shutter", "1 s – 1/500"], ["Light meter", "None, use a phone app"], ["Weight", "1,050 g"]],
      note: "Bright, clean viewing screen. Smooth focus. 12 square frames per roll." },
    { id: 3, name: "Instant OneStep",      year: 2017, format: "instant", grade: "A+", price: 8990,  stock: 2, img: "images/instant-camera.jpg",   tag: "Beginner friendly",
      specs: [["Lens", "106mm fixed focus"], ["Shutter", "Automatic"], ["Light meter", "Auto exposure"], ["Weight", "460 g"]],
      note: "Like new with the original box. Takes i-Type and 600 film." },
    { id: 4, name: "1950s Folding Camera", year: 1952, format: "120",     grade: "B",  price: 12500, stock: 1, img: "images/folding-camera.jpg",
      specs: [["Lens", "105mm f/4.5"], ["Shutter", "1/25 – 1/200 + B"], ["Light meter", "None, use a phone app"], ["Weight", "620 g"]],
      note: "Bellows tested light-tight. Brassing on the corners. Folds flat into a coat pocket." },
    { id: 5, name: "Instamatic 133",       year: 1968, format: "126",     grade: "B",  price: 2990,  stock: 3, img: "images/instamatic.jpg",       tag: "Collector",
      specs: [["Lens", "43mm f/11"], ["Shutter", "1/40 fixed"], ["Light meter", "None"], ["Weight", "300 g"]],
      note: "Working, but 126 film is rare. Best as a display piece or a gift." },
    { id: 6, name: "Retro Rangefinder",    year: 2016, format: "digital", grade: "A",  price: 42000, stock: 1, img: "images/rangefinder.jpg",
      specs: [["Lens", "23mm f/2 fixed"], ["Shutter", "30 s – 1/4000"], ["Sensor", "APS-C, 24 MP"], ["Weight", "470 g"]],
      note: "Film-style dials and a hybrid viewfinder. 8,200 shutter count." },
    { id: 7, name: "Pocket Digital",       year: 2018, format: "digital", grade: "A",  price: 24990, stock: 1, img: "images/pocket-digital.jpg",
      specs: [["Lens", "24–70mm f/1.8–2.8"], ["Shutter", "30 s – 1/2000"], ["Sensor", "1-inch, 20 MP"], ["Weight", "300 g"]],
      note: "Fits in a jeans pocket. Comes with a spare battery and wrist strap." },
    { id: 8, name: "70–210mm Zoom Lens",   year: 1985, format: "gear",    grade: "A",  price: 6490,  stock: 2, img: "images/zoom-lens.jpg",
      specs: [["Mount", "F-mount"], ["Aperture", "f/4 constant"], ["Focus", "Manual, smooth"], ["Weight", "720 g"]],
      note: "Clean glass, no haze or fungus. Front and rear caps included." },
    { id: 9, name: "Aluminium Tripod",     year: 1990, format: "gear",    grade: "A",  price: 2290,  stock: 4, img: "images/tripod.jpg",
      specs: [["Height", "45–150 cm"], ["Head", "3-way pan and tilt"], ["Load", "Up to 3 kg"], ["Weight", "1,400 g"]],
      note: "Sturdy legs with fresh rubber feet. Perfect for long exposures." }
  ];

  // Trade-in: base offer for a working item, then condition multipliers
  var TRADE = {
    types: [["35mm SLR", 4000], ["Rangefinder", 6000], ["Medium format / TLR", 9000], ["Point & shoot", 1500], ["Instant camera", 1500], ["Lens", 2000]],
    conditions: [["Works perfectly", 1], ["Works, with small issues", 0.6], ["Doesn't work / untested", 0.25]],
    boxBonus: 0.1
  };

  // Develop & scan: price per roll by format, extra per roll by scan size
  var DEVELOP = {
    formats: [["35mm (C-41 or B&W)", 349], ["120 medium format", 399], ["126 / 110 cartridge", 449]],
    scans: [["Standard", 0, "2000 px JPEG"], ["Large", 150, "4000 px JPEG"], ["Pro TIFF", 350, "Full-res TIFF"]],
    negReturn: 99,             // Posting negatives back
    freeReturnFrom: 3          // Rolls needed for free return post
  };
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
  function round100(n) { return Math.round(n / 100) * 100; }
  function photo(p, lazy) { return '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '"' + (lazy === false ? "" : ' loading="lazy"') + ' onerror="this.remove()" />'; }
  function formatLabel(p) { return findBy(FORMATS, "key", p.format).label; }
  function isCamera(p) { return p.format !== "gear"; }
  function frameNo(i) { return (i + 1) + (i % 2 ? "A" : ""); }

  /* ---------- State ---------- */
  var bag = load("fw-bag", []);
  var pack = load("fw-pack", false);
  var compare = [];
  var filter = { format: "all", grade: "all", sort: "featured" };

  bag = bag.filter(function (l) { var p = byId(l.id); return p && l.qty <= p.stock; });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  /* ---------- Film edge + hero contact sheet ---------- */
  function renderEdge() {
    var s = "";
    for (var i = 1; i <= 24; i++) s += "<span>FILMWALA 400</span><span>▸ " + i + "</span><span>" + i + "A</span>";
    $("#edgeTrack").innerHTML = s + s;
  }

  function renderSheet() {
    var picks = [1, 3, 2, 4, 6, 8];
    $("#sheet").innerHTML = picks.map(function (id, i) {
      var p = byId(id);
      return '<button class="frame' + (i === 0 ? " circled" : "") + '" data-detail="' + id + '"><span class="fno">' + frameNo(i) + "</span>" + photo(p, false) +
        (i === 0 ? '<svg class="grease" viewBox="0 0 200 150" aria-hidden="true"><path d="M30 80 C 20 30, 160 10, 178 60 C 196 110, 70 150, 28 100 C 14 82, 40 50, 70 44"/></svg><span class="pick">this one ★</span>' : "") +
        "</button>";
    }).join("");
  }

  /* ---------- Shop ---------- */
  function renderFilters() {
    $("#formats").innerHTML = FORMATS.map(function (f) {
      var n = f.key === "all" ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.format === f.key; }).length;
      if (!n) return "";
      return '<button class="fmt ' + (filter.format === f.key ? "on" : "") + '" data-format="' + f.key + '">' + f.label + " <i>" + n + "</i></button>";
    }).join("");
    $("#gradeSel").innerHTML = '<option value="all">Grade: any</option>' + GRADES.map(function (g) {
      return '<option value="' + g.key + '"' + (filter.grade === g.key ? " selected" : "") + ">Grade " + g.key + " · " + g.name + "</option>";
    }).join("");
  }

  function inBag(id) { var n = 0; bag.forEach(function (l) { if (l.id === id) n += l.qty; }); return n; }

  function card(p, i) {
    var left = p.stock - inBag(p.id);
    var g = findBy(GRADES, "key", p.grade);
    var cmp = compare.indexOf(p.id) > -1;
    return '<article class="card">' +
      '<div class="film">' +
        '<div class="film-meta"><span>' + frameNo(i) + "</span><span>" + esc(formatLabel(p)) + "</span></div>" +
        '<button class="shot" data-detail="' + p.id + '" aria-label="Details for ' + esc(p.name) + '">' + photo(p) + (p.tag ? '<span class="tag">' + esc(p.tag) + "</span>" : "") + "</button>" +
        '<div class="film-meta"><span>' + p.year + '</span><span class="grade g-' + p.grade.replace("+", "p") + '" title="' + g.name + '">' + p.grade + "</span></div>" +
      "</div>" +
      '<div class="card-body">' +
        "<h3>" + esc(p.name) + "</h3>" +
        '<p class="spec-line">' + esc(p.specs[0][1]) + " · " + g.name + "</p>" +
        '<div class="card-foot">' +
          '<b class="price">' + inr(p.price) + "</b>" +
          '<span class="stock ' + (left < 1 ? "out" : left === 1 ? "last" : "") + '">' + (left < 1 ? "All in your bag" : left === 1 ? "Only 1 left" : left + " in stock") + "</span>" +
        "</div>" +
        '<div class="card-actions">' +
          '<label class="cmp"><input type="checkbox" data-compare="' + p.id + '"' + (cmp ? " checked" : "") + " /> Compare</label>" +
          '<button class="btn btn-small btn-red" data-add="' + p.id + '"' + (left < 1 ? " disabled" : "") + ">" + (left < 1 ? "In bag" : "Add to bag") + "</button>" +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) {
      return (filter.format === "all" || p.format === filter.format) && (filter.grade === "all" || p.grade === filter.grade);
    });
    if (filter.sort !== "featured") {
      list = list.slice().sort(function (a, b) {
        if (filter.sort === "old") return a.year - b.year;
        return filter.sort === "low" ? a.price - b.price : b.price - a.price;
      });
    }
    $("#grid").innerHTML = list.length ? list.map(card).join("") : '<p class="empty">Nothing on this sheet. Try another grade or format.</p>';
  }

  function renderGrades() {
    $("#gradeList").innerHTML = GRADES.map(function (g) {
      var n = PRODUCTS.filter(function (p) { return p.grade === g.key; }).length;
      return '<article class="grade-card"><span class="grade big g-' + g.key.replace("+", "p") + '">' + g.key + "</span><h3>" + g.name + "</h3><p>" + g.text + '</p><button class="link" data-grade="' + g.key + '">See ' + n + " item" + (n === 1 ? "" : "s") + " →</button></article>";
    }).join("");
  }

  /* ---------- Detail & compare ---------- */
  function openModal(html, wide) {
    $("#modalBody").innerHTML = html;
    $("#modalCard").classList.toggle("wide", !!wide);
    $("#modal").hidden = false;
    $("#scrim").classList.add("show");
    document.body.classList.add("locked");
    setTimeout(function () { $("#modal .x").focus(); }, 30);
  }

  function detail(id) {
    var p = byId(id);
    var g = findBy(GRADES, "key", p.grade);
    var left = p.stock - inBag(p.id);
    var tested = isCamera(p)
      ? ["Shutter speeds checked", "Film advance and rewind", "Light seals replaced", "Lens cleaned, no fungus", "Test roll developed"]
      : ["Glass inspected under light", "Moving parts cleaned", "Caps and fittings checked"];
    openModal(
      '<div class="detail">' +
        '<div class="d-photo">' + photo(p, false) + '<span class="fno">' + p.year + "</span></div>" +
        '<div class="d-body">' +
          '<p class="mono-label">' + esc(formatLabel(p)) + " · Grade " + p.grade + " " + g.name + "</p>" +
          '<h3 id="modalTitle">' + esc(p.name) + "</h3>" +
          '<p class="d-price">' + inr(p.price) + "</p>" +
          '<p class="d-note">“' + esc(p.note) + "”</p>" +
          '<dl class="specs">' + p.specs.map(function (s) { return "<dt>" + s[0] + "</dt><dd>" + esc(s[1]) + "</dd>"; }).join("") + "</dl>" +
          '<h4>What we tested</h4><ul class="tested">' + tested.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>" +
          '<button class="btn btn-red btn-full" data-add="' + p.id + '"' + (left < 1 ? " disabled" : "") + ">" + (left < 1 ? "Already in your bag" : "Add to bag · " + inr(p.price)) + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function compareView() {
    var items = compare.map(byId);
    var labels = [];
    items.forEach(function (p) { p.specs.forEach(function (s) { if (labels.indexOf(s[0]) < 0) labels.push(s[0]); }); });
    function val(p, label) { for (var i = 0; i < p.specs.length; i++) if (p.specs[i][0] === label) return esc(p.specs[i][1]); return "—"; }
    var cheapest = Math.min.apply(null, items.map(function (p) { return p.price; }));
    var rows = [
      ["", items.map(function (p) { return '<div class="c-photo">' + photo(p, false) + "</div><b>" + esc(p.name) + "</b>"; })],
      ["Price", items.map(function (p) { return inr(p.price) + (p.price === cheapest && items.length > 1 ? ' <span class="best">lowest</span>' : ""); })],
      ["Year", items.map(function (p) { return p.year; })],
      ["Format", items.map(function (p) { return esc(formatLabel(p)); })],
      ["Grade", items.map(function (p) { return p.grade + " · " + findBy(GRADES, "key", p.grade).name; })]
    ].concat(labels.map(function (l) { return [l, items.map(function (p) { return val(p, l); })]; }))
     .concat([["", items.map(function (p) { var left = p.stock - inBag(p.id); return '<button class="btn btn-small btn-red" data-add="' + p.id + '"' + (left < 1 ? " disabled" : "") + ">" + (left < 1 ? "In bag" : "Add") + "</button>"; })]]);
    openModal(
      '<h3 class="c-title" id="modalTitle">Side by side</h3>' +
      '<div class="c-scroll"><table class="compare"><tbody>' + rows.map(function (r) {
        return "<tr><th>" + r[0] + "</th>" + r[1].map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>",
      true
    );
  }

  function renderTray() {
    $("#tray").hidden = !compare.length;
    var slots = "";
    for (var i = 0; i < CONFIG.compareMax; i++) {
      var p = compare[i] ? byId(compare[i]) : null;
      slots += p
        ? '<div class="slot">' + photo(p, false) + '<button data-uncompare="' + p.id + '" aria-label="Remove ' + esc(p.name) + '">✕</button></div>'
        : '<div class="slot empty">+</div>';
    }
    $("#traySlots").innerHTML = slots + '<span class="tray-note">' + compare.length + "/" + CONFIG.compareMax + " picked</span>";
    $("#openCompare").disabled = compare.length < 2;
    document.body.classList.toggle("has-tray", compare.length > 0);
  }

  function toggleCompare(id, on) {
    if (on && compare.indexOf(id) < 0) {
      if (compare.length >= CONFIG.compareMax) { toast("You can compare up to " + CONFIG.compareMax + " at a time"); renderGrid(); return; }
      compare.push(id);
    }
    if (!on) compare = compare.filter(function (x) { return x !== id; });
    renderTray();
    renderGrid();
  }

  /* ---------- Bag ---------- */
  function linePrice(l) { return (byId(l.id).price + (l.warranty ? CONFIG.warranty : 0)) * l.qty; }

  function addToBag(id) {
    var p = byId(id);
    if (inBag(id) >= p.stock) { toast("That's all we have of this one"); return; }
    var line = null;
    bag.forEach(function (l) { if (l.id === id) line = l; });
    if (line) line.qty++;
    else bag.push({ id: id, qty: 1, warranty: false });
    persist();
    var b = $("#bagBtn");
    b.classList.remove("flash");
    void b.offsetWidth;
    b.classList.add("flash");
    toast("📸 " + p.name + " is in your bag");
  }

  function persist() { save("fw-bag", bag); save("fw-pack", pack); renderBag(); renderGrid(); }

  function totals() {
    var items = 0, warranty = 0, count = 0;
    bag.forEach(function (l) { items += byId(l.id).price * l.qty; warranty += (l.warranty ? CONFIG.warranty : 0) * l.qty; count += l.qty; });
    var film = pack && bag.length ? CONFIG.filmPack : 0;
    return { items: items, extra: warranty + film, count: count, total: items + warranty + film };
  }

  function renderBag() {
    var t = totals();
    $("#bagCount").textContent = t.count;
    var empty = !bag.length;
    $("#bagFoot").hidden = empty;
    $("#packRow").hidden = empty;
    if (empty) {
      $("#bagItems").innerHTML = '<div class="empty"><p>Your bag is an unexposed roll.</p><a href="#shop" class="btn btn-red" data-close>Browse cameras</a></div>';
      return;
    }
    $("#bagItems").innerHTML = bag.map(function (l, i) {
      var p = byId(l.id);
      return '<div class="item">' +
        '<div class="thumb">' + photo(p) + "</div>" +
        "<div><b>" + esc(p.name) + "</b><small>" + p.year + " · Grade " + p.grade + "</small>" +
          (isCamera(p) ? '<label class="warranty"><input type="checkbox" data-warranty="' + i + '"' + (l.warranty ? " checked" : "") + " /> 18-month warranty +" + inr(CONFIG.warranty) + "</label>" : "") + "</div>" +
        '<div class="item-r"><b>' + inr(linePrice(l)) + "</b>" +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase"' + (l.qty >= p.stock ? " disabled" : "") + ">+</button></div></div>" +
      "</div>";
    }).join("");
    $("#filmPack").checked = pack;
    $("#packPrice").textContent = "+" + inr(CONFIG.filmPack);
    $("#bSub").textContent = inr(t.items);
    $("#bExtraRow").hidden = !t.extra;
    $("#bExtra").textContent = inr(t.extra);
    $("#bTotal").textContent = inr(t.total);
    $("#emi").textContent = "or " + CONFIG.emiMonths + " × " + inr(t.total / CONFIG.emiMonths) + "/month with no-cost EMI";
  }

  function openWhatsApp(msg) {
    var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
    var w = window.open(url, "_blank");
    if (!w) location.href = url; // popup blocked (e.g. in-app browsers)
  }

  function checkout() {
    var t = totals();
    var lines = bag.map(function (l) {
      var p = byId(l.id);
      return "• " + p.name + " (" + p.year + ", grade " + p.grade + ") × " + l.qty + " = " + inr(linePrice(l)) + (l.warranty ? " [incl. 18-month warranty]" : "");
    });
    openWhatsApp("Hi FILMWALA! 📸 I'd like to order:\n\n" + lines.join("\n") + "\n" +
      (pack ? "\n🎞️ 3-roll film starter pack: " + inr(CONFIG.filmPack) : "") +
      "\nShipping: Free (insured)\n*Total: " + inr(t.total) + "*\n\nCould you send close-up photos before I pay? My name and address:");
  }

  /* ---------- Trade-in ---------- */
  function tradeEstimate() {
    var base = TRADE.types[+$("#tType").value][1];
    var mult = TRADE.conditions[+$("#tCond").value][1];
    var v = base * mult * ($("#tBox").checked ? 1 + TRADE.boxBonus : 1);
    return { lo: round100(v * 0.85), hi: round100(v * 1.15) };
  }
  function renderTrade() {
    var e = tradeEstimate();
    $("#tOut").textContent = inr(e.lo) + " – " + inr(e.hi);
    $("#tCredit").textContent = "or up to " + inr(round100(e.hi * (1 + CONFIG.tradeCreditBonus))) + " as store credit";
  }

  /* ---------- Develop & scan ---------- */
  var rolls = 1, scan = 0;
  function devTotal() {
    var per = DEVELOP.formats[+$("#dFormat").value][1] + DEVELOP.scans[scan][1];
    var ret = $("#dNeg").checked && rolls < DEVELOP.freeReturnFrom ? DEVELOP.negReturn : 0;
    return { per: per, ret: ret, total: per * rolls + ret };
  }
  function renderDev() {
    $("#dRolls").textContent = rolls;
    $("#dScan").innerHTML = DEVELOP.scans.map(function (s, i) {
      return '<button type="button" class="' + (scan === i ? "on" : "") + '" data-scan="' + i + '"><b>' + s[0] + "</b><small>" + s[2] + (s[1] ? " · +" + inr(s[1]) : "") + "</small></button>";
    }).join("");
    $("#dNegNote").textContent = rolls >= DEVELOP.freeReturnFrom ? "(free)" : "(+" + inr(DEVELOP.negReturn) + ", free on " + DEVELOP.freeReturnFrom + "+ rolls)";
    var t = devTotal();
    $("#dOut").textContent = inr(t.total);
    $("#dNote").textContent = rolls + " × " + inr(t.per) + " per roll" + (t.ret ? " + " + inr(t.ret) + " return post" : "");
  }

  /* ---------- Open / close ---------- */
  function openBag() { $("#bag").classList.add("open"); $("#scrim").classList.add("show"); document.body.classList.add("locked"); }
  function closeAll() {
    $("#bag").classList.remove("open");
    $("#nav").classList.remove("open");
    $("#header").classList.remove("nav-open");
    $("#modal").hidden = true;
    $("#scrim").classList.remove("show");
    document.body.classList.remove("locked");
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-detail],[data-add],[data-format],[data-grade],[data-uncompare],[data-q],[data-roll],[data-scan],[data-close]");
    if (!el) return;
    var d = el.dataset;
    if (d.detail) { detail(+d.detail); return; }
    if (d.add) {
      addToBag(+d.add);
      if (!$("#modal").hidden) { if ($("#modalCard").classList.contains("wide")) compareView(); else detail(+d.add); }
      return;
    }
    if (d.format) { filter.format = d.format; renderFilters(); renderGrid(); return; }
    if (d.grade) { filter.grade = d.grade; filter.format = "all"; renderFilters(); renderGrid(); $("#shop").scrollIntoView({ behavior: "smooth" }); return; }
    if (d.uncompare) { toggleCompare(+d.uncompare, false); return; }
    if (d.q) {
      var l = bag[+d.q];
      l.qty += +d.d;
      if (l.qty < 1) bag.splice(+d.q, 1);
      persist();
      return;
    }
    if (d.roll) { rolls = Math.max(1, Math.min(20, rolls + +d.roll)); renderDev(); return; }
    if (d.scan) { scan = +d.scan; renderDev(); return; }
    if (el.hasAttribute("data-close")) closeAll();
  });

  document.addEventListener("change", function (e) {
    var d = e.target.dataset;
    if (d.compare) toggleCompare(+d.compare, e.target.checked);
    if (d.warranty) { bag[+d.warranty].warranty = e.target.checked; persist(); }
  });

  $("#gradeSel").addEventListener("change", function (e) { filter.grade = e.target.value; renderGrid(); });
  $("#sortSel").addEventListener("change", function (e) { filter.sort = e.target.value; renderGrid(); });
  $("#clearCompare").addEventListener("click", function () { compare = []; renderTray(); renderGrid(); });
  $("#openCompare").addEventListener("click", compareView);
  $("#filmPack").addEventListener("change", function (e) { pack = e.target.checked; persist(); });

  $("#tType").innerHTML = TRADE.types.map(function (t, i) { return '<option value="' + i + '">' + t[0] + "</option>"; }).join("");
  $("#tCond").innerHTML = TRADE.conditions.map(function (c, i) { return '<option value="' + i + '">' + c[0] + "</option>"; }).join("");
  ["#tType", "#tCond", "#tBox"].forEach(function (s) { $(s).addEventListener("change", renderTrade); });
  $("#tradeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var est = tradeEstimate();
    openWhatsApp("Hi FILMWALA! I'd like to trade in a camera.\n\nType: " + TRADE.types[+$("#tType").value][0] +
      "\nCondition: " + TRADE.conditions[+$("#tCond").value][0] + "\nOriginal box/case: " + ($("#tBox").checked ? "Yes" : "No") +
      "\nWebsite estimate: " + inr(est.lo) + " – " + inr(est.hi) + "\n\nI'll send photos here.");
  });

  $("#dFormat").innerHTML = DEVELOP.formats.map(function (f, i) { return '<option value="' + i + '">' + f[0] + " · " + inr(f[1]) + "/roll</option>"; }).join("");
  $("#dFormat").addEventListener("change", renderDev);
  $("#dNeg").addEventListener("change", renderDev);
  $("#devForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = devTotal();
    openWhatsApp("Hi FILMWALA! 🎞️ I'd like to book developing.\n\nFormat: " + DEVELOP.formats[+$("#dFormat").value][0] +
      "\nRolls: " + rolls + "\nScans: " + DEVELOP.scans[scan][0] + " (" + DEVELOP.scans[scan][2] + ")" +
      "\nReturn negatives: " + ($("#dNeg").checked ? "Yes" : "No") + "\n*Total: " + inr(t.total) + "*\n\nWhere should I post my film?");
  });

  $("#bagBtn").addEventListener("click", openBag);
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
  renderEdge();
  renderSheet();
  renderFilters();
  renderGrid();
  renderGrades();
  renderTray();
  renderBag();
  renderTrade();
  renderDev();
})();
