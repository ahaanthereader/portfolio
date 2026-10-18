/* ---- Swing: each click pushes faster & higher ---- */
(() => {
  const svg = $("#swingSvg"), hint = $("#swingHint"), grp = $(".swing-seat-grp");
  const MAX = 5;
  let level = 0;
  const hints = [
    "↑ click to push higher",
    "a little push… 🙂",
    "higher! 😄",
    "faster! 😆",
    "wheee! 🎉",
    "MAXIMUM SWING! 🚀 (click to slow down)",
  ];
  function apply() {
    const amp = 11 + level * 8;        // 11 → 51 degrees
    const dur = (3.2 - level * 0.45).toFixed(2); // 3.2s → ~0.95s
    grp.style.setProperty("--amp", amp);
    grp.style.setProperty("--dur", dur + "s");
    hint.textContent = hints[level];
  }
  svg.addEventListener("click", () => {
    level = level >= MAX ? 0 : level + 1; // climb, then loop back to gentle
    apply();
    if (level >= MAX) award("skyswinger");
  });
  apply();
})();
