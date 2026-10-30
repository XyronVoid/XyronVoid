/* ===== dewly. — Store logic =====
 * Edit the SETTINGS block (CONFIG, PRODUCTS, INGREDIENTS, SAMPLES) to make this store your own.
 */
(function () {
  "use strict";

  /* ================= SETTINGS — edit these ================= */
  var CONFIG = {
    whatsapp: "919876543210",  // Orders go here: country code + number, no "+" or spaces
    freeShippingAt: 499,
    shippingFee: 49,
    samplesAt: 999,            // Free samples unlock above this amount
    samplesCount: 2,
    routineOff: 0.15,          // Skin-quiz routine discount
    bundleOff: 0.20,           // "Pick any 3" discount
    subscribeOff: 0.10         // Subscribe & save discount
  };

  var CONCERNS = [
    { key: "acne",      label: "Acne & breakouts", icon: "🫧" },
    { key: "dullness",  label: "Dullness",         icon: "✨" },
    { key: "darkspots", label: "Dark spots",       icon: "🌗" },
    { key: "dryness",   label: "Dryness",          icon: "💧" },
    { key: "oil",       label: "Oil control",      icon: "🍃" },
    { key: "ageing",    label: "Fine lines",       icon: "⏳" }
  ];

  var INGREDIENTS = [
    { key: "niacinamide", name: "Niacinamide",     icon: "🌿", bg: "#dcebd8", text: "Vitamin B3 that controls oil, refines pores and fades post-acne marks." },
    { key: "hyaluronic",  name: "Hyaluronic Acid", icon: "💧", bg: "#dfeaf7", text: "Holds up to 1000× its weight in water for plump, bouncy skin." },
    { key: "ceramides",   name: "Ceramides",       icon: "🧱", bg: "#f3e3d3", text: "Lipids that repair your skin barrier and lock in moisture." },
    { key: "peptides",    name: "Peptides",        icon: "🧬", bg: "#e9e0f3", text: "Signal skin to make more collagen, softening fine lines over time." },
    { key: "oat",         name: "Colloidal Oat",   icon: "🌾", bg: "#f6efe2", text: "Calms itchy, sensitive skin and cleanses without stripping." },
    { key: "spf",         name: "Zinc & SPF 50",   icon: "☀️", bg: "#fff1c9", text: "Broad-spectrum PA++++ protection, with no white cast." }
  ];

  // img: product photo in the images/ folder (replace with your own photos).
  // shape + tint: a drawn pack that shows only if the photo can't load.
  // ings: key ingredients (the first one is shown on the card).
  var PRODUCTS = [
    { id: 1, name: "Gentle Cleansing Bar",   label: "Cleansing Bar",   sub: "Oat + Ceramides, soap-free",   step: "Cleanser",    img: "images/cleansing-bar.jpg",     shape: "jar",     tint: "#f1dfcc", sizes: [["100 g", 299], ["3 × 100 g", 799]], rating: 4.8, reviews: 2140, concerns: ["dryness"],                      types: ["all"],                             ings: ["oat", "ceramides"],       tag: "New" },
    { id: 2, name: "10% Niacinamide Serum",  label: "Niacinamide 10%", sub: "Niacinamide + Zinc",           step: "Serum",       img: "images/niacinamide-serum.jpg", shape: "dropper", tint: "#eef0f2", sizes: [["30 ml", 549], ["50 ml", 799]],     rating: 4.9, reviews: 4210, concerns: ["acne", "oil", "darkspots"],     types: ["oily", "combination"],             ings: ["niacinamide"],            tag: "Bestseller" },
    { id: 3, name: "Hydra Night Serum",      label: "Hydra Night",     sub: "Hyaluronic Acid + Peptides",   step: "Serum",       img: "images/hydra-night-serum.jpg", shape: "bottle",  tint: "#cfd8f2", sizes: [["30 ml", 699], ["50 ml", 999]],     rating: 4.8, reviews: 2950, concerns: ["dullness", "dryness", "ageing"], types: ["dry", "sensitive", "combination"], ings: ["hyaluronic", "peptides"] },
    { id: 4, name: "Ceramide Barrier Cream", label: "Barrier Cream",   sub: "5 Ceramides + Squalane",       step: "Moisturiser", img: "images/barrier-cream.jpg",     shape: "jar",     tint: "#d9dbdd", sizes: [["50 g", 499], ["100 g", 849]],      rating: 4.9, reviews: 1980, concerns: ["dryness", "ageing"],            types: ["all"],                             ings: ["ceramides", "hyaluronic"] },
    { id: 5, name: "Daily Sunscreen SPF 50", label: "SPF 50",          sub: "SPF 50 PA++++, no white cast", step: "Sunscreen",   img: "images/sunscreen.jpg",         shape: "bottle",  tint: "#ffc99a", sizes: [["50 ml", 499], ["100 ml", 849]],    rating: 4.9, reviews: 5340, concerns: ["oil", "darkspots"],             types: ["all"],                             ings: ["spf"],                    tag: "Bestseller" }
  ];

  var SAMPLES = ["Niacinamide Serum 5 ml", "Hydra Night Serum 5 ml", "Barrier Cream 10 g", "Sunscreen 10 ml", "Cleansing Bar mini"];
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

  // Pure-CSS product pack. Optional photo is layered on top; if it fails, it removes itself.
  function art(p) {
    return '<div class="art ' + p.shape + '" style="--tint:' + p.tint + '">' +
      '<i class="cap"></i>' +
      '<div class="body"><span class="label"><b>dewly.</b><i>' + esc(p.label) + '</i><small>' + esc(p.sizes[0][0]) + '</small></span></div>' +
      '<span class="floor"></span></div>' +
      (p.img ? '<img class="photo" src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()" />' : "");
  }
  function bg(p) { return "background:" + p.tint + "66"; }

  var bag = load("dw-bag", []);
  var samples = load("dw-samples", []);
  var filter = { concern: null, type: "all", ing: null };
  var chosenSize = {};

  // Drop any saved items that no longer exist (e.g. after editing PRODUCTS)
  bag = bag.filter(function (l) { var p = byId(l.id); return p && p.sizes[l.si]; });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { t.classList.remove("show"); }, 2300);
  }

  /* ---------- Shop ---------- */
  function renderConcerns() {
    $("#concerns").innerHTML = CONCERNS.map(function (c) {
      return '<button class="concern ' + (filter.concern === c.key ? "on" : "") + '" data-concern="' + c.key + '">' + c.icon + " " + c.label + "</button>";
    }).join("");
  }

  function card(p) {
    var si = chosenSize[p.id] || 0;
    var ing = findBy(INGREDIENTS, "key", p.ings[0]);
    var sizeCtl = p.sizes.length > 1
      ? '<select class="size" data-size="' + p.id + '" aria-label="Size">' + p.sizes.map(function (s, i) { return '<option value="' + i + '"' + (i === si ? " selected" : "") + ">" + s[0] + "</option>"; }).join("") + "</select>"
      : '<span class="size">' + p.sizes[0][0] + "</span>";
    return '<article class="card">' +
      '<div class="media" style="' + bg(p) + '">' +
        (p.tag ? '<span class="tag ' + (p.tag === "Bestseller" ? "hot" : "") + '">' + p.tag + "</span>" : "") +
        art(p) +
        '<div class="hover-info"><b>' + ing.icon + " Key ingredient: " + ing.name + "</b>" + ing.text + "</div>" +
      "</div>" +
      "<h3>" + esc(p.name) + "</h3>" +
      '<p class="sub-name">' + esc(p.sub) + "</p>" +
      '<div class="rating">★ ' + p.rating + " <span>(" + p.reviews.toLocaleString("en-IN") + " reviews)</span></div>" +
      '<div class="chips">' + p.concerns.slice(0, 2).map(function (c) { return "<span>" + findBy(CONCERNS, "key", c).label + "</span>"; }).join("") + "</div>" +
      '<div class="card-foot">' + sizeCtl + '<button class="add" data-add="' + p.id + '">Add · ' + inr(p.sizes[si][1]) + "</button></div>" +
    "</article>";
  }

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) {
      return (!filter.concern || p.concerns.indexOf(filter.concern) > -1) &&
        (filter.type === "all" || p.types.indexOf("all") > -1 || p.types.indexOf(filter.type) > -1) &&
        (!filter.ing || p.ings.indexOf(filter.ing) > -1);
    });
    var ing = filter.ing ? findBy(INGREDIENTS, "key", filter.ing) : null;
    var af = $("#activeFilter");
    af.hidden = !ing;
    if (ing) af.innerHTML = "Showing products with <b>" + ing.name + "</b> <button data-clear-ing>Clear</button>";
    $("#grid").innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No match for this combination. Try another concern?</p>';
  }

  /* ---------- Bag ---------- */
  function unitPrice(l) {
    return byId(l.id).sizes[l.si][1] * (1 - (l.deal || 0)) * (l.sub ? 1 - CONFIG.subscribeOff : 1);
  }

  function addToBag(id, si, deal, quiet) {
    si = si || 0; deal = deal || 0;
    var line = null;
    for (var i = 0; i < bag.length; i++) if (bag[i].id === id && bag[i].si === si && bag[i].deal === deal) line = bag[i];
    if (line) line.qty++;
    else bag.push({ id: id, si: si, qty: 1, deal: deal, sub: false });
    persist();
    var b = $("#bagBtn");
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
    if (!quiet) toast("💕 " + byId(id).name + " added");
  }

  function persist() { save("dw-bag", bag); renderBag(); }

  function totals() {
    var full = 0, sub = 0;
    bag.forEach(function (l) { full += byId(l.id).sizes[l.si][1] * l.qty; sub += unitPrice(l) * l.qty; });
    var ship = !bag.length || sub >= CONFIG.freeShippingAt ? 0 : CONFIG.shippingFee;
    return { full: full, sub: sub, save: full - sub, ship: ship, total: sub + ship };
  }

  function dealLabel(d) {
    if (d === CONFIG.routineOff) return "Quiz routine −" + Math.round(d * 100) + "%";
    if (d === CONFIG.bundleOff) return "Pick-3 bundle −" + Math.round(d * 100) + "%";
    return "";
  }

  function renderBag() {
    var t = totals();
    var count = 0;
    bag.forEach(function (l) { count += l.qty; });
    $("#bagCount").textContent = count;

    var left = CONFIG.freeShippingAt - t.sub;
    var sLeft = CONFIG.samplesAt - t.sub;
    $("#shipMsg").innerHTML = left > 0
      ? "You're <b>" + inr(left) + "</b> away from free shipping"
      : sLeft > 0 ? "✓ Free shipping! Add <b>" + inr(sLeft) + "</b> more for " + CONFIG.samplesCount + " free samples"
      : "🎁 Free shipping + " + CONFIG.samplesCount + " free samples unlocked!";
    $("#shipBar").style.width = Math.min(100, (t.sub / CONFIG.samplesAt) * 100) + "%";

    if (t.sub < CONFIG.samplesAt && samples.length) { samples = []; save("dw-samples", samples); }

    if (!bag.length) {
      $("#bagBody").innerHTML = '<div class="bag-empty"><span>🧴</span><p>Your bag is feeling a little dry…</p><a href="#quiz" class="btn btn-plum" data-close>Take the skin quiz</a></div>';
      $("#bagFoot").hidden = true;
      return;
    }
    $("#bagFoot").hidden = false;

    $("#bagBody").innerHTML = bag.map(function (l, i) {
      var p = byId(l.id);
      var base = p.sizes[l.si][1] * l.qty;
      var now = unitPrice(l) * l.qty;
      return '<div class="item">' +
        '<div class="thumb" style="' + bg(p) + '">' + art(p) + "</div>" +
        "<div><b>" + esc(p.name) + "</b><small>" + p.sizes[l.si][0] + "</small>" + (l.deal ? '<span class="deal">' + dealLabel(l.deal) + "</span>" : "") + "</div>" +
        '<div class="item-r"><span class="p">' + (now < base - 0.5 ? "<s>" + inr(base) + "</s>" : "") + inr(now) + "</span>" +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div></div>' +
        '<label class="subscribe"><input type="checkbox" data-sub="' + i + '"' + (l.sub ? " checked" : "") + " /> 🔁 Deliver every month &amp; <b>save " + Math.round(CONFIG.subscribeOff * 100) + "%</b></label>" +
      "</div>";
    }).join("") + samplesBox(t);

    $("#bSub").textContent = inr(t.full);
    $("#bSaveRow").hidden = t.save < 1;
    $("#bSave").textContent = "−" + inr(t.save);
    $("#bShip").textContent = t.ship ? inr(t.ship) : "FREE";
    $("#bTotal").textContent = inr(t.total);
  }

  function samplesBox(t) {
    var unlocked = t.sub >= CONFIG.samplesAt;
    return '<div class="samples"><h4>🎁 Pick ' + CONFIG.samplesCount + " free samples</h4>" +
      "<p>" + (unlocked ? samples.length + "/" + CONFIG.samplesCount + " chosen" : "Unlocks at " + inr(CONFIG.samplesAt)) + "</p>" +
      '<div class="sample-list">' + SAMPLES.map(function (s) {
        var on = samples.indexOf(s) > -1;
        var disabled = !unlocked || (!on && samples.length >= CONFIG.samplesCount);
        return '<button class="' + (on ? "on" : "") + '" data-sample="' + esc(s) + '"' + (disabled ? " disabled" : "") + ">" + esc(s) + "</button>";
      }).join("") + "</div></div>";
  }

  function checkout() {
    var t = totals();
    var lines = bag.map(function (l) {
      var p = byId(l.id);
      var tags = [];
      if (l.deal === CONFIG.routineOff) tags.push("quiz routine");
      if (l.deal === CONFIG.bundleOff) tags.push("pick-3 bundle");
      if (l.sub) tags.push("monthly subscription");
      return "• " + p.name + " (" + p.sizes[l.si][0] + ") × " + l.qty + " = " + inr(unitPrice(l) * l.qty) + (tags.length ? " [" + tags.join(", ") + "]" : "");
    });
    var msg = "Hi dewly! 💕 I'd like to order:\n\n" + lines.join("\n") + "\n";
    if (samples.length) msg += "\n🎁 Free samples: " + samples.join(", ");
    if (t.save >= 1) msg += "\nYou saved: " + inr(t.save);
    msg += "\nShipping: " + (t.ship ? inr(t.ship) : "FREE") + "\n*Total: " + inr(t.total) + "*";
    var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
    var w = window.open(url, "_blank");
    if (!w) location.href = url; // popup blocked (e.g. in-app browsers)
  }

  /* ---------- Skin quiz ---------- */
  var QUESTIONS = [
    { key: "type", q: "How does your skin feel by midday?", opts: [
      ["oily", "💦", "Shiny all over", "Oily skin"], ["dry", "🏜️", "Tight or flaky", "Dry skin"],
      ["combination", "☯️", "Oily T-zone, dry cheeks", "Combination skin"], ["sensitive", "🌸", "Red or itchy easily", "Sensitive skin"] ] },
    { key: "concern", q: "What's your #1 skin concern?", opts: [
      ["acne", "🫧", "Acne & breakouts", ""], ["dullness", "✨", "Dull, tired skin", ""],
      ["darkspots", "🌗", "Dark spots & tan", ""], ["ageing", "⏳", "Fine lines", ""] ] },
    { key: "time", q: "How much time do you give your skin?", opts: [
      ["minimal", "⚡", "Keep it quick", "3 steps"], ["full", "🧖‍♀️", "I love a ritual", "4 steps"] ] },
    { key: "sun", q: "How much sun do you get?", opts: [
      ["outdoor", "☀️", "Outdoors a lot", "Commute, college, field work"], ["indoor", "🏠", "Mostly indoors", "Office or home"] ] }
  ];
  var quiz = { step: 0, answers: {} };

  // Product ids: 1 cleanser, 2 niacinamide serum, 3 hydra serum, 4 barrier cream, 5 sunscreen
  function buildRoutine(a) {
    var serum = (a.concern === "acne" || a.concern === "darkspots") && a.type !== "dry" ? 2 : 3;
    return a.time === "minimal" ? [1, serum, 5] : [1, serum, 4, 5];
  }


  function renderQuiz() {
    var box = $("#quizCard");
    var done = quiz.step >= QUESTIONS.length;
    $("#quizBar").style.width = (Math.min(quiz.step, QUESTIONS.length) / QUESTIONS.length) * 100 + "%";
    $("#quizStep").textContent = done ? "Your routine is ready ✨" : "Question " + (quiz.step + 1) + " of " + QUESTIONS.length;

    if (!done) {
      var q = QUESTIONS[quiz.step];
      box.innerHTML = "<h3>" + q.q + "</h3>" +
        '<div class="options">' + q.opts.map(function (o, i) {
          return '<button class="opt" style="animation-delay:' + i * 0.05 + 's" data-answer="' + o[0] + '"><span>' + o[1] + "</span><div>" + o[2] + (o[3] ? "<small>" + o[3] + "</small>" : "") + "</div></button>";
        }).join("") + "</div>" +
        (quiz.step ? '<button class="quiz-back" data-quiz-back>← Back</button>' : "");
      return;
    }

    var ids = buildRoutine(quiz.answers);
    var full = 0;
    ids.forEach(function (id) { full += byId(id).sizes[0][1]; });
    var typeOpt = QUESTIONS[0].opts.filter(function (o) { return o[0] === quiz.answers.type; })[0];
    var concernLabel = findBy(CONCERNS, "key", quiz.answers.concern).label.toLowerCase();
    box.innerHTML =
      '<div class="result-top"><div><h3>Your ' + ids.length + "-step routine</h3><p>For " + typeOpt[3].toLowerCase() + " focused on " + concernLabel + "</p></div>" +
      '<span class="save-pill">' + Math.round(CONFIG.routineOff * 100) + "% OFF</span></div>" +
      '<div class="routine">' + ids.map(function (id, i) {
        var p = byId(id);
        return '<div class="step"><i>' + (i + 1) + '</i><div class="thumb" style="' + bg(p) + '">' + art(p) + "</div><div><b>" + esc(p.name) + "</b><small>" + p.step + " · " + esc(p.sub) + '</small></div><span class="p">' + inr(p.sizes[0][1]) + "</span></div>";
      }).join("") + "</div>" +
      '<div class="result-total"><span>Routine total</span><span><s>' + inr(full) + "</s><b>" + inr(full * (1 - CONFIG.routineOff)) + "</b></span></div>" +
      '<button class="btn btn-plum btn-full" data-add-routine="' + ids.join(",") + '">Add my routine to bag</button>' +
      '<button class="quiz-back" data-quiz-restart>↺ Retake quiz</button>';
  }

  /* ---------- Bundle builder ---------- */
  var picks = [];
  function renderBundle() {
    $("#bundlePicks").innerHTML = PRODUCTS.map(function (p) {
      return '<button class="pick ' + (picks.indexOf(p.id) > -1 ? "on" : "") + '" data-pick="' + p.id + '">' +
        '<span class="check">✓</span>' +
        '<div class="media" style="' + bg(p) + '">' + art(p) + "</div>" +
        "<b>" + esc(p.name) + "</b><small>" + p.step + " · " + inr(p.sizes[0][1]) + "</small></button>";
    }).join("");

    $("#slots").innerHTML = [0, 1, 2].map(function (i) {
      var p = byId(picks[i]);
      return p
        ? '<div class="slot filled"><div class="thumb" style="background:' + p.tint + '">' + art(p) + "</div><span>" + esc(p.name) + '</span><button data-unpick="' + p.id + '" aria-label="Remove">✕</button></div>'
        : '<div class="slot">✦ Pick product ' + (i + 1) + "</div>";
    }).join("");

    var full = 0;
    picks.forEach(function (id) { full += byId(id).sizes[0][1]; });
    var complete = picks.length === 3;
    $("#bundleTotal").innerHTML = picks.length
      ? "<span>" + (complete ? "Bundle price" : (3 - picks.length) + " more to unlock " + Math.round(CONFIG.bundleOff * 100) + "% off") + "</span><span>" + (complete ? "<s>" + inr(full) + "</s>" : "") + "<b>" + inr(complete ? full * (1 - CONFIG.bundleOff) : full) + "</b></span>"
      : "";
    var btn = $("#addBundle");
    btn.disabled = !complete;
    btn.textContent = complete ? "Add bundle to bag" : "Pick " + (3 - picks.length) + " more";
  }

  /* ---------- Ingredients ---------- */
  $("#ingredientList").innerHTML = INGREDIENTS.map(function (i) {
    var n = PRODUCTS.filter(function (p) { return p.ings.indexOf(i.key) > -1; }).length;
    return '<button class="ing" data-ing="' + i.key + '"><div class="ico" style="background:' + i.bg + '">' + i.icon + "</div><h3>" + i.name + "</h3><p>" + i.text + "</p><small>See " + n + " product" + (n === 1 ? "" : "s") + " →</small></button>";
  }).join("");

  /* ---------- Before / after ---------- */
  function setBA(v) { $("#ba").style.setProperty("--pos", v + "%"); }
  $("#baRange").addEventListener("input", function (e) { setBA(e.target.value); });

  /* ---------- Overlays ---------- */
  function openBag() { $("#bag").classList.add("open"); $("#scrim").classList.add("show"); }
  function closeAll() {
    $("#bag").classList.remove("open");
    $("#nav").classList.remove("open");
    $("#scrim").classList.remove("show");
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-concern],[data-add],[data-answer],[data-quiz-back],[data-quiz-restart],[data-add-routine],[data-pick],[data-unpick],[data-ing],[data-clear-ing],[data-q],[data-sample],[data-close]");
    if (!el) return;
    var d = el.dataset;

    if (d.concern) { filter.concern = filter.concern === d.concern ? null : d.concern; renderConcerns(); renderGrid(); return; }
    if (d.add) { addToBag(+d.add, chosenSize[+d.add] || 0, 0); return; }
    if (d.answer) { quiz.answers[QUESTIONS[quiz.step].key] = d.answer; quiz.step++; renderQuiz(); return; }
    if ("quizBack" in d) { quiz.step--; renderQuiz(); return; }
    if ("quizRestart" in d) { quiz = { step: 0, answers: {} }; renderQuiz(); return; }
    if (d.addRoutine) {
      d.addRoutine.split(",").forEach(function (id) { addToBag(+id, 0, CONFIG.routineOff, true); });
      toast("✨ Routine added with " + Math.round(CONFIG.routineOff * 100) + "% off!");
      openBag();
      return;
    }
    if (d.pick) {
      var id = +d.pick;
      if (picks.indexOf(id) > -1) picks = picks.filter(function (p) { return p !== id; });
      else if (picks.length < 3) picks.push(id);
      else toast("You've picked 3 already. Remove one to swap");
      renderBundle();
      return;
    }
    if (d.unpick) { picks = picks.filter(function (p) { return p !== +d.unpick; }); renderBundle(); return; }
    if (d.ing) {
      filter.ing = d.ing; filter.concern = null; filter.type = "all";
      $("#typeSelect").value = "all";
      renderConcerns();
      renderGrid();
      $("#shop").scrollIntoView({ behavior: "smooth" });
      return;
    }
    if ("clearIng" in d) { filter.ing = null; renderGrid(); return; }
    if (d.q) {
      var l = bag[+d.q];
      l.qty += +d.d;
      if (l.qty < 1) bag.splice(+d.q, 1);
      persist();
      return;
    }
    if (d.sample) {
      var s = d.sample;
      samples = samples.indexOf(s) > -1 ? samples.filter(function (x) { return x !== s; }) : samples.concat([s]).slice(0, CONFIG.samplesCount);
      save("dw-samples", samples);
      renderBag();
      return;
    }
    if ("close" in d) closeAll();
  });

  document.addEventListener("change", function (e) {
    var d = e.target.dataset || {};
    if (d.size) {
      chosenSize[+d.size] = +e.target.value;
      var btn = e.target.closest(".card-foot").querySelector(".add");
      btn.textContent = "Add · " + inr(byId(+d.size).sizes[+e.target.value][1]);
    }
    if (d.sub) {
      bag[+d.sub].sub = e.target.checked;
      persist();
      if (e.target.checked) toast("🔁 Subscribed! You save " + Math.round(CONFIG.subscribeOff * 100) + "% every month");
    }
  });

  $("#addBundle").addEventListener("click", function () {
    picks.forEach(function (id) { addToBag(id, 0, CONFIG.bundleOff, true); });
    picks = [];
    renderBundle();
    toast("🎉 Bundle added with " + Math.round(CONFIG.bundleOff * 100) + "% off!");
    openBag();
  });
  $("#typeSelect").addEventListener("change", function (e) { filter.type = e.target.value; renderGrid(); });
  $("#bagBtn").addEventListener("click", openBag);
  $("#scrim").addEventListener("click", closeAll);
  $("#checkout").addEventListener("click", checkout);
  $("#menuBtn").addEventListener("click", function () { $("#nav").classList.add("open"); $("#scrim").classList.add("show"); });
  $$("#nav a").forEach(function (a) { a.addEventListener("click", closeAll); });
  $("#newsForm").addEventListener("submit", function (e) { e.preventDefault(); e.target.reset(); toast("💌 Welcome to the dew club! Check your inbox"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  window.addEventListener("scroll", function () { $("#header").classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderConcerns();
  renderGrid();
  renderQuiz();
  renderBundle();
  renderBag();
})();
