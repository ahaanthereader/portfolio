/* ---- Timeline ---- */
(() => {
  $("#timeline").innerHTML = TIMELINE.map(t => `
    <div class="tl-item"><div class="yr">${t.yr}</div><p>${t.text}</p></div>
  `).join("");
})();
