/* ---- Music corner: Web Audio (calm ambient + piano + Echo game) ----
   All sound is generated live in the browser from oscillators — no audio files. */
(() => {
  let actx = null, master = null;
  function ensure() {
    if (actx) { if (actx.state === "suspended") actx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    actx = new AC();
    master = actx.createGain();
    master.gain.value = 0.8;
    master.connect(actx.destination);
    return true;
  }

  const FREQ = { C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88, C5:523.25 };

  function tone(freq, dur, type, gain, dest) {
    const t = actx.currentTime;
    const osc = actx.createOscillator(), g = actx.createGain();
    osc.type = type || "triangle"; osc.frequency.value = freq;
    osc.connect(g); g.connect(dest || master);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  /* --- calm ambient --- */
  const PENT = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
  let ambientOn = false, ambGain = null, ambTimer = null;
  function ambVol() { return (+$("#ambientVol").value) / 100 * 0.6; }
  function ambientStart() {
    if (ambientOn) return;          // already playing — never start a 2nd loop
    if (!ensure()) return;
    if (!ambGain) { ambGain = actx.createGain(); ambGain.connect(master); }  // single persistent node
    const t = actx.currentTime;
    ambGain.gain.cancelScheduledValues(t);
    ambGain.gain.setValueAtTime(Math.max(0.0001, ambVol()), t);
    ambientOn = true;
    (function step() {
      if (!ambientOn) return;
      const f = PENT[Math.floor(Math.random() * PENT.length)];
      tone(f, 2.6 + Math.random() * 1.6, "sine", 0.18, ambGain);
      if (Math.random() < 0.5) tone(f / 2, 3.0, "triangle", 0.10, ambGain);
      ambTimer = setTimeout(step, 850 + Math.random() * 950);
    })();
  }
  function ambientStop() {
    if (!ambientOn) return;
    ambientOn = false;
    if (ambTimer) { clearTimeout(ambTimer); ambTimer = null; }
    if (ambGain && actx) {
      const t = actx.currentTime;
      ambGain.gain.cancelScheduledValues(t);
      ambGain.gain.setValueAtTime(ambGain.gain.value, t);
      ambGain.gain.linearRampToValueAtTime(0.0001, t + 0.35); // fade out, no orphan sound
    }
  }
  function setAmbient(on) {
    if (on) ambientStart(); else ambientStop();
    on = ambientOn; // reflect the real state in case start/stop bailed
    if (on) award("calmcat");
    const b = $("#ambientToggle"), fab = $("#musicFab");
    b.textContent = on ? "⏸ Pause calm music" : "▶ Play calm music";
    b.classList.toggle("on", on);
    fab.classList.toggle("on", on);
    fab.textContent = on ? "⏸" : "🎵";
  }
  $("#ambientToggle").addEventListener("click", () => setAmbient(!ambientOn));
  $("#musicFab").addEventListener("click", () => setAmbient(!ambientOn));
  $("#ambientVol").addEventListener("input", () => { if (ambGain && ambientOn) ambGain.gain.value = Math.max(0.0001, ambVol()); });

  /* --- piano --- */
  const KEYS = [
    { n: "C4", l: "C", kb: "A" }, { n: "D4", l: "D", kb: "S" }, { n: "E4", l: "E", kb: "D" },
    { n: "F4", l: "F", kb: "F" }, { n: "G4", l: "G", kb: "G" }, { n: "A4", l: "A", kb: "H" },
    { n: "B4", l: "B", kb: "J" }, { n: "C5", l: "C", kb: "K" },
  ];
  const piano = $("#piano");
  piano.innerHTML = KEYS.map(k => `<div class="key" data-n="${k.n}"><span class="kb">${k.kb}</span>${k.l}</div>`).join("");

  function pressKey(n) {
    if (!ensure()) return;
    award("pianist");
    tone(FREQ[n], 0.7, "triangle", 0.5);
    const el = piano.querySelector(`.key[data-n="${n}"]`);
    if (el) { el.classList.add("down"); setTimeout(() => el.classList.remove("down"), 150); }
  }
  function handlePlay(n) { pressKey(n); if (playing && accepting) checkGame(n); }

  piano.addEventListener("pointerdown", e => { const k = e.target.closest(".key"); if (k) handlePlay(k.dataset.n); });
  const KBMAP = { a: "C4", s: "D4", d: "E4", f: "F4", g: "G4", h: "A4", j: "B4", k: "C5" };
  document.addEventListener("keydown", e => {
    if (e.repeat) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const n = KBMAP[e.key.toLowerCase()];
    if (n) handlePlay(n);
  });

  /* --- Echo memory game --- */
  const ORDER = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
  let seq = [], userIdx = 0, playing = false, accepting = false;
  const status = $("#echoStatus");
  function lite(n) {
    const el = piano.querySelector(`.key[data-n="${n}"]`);
    if (el) { el.classList.add("lit"); setTimeout(() => el.classList.remove("lit"), 320); }
  }
  function playSeq() {
    accepting = false; userIdx = 0;
    status.textContent = `Listen… 🎧`;
    seq.forEach((n, i) => setTimeout(() => { if (!ensure()) return; lite(n); tone(FREQ[n], 0.45, "triangle", 0.5); }, 520 * i));
    setTimeout(() => { accepting = true; status.textContent = `Your turn! Round ${seq.length}`; }, 520 * seq.length + 250);
  }
  function nextRound() { seq.push(ORDER[Math.floor(Math.random() * ORDER.length)]); playSeq(); }
  function checkGame(n) {
    if (n === seq[userIdx]) {
      userIdx++;
      if (userIdx === seq.length) { accepting = false; status.textContent = `✅ Round ${seq.length} cleared!`; setTimeout(nextRound, 850); }
    } else {
      accepting = false; playing = false;
      status.textContent = `❌ Reached round ${seq.length}! Tap Echo to try again.`;
    }
  }
  $("#echoStart").addEventListener("click", () => { if (!ensure()) return; seq = []; playing = true; nextRound(); });

  /* fullscreen piano */
  const card = $("#pianoCard"), fsBtn = $("#pianoFull");
  fsBtn.addEventListener("click", () => {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsEl) {
      const req = card.requestFullscreen || card.webkitRequestFullscreen;
      if (req) req.call(card);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const on = !!document.fullscreenElement;
    fsBtn.textContent = on ? "✕ Exit full screen" : "⛶ Full screen";
  });
})();
