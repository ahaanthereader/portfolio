/* ---- Doors of the World: collectible country cards (real facts; rounded "about" numbers; verify before sharing widely) ---- */
(function () {
  const COUNTRIES = [
    { id: "japan", name: "Japan", flag: "🇯🇵", lang: "ja", c: "#c0392b", cd: "#7c1f16", base: 659.25,
      crest: '<svg viewBox="0 0 120 50"><rect x="8" y="6" width="104" height="10" rx="3" fill="#e04836"/><rect x="22" y="20" width="76" height="7" rx="3" fill="#a02c1f"/><rect x="26" y="10" width="10" height="40" fill="#e04836"/><rect x="84" y="10" width="10" height="40" fill="#e04836"/></svg>',
      stats: [["Capital", "Tokyo"], ["Continent", "Asia"], ["Language", "Japanese"], ["Money", "Yen"], ["People", "about 124 million"], ["Size", "about 378,000 km²"]],
      facts: [["🏝️", "Japan is made of more than 6,800 islands."], ["🗻", "Mount Fuji is its tallest mountain, 3,776 metres high."], ["🚄", "Bullet trains (Shinkansen) have zoomed there since 1964."]],
      script: "七転び八起き", en: "“Fall down seven times, get up eight.”", note: "A Japanese proverb about never giving up.", why: "Missed a goal or a puzzle? Try again. Every try makes you stronger." },
    { id: "china", name: "China", flag: "🇨🇳", lang: "zh", c: "#c99a1c", cd: "#7a5c0a", base: 587.33,
      crest: '<svg viewBox="0 0 120 50"><path d="M8 22 L60 4 L112 22 L104 29 L60 13 L16 29 Z" fill="#e3b62c"/><path d="M24 36 L60 24 L96 36 L90 41 L60 30 L30 41 Z" fill="#c99a1c"/><rect x="55" y="30" width="10" height="20" fill="#7a5c0a"/></svg>',
      stats: [["Capital", "Beijing"], ["Continent", "Asia"], ["Language", "Mandarin Chinese"], ["Money", "Yuan (renminbi)"], ["People", "about 1.4 billion"], ["Size", "about 9.6 million km²"]],
      facts: [["🐼", "Wild giant pandas live only in China."], ["🧭", "Paper, printing, the compass and gunpowder were all invented in China."], ["🧱", "The Great Wall was built in pieces over many hundreds of years."]],
      script: "千里之行，始于足下", en: "“A journey of a thousand miles begins with a single step.”", note: "From the Tao Te Ching, written about 2,500 years ago.", why: "Big goals start small. One page a day can finish a whole book!" },
    { id: "india", name: "India", flag: "🇮🇳", lang: "sa", c: "#0e7c7b", cd: "#075251", base: 523.25,
      crest: '<svg viewBox="0 0 120 50"><path d="M30 50 L30 24 Q30 6 60 6 Q90 6 90 24 L90 50 L78 50 L78 26 Q78 17 60 17 Q42 17 42 26 L42 50 Z" fill="#12908e"/><circle cx="60" cy="35" r="9" fill="#f4b942"/></svg>',
      stats: [["Capital", "New Delhi"], ["Continent", "Asia"], ["Languages", "Hindi and English, plus many more"], ["Money", "Rupee"], ["People", "about 1.4 billion"], ["Size", "about 3.3 million km²"]],
      facts: [["♟️", "The game of chess began in India, long ago."], ["0️⃣", "Zero as a number was developed by mathematicians in India."], ["🗣️", "The Constitution recognises 22 languages."]],
      script: "वसुधैव कुटुम्बकम्", en: "“The world is one family.”", note: "From an ancient Sanskrit text, the Maha Upanishad.", why: "Be kind and curious about everyone. Friends all over the world make you wiser." },
    { id: "kazakhstan", name: "Kazakhstan", flag: "🇰🇿", lang: "kk", c: "#2f6fb2", cd: "#1a4066", base: 783.99,
      crest: '<svg viewBox="0 0 120 50"><g stroke="#e8f1fa" stroke-width="5" fill="none"><circle cx="60" cy="25" r="15"/><path d="M60 10 L60 40 M45 25 L75 25 M50 15 L70 35 M70 15 L50 35"/></g><circle cx="60" cy="25" r="5" fill="#e8f1fa"/></svg>',
      stats: [["Capital", "Astana"], ["Continent", "Mostly Asia, a little Europe"], ["Languages", "Kazakh and Russian"], ["Money", "Tenge"], ["People", "about 20 million"], ["Size", "about 2.7 million km²"]],
      facts: [["🌍", "It is the biggest landlocked country, with no sea coast at all."], ["🚀", "The first person in space, Yuri Gagarin, blasted off in 1961 from Baikonur in Kazakhstan."], ["🍎", "Wild apples grew in the mountains here. Almaty's name is linked to apples."]],
      script: "Жеті рет өлшеп, бір рет кес", en: "“Measure seven times, cut once.”", note: "A Kazakh proverb: think carefully before you act.", why: "Check your work before you finish. Careful steps lead to great results." },
    { id: "kenya", name: "Kenya", flag: "🇰🇪", lang: "sw", c: "#3f8a43", cd: "#265a2a", base: 698.46,
      crest: '<svg viewBox="0 0 120 50"><rect x="57" y="22" width="6" height="28" fill="#7a5a2a"/><ellipse cx="60" cy="18" rx="44" ry="9" fill="#5fae5a"/><ellipse cx="60" cy="12" rx="30" ry="7" fill="#7cc576"/></svg>',
      stats: [["Capital", "Nairobi"], ["Continent", "Africa"], ["Languages", "Swahili and English"], ["Money", "Kenyan shilling"], ["People", "about 55 million"], ["Size", "about 580,000 km²"]],
      facts: [["🦓", "Every year huge herds of wildebeest and zebras cross the plains in the Great Migration."], ["🏔️", "Mount Kenya is the second-highest mountain in Africa."], ["📏", "The Equator runs right through Kenya."]],
      script: "Haraka haraka haina baraka", en: "“Hurry, hurry has no blessing.”", note: "A Swahili proverb: rushing spoils things.", why: "Slow down and do it well. Your best work is not a race." },
    { id: "italy", name: "Italy", flag: "🇮🇹", lang: "it", c: "#a8642c", cd: "#6e3d17", base: 440,
      crest: '<svg viewBox="0 0 120 50"><path d="M20 50 L20 22 Q20 6 40 6 Q60 6 60 22 L60 50 L52 50 L52 24 Q52 14 40 14 Q28 14 28 24 L28 50 Z" fill="#c98a52"/><path d="M62 50 L62 22 Q62 6 82 6 Q102 6 102 22 L102 50 L94 50 L94 24 Q94 14 82 14 Q70 14 70 24 L70 50 Z" fill="#c98a52"/></svg>',
      stats: [["Capital", "Rome"], ["Continent", "Europe"], ["Language", "Italian"], ["Money", "Euro"], ["People", "about 59 million"], ["Size", "about 301,000 km²"]],
      facts: [["👢", "Italy looks like a boot on the map."], ["⛪", "The smallest country in the world, Vatican City, sits inside the city of Rome."], ["🌋", "Mount Vesuvius, a volcano, rises near the city of Naples."]],
      script: "Chi va piano va sano e va lontano", en: "“He who goes slowly goes safely, and goes far.”", note: "An Italian proverb: steady beats rushed.", why: "A little practice every day takes you a very long way." }
  ];

  const doorsEl = document.getElementById("dowDoors");
  if (!doorsEl) return;
  const $ = id => document.getElementById(id);
  const panel = $("dowPanel"), scriptEl = $("dowScript"), closeBtn = $("dowClose"), toggle = $("dowToggle"), vol = $("dowVol"), countEl = $("dowCount");
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "off";
  const SKEY = "ahaanDoorsSound", CKEY = "ahaanDoorsCards";
  let soundOn = false, openId = null, chars = [], raf = 0, mx = 0.5, got = [];

  try { const s = JSON.parse(localStorage.getItem(SKEY)); if (s) { soundOn = !!s.on; if (typeof s.vol === "number") vol.value = s.vol; } } catch (e) {}
  try { const g = JSON.parse(localStorage.getItem(CKEY)); if (Array.isArray(g)) got = g.filter(id => COUNTRIES.some(c => c.id === id)); } catch (e) {}
  const saveSound = () => { try { localStorage.setItem(SKEY, JSON.stringify({ on: soundOn, vol: +vol.value })); } catch (e) {} };
  const saveCards = () => { try { localStorage.setItem(CKEY, JSON.stringify(got)); } catch (e) {} };
  const paintToggle = () => { toggle.setAttribute("aria-pressed", String(soundOn)); toggle.textContent = "🔔 Soft chime: " + (soundOn ? "on" : "off"); };
  AhaanAudio.setVolume(+vol.value / 100); AhaanAudio.setMuted(!soundOn); paintToggle();
  toggle.addEventListener("click", () => {
    soundOn = !soundOn; AhaanAudio.setMuted(!soundOn); paintToggle(); saveSound();
    if (soundOn) AhaanAudio.bell(523.25, 0, 0.09);        // one soft note so he hears the level he chose
  });
  vol.addEventListener("input", () => { AhaanAudio.setVolume(+vol.value / 100); saveSound(); });

  const buttons = {};
  function paintDoor(ct) {
    const b = buttons[ct.id], has = got.indexOf(ct.id) >= 0;
    b.setAttribute("aria-label", "Open the door of " + ct.name + (has ? " (card collected)" : ""));
    const mark = b.querySelector(".dow-got"); if (mark) mark.hidden = !has;
  }
  function paintCount() {
    countEl.textContent = got.length === COUNTRIES.length ? "🌍 You collected every card!" : "Cards collected: " + got.length + " of " + COUNTRIES.length;
  }
  COUNTRIES.forEach(ct => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "dow-door"; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "dowPanel");
    b.innerHTML = '<span class="dow-crest" aria-hidden="true">' + ct.crest + '</span><span class="dow-leaf" style="--c:' + ct.c + ';--cd:' + ct.cd + '"><span class="dow-got" aria-hidden="true" hidden>✓</span><span class="dow-knob"></span><span class="dow-label">' + ct.name.toUpperCase() + '</span></span>';
    b.addEventListener("click", () => (openId === ct.id ? closeDoor() : openDoor(ct)));
    doorsEl.appendChild(b); buttons[ct.id] = b; paintDoor(ct);
  });
  paintCount();

  function chime(base) { [0, 7, 12].forEach((s, i) => AhaanAudio.bell(base * Math.pow(2, s / 12), i * 0.2, 0.09)); }

  function setScript(text, lang) {
    cancelAnimationFrame(raf); scriptEl.innerHTML = ""; chars = [];
    scriptEl.lang = lang; scriptEl.setAttribute("aria-label", text);
    Array.prototype.forEach.call(text, ch => { const s = document.createElement("span"); s.textContent = ch; s.setAttribute("aria-hidden", "true"); scriptEl.appendChild(s); chars.push(s); });
    if (!calm()) sway();
  }
  function sway() {                                       // runs only while a door is open, and only in default motion
    const t = performance.now() / 1000, n = chars.length;
    for (let i = 0; i < n; i++) {
      const prox = n > 1 ? Math.max(0, 1 - Math.abs(i / (n - 1) - mx) * 2.6) : 1;
      const w = Math.sin(t * 1.7 + i * 0.55) * (1.5 + 5 * prox);
      chars[i].style.transform = "translateY(" + w.toFixed(1) + "px) rotate(" + (w * 0.4).toFixed(1) + "deg)";
    }
    raf = requestAnimationFrame(sway);
  }
  panel.addEventListener("mousemove", e => { const r = scriptEl.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; });

  function openDoor(ct) {
    Object.keys(buttons).forEach(k => buttons[k].setAttribute("aria-expanded", String(k === ct.id)));
    openId = ct.id;
    panel.style.setProperty("--c", ct.c);
    $("dowFlag").textContent = ct.flag;
    $("dowNum").textContent = "Card " + (COUNTRIES.indexOf(ct) + 1) + " of " + COUNTRIES.length;
    $("dowName").textContent = ct.name;
    const stats = $("dowStats"); stats.innerHTML = "";
    ct.stats.forEach(s => { const d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = s[0]; dd.textContent = s[1]; d.appendChild(dt); d.appendChild(dd); stats.appendChild(d); });
    const facts = $("dowFacts"); facts.innerHTML = "";
    ct.facts.forEach(f => { const li = document.createElement("li"), e = document.createElement("span"), t = document.createElement("span"); e.textContent = f[0]; e.setAttribute("aria-hidden", "true"); t.textContent = f[1]; li.appendChild(e); li.appendChild(t); facts.appendChild(li); });
    $("dowEn").textContent = ct.en; $("dowNote").textContent = ct.note; $("dowWhy").textContent = ct.why;
    setScript(ct.script, ct.lang);
    const isNew = got.indexOf(ct.id) < 0;
    if (isNew) { got.push(ct.id); saveCards(); paintDoor(ct); paintCount(); }
    $("dowNew").hidden = !isNew;
    panel.hidden = false;
    if (window.CardDialog) CardDialog.open(panel, buttons[ct.id]);
    if (window.AhaanBrush) AhaanBrush.card(panel, ct.c, ct.cd);   // optional painted wash; CSS watercolor is the fallback
    if (soundOn) chime(ct.base);                           // silent unless Ahaan switched the chime on
  }
  function closeDoor() {
    cancelAnimationFrame(raf); openId = null; panel.hidden = true;
    if (window.CardDialog) CardDialog.close(panel);
    Object.keys(buttons).forEach(k => buttons[k].setAttribute("aria-expanded", "false"));
  }
  closeBtn.addEventListener("click", closeDoor);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && openId) { const b = buttons[openId]; closeDoor(); b.focus(); } });
})();
