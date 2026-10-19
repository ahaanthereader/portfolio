/* ---- Story Studio: write your own storybook (saves to localStorage) ---- */
(() => {
  const KEY = "ahaan-storybook";
  const STICKERS = ["🌟","🐉","🚀","🦄","🐯","🏰","🌈","🦖","🧙","🐳","🍩","⚽","🌋","🦉","👑","🎈","🐢","🌙","🦊","🛸"];
  const STARTERS = [
    "Once upon a time, in a land far away…",
    "Deep in the jungle, something moved…",
    "The spaceship landed with a thud…",
    "Nobody believed me, but I saw a dragon…",
    "On the highest swing in the park, I flew so high that…",
    "The old map had one X left to find…",
  ];

  let story = load();
  let cur = 0;

  function blank() { return { title: "", pages: [{ text: "", sticker: "🌟" }] }; }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.pages && s.pages.length) return s; } catch (e) {}
    return blank();
  }
  function save() {
    localStorage.setItem(KEY, JSON.stringify(story));
    const n = $("#saveNote"); n.classList.add("show");
    clearTimeout(save._t); save._t = setTimeout(() => n.classList.remove("show"), 1200);
  }

  // build sticker + starter palettes once
  $("#stickerRow").innerHTML = STICKERS.map(s => `<button class="sticker" data-s="${s}">${s}</button>`).join("");
  $("#starters").innerHTML = STARTERS.map((s, i) => `<button class="starter" data-i="${i}">${s.length > 32 ? s.slice(0, 30) + "…" : s}</button>`).join("");

  const titleInput = $("#storyTitle"), pageText = $("#pageText"), pageSticker = $("#pageSticker"),
        pageLabel = $("#pageLabel");

  function renderEdit() {
    const p = story.pages[cur];
    titleInput.value = story.title;
    pageText.value = p.text;
    pageSticker.textContent = p.sticker;
    pageLabel.textContent = `Page ${cur + 1} of ${story.pages.length}`;
    $$(".sticker").forEach(b => b.classList.toggle("sel", b.dataset.s === p.sticker));
    $("#prevPg").disabled = cur === 0;
    $("#nextPg").disabled = cur === story.pages.length - 1;
    $("#delPg").disabled = story.pages.length === 1;
  }

  titleInput.addEventListener("input", () => { story.title = titleInput.value; save(); });
  pageText.addEventListener("input", () => { story.pages[cur].text = pageText.value; save(); if (pageText.value.trim()) award("storyteller"); });
  $("#stickerRow").addEventListener("click", e => {
    const b = e.target.closest(".sticker"); if (!b) return;
    story.pages[cur].sticker = b.dataset.s; pageSticker.textContent = b.dataset.s;
    $$(".sticker").forEach(x => x.classList.toggle("sel", x === b)); save();
  });
  $("#starters").addEventListener("click", e => {
    const b = e.target.closest(".starter"); if (!b) return;
    const text = STARTERS[+b.dataset.i];
    pageText.value = (pageText.value ? pageText.value + " " : "") + text;
    story.pages[cur].text = pageText.value; pageText.focus(); save();
  });

  $("#addPg").addEventListener("click", () => { story.pages.splice(cur + 1, 0, { text: "", sticker: "🌟" }); cur++; renderEdit(); save(); });
  $("#delPg").addEventListener("click", () => {
    if (story.pages.length === 1) return;
    story.pages.splice(cur, 1); cur = Math.max(0, cur - 1); renderEdit(); save();
  });
  $("#prevPg").addEventListener("click", () => { if (cur > 0) { cur--; renderEdit(); } });
  $("#nextPg").addEventListener("click", () => { if (cur < story.pages.length - 1) { cur++; renderEdit(); } });
  $("#newBook").addEventListener("click", () => {
    if (!confirm("Start a brand new story? Your current one will be cleared.")) return;
    story = blank(); cur = 0; renderEdit(); save();
  });

  /* read mode: page 0 = cover, then one page per story page */
  let rp = 0;
  function renderRead() {
    const total = story.pages.length + 1; // +1 cover
    const stk = $("#sbSticker"), txt = $("#sbText"), num = $("#sbPageNum");
    if (rp === 0) {
      stk.textContent = "📖";
      txt.textContent = story.title || "My Storybook";
      txt.classList.add("cover");
      num.textContent = "by Ahaan";
    } else {
      const p = story.pages[rp - 1];
      stk.textContent = p.sticker;
      txt.textContent = p.text || "…";
      txt.classList.remove("cover");
      num.textContent = `Page ${rp} of ${story.pages.length}`;
    }
    $("#sbPrev").disabled = rp === 0;
    $("#sbNext").disabled = rp === total - 1;
  }
  $("#readBook").addEventListener("click", () => { rp = 0; $("#studioEdit").hidden = true; $("#studioRead").hidden = false; renderRead(); });
  $("#backToEdit").addEventListener("click", () => { $("#studioRead").hidden = true; $("#studioEdit").hidden = false; renderEdit(); });
  $("#sbPrev").addEventListener("click", () => { if (rp > 0) { rp--; renderRead(); } });
  $("#sbNext").addEventListener("click", () => { if (rp < story.pages.length) { rp++; renderRead(); } });

  renderEdit();
})();
