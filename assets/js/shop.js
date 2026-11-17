/* Choco Makes shop: catalogue, order sheet, interest requests.
   Everything the owner edits lives in data/shop.json. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");

  const DATA_URL = "data/shop.json";
  const STORE_KEY = "chocomakes.sheet.v1";
  const RECEIPT_KEY = "chocomakes.receipt.v1";
  const WEB3FORMS_URL = "https://api.web3forms.com/submit";
  const PLACEHOLDER_CONFIRMATION =
    "[Placeholder] Thanks, your order sheet has been sent to Choco Makes. (Owner: write what happens next in data/shop.json → settings.orderConfirmation.)";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  let shop = null;
  let money = null;
  let sheet = loadSheet();
  let receipt = loadReceipt();

  /* ---------- helpers ---------- */
  function formatMoney(n) {
    return money.format(n).replace(/\.00$/, "");
  }
  function newSheetNo() {
    const d = new Date();
    const mmdd = String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let tail = "";
    for (let i = 0; i < 3; i++) tail += chars[Math.floor(Math.random() * chars.length)];
    return `${mmdd}-${tail}`;
  }
  function loadSheet() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && Array.isArray(s.lines) && s.no) return s;
    } catch (_) { /* fresh sheet */ }
    return { no: newSheetNo(), lines: [] };
  }
  function saveSheet() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(sheet)); } catch (_) { /* private mode */ }
  }
  /* The customer's copy of their last sent sheet, kept until they start a new one. */
  function loadReceipt() {
    try {
      const r = JSON.parse(localStorage.getItem(RECEIPT_KEY));
      if (r && r.no && Array.isArray(r.lines)) return r;
    } catch (_) { /* none */ }
    return null;
  }
  function saveReceipt() {
    try {
      if (receipt) localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
      else localStorage.removeItem(RECEIPT_KEY);
    } catch (_) { /* private mode */ }
  }
  const showingReceipt = () => !!receipt && sheet.lines.length === 0;
  function announce(msg) {
    const el = $("[data-announce]");
    el.textContent = "";
    requestAnimationFrame(() => { el.textContent = msg; });
  }
  function el(tag, attrs = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
    }
    for (const k of kids) if (k) n.append(k);
    return n;
  }
  const icon = (d) => {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    s.append(p);
    return s;
  };
  const ICON = { minus: "M6 12h12", plus: "M12 6v12M6 12h12", x: "M7 7l10 10M17 7L7 17" };

  /* ---------- stock model ---------- */
  const product = (id) => shop.products.find((p) => p.id === id);
  const hasVariants = (p) => Array.isArray(p.variants) && p.variants.length > 0;
  function stockOf(p, variant) {
    if (hasVariants(p)) {
      const v = p.variants.find((x) => x.name === variant);
      return v ? Math.max(0, v.stock | 0) : 0;
    }
    return Math.max(0, p.stock | 0);
  }
  const totalStock = (p) => hasVariants(p) ? p.variants.reduce((a, v) => a + Math.max(0, v.stock | 0), 0) : Math.max(0, p.stock | 0);
  const lineKey = (id, variant) => `${id}::${variant || ""}`;
  const findLine = (id, variant) => sheet.lines.find((l) => lineKey(l.id, l.variant) === lineKey(id, variant));

  /* Public stock wording: exact counts stay private. */
  const lowAt = () => Number(shop.settings.lowStockAt) || 5;
  const isLow = (n) => n > 0 && n <= lowAt();
  function stockWord(n) {
    if (n <= 0) return "All gone for now";
    if (n <= 2) return "1–2 left";
    return n <= lowAt() ? "Low stock" : "In stock";
  }

  /* A bundle counts across a product's variants, and across every product
     sharing the same bundle group (e.g. any 2 fidgets for $13). */
  const dealPool = (p) => (p.bundle && p.bundle.group) || p.id;
  function dealText(p) {
    if (!p.bundle) return "";
    const { qty, price, group } = p.bundle;
    return group ? `any ${qty} ${group} for ${formatMoney(price)}` : `${qty} for ${formatMoney(price)}`;
  }

  const cents = (n) => Math.round(n * 100) / 100;
  function priceTotals() {
    let subtotal = 0, total = 0;
    const perLine = new Map();
    const pools = new Map();
    for (const l of sheet.lines) {
      const p = product(l.id);
      if (!p) continue;
      // lines show full price; bundle pricing is shown once as its own row
      perLine.set(lineKey(l.id, l.variant), l.qty * p.price);
      subtotal += l.qty * p.price;
      const key = dealPool(p);
      if (!pools.has(key)) pools.set(key, { bundle: p.bundle, label: (p.bundle && p.bundle.group) || p.name, prices: [] });
      for (let i = 0; i < l.qty; i++) pools.get(key).prices.push(p.price);
    }
    const dealTotals = [];
    for (const { bundle: b, label, prices } of pools.values()) {
      prices.sort((x, y) => y - x); // the deal covers the dearest items first
      const sum = (arr) => arr.reduce((a, x) => a + x, 0);
      const full = sum(prices);
      let t = full;
      if (b && b.qty > 1 && b.price != null) {
        const n = Math.floor(prices.length / b.qty) * b.qty;
        t = (n / b.qty) * b.price + sum(prices.slice(n));
      }
      total += t;
      if (t < full) dealTotals.push({ label, qty: prices.length, t });
    }
    subtotal = cents(subtotal); total = cents(total);
    return { subtotal, total, savings: cents(subtotal - total), perLine, dealTotals };
  }

  /* Drop lines whose product disappeared and clamp to current stock. */
  function reconcileSheet() {
    sheet.lines = sheet.lines
      .filter((l) => product(l.id) && (!hasVariants(product(l.id)) || product(l.id).variants.some((v) => v.name === l.variant)))
      .map((l) => ({ ...l, qty: Math.min(l.qty, stockOf(product(l.id), l.variant)) }))
      .filter((l) => l.qty > 0);
    saveSheet();
  }

  /* ---------- catalogue ---------- */
  const placeholder = (p, wide) => {
    const isClicker = /click/i.test(p.category || "");
    return el("div", { class: "ph-object" + (isClicker && !wide ? " ph-object--wide" : ""), text: "Photo coming soon" });
  };
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Product photos: a swipeable carousel when there's more than one. */
  function renderPhoto(target, p, wide) {
    target.textContent = "";
    const photos = p.photos && p.photos.length ? p.photos : p.photo ? [{ src: p.photo, alt: p.photoAlt || p.name }] : [];
    if (!photos.length) { target.append(placeholder(p, wide)); return; }
    const slides = photos.map((ph, i) => el("div", { class: "carousel__slide", role: "group", "aria-roledescription": "slide", "aria-label": `${i + 1} of ${photos.length}` },
      el("img", { src: ph.src, alt: ph.alt, loading: "lazy", decoding: "async", draggable: "false" })));
    const track = el("div", { class: "carousel__track" }, ...slides);
    const ph = placeholder(p, wide);
    ph.hidden = true;
    const box = el("div", { class: "carousel", role: "region", "aria-roledescription": "carousel", "aria-label": `Photos of ${p.name}` }, track, ph);
    target.append(box);
    if (photos.length < 2) return;

    track.tabIndex = 0;
    const prev = el("button", { class: "carousel__btn carousel__btn--prev", type: "button", "aria-label": "Previous photo" });
    const next = el("button", { class: "carousel__btn carousel__btn--next", type: "button", "aria-label": "Next photo" });
    prev.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
    const count = el("span", { class: "carousel__count", "aria-hidden": "true" });
    box.append(prev, next, count);

    const current = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    const update = () => {
      const i = Math.min(photos.length - 1, current());
      count.textContent = `${i + 1} / ${photos.length}`;
      prev.disabled = i === 0;
      next.disabled = i === photos.length - 1;
    };
    const goTo = (i) => {
      i = Math.max(0, Math.min(photos.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft, behavior: reduceMotion() ? "auto" : "smooth" });
    };
    prev.addEventListener("click", () => goTo(current() - 1));
    next.addEventListener("click", () => goTo(current() + 1));
    let raf = 0;
    track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    update();
    box._show = (variant) => {
      const i = photos.findIndex((x) => x.variant === variant);
      const v = hasVariants(p) ? p.variants.find((x) => x.name === variant) : null;
      const noPhoto = i < 0 && v && p.photoIsVariant;
      ph.hidden = !noPhoto;
      track.hidden = prev.hidden = next.hidden = count.hidden = noPhoto;
      if (i >= 0) goTo(i);
    };
  }

  /* When a colour is picked, jump to its photo (or show "coming soon"). */
  function showVariantPhoto(node, p, variant) {
    if (node.dataset.photoVariant === (variant || "")) return;
    const first = node.dataset.photoVariant === undefined;
    node.dataset.photoVariant = variant || "";
    const box = $("[data-media] .carousel", node);
    if (box && box._show && !first) box._show(variant);
  }

  function renderFeature() {
    const p = shop.products.find((x) => x.featured) || shop.products[0];
    const fig = $("#feature");
    const label = $("[data-feature-label]");
    if (!p) { fig.hidden = true; return; }
    fig.className = `feature cloth cloth--${p.cloth || "lilac"}`;
    const media = $("[data-feature-media]");
    media.textContent = "";
    const header = shop.settings && shop.settings.headerPhoto;
    if (header) media.append(el("img", { src: header, alt: "Stitched spines of handmade notepads, fanned out on a desk", decoding: "async" }));
    else if (p.photo) media.append(el("img", { src: p.photo, alt: p.photoAlt || p.name, decoding: "async" }));
    /* The header photo is a group shot, so the label covers the featured
       item's whole category (e.g. every notepad) rather than one product. */
    const range = header ? shop.products.filter((x) => x.category === p.category) : [p];
    const left = range.reduce((a, x) => a + totalStock(x), 0);
    const low = Math.min(...range.map((x) => x.price));
    const price = range.some((x) => x.price !== low) ? `from ${formatMoney(low)}` : formatMoney(low);
    label.textContent = "";
    label.append(
      el("a", { href: `#p-${range[0].id}` },
        el("span", { class: "label__name", text: range.length > 1 ? p.category : p.name }),
        el("span", { class: "label__meta", text: `${price}${p.bundle ? ` · ${dealText(p)}` : ""} · ${stockWord(left)}` }),
        p.photo || header ? null : el("span", { class: "label__meta", text: "Photo coming soon" })
      )
    );
  }

  function renderCatalogue() {
    const root = $("[data-catalogue]");
    root.textContent = "";
    const order = [...(shop.categories || [])];
    for (const p of shop.products) if (p.category && !order.includes(p.category)) order.push(p.category);
    const rank = (p) => { const i = order.indexOf(p.category); return i < 0 ? order.length : i; };
    const list = [...shop.products].sort((a, b) => rank(a) - rank(b));
    if (!list.length) {
      root.append(el("p", { class: "status-note", text: "Nothing listed right now. Check the updates below for the next batch." }));
      return;
    }
    /* Subsections (e.g. paper goods, fidgets) in the order they first appear. */
    const sections = new Map();
    for (const p of list) {
      const key = p.section || "";
      if (!sections.has(key)) sections.set(key, []);
      sections.get(key).push(p);
    }
    if (sections.size === 1 && sections.has("")) {
      root.append(el("div", { class: "grid" }, ...list.map(renderProduct)));
      return;
    }
    let n = 0;
    for (const [title, items] of sections) {
      const headId = `section-${++n}`;
      root.append(el("section", { class: "category", "aria-labelledby": headId },
        el("div", { class: "category__head" },
          el("h3", { id: headId, text: title || "More" }),
          el("span", { class: "category__count", text: `${items.length} ${items.length === 1 ? "item" : "items"}` })
        ),
        el("div", { class: "grid" }, ...items.map(renderProduct))
      ));
    }
  }

  function renderProduct(p) {
    const node = $("#tpl-product").content.firstElementChild.cloneNode(true);
    node.id = `p-${p.id}`;
    node.dataset.id = p.id;
    $(".product__cloth", node).classList.add(`cloth--${p.cloth || "lilac"}`);
    $("[data-tag]", node).hidden = !p.sample;
    const cat = $("[data-category]", node);
    cat.textContent = p.category || "";
    cat.hidden = !p.category;
    renderPhoto($("[data-media]", node), p);
    const nameId = `name-${p.id}`;
    const name = $("[data-name]", node);
    name.id = nameId;
    name.textContent = p.name;
    node.setAttribute("aria-labelledby", nameId);

    const price = $("[data-price]", node);
    price.append(formatMoney(p.price));
    if (p.bundle) price.append(el("span", { class: "bundle", text: ` · ${dealText(p)}` }));
    $("[data-desc]", node).textContent = p.description || "";
    if (!p.description) $("[data-desc]", node).remove();

    if (hasVariants(p)) {
      const fs = $("[data-variants]", node);
      fs.hidden = false;
      $("[data-variant-legend]", node).textContent = p.variantLabel || "Option";
      const opts = $("[data-variant-options]", node);
      const firstAvail = p.variants.find((v) => v.stock > 0) || p.variants[0];
      p.variants.forEach((v, i) => {
        const out = !(v.stock > 0);
        const input = el("input", { type: "radio", name: `v-${p.id}`, value: v.name, id: `v-${p.id}-${i}`, checked: v === firstAvail });
        const label = el("label", { class: "variant" + (out ? " is-out" : ""), for: `v-${p.id}-${i}` },
          input, el("span", { text: v.name + (out ? " (gone)" : "") }));
        input.addEventListener("change", () => syncProduct(node, p));
        opts.append(label);
      });
      const note = $("[data-variant-note]", node);
      note.textContent = p.variantNote || "";
      note.hidden = !p.variantNote;
    }

    $("[data-add]", node).addEventListener("click", () => addToSheet(p, selectedVariant(node, p)));
    const notify = $("[data-notify]", node);
    const form = $("[data-interest]", node);
    const formId = `interest-${p.id}`;
    form.id = formId;
    notify.setAttribute("aria-controls", formId);
    notify.addEventListener("click", () => {
      const open = form.hidden;
      form.hidden = !open;
      notify.setAttribute("aria-expanded", String(open));
      if (open) { notify.hidden = true; $("input[name=contact]", form).focus(); }
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); sendInterest(form, p, selectedVariant(node, p)); });

    syncProduct(node, p);
    return node;
  }

  function selectedVariant(node, p) {
    if (!hasVariants(p)) return null;
    const c = $("input[type=radio]:checked", node);
    return c ? c.value : p.variants[0].name;
  }

  /* Reflect stock vs. what's already on the sheet for one card. */
  function syncProduct(node, p) {
    const variant = selectedVariant(node, p);
    showVariantPhoto(node, p, variant);
    const stock = stockOf(p, variant);
    const onSheet = (findLine(p.id, variant) || { qty: 0 }).qty;
    const remaining = stock - onSheet;
    const allGone = totalStock(p) === 0;
    node.classList.toggle("is-soldout", allGone);
    $("[data-gone]", node).hidden = !allGone;

    const stockEl = $("[data-stock]", node);
    const what = variant ? `${variant}: ` : "";
    stockEl.classList.toggle("is-low", isLow(stock));
    stockEl.textContent = `${what}${stockWord(stock)}${stock && onSheet ? ` · ${onSheet} on your sheet` : ""}`;

    const add = $("[data-add]", node);
    const notify = $("[data-notify]", node);
    const form = $("[data-interest]", node);
    add.hidden = stock === 0;
    add.disabled = remaining <= 0;
    add.textContent = remaining <= 0 && stock > 0 ? "All on your sheet" : "Add to sheet";
    notify.hidden = stock !== 0 || !form.hidden;
    if (stock !== 0) { form.hidden = true; notify.setAttribute("aria-expanded", "false"); }
  }
  const syncAll = () => $$(".product").forEach((n) => syncProduct(n, product(n.dataset.id)));

  /* ---------- sheet ---------- */
  function addToSheet(p, variant) {
    if (receipt) { receipt = null; saveReceipt(); }
    const stock = stockOf(p, variant);
    const line = findLine(p.id, variant);
    if (line) {
      if (line.qty >= stock) return;
      line.qty += 1;
    } else {
      if (stock < 1) return;
      sheet.lines.push({ id: p.id, variant, qty: 1 });
    }
    saveSheet();
    renderSheet(true);
    syncAll();
    announce(`Added ${p.name}${variant ? `, ${variant}` : ""} to your order sheet.`);
  }

  function setQty(line, qty) {
    const p = product(line.id);
    const max = stockOf(p, line.variant);
    line.qty = Math.max(0, Math.min(qty, max));
    if (line.qty === 0) sheet.lines = sheet.lines.filter((l) => l !== line);
    saveSheet();
    renderSheet(true);
    syncAll();
  }

  function renderReceipt() {
    const r = receipt;
    const when = new Intl.DateTimeFormat(shop.settings.locale || "en-CA", { dateStyle: "long" }).format(new Date(r.sentAt));
    $("[data-receipt-meta]").textContent = `${when} · from ${r.name} · replies go to ${r.email}${r.phone ? ` or ${r.phone}` : ""}`;
    $("[data-receipt-message]").textContent = (shop.settings.orderConfirmation || "").trim() || PLACEHOLDER_CONFIRMATION;
    const list = $("[data-receipt-lines]");
    list.textContent = "";
    for (const l of r.lines) list.append(el("li", {}, el("span", { text: `${l.qty} × ${l.label}` }), el("span", { text: formatMoney(l.amount) })));
    const totals = $("[data-receipt-totals]");
    totals.textContent = "";
    const row = (dt, dd, cls) => totals.append(el("div", cls ? { class: cls } : {}, el("dt", { text: dt }), el("dd", { text: dd })));
    row("Items", formatMoney(r.subtotal));
    if (r.savings > 0) row("Bundle pricing", `\u2212${formatMoney(r.savings)}`, "totals__save");
    row("Total", `${formatMoney(r.total)} ${r.currency}`, "totals__grand");
    $("[data-receipt-notes]").hidden = !r.notes;
    $("[data-receipt-notes-text]").textContent = r.notes || "";
  }

  function renderSheet(tick) {
    const { subtotal, total, savings, perLine } = priceTotals();
    const count = sheet.lines.reduce((a, l) => a + l.qty, 0);
    const done = showingReceipt();
    const no = done ? receipt.no : sheet.no;
    $("[data-sheet-no]").textContent = `No. ${no}`;
    $("[data-slip-no]").textContent = `No. ${no}`;
    $("[data-sheet-grid]").hidden = done;
    $("[data-receipt]").hidden = !done;
    if (done) renderReceipt();
    setToggleLabel();

    const summary = $("[data-slip-summary]");
    summary.textContent = "";
    if (done) summary.append("Sent · your copy is saved");
    else if (count) summary.append(`${count} ${count === 1 ? "item" : "items"} · `, el("strong", { text: formatMoney(total) }), ` ${shop.settings.currency || "CAD"}`);
    else summary.append("Nothing added yet");
    if (tick) { summary.classList.remove("tick"); void summary.offsetWidth; summary.classList.add("tick"); }

    const list = $("[data-lines]");
    list.textContent = "";
    for (const l of sheet.lines) {
      const p = product(l.id);
      const max = stockOf(p, l.variant);
      const label = `${p.name}${l.variant ? `, ${l.variant}` : ""}`;
      const minus = el("button", { type: "button", "aria-label": `One fewer ${label}` }, icon(ICON.minus));
      const plus = el("button", { type: "button", "aria-label": `One more ${label}`, disabled: l.qty >= max }, icon(ICON.plus));
      const remove = el("button", { type: "button", class: "remove", "aria-label": `Remove ${label}` }, icon(ICON.x));
      minus.addEventListener("click", () => setQty(l, l.qty - 1));
      plus.addEventListener("click", () => setQty(l, l.qty + 1));
      remove.addEventListener("click", () => { setQty(l, 0); announce(`Removed ${label}.`); });
      const meta = `${formatMoney(p.price)} each${p.bundle ? ` · ${dealText(p)}` : ""}${l.qty >= max ? " · that's all of them" : ""}`;
      list.append(el("li", {},
        el("div", { class: "line__info" },
          el("span", { class: "line__name", text: label }),
          el("span", { class: "line__meta", text: meta })),
        el("div", { class: "stepper", role: "group", "aria-label": `Quantity of ${label}` },
          minus, el("output", { "aria-live": "polite", text: String(l.qty) }), plus),
        el("span", { class: "line__total", text: formatMoney(perLine.get(lineKey(l.id, l.variant)) || 0) }),
        remove
      ));
    }
    $("[data-empty]").hidden = count > 0;
    $("[data-totals]").hidden = count === 0;
    $("[data-subtotal]").textContent = formatMoney(subtotal);
    $("[data-savings-row]").hidden = savings <= 0;
    $("[data-savings]").textContent = `\u2212${formatMoney(savings)}`;
    $("[data-total]").textContent = `${formatMoney(total)} ${shop.settings.currency || "CAD"}`;
    $("[data-send]").disabled = count === 0;
  }

  /* ---------- slip open / close ---------- */
  const slip = $("[data-slip]");
  const sheetEl = $("[data-sheet]");
  const toggle = $("[data-toggle]");
  const isOpen = () => slip.classList.contains("is-open");
  function setToggleLabel() {
    $("[data-toggle-label]").textContent = isOpen() ? "Fold away" : showingReceipt() ? "View your copy" : "Review & send";
  }
  function openSheet() {
    if (isOpen()) return;
    sheetEl.hidden = false;
    sheetEl.classList.remove("is-leaving");
    sheetEl.classList.add("is-entering");
    slip.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    setToggleLabel();
    $("[data-sheet-title]").focus({ preventScroll: true });
  }
  function closeSheet(returnFocus = true) {
    if (!isOpen()) return;
    slip.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    setToggleLabel();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let finished = false;
    const done = () => {
      if (finished || slip.classList.contains("is-open")) return; // reopened mid-fold
      finished = true;
      sheetEl.hidden = true;
      sheetEl.classList.remove("is-leaving", "is-entering");
    };
    if (reduce) done();
    else {
      sheetEl.classList.remove("is-entering");
      sheetEl.classList.add("is-leaving");
      sheetEl.addEventListener("animationend", done, { once: true });
      setTimeout(done, 400); // backstop if animationend never arrives
    }
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener("click", () => (isOpen() ? closeSheet() : openSheet()));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) closeSheet(); });

  $("[data-receipt-print]").addEventListener("click", () => {
    document.documentElement.classList.add("printing-receipt");
    window.print();
  });
  window.addEventListener("afterprint", () => document.documentElement.classList.remove("printing-receipt"));
  $("[data-receipt-new]").addEventListener("click", () => {
    receipt = null;
    saveReceipt();
    renderSheet(false);
    $("[data-sheet-title]").focus({ preventScroll: true });
  });

  /* ---------- sending ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validContact(v) {
    v = v.trim();
    if (v.includes("@")) return EMAIL_RE.test(v);
    return v.replace(/\D/g, "").length >= 7;
  }
  function setFieldError(input, msg) {
    const err = $(`#${input.id}-error`);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    const ids = (input.getAttribute("aria-describedby") || "").split(" ").filter((x) => x && x !== err.id);
    if (msg) ids.push(err.id);
    input.setAttribute("aria-describedby", ids.join(" "));
    err.textContent = msg || "";
    err.hidden = !msg;
  }
  function accessKey() {
    return (shop.settings.web3formsAccessKey || "").trim();
  }
  async function submitToOwner(fields) {
    if (!accessKey()) throw new Error("not-configured");
    const res = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: accessKey(), from_name: "Choco Makes website", ...fields }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) throw new Error(json.message || "send-failed");
    return json;
  }
  function failureMessage(err) {
    if (err.message === "not-configured") return "Sending isn't switched on yet. The shop is still being set up, so please try again soon.";
    if (err instanceof TypeError) return "Couldn't reach the internet. Check your connection and try again. Your sheet is saved on this device.";
    return "That didn't send. Please try again in a moment. Your sheet is saved on this device.";
  }

  const orderForm = $("[data-order-form]");
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $("[data-form-status]");
    status.className = "form-status";
    status.textContent = "";
    const nameIn = $("#order-name");
    const emailIn = $("#order-email");
    const phoneIn = $("#order-phone");
    const nameOk = nameIn.value.trim().length > 0;
    const emailOk = EMAIL_RE.test(emailIn.value.trim());
    const phoneOk = !phoneIn.value.trim() || phoneIn.value.replace(/\D/g, "").length >= 7;
    setFieldError(nameIn, nameOk ? "" : "Add your name so the maker knows who the order is from.");
    setFieldError(emailIn, emailOk ? "" : "Add an email address the maker can reply to, like name@example.com.");
    setFieldError(phoneIn, phoneOk ? "" : "Check the phone number, or leave it empty.");
    if (!nameOk) return nameIn.focus();
    if (!emailOk) return emailIn.focus();
    if (!phoneOk) return phoneIn.focus();
    if (!sheet.lines.length) return;
    if ($("input[name=botcheck]", orderForm).checked) return;

    const { subtotal, total, savings, dealTotals } = priceTotals();
    const cur = shop.settings.currency || "CAD";
    const rows = sheet.lines.map((l) => {
      const p = product(l.id);
      return `${l.qty} × ${p.name}${l.variant ? ` (${l.variant})` : ""} @ ${formatMoney(p.price)}`;
    });
    const bundleRows = dealTotals.map((d) => `${d.label.charAt(0).toUpperCase()}${d.label.slice(1)}: ${d.qty} for ${formatMoney(d.t)} with bundle pricing`);
    const name = nameIn.value.trim();
    const email = emailIn.value.trim();
    const phone = phoneIn.value.trim();
    const notes = $("#order-notes").value.trim();
    const text = [
      `Order sheet No. ${sheet.no}`,
      `From: ${name}`,
      `Email: ${email}`,
      ...(phone ? [`Phone: ${phone}`] : []),
      "",
      ...rows, "",
      ...(bundleRows.length ? [...bundleRows, ""] : []),
      `Items: ${formatMoney(subtotal)}`,
      ...(savings > 0 ? [`Bundle pricing: −${formatMoney(savings)}`] : []),
      `Total: ${formatMoney(total)} ${cur}`,
      ...(notes ? ["", "Notes from the customer:", notes] : []),
    ].join("\n");

    const send = $("[data-send]");
    send.disabled = true;
    send.textContent = "Sending…";
    try {
      await submitToOwner({
        subject: `Order sheet No. ${sheet.no} from ${name}`,
        name,
        email,
        ...(phone ? { phone } : {}),
        order: text,
        ...(notes ? { notes } : {}),
        total: `${formatMoney(total)} ${cur}`,
      });
      receipt = {
        no: sheet.no, sentAt: new Date().toISOString(), name, email, phone, notes,
        lines: sheet.lines.map((l) => {
          const p = product(l.id);
          return { label: `${p.name}${l.variant ? `, ${l.variant}` : ""}`, qty: l.qty, amount: l.qty * p.price };
        }),
        subtotal, savings, total, currency: cur,
      };
      saveReceipt();
      sheet = { no: newSheetNo(), lines: [] };
      saveSheet();
      orderForm.reset();
      renderSheet(true);
      syncAll();
      $("[data-receipt-title]").focus({ preventScroll: true });
      $("[data-sheet]").scrollTop = 0;
      announce(`Order sheet No. ${receipt.no} sent. Your copy is shown on the sheet.`);
    } catch (err) {
      status.className = "form-status is-error";
      status.textContent = failureMessage(err);
    } finally {
      send.textContent = "Send order sheet";
      send.disabled = sheet.lines.length === 0;
    }
  });

  async function sendInterest(form, p, variant) {
    const input = $("input[name=contact]", form);
    const status = $(".interest__status", form);
    status.className = "interest__status";
    if (!validContact(input.value)) {
      input.setAttribute("aria-invalid", "true");
      status.classList.add("is-error");
      status.textContent = "Add a phone number or an email address.";
      return input.focus();
    }
    input.setAttribute("aria-invalid", "false");
    if ($("input[name=botcheck]", form).checked) return;
    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    status.textContent = "Sending…";
    const label = `${p.name}${variant ? ` (${variant})` : ""}`;
    try {
      const contact = input.value.trim();
      await submitToOwner({
        subject: `Interest: ${label}`,
        contact,
        ...(contact.includes("@") ? { email: contact } : {}),
        item: label,
        message: `Someone would like to know when ${label} is back.`,
      });
      status.classList.add("is-ok");
      status.textContent = "Thanks, you'll hear when it's back.";
      input.value = "";
    } catch (err) {
      status.classList.add("is-error");
      status.textContent = failureMessage(err);
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------- updates ---------- */
  function renderUpdates() {
    const list = $("[data-updates]");
    list.textContent = "";
    const items = [...(shop.updates || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!items.length) {
      list.append(el("li", {}, el("span"), el("p", { text: "No updates yet." })));
      return;
    }
    const fmt = new Intl.DateTimeFormat(shop.settings.locale || "en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
    for (const u of items) {
      const d = new Date(`${u.date}T00:00:00Z`);
      const p = el("p", { text: u.text });
      if (u.sample) p.append(el("span", { class: "is-sample", text: "Sample" }));
      list.append(el("li", {}, el("time", { datetime: u.date, text: isNaN(d) ? u.date : fmt.format(d) }), p));
    }
  }

  /* ---------- boot ---------- */
  async function boot() {
    $("[data-year]").textContent = new Date().getFullYear();
    try {
      const res = await fetch(DATA_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      shop = await res.json();
    } catch (err) {
      $("[data-catalogue]").innerHTML = "";
      $("[data-catalogue]").append(el("p", { class: "status-note is-error", text: "The shop couldn't load. Refresh the page to try again." }));
      $("[data-feature-label]").textContent = "Couldn't load the shop.";
      return;
    }
    shop.settings = shop.settings || {};
    shop.products = shop.products || [];
    money = new Intl.NumberFormat(shop.settings.locale || "en-CA", { style: "currency", currency: shop.settings.currency || "CAD" });
    reconcileSheet();
    renderFeature();
    renderCatalogue();
    renderUpdates();
    renderSheet(false);
  }
  boot();
})();
