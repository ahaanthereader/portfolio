/* ---- Ahaan's Country Book: the book viewer ----
   The book has a cover, a contents page, and one page for each entry in assets/country-data.js.
   The pages are in A to Z order. Previous, Next and the left and right arrow keys turn the pages.
   The book has no sound. Nothing moves by itself. A page turn shows a short slide only when the
   system allows motion and Motion is not off. ---- */
(() => {
  const root = document.getElementById("cb");
  if (!root || !Array.isArray(window.COUNTRY_BOOK)) return;

  const byName = (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  const BOOK = window.COUNTRY_BOOK.slice().sort(byName);
  const TOTAL = BOOK.length;
  const COVER = 0, CONTENTS = 1, FIRST = 2, LAST = FIRST + TOTAL - 1;

  const pageEl = document.getElementById("cbPage");
  const numEl = document.getElementById("cbNum");
  const prevBtn = document.getElementById("cbPrev");
  const nextBtn = document.getElementById("cbNext");
  const contentsBtn = document.getElementById("cbContentsBtn");

  // Simple text for search and for the address: no accents, lower case.
  const plain = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const slug = s => plain(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const motionOK = () => !matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.dataset.motion !== "off";

  let current = COVER;

  /* ---------- page templates ---------- */
  function coverHTML() {
    const sample = ["India", "Singapore", "Japan", "Brazil", "Kenya", "Canada"]
      .map(n => BOOK.find(c => c.name === n)).filter(Boolean)
      .map(c => '<span aria-hidden="true">' + c.flag + "</span>").join("");
    return '<div class="cb-cover">' +
      '<p class="cb-cover-flags">' + sample + "</p>" +
      '<h3 class="cb-cover-title" tabindex="-1">Ahaan\'s Country Book</h3>' +
      '<p class="cb-cover-sub">' + TOTAL + " countries and places</p>" +
      '<p class="cb-cover-by">By Ahaan</p>' +
      '<div class="cb-cover-actions">' +
        '<button type="button" class="cb-btn" data-go="contents">Open the contents</button>' +
        '<button type="button" class="cb-btn ghost" data-go="first">Start at page 1</button>' +
      "</div>" +
      '<p><a class="cb-link" href="geography.html">🗺️ See the map</a></p>' +
    "</div>";
  }

  function contentsHTML() {
    let html = '<div class="cb-contents">' +
      '<h3 class="cb-contents-title" tabindex="-1">Contents</h3>' +
      '<label class="cb-search-label" for="cbSearch">Find a country, a place or a capital</label>' +
      '<input type="search" id="cbSearch" class="cb-search" autocomplete="off" spellcheck="false" placeholder="Type a name…" />' +
      '<p class="cb-search-msg" id="cbSearchMsg" aria-live="polite"></p>' +
      '<div class="cb-list" id="cbList">';
    let letter = "";
    BOOK.forEach((c, i) => {
      const L = plain(c.name)[0].toUpperCase();
      if (L !== letter) {
        if (letter) html += "</ul></div>";
        letter = L;
        html += '<div class="cb-letter" data-letter="' + L + '"><h4>' + L + "</h4><ul>";
      }
      html += '<li data-find="' + esc(plain(c.name + " " + c.capital)) + '">' +
        '<button type="button" class="cb-item" data-page="' + (FIRST + i) + '">' +
        '<span class="cb-item-name">' + esc(c.name) + "</span>" +
        '<span class="cb-item-cap">' + esc(c.capital) + "</span>" +
        '<span class="cb-item-num">' + (i + 1) + "</span></button></li>";
    });
    return html + "</ul></div></div></div>";
  }

  function countryHTML(c, n) {
    const stripes = c.colors.map(col => '<span style="background:' + esc(col) + '"></span>').join("");
    const kind = c.kind === "place" ? "A place in " : "A country in ";
    const row = (label, value) => "<div><dt>" + label + "</dt><dd>" + esc(value) + "</dd></div>";
    return '<article class="cb-country" aria-labelledby="cbName"><div class="cb-left">' +
      '<h3 class="cb-name" id="cbName" tabindex="-1">' + esc(c.name) + "</h3>" +
      '<p class="cb-kind">' + kind + esc(c.continent) + ".</p>" +
      (c.note ? '<p class="cb-note">' + esc(c.note) + "</p>" : "") +
      '<div class="cb-flagrow">' +
        '<div class="cb-stripes" role="img" aria-label="The three main flag colours">' + stripes + "</div>" +
        '<span class="cb-emoji" aria-hidden="true">' + c.flag + "</span>" +
      "</div>" +
      '<div class="cb-cap"><span class="cb-cap-label">' + esc(c.capLabel || "Capital") + '</span><span class="cb-cap-name' + (c.capital.length > 28 ? " long" : "") + '">' + esc(c.capital) + "</span></div>" +
      "</div>" +
      '<dl class="cb-facts">' +
        row("Continent", c.continent) +
        row("Language", c.language) +
        row("Currency", c.currency) +
        row("Famous place", c.famous) +
        row("Fun fact", c.fact) +
      "</dl>" +
      '<p class="cb-pageno" aria-hidden="true">' + n + "</p>" +
    "</article>";
  }

  /* ---------- show a page ---------- */
  function hashFor(p) {
    if (p === COVER) return "cover";
    if (p === CONTENTS) return "contents";
    return slug(BOOK[p - FIRST].name);
  }
  function pageFromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h === "contents") return CONTENTS;
    const i = BOOK.findIndex(c => slug(c.name) === h);
    return i >= 0 ? FIRST + i : COVER;
  }

  function show(p, opts) {
    opts = opts || {};
    p = Math.max(COVER, Math.min(LAST, p));
    const had = document.activeElement;
    const hadInPage = !!(had && pageEl.contains(had));
    const dir = p > current ? "next" : p < current ? "prev" : "";
    current = p;

    if (p === COVER) pageEl.innerHTML = coverHTML();
    else if (p === CONTENTS) { pageEl.innerHTML = contentsHTML(); wireContents(); }
    else pageEl.innerHTML = countryHTML(BOOK[p - FIRST], p - FIRST + 1);
    pageEl.scrollTop = 0;

    if (p === COVER) numEl.textContent = "Cover";
    else if (p === CONTENTS) numEl.textContent = "Contents";
    else numEl.textContent = "Page " + (p - FIRST + 1) + " of " + TOTAL;

    prevBtn.disabled = p === COVER;
    nextBtn.disabled = p === LAST;
    contentsBtn.disabled = p === CONTENTS;

    try { history.replaceState(null, "", "#" + hashFor(p)); } catch (e) {}

    // The page-turn slide plays only when motion is allowed. Reduced motion: no animation.
    pageEl.classList.remove("turn-next", "turn-prev");
    if (dir && motionOK() && !opts.still) { void pageEl.offsetWidth; pageEl.classList.add("turn-" + dir); }

    // Move focus to the page heading only after a jump. Previous and Next keep focus on the button.
    // A page change also removes old page content. If focus was in that content, move focus to the new heading.
    if (opts.focusPage || hadInPage) { const h = pageEl.querySelector("h3"); if (h) h.focus({ preventScroll: true }); }
    // A disabled button loses focus. Move focus to the other turn button so focus stays visible.
    else if (had && had.disabled && (had === prevBtn || had === nextBtn)) (had === prevBtn ? nextBtn : prevBtn).focus();
  }
  pageEl.addEventListener("animationend", () => pageEl.classList.remove("turn-next", "turn-prev"));

  /* ---------- contents search ---------- */
  function wireContents() {
    const input = document.getElementById("cbSearch"), msg = document.getElementById("cbSearchMsg");
    const items = Array.from(pageEl.querySelectorAll(".cb-list li"));
    const groups = Array.from(pageEl.querySelectorAll(".cb-letter"));
    input.addEventListener("input", () => {
      const q = plain(input.value.trim());
      let shown = 0;
      items.forEach(li => { const ok = !q || li.dataset.find.indexOf(q) >= 0; li.hidden = !ok; if (ok) shown++; });
      groups.forEach(g => { g.hidden = !g.querySelector("li:not([hidden])"); });
      msg.textContent = !q ? "" : shown ? shown + (shown === 1 ? " match. Press Enter to open it." : " matches. Press Enter to open the first one.") : "No match. Check the spelling.";
    });
    input.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const first = pageEl.querySelector(".cb-list li:not([hidden]) .cb-item");
      if (first) { e.preventDefault(); show(+first.dataset.page, { focusPage: true }); }
    });
  }

  /* ---------- controls ---------- */
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));
  contentsBtn.addEventListener("click", () => show(CONTENTS, { focusPage: true }));
  pageEl.addEventListener("click", e => {
    const item = e.target.closest(".cb-item");
    if (item) { show(+item.dataset.page, { focusPage: true }); return; }
    const go = e.target.closest("[data-go]");
    if (go) show(go.dataset.go === "contents" ? CONTENTS : FIRST, { focusPage: true });
  });

  // Left and right arrow keys turn the pages. The keys keep their normal job in a text box or a menu.
  document.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (t && t.closest && t.closest(".nav")) return;
    e.preventDefault();
    show(current + (e.key === "ArrowRight" ? 1 : -1));
  });

  window.addEventListener("hashchange", () => { const p = pageFromHash(); if (p !== current) show(p, { focusPage: true }); });

  show(pageFromHash(), { still: true });
})();
