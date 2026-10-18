/* ---- Home scenery: a gentle breeze in the leaves, the swing and the grass (owner decision D9).
   Pure CSS animation on separate layers (no repainting of the watercolor). Paused by the Breeze
   button, while the hero is off screen, and switched off entirely in Calm mode / reduced motion. ---- */
(function () {
  const hero = document.querySelector(".home-hero");
  if (!hero) return;
  const btn = document.getElementById("breezeBtn");
  let on = true;
  try { on = localStorage.getItem("ahaanBreeze") !== "off"; } catch (e) {}
  function paint() {
    hero.classList.toggle("breeze-off", !on);
    if (btn) { btn.setAttribute("aria-pressed", String(on)); btn.textContent = "🍃 Breeze: " + (on ? "on" : "off"); }
  }
  if (btn) btn.addEventListener("click", () => { on = !on; try { localStorage.setItem("ahaanBreeze", on ? "on" : "off"); } catch (e) {} paint(); });

  // Each layer sways around a real point in the drawing (trunk top, swing branch, ground); map it to screen pixels.
  function origins() {
    document.querySelectorAll(".scn-anim").forEach(svg => {
      const pt = svg.dataset.origin.split(" ").map(Number), m = svg.getScreenCTM();
      if (!m) return;
      const r = svg.getBoundingClientRect();
      svg.style.transformOrigin = (m.a * pt[0] + m.c * pt[1] + m.e - r.left).toFixed(1) + "px " + (m.b * pt[0] + m.d * pt[1] + m.f - r.top).toFixed(1) + "px";
    });
  }
  origins(); addEventListener("resize", origins);
  if ("IntersectionObserver" in window) new IntersectionObserver(es => hero.classList.toggle("scn-paused", !es[0].isIntersecting)).observe(hero);
  paint();
})();
