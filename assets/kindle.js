/* ---- My Reader: in-browser EPUB reader (epub.js) ---- */
(() => {
  const viewer = $("#viewer"), titleEl = $("#bookTitle"), statusEl = $("#readerStatus");
  const prevBtn = $("#prevPage"), nextBtn = $("#nextPage");
  let book = null, rendition = null, fontPct = 100;

  const fail = msg => { viewer.innerHTML = `<div class="reader-empty">😕<br>${msg}</div>`; };
  const fit = () => { if (rendition) { try { rendition.resize(viewer.clientWidth, viewer.clientHeight); } catch (e) {} } };
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(fit, 150); });

  // Lazily load the EPUB library only when a book is opened, so the page never
  // blocks on (or breaks because of) an external CDN at load time.
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error("load failed: " + src));
      document.head.appendChild(s);
    });
  }
  let epubLibPromise = null;
  function loadEpubLib() {
    if (typeof ePub !== "undefined" && typeof JSZip !== "undefined") return Promise.resolve();
    if (!epubLibPromise) {
      // JSZip MUST be defined before epub.js evaluates (epub.js binds the global
      // at load time), so load sequentially — both from the same reliable CDN.
      epubLibPromise = loadScript("https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js")
        .then(() => loadScript("https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"))
        .catch(e => { epubLibPromise = null; throw e; });
    }
    return epubLibPromise;
  }

  async function openBook(src, label) {
    award("bookworm");
    titleEl.textContent = label || "Loading…";
    viewer.innerHTML = `<div class="reader-empty">📖<br>Loading the reader…</div>`;
    try {
      await loadEpubLib();
    } catch (e) {
      fail("The reader needs the internet to load books.<br><small>Reconnect and try again.</small>");
      return;
    }
    try {
      if (rendition) rendition.destroy();
      viewer.innerHTML = "";
      titleEl.textContent = label || "Loading…";
      book = ePub(src);
      rendition = book.renderTo("viewer", { width: "100%", height: "100%", flow: "paginated", spread: "none" });
      rendition.themes.fontSize(fontPct + "%");
      // wait until the book is fully parsed before displaying the FIRST page
      book.ready
        .then(() => rendition.display(book.spine.first() && book.spine.first().href))
        .then(() => {
          statusEl.textContent = "Use the ‹ › arrows or your keyboard to turn pages.";
          // re-fit the columns to the viewer once layout has settled (epub.js sizing quirk)
          setTimeout(fit, 60);
        })
        .catch(() => fail("Hmm, that file couldn't be opened.<br><small>Make sure it's a valid .epub book.</small>"));
      book.loaded.metadata.then(m => { if (m && m.title) titleEl.textContent = m.title; }).catch(() => {});
    } catch (e) {
      fail("Hmm, that file couldn't be opened.<br><small>Make sure it's a valid .epub book.</small>");
    }
  }

  $("#epubInput").addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => openBook(ev.target.result, file.name.replace(/\.epub$/i, ""));
    reader.readAsArrayBuffer(file);
  });

  $("#builtinBooks").addEventListener("change", e => {
    const val = e.target.value;
    if (!val) return;
    if (val.startsWith("fav:")) {
      const name = val.slice(4);
      award("bookworm");
      titleEl.textContent = name + " (Ahaan's favorite!)";
      viewer.innerHTML = `<div class="reader-empty">📚<br>${name} is one of Ahaan's favorite series!<br><small>It's not free online, so open it on his Kindle — or tap 📂 Open an EPUB to load his own copy.</small></div>`;
      return;
    }
    const [path, label] = val.split("|");
    titleEl.textContent = "Loading…";
    openBook(path, label);
  });

  prevBtn.addEventListener("click", () => rendition && rendition.prev());
  nextBtn.addEventListener("click", () => rendition && rendition.next());
  document.addEventListener("keydown", e => {
    if (!rendition) return;
    const inReader = $("#reader").getBoundingClientRect();
    if (inReader.top > window.innerHeight || inReader.bottom < 0) return; // only when section on screen
    if (e.key === "ArrowLeft") rendition.prev();
    if (e.key === "ArrowRight") rendition.next();
  });

  $("#fontUp").addEventListener("click", () => { fontPct = Math.min(220, fontPct + 15); rendition && rendition.themes.fontSize(fontPct + "%"); });
  $("#fontDown").addEventListener("click", () => { fontPct = Math.max(70, fontPct - 15); rendition && rendition.themes.fontSize(fontPct + "%"); });
})();
