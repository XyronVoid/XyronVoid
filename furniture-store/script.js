/* ===== KONA — Store logic =====
 * Edit the SETTINGS block (CONFIG, ROOMS, PRODUCTS, PLANTS) to make this store your own.
 */
(function () {
  "use strict";

  /* ================= SETTINGS — edit these ================= */
  var CONFIG = {
    whatsapp: "919876543210",  // Orders go here: country code + number, no "+" or spaces
    freeDeliveryAt: 15000,
    deliveryFee: 799,
    assembly: 499,             // Per furniture item
    freeAssemblyAt: 25000,     // Assembly is free above this product total
    stairsPerFloor: 150,       // Per large item, per floor, when there's no lift
    maxFloor: 15,
    emiMonths: [3, 6, 9, 12],
    fitMargin: 5               // Minimum gap (cm) we want on each side
  };

  // shape: circle, square, triangle or half (a half circle). colour: red, yellow, blue or black.
  var ROOMS = [
    { key: "living",  label: "Living room", shape: "circle",   colour: "red" },
    { key: "dining",  label: "Dining",      shape: "square",   colour: "yellow" },
    { key: "study",   label: "Study",       shape: "triangle", colour: "blue" },
    { key: "bedroom", label: "Bedroom",     shape: "half",     colour: "black" }
  ];

  // img: photo in the images/ folder (replace with your own). dims in cm (w × d × h).
  // finishes: [name, swatch colour, price difference]. large: counts for the stairs charge.
  // pairs: plant ids suggested in the product view.
  var PRODUCTS = [
    { id: 1,  rooms: ["living"],            name: "Cloud Grey Sofa",    desc: "A deep three-seater with a tufted back, solid sheesham legs and removable, washable covers.", price: 42990, img: "images/grey-sofa.jpg",     dims: { w: 210, d: 90, h: 85 },  finishes: [["Cloud grey", "#9a9a98", 0], ["Teal velvet", "#1f6f74", 4000], ["Oat linen", "#d9cdb4", 2000]], large: true,  assembly: true,  pairs: [5, 2], tag: "Bestseller" },
    { id: 2,  rooms: ["living"],            name: "Tan Leather Sofa",   desc: "Top-grain leather that only gets better with age, on a kiln-dried hardwood frame.",          price: 84990, img: "images/leather-sofa.jpg",   dims: { w: 220, d: 95, h: 80 },  finishes: [["Tan leather", "#b9774a", 0], ["Espresso leather", "#4a2e22", 6000]], large: true,  assembly: true,  pairs: [5, 1] },
    { id: 3,  rooms: ["living", "bedroom"], name: "Arc Lounge Chair",   desc: "A curved, hugging armchair for reading corners, with tapered wooden legs.",                 price: 18490, img: "images/arc-armchair.jpg",   dims: { w: 75, d: 78, h: 82 },   finishes: [["Denim blue", "#4f6f95", 0], ["Rust", "#b2512f", 0], ["Charcoal", "#3b3b3d", 0]], large: true,  assembly: false, pairs: [6, 4], tag: "New" },
    { id: 4,  rooms: ["dining", "study"],   name: "Shell Armchair",     desc: "A moulded shell seat on a black steel and beech base. Stackable, wipe-clean.",              price: 7990,  img: "images/shell-chair.jpg",    dims: { w: 63, d: 60, h: 80 },   finishes: [["Black", "#1c1c1c", 0], ["White", "#f1f0eb", 0]], large: false, assembly: true,  pairs: [2] },
    { id: 5,  rooms: ["dining"],            name: "Café Chair Pair",    desc: "Two lightweight dining chairs with powder-coated legs, in mustard and sage.",               price: 11990, img: "images/cafe-chairs.jpg",    dims: { w: 47, d: 52, h: 82 },   finishes: [["Mustard + sage", "#d4a72c", 0]], large: false, assembly: true,  pairs: [3] },
    { id: 6,  rooms: ["dining"],            name: "Bistro Chair",       desc: "The classic bentwood café chair, hand-finished in soft white.",                             price: 5490,  img: "images/bistro-chair.jpg",   dims: { w: 42, d: 45, h: 86 },   finishes: [["Soft white", "#efede6", 0], ["Natural", "#c8a87c", 0]], large: false, assembly: false, pairs: [1] },
    { id: 7,  rooms: ["study"],             name: "Oak Writing Desk",   desc: "Two slim drawers, hairpin legs and a cable cut-out. Big enough for a laptop and a monitor.", price: 24990, img: "images/oak-desk.jpg",       dims: { w: 120, d: 55, h: 75 },  finishes: [["Natural oak", "#d8b98c", 0], ["Walnut", "#6b4a32", 2000]], large: true,  assembly: true,  pairs: [2, 3], tag: "Work from home" },
    { id: 8,  rooms: ["dining", "study"],   name: "Birch Bar Stool",    desc: "Counter-height stool in solid birch with a footrest. Light enough to carry with one hand.", price: 4990,  img: "images/birch-stool.jpg",    dims: { w: 38, d: 38, h: 75 },   finishes: [["Birch", "#e2d6c2", 0]], large: false, assembly: true,  pairs: [1] },
    { id: 9,  rooms: ["bedroom"],           name: "Round Bedside Table", desc: "A white top on dipped wooden legs. Just the right size for a lamp, a book and a clock.",   price: 6490,  img: "images/bedside-table.jpg",  dims: { w: 40, d: 40, h: 52 },   finishes: [["White + oak", "#f4f3ef", 0], ["Black + oak", "#202020", 0]], large: false, assembly: true,  pairs: [3, 4] },
    { id: 10, rooms: ["living", "dining", "study", "bedroom"], name: "Dome Pendant Light", desc: "A matte metal dome with a warm diffuser. Fits a standard B22 bulb, 1.2 m adjustable cord.", price: 3990, img: "images/dome-pendant.jpg", dims: { w: 32, d: 32, h: 25 }, finishes: [["Chalk white", "#efefea", 0], ["Ink blue", "#1d3a6b", 0], ["Signal red", "#c8322b", 300]], large: false, assembly: false, pairs: [6] }
  ];

  var PLANTS = [
    { id: 1, name: "Spiky Cactus",    price: 599,  img: "images/cactus.jpg",       light: "Bright sun · water monthly" },
    { id: 2, name: "Aloe Vera",       price: 449,  img: "images/aloe.jpg",         light: "Bright light · water fortnightly" },
    { id: 3, name: "Succulent Set",   price: 1299, img: "images/succulents.jpg",   light: "Set of 6 · sunny windowsill" },
    { id: 4, name: "White Orchid",    price: 1899, img: "images/orchid.jpg",       light: "Indirect light · blooms 2 months" },
    { id: 5, name: "Bonsai Tree",     price: 2499, img: "images/bonsai.jpg",       light: "Bright light · water when dry" },
    { id: 6, name: "Hanging Fern",    price: 899,  img: "images/hanging-fern.jpg", light: "Shade-loving · mist weekly" }
  ];
  /* ========================================================== */

  /* ---------- Helpers ---------- */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function findBy(list, key, val) { for (var i = 0; i < list.length; i++) if (list[i][key] === val) return list[i]; return null; }
  function product(id) { return findBy(PRODUCTS, "id", id); }
  function plant(id) { return findBy(PLANTS, "id", id); }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function photo(x) { return '<img src="' + esc(x.img) + '" alt="' + esc(x.name) + '" loading="lazy" onerror="this.remove()" />'; }
  function dimText(d) { return d.w + " × " + d.d + " × " + d.h + " cm"; }
  function maxEmi() { return CONFIG.emiMonths[CONFIG.emiMonths.length - 1]; }
  function shape(r) { return '<span class="shape ' + r.shape + " " + r.colour + '" aria-hidden="true"></span>'; }
  function floorName(f) { return f === 0 ? "Ground floor" : f + (f === 1 ? "st" : f === 2 ? "nd" : f === 3 ? "rd" : "th") + " floor"; }

  /* ---------- State ---------- */
  var cart = load("kona-cart", []);
  var delivery = load("kona-delivery", { floor: 0, lift: true });
  var fit = load("kona-fit", { w: "", d: "", door: "" });
  var filter = { room: "all", sort: "featured" };

  cart = cart.filter(function (l) { return l.type === "p" ? plant(l.id) : product(l.id) && product(l.id).finishes[l.fi]; });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  /* ---------- Rooms & grid ---------- */
  function renderRooms() {
    $("#roomList").innerHTML = ROOMS.map(function (r) {
      var n = PRODUCTS.filter(function (p) { return p.rooms.indexOf(r.key) > -1; }).length;
      return '<button class="room room-' + r.colour + (filter.room === r.key ? " on" : "") + '" data-room="' + r.key + '">' + shape(r) +
        "<b>" + r.label + "</b><small>" + n + " pieces →</small></button>";
    }).join("");
    $("#tabs").innerHTML = [{ key: "all", label: "All" }].concat(ROOMS).map(function (r) {
      return '<button class="tab ' + (filter.room === r.key ? "on" : "") + '" data-room="' + r.key + '">' + r.label + "</button>";
    }).join("");
  }

  function card(p, i) {
    var room = findBy(ROOMS, "key", p.rooms[0]);
    return '<article class="card accent-' + room.colour + '">' +
      '<button class="card-media" data-view="' + p.id + '" aria-label="View ' + esc(p.name) + '">' + photo(p) +
        '<span class="corner ' + room.shape + '"></span>' +
        (p.tag ? '<span class="tag">' + esc(p.tag) + "</span>" : "") + "</button>" +
      '<div class="card-body">' +
        '<span class="card-num">' + pad(p.id) + "</span>" +
        "<h3>" + esc(p.name) + "</h3>" +
        '<p class="card-dims">' + dimText(p.dims) + "</p>" +
        '<div class="card-swatches">' + p.finishes.map(function (f) { return '<i style="background:' + f[1] + '" title="' + esc(f[0]) + '"></i>'; }).join("") + "</div>" +
        '<div class="card-foot"><div><b>' + inr(p.price) + "</b><small>or " + inr(p.price / maxEmi()) + "/mo</small></div>" +
          '<button class="btn btn-black btn-small" data-view="' + p.id + '">View</button></div>' +
      "</div>" +
    "</article>";
  }

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) { return filter.room === "all" || p.rooms.indexOf(filter.room) > -1; });
    if (filter.sort !== "featured") list = list.slice().sort(function (a, b) { return filter.sort === "low" ? a.price - b.price : b.price - a.price; });
    $("#grid").innerHTML = list.map(card).join("");
  }

  function renderPlants() {
    $("#plantList").innerHTML = PLANTS.map(function (pl) {
      return '<article class="plant"><div class="plant-media">' + photo(pl) + "</div>" +
        "<h3>" + esc(pl.name) + "</h3><p>" + esc(pl.light) + "</p>" +
        '<div class="plant-foot"><b>' + inr(pl.price) + '</b><button class="add-round" data-plant="' + pl.id + '" aria-label="Add ' + esc(pl.name) + '">+</button></div></article>';
    }).join("");
  }

  /* ---------- Product modal ---------- */
  var m = null; // { id, fi, emi }

  function openModal(id) {
    var p = product(id);
    m = { id: id, fi: 0, emi: CONFIG.emiMonths.length - 1 };
    $("#mImg").src = p.img;
    $("#mImg").alt = p.name;
    $("#mNum").textContent = pad(p.id);
    $("#mRoom").textContent = p.rooms.map(function (k) { return findBy(ROOMS, "key", k).label; }).join(" · ");
    $("#mName").textContent = p.name;
    $("#mDesc").textContent = p.desc;
    $("#mDims").innerHTML = ["Width", "Depth", "Height"].map(function (l, i) {
      return "<div><span>" + l + "</span><b>" + [p.dims.w, p.dims.d, p.dims.h][i] + "<small>cm</small></b></div>";
    }).join("");
    $("#mFinishWrap").hidden = p.finishes.length < 2;
    $("#mPairWrap").hidden = !p.pairs.length;
    $("#mPairs").innerHTML = p.pairs.map(function (pid) {
      var pl = plant(pid);
      return '<button class="pair" data-plant="' + pid + '"><span class="pair-img">' + photo(pl) + "</span><span><b>" + esc(pl.name) + "</b><small>+" + inr(pl.price) + "</small></span></button>";
    }).join("");
    $("#emiRange").max = CONFIG.emiMonths.length - 1;
    $("#emiRange").value = m.emi;
    $("#fW").value = fit.w; $("#fD").value = fit.d; $("#fDoor").value = fit.door;
    renderModal();
    $("#modal").hidden = false;
    $("#scrim").classList.add("show");
    document.body.classList.add("locked");
    setTimeout(function () { $("#modal .x").focus(); }, 30);
  }

  function modalPrice() { var p = product(m.id); return p.price + p.finishes[m.fi][2]; }

  function renderModal() {
    var p = product(m.id);
    var price = modalPrice();
    var months = CONFIG.emiMonths[m.emi];
    $("#mPrice").textContent = inr(price);
    $("#mEmi").textContent = "or " + inr(price / months) + " × " + months + " months";
    $("#mFinishName").textContent = p.finishes[m.fi][0] + (p.finishes[m.fi][2] ? " (+" + inr(p.finishes[m.fi][2]) + ")" : "");
    $("#mFinishes").innerHTML = p.finishes.map(function (f, i) {
      return '<button class="sw ' + (m.fi === i ? "on" : "") + '" data-finish="' + i + '" style="background:' + f[1] + '" aria-label="' + esc(f[0]) + '" title="' + esc(f[0]) + '"></button>';
    }).join("");
    $("#emiMonths").textContent = months + " months";
    $("#emiTicks").innerHTML = CONFIG.emiMonths.map(function (mo, i) {
      return '<span class="' + (i === m.emi ? "on" : "") + '"><b>' + mo + "</b>" + inr(price / mo) + "</span>";
    }).join("");
    renderFit();
    $("#mAdd").textContent = "Add to cart · " + inr(price);
  }

  // Fits if the footprint (either way round) leaves the margin on each side, and the
  // smallest dimension can pass through the door.
  function renderFit() {
    var p = product(m.id);
    var W = +$("#fW").value, D = +$("#fD").value, door = +$("#fDoor").value;
    var el = $("#fitResult");
    var msgs = [], ok = true, any = false;
    var g = CONFIG.fitMargin;
    if (W && D) {
      any = true;
      var spareA = Math.min((W - p.dims.w) / 2, D - p.dims.d);
      var spareB = Math.min((W - p.dims.d) / 2, D - p.dims.w);
      var best = Math.max(spareA, spareB);
      if (best >= g) msgs.push("✓ Fits your space with " + Math.floor(best) + " cm to spare" + (spareB > spareA ? " (turned sideways)" : ""));
      else if (best >= 0) { msgs.push("⚠ Fits, but only just: " + Math.floor(best) + " cm to spare"); }
      else { ok = false; msgs.push("✕ Too big for this space by " + Math.ceil(-best) + " cm"); }
    }
    if (door) {
      any = true;
      var thinnest = Math.min(p.dims.w, p.dims.d, p.dims.h);
      if (thinnest <= door - 2) msgs.push("✓ Goes through a " + door + " cm door");
      else { ok = false; msgs.push("✕ Won't pass a " + door + " cm door (needs " + (thinnest + 2) + " cm)"); }
    }
    el.className = "fit-result" + (any ? (ok ? (msgs.join(" ").indexOf("⚠") > -1 ? " warn" : " ok") : " bad") : "");
    el.innerHTML = any ? msgs.join("<br />") : "Enter your measurements in cm.";
  }

  /* ---------- Cart ---------- */
  function linePrice(l) {
    if (l.type === "p") return plant(l.id).price * l.qty;
    var p = product(l.id);
    return (p.price + p.finishes[l.fi][2]) * l.qty;
  }

  function addFurniture(id, fi) {
    var line = null;
    cart.forEach(function (l) { if (l.type === "f" && l.id === id && l.fi === fi) line = l; });
    if (line) line.qty++;
    else cart.push({ type: "f", id: id, fi: fi, qty: 1, asm: product(id).assembly });
    persist();
    bump();
    toast(product(id).name + " added");
  }

  function addPlant(id) {
    var line = null;
    cart.forEach(function (l) { if (l.type === "p" && l.id === id) line = l; });
    if (line) line.qty++;
    else cart.push({ type: "p", id: id, qty: 1 });
    persist();
    bump();
    toast("🌱 " + plant(id).name + " added");
  }

  function bump() {
    var b = $("#cartBtn");
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  }

  function persist() { save("kona-cart", cart); save("kona-delivery", delivery); renderCart(); }

  function totals() {
    var products = 0, asmItems = 0, large = 0, count = 0;
    cart.forEach(function (l) {
      products += linePrice(l);
      count += l.qty;
      if (l.type === "f") {
        if (l.asm) asmItems += l.qty;
        if (product(l.id).large) large += l.qty;
      }
    });
    var asm = products >= CONFIG.freeAssemblyAt ? 0 : asmItems * CONFIG.assembly;
    var ship = !cart.length || products >= CONFIG.freeDeliveryAt ? 0 : CONFIG.deliveryFee;
    var stairs = !delivery.lift && delivery.floor > 0 ? delivery.floor * CONFIG.stairsPerFloor * large : 0;
    return { products: products, asmItems: asmItems, asm: asm, ship: ship, stairs: stairs, large: large, count: count, total: products + asm + ship + stairs };
  }

  function renderCart() {
    var t = totals();
    $("#cartCount").textContent = t.count;
    var empty = !cart.length;
    $("#cartFoot").hidden = empty;
    $("#deliveryBox").hidden = empty;
    if (empty) {
      $("#cartItems").innerHTML = '<div class="empty"><span class="shape circle red"></span><span class="shape square yellow"></span><span class="shape triangle blue"></span><p>Your cart is an empty room.</p><a href="#shop" class="btn btn-black" data-close>Start furnishing</a></div>';
      return;
    }
    $("#cartItems").innerHTML = cart.map(function (l, i) {
      var x = l.type === "p" ? plant(l.id) : product(l.id);
      var sub = l.type === "p" ? "Plant" : x.finishes[l.fi][0] + " · " + dimText(x.dims);
      var asm = l.type === "f" && x.assembly
        ? '<label class="asm"><input type="checkbox" data-asm="' + i + '"' + (l.asm ? " checked" : "") + " /> Assembly " + (t.products >= CONFIG.freeAssemblyAt ? "(free)" : "+" + inr(CONFIG.assembly)) + "</label>"
        : "";
      return '<div class="item"><div class="thumb">' + photo(x) + "</div>" +
        "<div><b>" + esc(x.name) + "</b><small>" + esc(sub) + "</small>" + asm + "</div>" +
        '<div class="item-r"><b>' + inr(linePrice(l)) + "</b>" +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div></div></div>';
    }).join("");

    $("#floor").value = delivery.floor;
    $("#lift").checked = delivery.lift;
    $("#delNote").innerHTML = !t.large ? "Only small items, so no stairs charge." :
      delivery.lift || delivery.floor === 0 ? "✓ No stairs charge for " + floorName(delivery.floor).toLowerCase() + (delivery.floor ? " with a lift" : "") + "." :
      "No lift: " + delivery.floor + " floor" + (delivery.floor > 1 ? "s" : "") + " × " + t.large + " large item" + (t.large > 1 ? "s" : "") + " × " + inr(CONFIG.stairsPerFloor) + " = <b>" + inr(t.stairs) + "</b>";

    $("#cSub").textContent = inr(t.products);
    $("#cAsmRow").hidden = !t.asmItems;
    $("#cAsm").textContent = t.asm ? inr(t.asm) : "Free";
    $("#cShip").textContent = t.ship ? inr(t.ship) : "Free";
    $("#cStairRow").hidden = !t.stairs;
    $("#cStair").textContent = inr(t.stairs);
    $("#cTotal").textContent = inr(t.total);
    $("#cEmi").textContent = "or " + inr(t.total / maxEmi()) + "/month for " + maxEmi() + " months at 0% interest";
  }

  function checkout() {
    var t = totals();
    var lines = cart.map(function (l) {
      if (l.type === "p") return "• " + plant(l.id).name + " (plant) × " + l.qty + " = " + inr(linePrice(l));
      var p = product(l.id);
      return "• " + p.name + " (" + p.finishes[l.fi][0] + ", " + dimText(p.dims) + ") × " + l.qty + " = " + inr(linePrice(l)) + (l.asm ? " [with assembly]" : "");
    });
    var msg = "Hi KONA! I'd like to order:\n\n" + lines.join("\n") + "\n" +
      "\n🏢 Delivery to: " + floorName(delivery.floor) + (delivery.floor ? (delivery.lift ? ", lift available" : ", no lift") : "") +
      "\n\nProducts: " + inr(t.products) +
      (t.asmItems ? "\nAssembly: " + (t.asm ? inr(t.asm) : "Free") : "") +
      "\nDelivery: " + (t.ship ? inr(t.ship) : "Free") +
      (t.stairs ? "\nStairs carry: " + inr(t.stairs) : "") +
      "\n*Total: " + inr(t.total) + "*\n\nI'd like to pay by: EMI / UPI\nMy name and address:";
    var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
    var w = window.open(url, "_blank");
    if (!w) location.href = url; // popup blocked (e.g. in-app browsers)
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
    var el = e.target.closest("[data-view],[data-room],[data-plant],[data-finish],[data-q],[data-close]");
    if (!el) return;
    var d = el.dataset;
    if (d.view) { openModal(+d.view); return; }
    if (d.room) {
      filter.room = filter.room === d.room && el.classList.contains("room") ? "all" : d.room;
      renderRooms(); renderGrid();
      if (el.classList.contains("room")) $("#shop").scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (d.plant) { addPlant(+d.plant); return; }
    if (d.finish) { m.fi = +d.finish; renderModal(); return; }
    if (d.q) {
      var l = cart[+d.q];
      l.qty += +d.d;
      if (l.qty < 1) cart.splice(+d.q, 1);
      persist();
      return;
    }
    if (el.hasAttribute("data-close")) closeAll();
  });

  document.addEventListener("change", function (e) {
    if (e.target.dataset.asm) { cart[+e.target.dataset.asm].asm = e.target.checked; persist(); }
  });

  ["#fW", "#fD", "#fDoor"].forEach(function (s) {
    $(s).addEventListener("input", function () {
      fit = { w: $("#fW").value, d: $("#fD").value, door: $("#fDoor").value };
      save("kona-fit", fit);
      renderFit();
    });
  });
  $("#emiRange").addEventListener("input", function (e) { m.emi = +e.target.value; renderModal(); });
  $("#mAdd").addEventListener("click", function () { addFurniture(m.id, m.fi); closeAll(); });
  $("#sortSel").addEventListener("change", function (e) { filter.sort = e.target.value; renderGrid(); });

  var floors = "";
  for (var f = 0; f <= CONFIG.maxFloor; f++) floors += '<option value="' + f + '">' + floorName(f) + "</option>";
  $("#floor").innerHTML = floors;
  $("#floor").addEventListener("change", function (e) { delivery.floor = +e.target.value; persist(); });
  $("#lift").addEventListener("change", function (e) { delivery.lift = e.target.checked; persist(); });

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
  renderRooms();
  renderGrid();
  renderPlants();
  renderCart();
})();
