/* Mobile proposal (sketch, not shipped). Run after shop.js has rendered.
   In the real build these become small changes inside shop.js. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* 1. Section shelf under the intro: one tap to the range */
  const cloths = ["lilac", "blue", "pink"];
  const shelf = document.createElement("nav");
  shelf.className = "jump";
  shelf.setAttribute("aria-label", "Shop sections");
  const links = $$(".category").map((sec, i) => {
    const h = $("h3", sec);
    const n = $$(".product", sec).length;
    return [`#${sec.id || (sec.id = `shelf-${i}`)}`, h.textContent.replace(/^(Handmade|3D-printed)\s+/i, ""), `${n} ${n === 1 ? "item" : "items"}`, cloths[i % 2]];
  });
  links.push(["#custom", "Custom orders", "Ask the maker", "pink"]);
  for (const [href, name, meta, c] of links) {
    const a = document.createElement("a");
    a.href = href;
    a.className = `cloth--${c}`;
    a.innerHTML = `<span class="jump__name"></span><span class="jump__meta"></span>`;
    a.firstChild.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    a.lastChild.textContent = meta;
    shelf.append(a);
  }
  $(".intro__copy").append(shelf);

  /* 2. Bundle deal reads as its own tag, not a run-on after the price */
  for (const b of $$(".product__price .bundle")) {
    b.textContent = b.textContent.replace(/^\s*·\s*/, "");
    b.closest(".product__price").after(b);
  }

  /* 3. "Added" feedback on the button itself for 1.6s */
  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  for (const btn of $$("[data-add]")) {
    btn.addEventListener("click", () => {
      btn.classList.add("is-added");
      btn.innerHTML = `${check}<span>Added to your sheet</span>`;
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.classList.remove("is-added"); btn.textContent = "Add to sheet"; }, 1600);
    });
  }
})();
