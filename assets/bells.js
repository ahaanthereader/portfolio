/* ---- Bells of the World: hanging bells on strings, soft opt-in sound, collectible stamp cards ----
   String physics: a small Verlet rope simulation written for this page (the classic Jakobsen-style
   technique). It only runs after Ahaan rings or drags a bell, settles, then stops: no idle motion.
   Facts use rounded "about" numbers; verify the marked ones before sharing widely. */
(function () {
  const BELLS = [
    { id: "japan", name: "Japan", flag: "🇯🇵", bell: "Bonshō", shape: "bonsho", c: "#5f7d6a", cd: "#3d5547",
      word: "鐘", wordLang: "ja", say: "kane",
      tone: { f: 110, decay: 3.8, peak: 0.11, partials: [[1, 1, 1], [2, 0.5, 0.8], [2.76, 0.35, 0.6], [4.07, 0.15, 0.4]] },
      stats: [["Bell", "Bonshō (temple bell)"], ["Made of", "Bronze"], ["Rung by", "Swinging a wooden log against the outside"], ["Famous one", "Chion-in temple, Kyoto: about 70 tonnes"]],
      facts: [["🎍", "On New Year's Eve, temples ring their big bell 108 times."], ["🪵", "A bonshō has no clapper inside. It is struck from the outside."], ["〰️", "Its deep hum keeps sounding long after a single strike."]],
      listen: "A very deep, slow hum." },
    { id: "china", name: "China", flag: "🇨🇳", bell: "Bianzhong", shape: "bianzhong", c: "#b08a3e", cd: "#7a5c22",
      word: "钟", wordLang: "zh", say: "zhōng",
      tone: { f: 392, decay: 2, peak: 0.09, partials: [[1, 1, 1], [2.4, 0.4, 0.6], [3.9, 0.2, 0.4]] },
      stats: [["Bell", "Bianzhong (a set of tuned bells)"], ["Made of", "Bronze"], ["Rung by", "Tapping with wooden mallets"], ["Famous one", "Marquis Yi's set: 65 bells, about 2,400 years old"]],
      facts: [["🎵", "Each of those ancient bells plays two different notes, depending on where you tap it."], ["🔔", "The Yongle Bell in Beijing weighs about 46 tonnes."], ["✍️", "The Yongle Bell is covered in more than 200,000 written characters."]],
      listen: "A bright, clear note." },
    { id: "india", name: "India", flag: "🇮🇳", bell: "Ghanta", shape: "ghanta", c: "#c99a2e", cd: "#8a6510",
      word: "घंटा", wordLang: "hi", say: "ghaṇṭā",
      tone: { f: 880, decay: 2.6, peak: 0.07, partials: [[1, 1, 1], [2.76, 0.3, 0.6], [5.4, 0.12, 0.4]] },
      stats: [["Bell", "Ghanta (temple bell)"], ["Made of", "Bell metal (copper and tin) or brass"], ["Rung by", "Pulling the clapper by hand"], ["Where", "At the doorway of many temples"]],
      facts: [["🛕", "People often ring the temple bell when they arrive."], ["🪔", "A small hand bell is rung during aarti, a prayer with lamps."], ["🧪", "Bell metal is a mix of copper and tin."]],
      listen: "A ringing, shimmering note." },
    { id: "kazakhstan", name: "Kazakhstan", flag: "🇰🇿", bell: "Qońyraw", shape: "handbell", c: "#d4a43a", cd: "#2f6fb2",
      word: "қоңырау", wordLang: "kk", say: "qoñyrau",
      tone: { f: 1046.5, decay: 1.1, peak: 0.06, repeat: 3, gap: 0.13, partials: [[1, 1, 1], [2, 0.25, 0.5], [3, 0.12, 0.3]] },
      stats: [["Bell", "Qońyraw (hand bell)"], ["Made of", "Metal, often brass"], ["Rung by", "Shaking it by the handle"], ["Famous moment", "The school Last Bell day"]],
      facts: [["🎒", "On the first day of school, a First Bell is rung to welcome the year."], ["🎓", "At the Last Bell ceremony, a young pupil rings a hand bell, often riding on an older student's shoulder."], ["🐫", "Long ago, Silk Road camel caravans crossed this land, and camels often wore bells."]],
      listen: "A quick, happy jingle." },
    { id: "kenya", name: "Kenya", flag: "🇰🇪", bell: "Kengele", shape: "cowbell", c: "#7a6a58", cd: "#4a3e33",
      word: "kengele", wordLang: "sw", say: "ken-GEH-leh",
      tone: { f: 523.25, decay: 0.7, peak: 0.08, repeat: 2, gap: 0.35, partials: [[1, 1, 1], [1.5, 0.5, 0.7], [2.3, 0.3, 0.5]] },
      stats: [["Bell", "Kengele"], ["Made of", "Iron or other metal"], ["Rung by", "Animals walking, or dancers moving"], ["Used for", "Hearing where the herd is"]],
      facts: [["🐄", "Herders hang bells on cattle and goats so they can hear the herd, even out of sight."], ["💃", "Some dancers wear small ankle bells that jingle with every step."], ["🗣️", "Kengele is the Swahili word for bell."]],
      listen: "A short, clanky clonk." },
    { id: "italy", name: "Italy", flag: "🇮🇹", bell: "Campana", shape: "campana", c: "#9a6a3a", cd: "#5e3d1c",
      word: "campana", wordLang: "it", say: "cam-PAH-na",
      tone: { f: 196, decay: 3.6, peak: 0.1, partials: [[1, 1, 1], [2, 0.5, 0.8], [2.4, 0.35, 0.7], [3, 0.25, 0.5], [4, 0.12, 0.4]] },
      stats: [["Bell", "Campana (church bell)"], ["Made of", "Bronze"], ["Rung by", "Swinging it in a bell tower"], ["Famous tower", "Leaning Tower of Pisa: 7 bells"]],
      facts: [["🗼", "The Leaning Tower of Pisa is really a bell tower, with seven bells."], ["📏", "St Mark's bell tower in Venice is about 99 metres tall."], ["🏭", "In the town of Agnone, one family foundry has made bells for many hundreds of years."]],
      listen: "A big, round dong." }
  ];

  const $id = id => document.getElementById(id);
  const stage = $id("belStage"), canvas = $id("belCanvas");
  if (!stage || !canvas) return;
  const ctx = canvas.getContext("2d");
  const panel = $id("belPanel"), toggle = $id("belToggle"), vol = $id("belVol"), countEl = $id("belCount"), stampsEl = $id("belStamps");
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
  const SKEY = "ahaanDoorsSound", CKEY = "ahaanBellsStamps";          // sound choice is shared with Doors
  let soundOn = false, got = [], openId = null;

  try { const s = JSON.parse(localStorage.getItem(SKEY)); if (s) { soundOn = !!s.on; if (typeof s.vol === "number") vol.value = s.vol; } } catch (e) {}
  try { const g = JSON.parse(localStorage.getItem(CKEY)); if (Array.isArray(g)) got = g.filter(id => BELLS.some(b => b.id === id)); } catch (e) {}
  const saveSound = () => { try { localStorage.setItem(SKEY, JSON.stringify({ on: soundOn, vol: +vol.value })); } catch (e) {} };
  const saveStamps = () => { try { localStorage.setItem(CKEY, JSON.stringify(got)); } catch (e) {} };
  const paintToggle = () => { toggle.setAttribute("aria-pressed", String(soundOn)); toggle.textContent = "🔔 Sound: " + (soundOn ? "on" : "off"); };
  AhaanAudio.setVolume(+vol.value / 100); AhaanAudio.setMuted(!soundOn); paintToggle();
  toggle.addEventListener("click", () => {
    soundOn = !soundOn; AhaanAudio.setMuted(!soundOn); paintToggle(); saveSound();
    if (soundOn) AhaanAudio.strike(523.25, { decay: 1.5, peak: 0.08 });   // one soft note so he hears the level
  });
  vol.addEventListener("input", () => { AhaanAudio.setVolume(+vol.value / 100); saveSound(); });

  function sound(b) {
    if (!soundOn) return;
    const t = b.tone;
    for (let i = 0; i < (t.repeat || 1); i++) AhaanAudio.strike(t.f, { when: i * (t.gap || 0), decay: t.decay, peak: t.peak, partials: t.partials });
  }

  /* ---------- rope physics ---------- */
  const SEG = 9, GRAV = 900;
  let W = 0, H = 0, S = 1, ropes = [], drag = null, raf = 0, quiet = 0, last = 0;

  function build() {
    W = stage.clientWidth; H = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S = Math.max(0.7, Math.min(1.25, W / 620));
    ropes = BELLS.map((b, i) => {
      const ax = W * (0.21 + i * 0.116), len = (H - 80 * S) * (0.55 + (i % 3) * 0.14), seg = len / SEG, pts = [];
      for (let k = 0; k <= SEG; k++) pts.push({ x: ax, y: k * seg, px: ax, py: k * seg });
      return { b, ax, seg, len, pts, glow: got.indexOf(b.id) >= 0 && openId === b.id ? 1 : 0 };
    });
    draw();
  }

  function step(dt) {
    let energy = 0;
    ropes.forEach(r => {
      const p = r.pts;
      for (let k = 1; k <= SEG; k++) {
        const q = p[k], vx = (q.x - q.px) * 0.972, vy = (q.y - q.py) * 0.972;
        q.px = q.x; q.py = q.y; q.x += vx; q.y += vy + GRAV * dt * dt;
        energy += vx * vx + vy * vy;
      }
      for (let it = 0; it < 8; it++) {
        for (let k = 0; k < SEG; k++) {
          const a = p[k], c = p[k + 1], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1e-6, diff = (d - r.seg) / d;
          if (k === 0) { c.x -= dx * diff; c.y -= dy * diff; }
          else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; c.x -= dx * diff * 0.5; c.y -= dy * diff * 0.5; }
        }
        p[0].x = r.ax; p[0].y = 0;
        if (drag && drag.rope === r) { p[SEG].x = drag.x; p[SEG].y = drag.y; }
      }
    });
    return energy;
  }

  function loop(now) {
    const dt = Math.min(1 / 30, (now - last) / 1000) || 1 / 60; last = now;
    const e = step(dt); draw();
    if (!drag && e < 0.004) { if (++quiet > 45) { raf = 0; return; } } else quiet = 0;   // settled: stop the loop
    raf = requestAnimationFrame(loop);
  }
  function wake() { if (!raf && !calm()) { last = performance.now(); quiet = 0; raf = requestAnimationFrame(loop); } }

  /* ---------- drawing (our own bell shapes) ---------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
    return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")";
  }
  function body(c, path, col, w) {
    const g = c.createLinearGradient(-w, 0, w, 0);
    g.addColorStop(0, shade(col, 0.35)); g.addColorStop(0.45, col); g.addColorStop(1, shade(col, -0.35));
    c.fillStyle = g; c.beginPath(); path(c); c.closePath(); c.fill();
    c.strokeStyle = shade(col, -0.45); c.lineWidth = 1.2; c.stroke();
  }
  const clapper = (c, y, r) => { c.fillStyle = "#4a3a2c"; c.beginPath(); c.arc(0, y, r, 0, Math.PI * 2); c.fill(); };
  const SHAPES = {
    bonsho(c, b) {
      c.fillStyle = shade(b.c, -0.4); c.fillRect(-4, 0, 8, 9);
      body(c, p => { p.moveTo(-17, 14); p.quadraticCurveTo(-17, 6, 0, 6); p.quadraticCurveTo(17, 6, 17, 14); p.lineTo(18, 58); p.quadraticCurveTo(18, 62, 14, 62); p.lineTo(-14, 62); p.quadraticCurveTo(-18, 62, -18, 58); }, b.c, 18);
      c.strokeStyle = shade(b.c, -0.35); c.lineWidth = 1.5;
      [26, 46].forEach(y => { c.beginPath(); c.moveTo(-17.5, y); c.lineTo(17.5, y); c.stroke(); });
      c.fillStyle = shade(b.c, 0.25); for (let i = -2; i <= 2; i++) for (let j = 0; j < 2; j++) { c.beginPath(); c.arc(i * 6, 15 + j * 5, 1.4, 0, Math.PI * 2); c.fill(); }
    },
    bianzhong(c, b) {
      c.fillStyle = shade(b.c, -0.4); c.fillRect(-3, 0, 6, 11);
      body(c, p => { p.moveTo(-12, 10); p.lineTo(12, 10); p.lineTo(19, 52); p.quadraticCurveTo(10, 45, 0, 54); p.quadraticCurveTo(-10, 45, -19, 52); }, b.c, 18);
      c.fillStyle = shade(b.c, 0.3); for (let i = -1; i <= 1; i++) for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(i * 6, 18 + j * 7, 1.6, 0, Math.PI * 2); c.fill(); }
    },
    ghanta(c, b) {
      c.fillStyle = shade(b.c, -0.2); c.beginPath(); c.arc(0, 6, 5, 0, Math.PI * 2); c.fill(); c.fillRect(-3, 8, 6, 7);
      body(c, p => { p.moveTo(-6, 14); p.quadraticCurveTo(-14, 16, -15, 34); p.quadraticCurveTo(-16, 48, -24, 54); p.lineTo(24, 54); p.quadraticCurveTo(16, 48, 15, 34); p.quadraticCurveTo(14, 16, 6, 14); }, b.c, 24);
      clapper(c, 57, 4);
    },
    handbell(c, b) {
      c.fillStyle = "#8a5a2c"; c.fillRect(-3, 0, 6, 17);
      c.fillStyle = b.cd; c.beginPath(); c.moveTo(-2, 13); c.lineTo(-12, 22); c.lineTo(-6, 13); c.fill(); c.beginPath(); c.moveTo(2, 13); c.lineTo(12, 22); c.lineTo(6, 13); c.fill();
      body(c, p => { p.moveTo(-8, 16); p.quadraticCurveTo(-16, 18, -16, 32); p.lineTo(-20, 46); p.lineTo(20, 46); p.lineTo(16, 32); p.quadraticCurveTo(16, 18, 8, 16); }, b.c, 20);
      clapper(c, 49, 3.5);
    },
    cowbell(c, b) {
      c.strokeStyle = "#5a4636"; c.lineWidth = 3; c.beginPath(); c.arc(0, 8, 6, Math.PI, 0); c.stroke();
      body(c, p => { p.moveTo(-10, 8); p.lineTo(10, 8); p.lineTo(16, 48); p.quadraticCurveTo(0, 51, -16, 48); }, b.c, 16);
      c.fillStyle = "#3a2e24"; c.fillRect(-3, 47, 6, 7);
    },
    campana(c, b) {
      c.fillStyle = "#6a4a2a"; c.fillRect(-15, 0, 30, 6);
      body(c, p => { p.moveTo(-9, 6); p.quadraticCurveTo(-17, 8, -17, 26); p.quadraticCurveTo(-17, 44, -27, 56); p.quadraticCurveTo(0, 60, 27, 56); p.quadraticCurveTo(17, 44, 17, 26); p.quadraticCurveTo(17, 8, 9, 6); }, b.c, 27);
      c.strokeStyle = shade(b.c, -0.35); c.lineWidth = 1.5; c.beginPath(); c.moveTo(-22, 50); c.quadraticCurveTo(0, 54, 22, 50); c.stroke();
      clapper(c, 60, 4);
    }
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ropes.forEach(r => {
      const p = r.pts;
      ctx.strokeStyle = "rgba(70,50,30,.7)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
      for (let k = 1; k < SEG; k++) ctx.quadraticCurveTo(p[k].x, p[k].y, (p[k].x + p[k + 1].x) / 2, (p[k].y + p[k + 1].y) / 2);
      ctx.lineTo(p[SEG].x, p[SEG].y); ctx.stroke();
      const a = p[SEG], q = p[SEG - 1];
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(-Math.atan2(a.x - q.x, a.y - q.y)); ctx.scale(S, S);
      if (r.glow > 0) { ctx.fillStyle = "rgba(255,232,160," + (0.55 * r.glow) + ")"; ctx.beginPath(); ctx.ellipse(0, 32, 40, 38, 0, 0, Math.PI * 2); ctx.fill(); }
      SHAPES[r.b.shape](ctx, r.b);
      ctx.restore();
    });
  }

  /* ---------- ringing, stamps, cards ---------- */
  function ring(r, fromDrag) {
    ropes.forEach(o => { o.glow = o === r ? 1 : 0; });
    if (!calm() && !fromDrag) { const l = r.pts[SEG]; l.px -= (Math.random() < 0.5 ? -1 : 1) * 7; wake(); }
    else draw();
    sound(r.b);
    openCard(r.b);
  }

  const stampBtns = {};
  function paintStamp(b) {
    const el = stampBtns[b.id], has = got.indexOf(b.id) >= 0;
    el.querySelector(".bel-post").hidden = !has;
    el.setAttribute("aria-label", "Ring the " + b.bell + " bell from " + b.name + (has ? " (stamp collected)" : ""));
  }
  const paintCount = () => { countEl.textContent = got.length === BELLS.length ? "🌍 You collected every bell stamp!" : "Stamps collected: " + got.length + " of " + BELLS.length; };
  BELLS.forEach((b, i) => {
    const el = document.createElement("button");
    el.type = "button"; el.className = "bel-stamp"; el.style.setProperty("--c", b.c); el.style.setProperty("--tilt", ((i % 3) - 1) * 1.2 + "deg");
    el.setAttribute("aria-expanded", "false"); el.setAttribute("aria-controls", "belPanel");
    el.innerHTML = '<span class="bel-flag" aria-hidden="true">' + b.flag + '</span><span class="bel-name">' + b.name + '</span><span class="bel-word" lang="' + b.wordLang + '">' + b.word + '</span><span class="bel-post" aria-hidden="true" hidden>RUNG</span>';
    el.addEventListener("click", () => ring(ropes[i]));
    stampsEl.appendChild(el); stampBtns[b.id] = el; paintStamp(b);
  });
  paintCount();

  function openCard(b) {
    openId = b.id;
    Object.keys(stampBtns).forEach(k => stampBtns[k].setAttribute("aria-expanded", String(k === b.id)));
    panel.style.setProperty("--c", b.c);
    $id("belFlag").textContent = b.flag;
    $id("belNum").textContent = "Stamp " + (BELLS.indexOf(b) + 1) + " of " + BELLS.length;
    $id("belName").textContent = b.name + " · " + b.bell;
    const stats = $id("belStats"); stats.innerHTML = "";
    b.stats.forEach(s => { const d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = s[0]; dd.textContent = s[1]; d.append(dt, dd); stats.appendChild(d); });
    const facts = $id("belFacts"); facts.innerHTML = "";
    b.facts.forEach(f => { const li = document.createElement("li"), e = document.createElement("span"), t = document.createElement("span"); e.textContent = f[0]; e.setAttribute("aria-hidden", "true"); t.textContent = f[1]; li.append(e, t); facts.appendChild(li); });
    $id("belListen").textContent = b.listen;
    const w = $id("belWord"); w.textContent = b.word; w.lang = b.wordLang;
    $id("belSay").textContent = "say it: " + b.say;
    const isNew = got.indexOf(b.id) < 0;
    if (isNew) { got.push(b.id); saveStamps(); paintStamp(b); paintCount(); }
    $id("belNew").hidden = !isNew;
    panel.hidden = false;
    if (window.AhaanBrush) AhaanBrush.card(panel, b.c, b.cd);
  }
  function closeCard() {
    panel.hidden = true; openId = null;
    Object.keys(stampBtns).forEach(k => stampBtns[k].setAttribute("aria-expanded", "false"));
    ropes.forEach(o => { o.glow = 0; }); draw();
  }
  $id("belClose").addEventListener("click", closeCard);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && openId) { const el = stampBtns[openId]; closeCard(); el.focus(); } });

  /* ---------- pointer: tap a bell to ring it, or drag it and let go ---------- */
  function hit(x, y) {
    let best = null, bd = 46 * S;
    ropes.forEach(r => { const l = r.pts[SEG], d = Math.hypot(l.x - x, l.y + 30 * S - y); if (d < bd) { bd = d; best = r; } });
    return best;
  }
  const local = e => { const rc = canvas.getBoundingClientRect(); return { x: e.clientX - rc.left, y: e.clientY - rc.top }; };
  canvas.addEventListener("pointerdown", e => {
    const p = local(e), r = hit(p.x, p.y); if (!r) return;
    if (calm()) { ring(r); return; }
    drag = { rope: r, x: p.x, y: p.y, sx: p.x, sy: p.y, moved: false };
    canvas.setPointerCapture(e.pointerId); wake();
  });
  canvas.addEventListener("pointermove", e => {
    const p = local(e);
    if (!drag) { canvas.style.cursor = hit(p.x, p.y) ? "grab" : "default"; return; }
    const r = drag.rope, dx = p.x - r.ax, dy = p.y, d = Math.hypot(dx, dy), k = d > r.len ? r.len / d : 1;   // keep within the string length
    drag.x = r.ax + dx * k; drag.y = dy * k;
    if (Math.hypot(p.x - drag.sx, p.y - drag.sy) > 6) drag.moved = true;
  });
  const release = () => { if (!drag) return; const r = drag.rope, moved = drag.moved; drag = null; ring(r, moved); };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", () => { drag = null; });

  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });
  build();
})();
