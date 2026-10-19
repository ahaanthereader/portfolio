/* ---- p5.brush watercolor washes: lazy-loaded, each wash painted ONCE to a static image.
   If WebGL2 or the CDN is unavailable, nothing changes and the CSS watercolor stays. ---- */
window.AhaanBrush = (function () {
  const SRC = "https://cdn.jsdelivr.net/npm/p5.brush@2.2.3/dist/brush.js";   // standalone build, no p5.js needed
  const SIZES = { door: [248, 352], card: [700, 800] };
  const surfaces = {}, cache = {};
  let loading = null;

  function load() {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      let ok = false;
      try { ok = !!document.createElement("canvas").getContext("webgl2"); } catch (e) {}
      if (!ok) return reject(new Error("WebGL2 not available"));
      const s = document.createElement("script");
      s.src = SRC;
      s.onload = () => (window.brush ? resolve(window.brush) : reject(new Error("p5.brush missing")));
      s.onerror = () => reject(new Error("p5.brush failed to load"));
      document.head.appendChild(s);
    });
    return loading;
  }
  const hash = str => { let h = 7; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; };

  function paint(kind, c, cd) {
    const key = kind + c + cd;
    if (cache[key]) return cache[key];
    const b = window.brush, W = SIZES[kind][0], H = SIZES[kind][1];
    if (!surfaces[kind]) { const cv = document.createElement("canvas"); cv.width = W; cv.height = H; surfaces[kind] = cv; }
    b.load(surfaces[kind]);
    b.seed(hash(c)); b.noiseSeed(hash(cd));
    b.clear();
    b.push(); b.translate(-W / 2, -H / 2);
    b.noStroke(); b.noHatch();
    if (kind === "door") {
      b.fill(c, 150); b.fillBleed(0.35, "out"); b.fillTexture(0.6, 0.5);
      b.rect(10, 10, W - 20, H - 20, "corner");
      b.fill(cd, 90); b.fillBleed(0.5, "out"); b.fillTexture(0.7, 0.4);
      b.rect(W * 0.14, H * 0.52, W * 0.72, H * 0.4, "corner");
    } else {
      b.fill(c, 70); b.fillBleed(0.5, "out"); b.fillTexture(0.6, 0.4);
      b.circle(W * 0.14, H * 0.1, W * 0.5);
      b.fill(c, 55); b.fillBleed(0.5, "out"); b.fillTexture(0.6, 0.4);
      b.circle(W * 0.9, H * 0.96, W * 0.55);
    }
    b.pop();
    b.render();
    return (cache[key] = surfaces[kind].toDataURL("image/png"));       // snapshot right after render
  }

  function paintDoors() {
    document.querySelectorAll(".dow-leaf").forEach(leaf => {
      const cs = getComputedStyle(leaf);
      const c = cs.getPropertyValue("--c").trim(), cd = cs.getPropertyValue("--cd").trim();
      if (!c) return;
      leaf.style.setProperty("--wc-img", "url(" + paint("door", c, cd) + ")");
      leaf.classList.add("wc-brush");
    });
  }
  function start() { return load().then(paintDoors).catch(e => console.warn("Brush watercolor off, using CSS:", e.message)); }
  function card(panel, c, cd) {
    load().then(() => {
      panel.style.setProperty("--wc-card", "url(" + paint("card", c, cd) + ")");
      panel.classList.add("wc-brush");
    }).catch(() => {});
  }

  const sec = document.getElementById("doors");
  if (sec && "IntersectionObserver" in window) {                       // only fetch the library when the doors are near the screen
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: "400px" });
    io.observe(sec);
  }
  return { start: start, card: card };
})();
