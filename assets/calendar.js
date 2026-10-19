/* ---- Calendar: interactive, animated month view (saves to localStorage) ---- */
(() => {
  const KEY = "ahaan-calendar";
  const STICKERS = ["🌟","🎈","❤️","🎂","⚽","📚","🎹","🦖","🌈","🎉","🏊","✈️"];
  const ACTIVITIES = [
    "📚 Read a chapter up on the swing!",
    "🗺️ Learn a brand-new capital city!",
    "🎹 Make up a 5-note song on the piano!",
    "✍️ Write a page of your own story!",
    "🌍 Spin the globe and pick a country to explore!",
    "🦖 Draw the silliest dinosaur ever!",
    "🎈 Build the tallest pillow fort in the world!",
    "🏊 Swing SO high you nearly touch the clouds!",
  ];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(store));

  const now = new Date();
  const today = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  let viewY = today.y, viewM = today.m, activeSticker = STICKERS[0];

  const grid = $("#calGrid"), titleEl = $("#calTitle"), msgEl = $("#calMsg"), pick = $("#calPick");
  const keyFor = (y, m, d) => `${y}-${m + 1}-${d}`;
  const ordinal = d => { const s = ["th","st","nd","rd"], v = d % 100; return d + (s[(v - 20) % 10] || s[v] || s[0]); };

  pick.innerHTML = STICKERS.map(s => `<button class="cal-sticker" data-s="${s}">${s}</button>`).join("")
    + `<button class="cal-sticker" data-s="" title="Eraser">🧽</button>`;
  function selectSticker(s, btn) { activeSticker = s; $$(".cal-sticker", pick).forEach(b => b.classList.toggle("sel", b === btn)); }
  pick.addEventListener("click", e => { const b = e.target.closest(".cal-sticker"); if (b) selectSticker(b.dataset.s, b); });
  selectSticker(STICKERS[0], pick.querySelector(".cal-sticker"));

  function render() {
    titleEl.textContent = `${MONTHS[viewM]} ${viewY}`;
    const first = new Date(viewY, viewM, 1).getDay();
    const days = new Date(viewY, viewM + 1, 0).getDate();
    let html = "";
    for (let i = 0; i < first; i++) html += `<div class="cal-day empty"></div>`;
    for (let d = 1; d <= days; d++) {
      const dow = new Date(viewY, viewM, d).getDay();
      const isToday = viewY === today.y && viewM === today.m && d === today.d;
      const st = store[keyFor(viewY, viewM, d)] || "";
      const cls = ["cal-day"];
      if (dow === 0 || dow === 6) cls.push("weekend");
      if (isToday) cls.push("today");
      html += `<div class="${cls.join(" ")}" data-d="${d}" style="animation-delay:${(first + d) * 13}ms"><span class="dnum">${d}</span><span class="dsticker">${st}</span></div>`;
    }
    grid.innerHTML = html;
  }

  grid.addEventListener("click", e => {
    const cell = e.target.closest(".cal-day"); if (!cell || cell.classList.contains("empty")) return;
    const d = +cell.dataset.d, k = keyFor(viewY, viewM, d), stEl = cell.querySelector(".dsticker");
    if (activeSticker === "") { delete store[k]; stEl.textContent = ""; msgEl.textContent = "Wiped it clean! 🧽"; }
    else if (store[k] === activeSticker) { delete store[k]; stEl.textContent = ""; msgEl.textContent = "Sticker removed!"; }
    else {
      store[k] = activeSticker; stEl.textContent = activeSticker;
      cell.classList.remove("pop"); void cell.offsetWidth; cell.classList.add("pop");
      msgEl.textContent = `${activeSticker} on the ${ordinal(d)}! Nice!`;
      award("planner");
    }
    save();
  });

  $("#calPrev").addEventListener("click", () => { if (--viewM < 0) { viewM = 11; viewY--; } render(); });
  $("#calNext").addEventListener("click", () => { if (++viewM > 11) { viewM = 0; viewY++; } render(); });
  $("#calToday").addEventListener("click", () => { viewY = today.y; viewM = today.m; render(); msgEl.textContent = "Here's today! ⭐"; });

  $("#calSurprise").addEventListener("click", () => {
    const days = new Date(viewY, viewM + 1, 0).getDate();
    const d = 1 + Math.floor(Math.random() * days);
    const act = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
    store[keyFor(viewY, viewM, d)] = "🎲"; save(); render();
    const cell = grid.querySelector(`.cal-day[data-d="${d}"]`);
    if (cell) cell.classList.add("surprise-hit");
    msgEl.textContent = `🎲 On the ${ordinal(d)}: ${act}`;
  });

  render();
})();
